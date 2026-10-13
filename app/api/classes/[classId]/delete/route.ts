import "server-only";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuthenticatedUser, authenticatedUserError } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ classId: string }> };
type DocRef = FirebaseFirestore.DocumentReference;
const clean = (value: unknown): string => typeof value === "string" ? value.trim() : "";
const ids = (value: unknown): string[] => Array.isArray(value) ? value.filter((x): x is string => typeof x === "string" && !!x) : [];
const OWNED = ["assignments", "classAssignments", "examAssignments", "assignmentProgress", "assignmentResults", "examSubmissions", "examSubmissionAttemptHistory", "interventions"] as const;
const BY_ASSIGNMENT = ["assignmentProgress", "assignmentResults", "examSubmissions", "examSubmissionAttemptHistory"] as const;
const DEMO = "demo-cs-master";

// IMPORTANT: production deletion stays disabled until end-to-end emulator tests
// prove complete isolation and every Admin SDK writer has lifecycle protection.
function destructiveEmulatorOnly(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS === "true" &&
    process.env.FIREBASE_ADMIN_PROJECT_ID === DEMO &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === DEMO &&
    process.env.FIRESTORE_EMULATOR_HOST === "127.0.0.1:8080" &&
    process.env.FIREBASE_AUTH_EMULATOR_HOST === "127.0.0.1:9099" &&
    process.env.CSMASTER_ENABLE_EMULATOR_CLASS_DELETE === "true";
}

async function authorise(request: Request, classId: string) {
  const actor = await requireAuthenticatedUser(request);
  const ref = adminDb.collection("classes").doc(classId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("CLASS_NOT_FOUND");
  const data = snap.data() ?? {};
  if (clean(data.teacherId) !== actor.uid || !["teacher", "admin", "school_admin"].includes(actor.role.toLowerCase()) || !actor.schoolId || actor.schoolId !== clean(data.schoolId)) throw new Error("FORBIDDEN");
  return { actor, ref, data };
}

async function discover(classId: string, data: FirebaseFirestore.DocumentData) {
  const docs = new Map<string, DocRef>();
  const assignmentIds = new Set<string>(ids(data.assignmentIds));
  const counts: Record<string, number> = {};
  const collect = (ref: DocRef) => { docs.set(ref.path, ref); };
  for (const name of OWNED) {
    const snapshot = await adminDb.collection(name).where("classId", "==", classId).get();
    counts[name] = snapshot.size;
    for (const doc of snapshot.docs) {
      collect(doc.ref);
      if (["assignments", "classAssignments", "examAssignments"].includes(name)) assignmentIds.add(doc.id);
    }
  }
  // Legacy records sometimes carry assignmentId but not classId.
  for (const name of BY_ASSIGNMENT) {
    for (const assignmentId of assignmentIds) {
      const snapshot = await adminDb.collection(name).where("assignmentId", "==", assignmentId).get();
      for (const doc of snapshot.docs) {
        // Only remove legacy records if the parent assignment is proven to belong
        // to this class; never trust stale class.assignmentIds alone.
        if (!docs.has(`assignments/${assignmentId}`) && !docs.has(`classAssignments/${assignmentId}`) && !docs.has(`examAssignments/${assignmentId}`)) continue;
        const recordClassId = clean(doc.data().classId);
        if (recordClassId && recordClassId !== classId) throw new Error("AMBIGUOUS_RECORD");
        collect(doc.ref);
      }
    }
  }
  // studentTargets are keyed by student ID: only delete an explicitly linked
  // record, never delete every target belonging to an enrolled student.
  const targets = await adminDb.collection("studentTargets").where("classId", "==", classId).get();
  counts.studentTargets = targets.size;
  for (const doc of targets.docs) collect(doc.ref);
  const members = await adminDb.collection("users").where("classIds", "array-contains", classId).get();
  const studentIds = new Set([...ids(data.studentIds), ...members.docs.map(d => d.id)]);
  return { docs, counts, assignmentIds, studentIds };
}

function failure(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "CLASS_NOT_FOUND") return NextResponse.json({ error: "Class not found." }, { status: 404 });
  if (code === "FORBIDDEN") return NextResponse.json({ error: "Only the class owner in the same school can delete this class." }, { status: 403 });
  if (code === "ARCHIVE_REQUIRED") return NextResponse.json({ error: "Archive the class first." }, { status: 409 });
  if (code === "NAME_MISMATCH") return NextResponse.json({ error: "Type the exact class name to confirm." }, { status: 400 });
  if (code === "DELETION_BUSY") return NextResponse.json({ error: "A deletion is running; retry after the current attempt completes." }, { status: 409 });
  if (code === "AMBIGUOUS_RECORD") return NextResponse.json({ error: "Ambiguous class-linked record. Deletion stopped for manual review." }, { status: 409 });
  if (["AUTH_REQUIRED", "AUTH_INVALID", "PROFILE_NOT_FOUND"].includes(code)) {
    const auth = authenticatedUserError(error);
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }
  console.error("[Class deletion]", error);
  return NextResponse.json({ error: "Deletion incomplete; class retained for investigation and retry." }, { status: 500 });
}

export async function GET(request: Request, context: Context) {
  try {
    const { classId } = await context.params;
    const { data } = await authorise(request, classId);
    const found = await discover(classId, data);
    return NextResponse.json({ className: clean(data.name), status: clean(data.status), students: found.studentIds.size, records: found.docs.size, counts: found.counts, warning: "Class deletion is disabled in production. Global XP and independent practice are never deleted." });
  } catch (error) { return failure(error); }
}

export async function DELETE(request: Request, context: Context) {
  // This guard MUST be first, before parsing or any Firestore write.
  if (!destructiveEmulatorOnly()) return NextResponse.json({ error: "Permanent class deletion is disabled until emulator data-integrity testing is completed." }, { status: 503 });
  let classId = "";
  let auditId = "";
  try {
    ({ classId } = await context.params);
    const { actor, ref, data } = await authorise(request, classId);
    const body: unknown = await request.json().catch(() => ({}));
    const confirmation = body && typeof body === "object" && "confirmation" in body ? clean(body.confirmation) : "";
    if (confirmation !== clean(data.name)) throw new Error("NAME_MISMATCH");
    if (data.status !== "archived" && data.status !== "deleting") throw new Error("ARCHIVE_REQUIRED");
    auditId = classId;
    const audit = adminDb.collection("classDeletionAudit").doc(classId);
    // A short lease permits safe retry after an interrupted process.
    await adminDb.runTransaction(async tx => {
      const latest = await tx.get(ref);
      const journal = await tx.get(audit);
      if (!latest.exists) throw new Error("CLASS_NOT_FOUND");
      const latestData = latest.data() ?? {};
      if (latestData.status !== "archived" && latestData.status !== "deleting") throw new Error("ARCHIVE_REQUIRED");
      const prior = journal.data() ?? {};
      const now = Date.now();
      if (prior.state === "running" && typeof prior.leaseUntil === "number" && prior.leaseUntil > now) throw new Error("DELETION_BUSY");
      tx.set(audit, { classId, className: clean(latestData.name), schoolId: actor.schoolId, deletedBy: actor.uid, state: "running", leaseUntil: now + 300000, startedAt: prior.startedAt ?? FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp(), emulatorOnly: true }, { merge: true });
      tx.update(ref, { status: "deleting", joinCodeEnabled: false, updatedAt: FieldValue.serverTimestamp() });
    });
    // Discover repeatedly so an interrupted run can be resumed and newly linked
    // documents cannot be silently ignored. Stop rather than deleting class if
    // verification fails.
    let removed = 0;
    for (let pass = 0; pass < 5; pass++) {
      const found = await discover(classId, data);
      if (!found.docs.size) break;
      for (const document of found.docs.values()) {
        await adminDb.recursiveDelete(document);
        removed++;
      }
    }
    // Membership removal is idempotent; remove only this class ID.
    const found = await discover(classId, data);
    if (found.docs.size) throw new Error("Class-linked records remain after cleanup");
    for (const studentId of found.studentIds) {
      const student = adminDb.collection("users").doc(studentId);
      const snapshot = await student.get();
      if (snapshot.exists) await student.update({ classIds: FieldValue.arrayRemove(classId) });
    }
    const verification = await discover(classId, data);
    const remainingMemberships = await adminDb.collection("users").where("classIds", "array-contains", classId).get();
    if (verification.docs.size || remainingMemberships.size) throw new Error("Deletion verification failed; class retained");
    await audit.set({ state: "completed", leaseUntil: 0, finishedAt: FieldValue.serverTimestamp(), removedInFinalRun: removed, studentMembershipsChecked: found.studentIds.size, globalXpPreserved: true }, { merge: true });
    // Class document is deleted LAST. Audit remains outside the class.
    await adminDb.recursiveDelete(ref);
    return NextResponse.json({ ok: true, removed, studentMembershipsChecked: found.studentIds.size, emulatorOnly: true });
  } catch (error) {
    if (auditId) console.error(`[Class deletion] interrupted: ${auditId}`, error);
    return failure(error);
  }
}
