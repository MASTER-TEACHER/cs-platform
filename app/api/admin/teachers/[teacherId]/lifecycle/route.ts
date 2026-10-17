import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { platformAdminError, requirePlatformAdmin } from "@/lib/admin/requirePlatformAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ teacherId: string }> };
const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const COLLECTIONS = [
  "classes", "assignments", "examAssignments", "quizAssignments", "programmingAssignments",
  "assignmentResults", "examSubmissions", "examSubmissionAttemptHistory", "quizAttempts",
  "neaProjects", "teacherNotes", "studentTargets", "markingAudit", "privateStudentIdentifiers",
  "schoolInvites", "privacyRequests", "feedback", "feedbackReports", "schoolSubscriptions",
  "schoolTrials", "adminAuditLogs", "teacherAssignmentDeletionAudit", "studentAssignmentRemovalAudit",
] as const;
const FIELDS = ["teacherId", "teacherUid", "teacherUID", "ownerId", "ownerUid", "createdBy", "userId", "uid", "assignedBy", "markedBy", "requestedBy"] as const;

async function authExists(uid: string) {
  try { await adminAuth.getUser(uid); return true; }
  catch (error) {
    if ((error as { code?: string }).code === "auth/user-not-found") return false;
    throw error;
  }
}

// Fail closed: any matching record is preserved and prevents destructive deletion.
// A failed query is NOT interpreted as zero dependencies.
async function review(uid: string, schoolId: string) {
  const dependencies: string[] = [];
  for (const collection of COLLECTIONS) {
    for (const field of FIELDS) {
      const result = await adminDb.collection(collection).where(field, "==", uid).limit(1).get();
      if (!result.empty) dependencies.push(`${collection}.${field}`);
    }
  }
  // A teacher may be a member of a different school than their user profile says.
  // Do not silently miss stale memberships, including last-admin memberships.
  const schools = await adminDb.collection("schools").limit(501).get();
  if (schools.size > 500) throw new Error("SCHOOL_REVIEW_LIMIT");
  for (const school of schools.docs) {
    const member = await school.ref.collection("members").doc(uid).get();
    if (member.exists && !["former", "removed", "left"].includes(clean(member.data()?.status).toLowerCase())) {
      dependencies.push(`schools/${school.id}/members`);
    }
  }
  if (schoolId) dependencies.push("users.schoolId");
  return [...new Set(dependencies)];
}

async function log(actorId: string, targetId: string, action: string, reason: string, extra: Record<string, unknown> = {}) {
  await adminDb.collection("adminUserAudit").add({ actorId, targetId, action, reason, ...extra, at: FieldValue.serverTimestamp() });
}

export async function GET(request: Request, context: Context) {
  try {
    await requirePlatformAdmin(request);
    const { teacherId } = await context.params;
    if (!teacherId || teacherId.includes("/")) return NextResponse.json({ error: "Invalid account." }, { status: 400 });
    const profile = await adminDb.collection("users").doc(teacherId).get();
    if (!profile.exists || profile.data()?.role !== "teacher") return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });
    const authPresent = await authExists(teacherId);
    const schoolId = clean(profile.data()?.schoolId);
    const dependencies = await review(teacherId, schoolId);
    return NextResponse.json({ authPresent, profilePresent: true, schoolId: schoolId || null, orphaned: !authPresent, dependencies, eligible: dependencies.length === 0 });
  } catch (error) {
    if (error instanceof Error && error.message === "SCHOOL_REVIEW_LIMIT") return NextResponse.json({ error: "More than 500 schools: manual membership review required." }, { status: 409 });
    const failure = platformAdminError(error);
    return NextResponse.json({ error: failure.message }, { status: failure.status });
  }
}

export async function POST(request: Request, context: Context) {
  try {
    const actor = await requirePlatformAdmin(request);
    const { teacherId } = await context.params;
    if (!teacherId || teacherId.includes("/") || teacherId === actor.uid) return NextResponse.json({ error: "Invalid account." }, { status: 400 });
    const body = (await request.json()) as { action?: unknown; confirmation?: unknown; reason?: unknown; retentionApproved?: unknown };
    const action = clean(body.action);
    const reason = clean(body.reason).slice(0, 500);
    if (!["remove_school", "delete_account", "review_deletion"].includes(action) || reason.length < 10 || clean(body.confirmation) !== teacherId) {
      return NextResponse.json({ error: "Action, reason (at least 10 characters), and exact account ID confirmation are required." }, { status: 400 });
    }
    const userRef = adminDb.collection("users").doc(teacherId);
    const user = await userRef.get();
    if (!user.exists || user.data()?.role !== "teacher") return NextResponse.json({ error: "Teacher profile not found." }, { status: 404 });
    const schoolId = clean(user.data()?.schoolId);
    const authPresent = await authExists(teacherId);
    const dependencies = await review(teacherId, schoolId);
    if (action === "review_deletion") {
      await log(actor.uid, teacherId, "review_teacher_deletion", reason, { dependencies, authPresent });
      return NextResponse.json({ success: true, eligible: dependencies.length === 0, dependencies, authPresent, message: dependencies.length ? "Deletion blocked. Resolve or formally retain the listed records first." : "No known dependencies found. Review retention obligations before confirming deletion." });
    }
    const removalBlockers = action === "remove_school" ? dependencies.filter(item => item !== "users.schoolId" && item !== `schools/${schoolId}/members`) : dependencies;
    if (removalBlockers.length) return NextResponse.json({ error: "Account has dependent records or other active memberships. Reassign, preserve or resolve them before proceeding.", dependencies: removalBlockers }, { status: 409 });

    if (action === "delete_account") {
      if (body.retentionApproved !== true) return NextResponse.json({ error: "Explicit retention and privacy review approval is required." }, { status: 400 });
      // A durable audit is written BEFORE external Auth deletion. Never erase audit history.
      const auditRef = adminDb.collection("adminUserAudit").doc();
      await auditRef.set({ action: "teacher_deletion_started", actorId: actor.uid, targetId: teacherId, reason, authPresent, at: FieldValue.serverTimestamp(), status: "started" });
      try {
        if (authPresent) {
          await adminAuth.updateUser(teacherId, { disabled: true });
          await adminAuth.revokeRefreshTokens(teacherId);
          try { await adminAuth.deleteUser(teacherId); }
          catch (error) { if ((error as { code?: string }).code !== "auth/user-not-found") throw error; }
        }
        // Repeat review after Auth removal to avoid deleting a profile if linked records appeared.
        const fresh = await userRef.get();
        if (!fresh.exists || fresh.data()?.role !== "teacher") throw new Error("PROFILE_CHANGED");
        const remaining = await review(teacherId, clean(fresh.data()?.schoolId));
        if (remaining.length) throw new Error("DEPENDENCIES_CHANGED");
        await adminDb.runTransaction(async tx => {
          const latest = await tx.get(userRef);
          if (!latest.exists || latest.data()?.role !== "teacher" || clean(latest.data()?.schoolId)) throw new Error("PROFILE_CHANGED");
          tx.delete(userRef);
          tx.update(auditRef, { status: "completed", completedAt: FieldValue.serverTimestamp() });
        });
        return NextResponse.json({ success: true, action, message: "Teacher login and unlinked profile removed. Audit preserved." });
      } catch (error) {
        await auditRef.update({ status: "partial_failure", errorCode: error instanceof Error ? error.message.slice(0, 120) : "unknown", updatedAt: FieldValue.serverTimestamp() });
        return NextResponse.json({ error: "Deletion partially completed or interrupted. Review audit and dependencies before retrying. Do not recreate this login.", partial: true, auditId: auditRef.id }, { status: 503 });
      }
    }

    // Removal requires a current school membership; school-admin memberships are never removed here.
    if (!schoolId) return NextResponse.json({ error: "Teacher has no active school membership.", alreadyRemoved: true }, { status: 409 });
    const schoolRef = adminDb.collection("schools").doc(schoolId);
    const memberRef = schoolRef.collection("members").doc(teacherId);
    await adminDb.runTransaction(async tx => {
      const [fresh, member, school] = await Promise.all([tx.get(userRef), tx.get(memberRef), tx.get(schoolRef)]);
      if (!fresh.exists || clean(fresh.data()?.schoolId) !== schoolId || !school.exists) throw new Error("MEMBERSHIP_CHANGED");
      if (member.data()?.role === "school_admin") throw new Error("SCHOOL_ADMIN_REASSIGN_REQUIRED");
      tx.set(memberRef, { status: "former", leftAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      tx.update(userRef, { schoolId: null, schoolName: null, accountType: "individual", plan: fresh.data()?.personalPlan === "premium" ? "premium" : "free", updatedAt: FieldValue.serverTimestamp() });
      tx.update(schoolRef, { membershipUpdatedAt: FieldValue.serverTimestamp() });
      tx.create(adminDb.collection("adminUserAudit").doc(), { action: "remove_teacher_from_school", actorId: actor.uid, targetId: teacherId, schoolId, reason, authMissingAtCheck: !authPresent, at: FieldValue.serverTimestamp() });
    });
    if (authPresent) {
      try { await adminAuth.revokeRefreshTokens(teacherId); }
      catch (error) {
        if ((error as { code?: string }).code !== "auth/user-not-found") return NextResponse.json({ error: "School removed, but token revocation failed. Investigate sessions.", partial: true }, { status: 503 });
      }
    }
    return NextResponse.json({ success: true, action, message: authPresent ? "School membership removed; account retained." : "Orphaned profile detached from school; Auth account was already missing." });
  } catch (error) {
    if (error instanceof Error && ["MEMBERSHIP_CHANGED", "SCHOOL_ADMIN_REASSIGN_REQUIRED", "SCHOOL_REVIEW_LIMIT"].includes(error.message)) return NextResponse.json({ error: error.message }, { status: 409 });
    const failure = platformAdminError(error);
    return NextResponse.json({ error: failure.message }, { status: failure.status });
  }
}
