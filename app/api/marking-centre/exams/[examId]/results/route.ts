import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { createHash } from "node:crypto";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, requireCentreTeacher } from "@/lib/marking/centre";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
type Context = { params: Promise<{ examId: string }> };
type Boundary = { grade: string; minimum: number };
function errorResponse(error: unknown) {
 const code = error instanceof Error ? error.message : "";
 const status = code === "CENTRE_INVALID" ? 400 : code === "CENTRE_NOT_FOUND" ? 404 : code === "CENTRE_FORBIDDEN" ? 403 : code.startsWith("AUTH_") ? 401 : code === "CENTRE_CONFLICT" ? 409 : 500;
 return NextResponse.json({ error: status === 500 ? "Results operation failed." : code === "CENTRE_CONFLICT" ? "Results changed. Reload and retry." : code === "CENTRE_INVALID" ? "Cannot save boundaries: check the source note, grade labels, unique thresholds and approval of every paper structure." : "Invalid or unavailable examination/results." }, { status, headers });
}
async function owned(request: Request, context: Context) {
 const actor = await requireAuthenticatedUser(request); requireCentreTeacher(actor);
 const { examId } = await context.params;
 if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_INVALID");
 const ref = centreCollection.doc(examId); const snap = await ref.get();
 if (!snap.exists || snap.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
 const papers = snap.data()?.papers as { id: string; title?: string }[] | undefined;
 if (!Array.isArray(papers) || papers.length < 1) throw new Error("CENTRE_INVALID");
 return { ref, papers, actor };
}
function validBoundaries(value: unknown, maximum: number): asserts value is Boundary[] {
 if (!Array.isArray(value) || value.length < 1 || value.length > 15) throw new Error("CENTRE_INVALID");
 const grades = new Set<string>(); const thresholds = new Set<number>();
 for (const b of value) {
  if (!b || typeof b !== "object" || typeof b.grade !== "string" || !/^[A-Za-z0-9+*\-]{1,12}$/.test(b.grade) || !Number.isInteger(b.minimum) || b.minimum < 0 || b.minimum > maximum || grades.has(b.grade) || thresholds.has(b.minimum)) throw new Error("CENTRE_INVALID");
  grades.add(b.grade); thresholds.add(b.minimum);
 }
}
function csvCell(value: unknown) {
 const raw = String(value ?? "");
 const safe = /^[\s]*[=+@\-\t\r]/.test(raw) ? "'" + raw : raw;
 return '"' + safe.replace(/"/g, '""') + '"';
}
export async function PUT(request: Request, context: Context) {
 try {
  const { ref, papers, actor } = await owned(request, context);
  const body = await request.json() as { boundaries?: unknown; expectedRevision?: number; sourceNote?: string; mode?: "internal" | "official" };
  if (!body || !["internal", "official"].includes(body.mode ?? "") || typeof body.expectedRevision !== "number" || !Number.isInteger(body.expectedRevision) || typeof body.sourceNote !== "string" || body.sourceNote.trim().length < 8 || body.sourceNote.length > 500) throw new Error("CENTRE_INVALID");
  const structures = await Promise.all(papers.map(p => ref.collection("paperStructures").doc(p.id).get()));
  if (structures.some(s => s.data()?.status !== "approved")) throw new Error("CENTRE_INVALID");
  const maximum = structures.reduce((sum, s) => sum + Number(s.data()?.totalMarks ?? 0), 0);
  if (!Number.isInteger(maximum) || maximum < 1 || maximum > 1000) throw new Error("CENTRE_INVALID");
  validBoundaries(body.boundaries, maximum);
  const qualification = (await ref.get()).data()?.qualificationLevel;
  const allowed = qualification === "GCSE" ? new Set(["9","8","7","6","5","4","3","2","1"])
    : qualification === "A Level" ? new Set(["A*","A","B","C","D","E"]) : null;
  if (allowed && (body.boundaries.length !== allowed.size || body.boundaries.some(b => !allowed.has(b.grade)))) throw new Error("CENTRE_INVALID");
  const boundaries = [...body.boundaries].sort((a,b) => b.minimum - a.minimum);
  await ref.firestore.runTransaction(async tx => {
   const snapshot = await tx.get(ref); const current = snapshot.data();
   if (!snapshot.exists || current?.ownerId !== actor.uid || Number(current?.gradingRevision ?? 0) !== body.expectedRevision) throw new Error("CENTRE_CONFLICT");
   tx.update(ref, { gradingBoundaries: boundaries, gradingMaximum: maximum, gradingRevision: body.expectedRevision! + 1, gradingSourceNote: body.sourceNote!.trim(), gradingMode: body.mode, gradingVerifiedBy: actor.uid, gradingVerifiedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
   tx.set(ref.collection("resultsAudit").doc(), { action: body.mode === "official" ? "official_boundaries_verified" : "internal_boundaries_saved", actorId: actor.uid, boundaries, maximum, mode: body.mode, sourceNote: body.sourceNote!.trim(), at: FieldValue.serverTimestamp() });
  });
  return NextResponse.json({ ok: true, gradingRevision: body.expectedRevision + 1 }, { headers });
 } catch (error) { return errorResponse(error); }
}
export async function GET(request: Request, context: Context) {
 try {
  const { ref, papers } = await owned(request, context);
  const [exam, candidates, reviews, structures, scripts] = await Promise.all([
   ref.get(), ref.collection("candidates").limit(1000).get(), ref.collection("markingReviews").limit(3000).get(),
   Promise.all(papers.map(p => ref.collection("paperStructures").doc(p.id).get())),
   ref.collection("candidateScripts").limit(3000).get(),
  ]);
  const data = exam.data() ?? {};
  const maximum = structures.reduce((sum, s) => sum + (s.data()?.status === "approved" ? Number(s.data()?.totalMarks ?? 0) : 0), 0);
  const allApproved = structures.every(s => s.data()?.status === "approved");
  const boundaries = Array.isArray(data.gradingBoundaries) ? data.gradingBoundaries as Boundary[] : [];
  const gradeReady = allApproved && maximum === data.gradingMaximum && boundaries.length > 0;
  const byKey = new Map(reviews.docs.map(doc => [doc.id, doc.data()]));
  const scriptsByKey = new Map(scripts.docs.map(doc => [doc.id, doc.data()]));
  const rows = candidates.docs.map(doc => {
   const code = doc.id; let total = 0; const scores: Record<string, number | null> = {}; let complete = true;
   for (const paper of papers) {
    const key = `${paper.id}_${code}`;
    const r = byKey.get(key); const script = scriptsByKey.get(key);
    const structure = structures[papers.indexOf(paper)].data();
    const valid = r?.status === "approved" && !!r?.approvedAt?.toMillis && !!script?.uploadedAt?.toMillis && r.approvedAt.toMillis() >= script.uploadedAt.toMillis() && r?.structureHash && structure?.status === "approved" && Array.isArray(r?.marks) && r.marks.length === structure.questions?.length && new Set(r.marks.map((m: { questionId: string }) => m.questionId)).size === structure.questions.length && r.marks.every((m: { awardedMarks: number; questionId: string }) => Number.isInteger(m.awardedMarks) && structure.questions.some((q: { id: string; maxMarks: number }) => q.id === m.questionId && m.awardedMarks >= 0 && m.awardedMarks <= q.maxMarks));
    // Hash the currently approved structure to exclude superseded marking reviews.
    const currentHash = structure?.questions ? createHash("sha256").update(JSON.stringify(structure.questions)).digest("hex") : "";
    if (!valid || r?.structureHash !== currentHash) { complete = false; scores[paper.id] = null; }
    else { const paperTotal = r.marks.reduce((sum: number, m: { awardedMarks: number }) => sum + m.awardedMarks, 0); scores[paper.id] = paperTotal; total += paperTotal; }
   }
   const grade = complete && gradeReady ? (boundaries.find(b => total >= b.minimum)?.grade ?? "U") : null;
   return { candidateCode: code, paperScores: scores, total: complete ? total : null, maximum, grade, status: complete ? "approved" : "incomplete" };
  });
  if (new URL(request.url).searchParams.get("format") === "csv") {
   const lines = [["Candidate code", ...papers.map(p => p.title || p.id), "Total", "Maximum", "Grade", "Status"].map(csvCell).join(",")];
   for (const row of rows) lines.push([row.candidateCode, ...papers.map(p => row.paperScores[p.id] ?? ""), row.total ?? "", maximum, row.grade ?? "", row.status].map(csvCell).join(","));
   return new Response("\uFEFF" + lines.join("\r\n") + "\r\n", { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="csmaster-marking-results.csv"' } });
  }
  return NextResponse.json({ rows, papers, maximum, allStructuresApproved: allApproved, grading: { ready: gradeReady, mode: data.gradingMode === "official" ? "official" : "internal", boundaries, revision: Number(data.gradingRevision ?? 0), sourceNote: data.gradingSourceNote ?? "" } }, { headers });
 } catch (error) { return errorResponse(error); }
}
