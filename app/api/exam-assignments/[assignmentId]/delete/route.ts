import "server-only";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuthenticatedUser, authenticatedUserError } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ assignmentId: string }> };
const clean = (v: unknown) => typeof v === "string" ? v.trim() : "";
const RELATED = ["examSubmissions", "examSubmissionAttemptHistory", "assignmentProgress", "assignmentResults"] as const;

function errorResponse(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (["AUTH_REQUIRED", "AUTH_INVALID", "PROFILE_NOT_FOUND"].includes(code)) {
    const result = authenticatedUserError(error);
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  const codes: Record<string, [number, string]> = {
    NOT_FOUND: [404, "Assignment not found."],
    FORBIDDEN: [403, "Only the authorised class teacher can delete this assignment."],
    CLASS_DELETING: [409, "Class deletion is in progress."],
    BUSY: [409, "Deletion already in progress. Retry later."],
    AMBIGUOUS: [409, "Conflicting linked records found. Manual review required."],
  };
  if (codes[code]) return NextResponse.json({ error: codes[code][1] }, { status: codes[code][0] });
  console.error("[Exam assignment deletion]", error);
  return NextResponse.json({ error: "Deletion incomplete. Retry or contact support." }, { status: 500 });
}

export async function DELETE(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    const { assignmentId } = await context.params;
    if (!assignmentId || assignmentId.includes("/")) throw new Error("NOT_FOUND");
    const ref = adminDb.collection("examAssignments").doc(assignmentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) throw new Error("NOT_FOUND");
    const data = snapshot.data() ?? {};
    const classId = clean(data.classId);
    const classDoc = classId ? await adminDb.collection("classes").doc(classId).get() : null;
    const classData = classDoc?.data() ?? {};
    if (!classDoc?.exists || clean(classData.schoolId) !== actor.schoolId ||
      clean(classData.teacherId) !== actor.uid || clean(data.teacherId) !== actor.uid ||
      !["teacher", "admin", "school_admin"].includes(actor.role.toLowerCase())) throw new Error("FORBIDDEN");
    if (["deleting", "deleted"].includes(clean(classData.status))) throw new Error("CLASS_DELETING");

    const audit = adminDb.collection("examAssignmentDeletionAudit").doc(assignmentId);
    await adminDb.runTransaction(async tx => {
      const [fresh, journal] = await Promise.all([tx.get(ref), tx.get(audit)]);
      if (!fresh.exists) throw new Error("NOT_FOUND");
      const freshData = fresh.data() ?? {};
      if (clean(freshData.teacherId) !== actor.uid || clean(freshData.classId) !== classId) throw new Error("FORBIDDEN");
      const previous = journal.data() ?? {};
      const now = Date.now();
      if (previous.state === "running" && Number(previous.leaseUntil) > now) throw new Error("BUSY");
      tx.set(audit, { assignmentId, classId, schoolId: actor.schoolId, deletedBy: actor.uid,
        state: "running", leaseUntil: now + 300000, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      tx.update(ref, { status: "deleting", updatedAt: FieldValue.serverTimestamp() });
    });

    let removed = 0;
    for (let pass = 0; pass < 5; pass++) {
      const linked = new Map<string, FirebaseFirestore.DocumentReference>();
      for (const name of RELATED) {
        const found = await adminDb.collection(name).where("assignmentId", "==", assignmentId).get();
        for (const doc of found.docs) {
          const linkedClass = clean(doc.data().classId);
          if (linkedClass && linkedClass !== classId) throw new Error("AMBIGUOUS");
          linked.set(doc.ref.path, doc.ref);
        }
      }
      if (linked.size === 0) break;
      for (const doc of linked.values()) { await adminDb.recursiveDelete(doc); removed++; }
    }
    for (const name of RELATED) {
      const remaining = await adminDb.collection(name).where("assignmentId", "==", assignmentId).limit(1).get();
      if (!remaining.empty) throw new Error("AMBIGUOUS");
    }
    await adminDb.recursiveDelete(ref);
    await audit.set({ state: "completed", leaseUntil: 0, removed,
      finishedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ success: true, removed });
  } catch (error) { return errorResponse(error); }
}
