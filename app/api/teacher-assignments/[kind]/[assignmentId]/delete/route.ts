import "server-only";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuthenticatedUser, authenticatedUserError } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ kind: string; assignmentId: string }> };
const collections: Record<string, string> = { general: "assignments", quiz: "assignments", programming: "classAssignments" };
const related = ["assignmentProgress", "assignmentResults", "examSubmissions", "examSubmissionAttemptHistory"] as const;
const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";

function failure(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (["AUTH_REQUIRED", "AUTH_INVALID", "PROFILE_NOT_FOUND"].includes(code)) {
    const result = authenticatedUserError(error);
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  const errors: Record<string, [number, string]> = {
    NOT_FOUND: [404, "Assignment not found."],
    FORBIDDEN: [403, "Only the owning class teacher may delete this assignment."],
    CLASS_BUSY: [409, "Class deletion is in progress."],
    BUSY: [409, "Deletion already in progress."],
    AMBIGUOUS: [409, "Conflicting linked records found; deletion stopped."],
  };
  if (errors[code]) return NextResponse.json({ error: errors[code][1] }, { status: errors[code][0] });
  console.error("[Teacher assignment deletion]", error);
  return NextResponse.json({ error: "Deletion incomplete. Contact support before retrying." }, { status: 500 });
}

export async function DELETE(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    const { kind, assignmentId } = await context.params;
    const collection = collections[kind];
    if (!collection || !assignmentId || assignmentId.includes("/")) throw new Error("NOT_FOUND");
    const ref = adminDb.collection(collection).doc(assignmentId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("NOT_FOUND");
    const data = snap.data() ?? {};
    if (kind === "quiz" && clean(data.type) !== "quiz") throw new Error("NOT_FOUND");
    if (kind === "general" && clean(data.type) === "quiz") throw new Error("NOT_FOUND");
    const classId = clean(data.classId);
    if (!classId || !["teacher", "admin", "school_admin"].includes(actor.role.toLowerCase())) throw new Error("FORBIDDEN");
    const classSnap = await adminDb.collection("classes").doc(classId).get();
    const classData = classSnap.data() ?? {};
    if (!classSnap.exists || clean(data.teacherId) !== actor.uid || clean(classData.teacherId) !== actor.uid || !actor.schoolId || clean(classData.schoolId) !== actor.schoolId) throw new Error("FORBIDDEN");
    if (["deleting", "deleted"].includes(clean(classData.status))) throw new Error("CLASS_BUSY");
    const audit = adminDb.collection("teacherAssignmentDeletionAudit").doc(`${collection}_${assignmentId}`);
    await adminDb.runTransaction(async tx => {
      const fresh = await tx.get(ref);
      const journal = await tx.get(audit);
      if (!fresh.exists || clean(fresh.data()?.teacherId) !== actor.uid || clean(fresh.data()?.classId) !== classId) throw new Error("FORBIDDEN");
      const previous = journal.data() ?? {};
      if (previous.state === "running" && Number(previous.leaseUntil) > Date.now()) throw new Error("BUSY");
      tx.set(audit, { assignmentId, collection, kind, classId, schoolId: actor.schoolId, deletedBy: actor.uid, state: "running", leaseUntil: Date.now() + 300000, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      tx.update(ref, { status: "deleting", updatedAt: FieldValue.serverTimestamp() });
    });
    let removed = 0;
    for (let pass = 0; pass < 5; pass++) {
      const docs = new Map<string, FirebaseFirestore.DocumentReference>();
      for (const name of related) {
        const query = await adminDb.collection(name).where("assignmentId", "==", assignmentId).get();
        for (const document of query.docs) {
          const recordClass = clean(document.data().classId);
          if (recordClass && recordClass !== classId) throw new Error("AMBIGUOUS");
          docs.set(document.ref.path, document.ref);
        }
      }
      if (!docs.size) break;
      for (const document of docs.values()) { await adminDb.recursiveDelete(document); removed++; }
    }
    for (const name of related) {
      const pending = await adminDb.collection(name).where("assignmentId", "==", assignmentId).limit(1).get();
      if (!pending.empty) throw new Error("AMBIGUOUS");
    }
    await adminDb.recursiveDelete(ref);
    await adminDb.collection("classes").doc(classId).update({ assignmentIds: FieldValue.arrayRemove(assignmentId), updatedAt: FieldValue.serverTimestamp() });
    await audit.set({ state: "completed", leaseUntil: 0, removed, finishedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ success: true, removed });
  } catch (error) { return failure(error); }
}
