import "server-only";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuthenticatedUser, authenticatedUserError } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ kind: string; assignmentId: string; studentId: string }> };
const collections: Record<string, string> = { general: "assignments", quiz: "assignments", programming: "classAssignments", exam: "examAssignments" };
const related = ["assignmentProgress", "assignmentResults", "examSubmissions", "examSubmissionAttemptHistory"] as const;
const clean = (v: unknown) => typeof v === "string" ? v.trim() : "";
const studentKey = (data: FirebaseFirestore.DocumentData) => clean(data.studentId) || clean(data.userId);

function fail(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (["AUTH_REQUIRED", "AUTH_INVALID", "PROFILE_NOT_FOUND"].includes(code)) {
    const response = authenticatedUserError(error);
    return NextResponse.json({ error: response.message }, { status: response.status });
  }
  const statuses: Record<string, [number, string]> = {
    NOT_FOUND: [404, "Assignment or assigned student not found."],
    FORBIDDEN: [403, "Only the owning teacher can remove this student."],
    CLASS_BUSY: [409, "The class is being deleted."],
    BUSY: [409, "Another removal is in progress."],
    AMBIGUOUS: [409, "Ambiguous linked records; removal stopped for review."],
  };
  if (statuses[code]) return NextResponse.json({ error: statuses[code][1] }, { status: statuses[code][0] });
  console.error("[Student assignment removal]", error);
  return NextResponse.json({ error: "Removal incomplete; check the audit before retrying." }, { status: 500 });
}

export async function DELETE(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    const { kind, assignmentId, studentId } = await context.params;
    const collection = collections[kind];
    if (!collection || !assignmentId || !studentId || [assignmentId, studentId].some(v => v.includes("/"))) throw new Error("NOT_FOUND");
    if (!["teacher", "admin", "school_admin"].includes(actor.role.toLowerCase())) throw new Error("FORBIDDEN");
    const ref = adminDb.collection(collection).doc(assignmentId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("NOT_FOUND");
    const data = snap.data() ?? {};
    if ((kind === "quiz" && clean(data.type) !== "quiz") || (kind === "general" && clean(data.type) === "quiz")) throw new Error("NOT_FOUND");
    const classId = clean(data.classId);
    const classSnap = await adminDb.collection("classes").doc(classId).get();
    const classData = classSnap.data() ?? {};
    if (!classSnap.exists || clean(data.teacherId) !== actor.uid || clean(classData.teacherId) !== actor.uid || !actor.schoolId || clean(classData.schoolId) !== actor.schoolId) throw new Error("FORBIDDEN");
    if (["deleting", "deleted"].includes(clean(classData.status))) throw new Error("CLASS_BUSY");
    if (!Array.isArray(data.studentIds) || !data.studentIds.includes(studentId)) throw new Error("NOT_FOUND");
    const audit = adminDb.collection("studentAssignmentRemovalAudit").doc(`${collection}_${assignmentId}_${studentId}`);
    await adminDb.runTransaction(async tx => {
      const current = await tx.get(ref);
      const journal = await tx.get(audit);
      const value = current.data() ?? {};
      if (!current.exists || clean(value.teacherId) !== actor.uid || !Array.isArray(value.studentIds) || !value.studentIds.includes(studentId)) throw new Error("NOT_FOUND");
      if (journal.data()?.state === "running" && Number(journal.data()?.leaseUntil) > Date.now()) throw new Error("BUSY");
      tx.set(audit, { assignmentId, studentId, kind, classId, schoolId: actor.schoolId, removedBy: actor.uid, state: "running", leaseUntil: Date.now() + 300000, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      // Remove access first; all other recipients remain assigned.
      const remaining = value.studentIds.filter((id: unknown) => id !== studentId);
      tx.update(ref, { studentIds: FieldValue.arrayRemove(studentId), studentCount: remaining.length, updatedAt: FieldValue.serverTimestamp() });
    });
    let removed = 0;
    for (let pass = 0; pass < 5; pass++) {
      const docs = new Map<string, FirebaseFirestore.DocumentReference>();
      for (const name of related) {
        const query = await adminDb.collection(name).where("assignmentId", "==", assignmentId).get();
        for (const record of query.docs) {
          const value = record.data();
          const recordClass = clean(value.classId);
          if (recordClass && recordClass !== classId) throw new Error("AMBIGUOUS");
          if (studentKey(value) === studentId) docs.set(record.ref.path, record.ref);
        }
      }
      if (!docs.size) break;
      for (const document of docs.values()) { await adminDb.recursiveDelete(document); removed++; }
    }
    for (const name of related) {
      const query = await adminDb.collection(name).where("assignmentId", "==", assignmentId).get();
      if (query.docs.some(d => studentKey(d.data()) === studentId)) throw new Error("AMBIGUOUS");
    }
    await audit.set({ state: "completed", leaseUntil: 0, removed, finishedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ success: true, removed, studentId });
  } catch (error) { return fail(error); }
}
