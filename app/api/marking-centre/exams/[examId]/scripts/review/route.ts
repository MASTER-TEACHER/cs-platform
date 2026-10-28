import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { loadReviewContext, extractReviewText, validateMarks } from "@/lib/marking/reviewContext";
import { proposeMarks } from "@/lib/marking/proposeMarks";
import { qualityFlags, isExplicitNonAnswer, unsupportedWorkingClaim } from "@/lib/marking/reviewFlags";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };
function fail(error: unknown) {
  const messages: Record<string, [number, string]> = {
    CENTRE_NOT_FOUND: [404, "Examination not found."], CENTRE_INVALID: [400, "Invalid marking details."], CENTRE_NOT_APPROVED: [409, "Approved question criteria required."],
    CENTRE_SCRIPT_NOT_FOUND: [404, "Candidate script not found."], CENTRE_SCAN: [422, "Scanned script needs manual transcription or vision review."],
    CENTRE_TRUNCATED: [422, "Script text truncated. Review original PDF."], CENTRE_STORAGE_UNAVAILABLE: [503, "Storage unavailable."],
    MARK_NO_KEY: [503, "AI marking not configured."], MARK_PROVIDER: [502, "AI marking service unavailable."], MARK_FORMAT: [422, "AI marking response failed validation."],
    CENTRE_STALE: [409, "Script or approved structure changed. Generate a new proposal."], CENTRE_FINAL: [409, "Approved marks are locked."], CENTRE_GUIDANCE: [422, "Add specific improvement guidance for each question with lost marks, or explain why guidance cannot be provided."], CENTRE_JUSTIFICATION: [422, "Add a teacher justification for changed marks or credit without an answer before approval."], CENTRE_EVIDENCE: [422, "Feedback claims working not evident in the extracted answer. Correct the feedback and verify the original script before approval."],
    CENTRE_FORBIDDEN: [403, "Teacher access required."], AUTH_REQUIRED: [401, "Sign in again."], AUTH_INVALID: [401, "Sign in again."],
  };
  const code = error instanceof Error ? error.message : "";
  const [status, message] = messages[code] ?? [500, "Unable to complete marking request."];
  if (status === 500) console.error("[Marking Centre] review failed", code);
  return NextResponse.json({ error: message }, { status, headers });
}
async function context(request: Request, params: Context) {
  const { examId } = await params.params;
  let paperId = "", candidateCode = "";
  if (request.method === "GET") {
    const url = new URL(request.url);
    paperId = url.searchParams.get("paperId") ?? "";
    candidateCode = url.searchParams.get("candidateCode") ?? "";
  } else {
    const body = await request.json() as { paperId?: string; candidateCode?: string; action?: string; marks?: unknown; expectedRevision?: number };
    paperId = body.paperId ?? ""; candidateCode = body.candidateCode ?? "";
    return { ctx: await loadReviewContext(request, examId, paperId, candidateCode), body };
  }
  return { ctx: await loadReviewContext(request, examId, paperId, candidateCode), body: null };
}
export async function GET(request: Request, params: Context) {
  try {
    const { ctx } = await context(request, params);
    const snap = await ctx.reviewRef.get(); const data = snap.data();
    if (!data) return NextResponse.json({ review: null }, { headers });
    const stale = data.scriptHash !== ctx.scriptHash || data.structureHash !== ctx.structureHash;
    return NextResponse.json({ review: { ...data, stale, approvedAt: data.approvedAt?.toDate?.()?.toISOString() ?? null } }, { headers });
  } catch (error) { return fail(error); }
}
export async function POST(request: Request, params: Context) {
  try {
    const { ctx, body } = await context(request, params);
    if (!body || !["propose", "save", "approve"].includes(body.action ?? "")) throw new Error("CENTRE_INVALID");
    const existing = await ctx.reviewRef.get(); const data = existing.data();
    if (data?.status === "approved" && data.scriptHash === ctx.scriptHash && data.structureHash === ctx.structureHash) throw new Error("CENTRE_FINAL");
    if (body.action === "propose") {
      const text = await extractReviewText(ctx);
      const result = await proposeMarks(text, ctx.questions);
      // Check source again before persisting; teacher approval always performs a further check.
      await ctx.examRef.firestore.runTransaction(async tx => {
      const now = await tx.get(ctx.reviewRef);
      if (now.data()?.status === "approved" && now.data()?.scriptHash === ctx.scriptHash && now.data()?.structureHash === ctx.structureHash) throw new Error("CENTRE_FINAL");
      tx.set(ctx.reviewRef, { paperId: ctx.paperId, candidateCode: ctx.candidateCode, scriptHash: ctx.scriptHash, structureHash: ctx.structureHash,
        marks: result.marks, qualityFlags: qualityFlags(result.marks, ctx.questions, result.alignmentWarnings), originalProposalMarks: result.marks.map(m => ({ questionId: m.questionId, awardedMarks: m.awardedMarks })), model: result.model, alignmentWarnings: result.alignmentWarnings, status: "proposed", revision: (Number(now.data()?.revision) || 0) + 1,
        proposedAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
      tx.set(ctx.reviewRef.collection("audit").doc(), { action: "propose", actorId: ctx.actor.uid, at: FieldValue.serverTimestamp(), scriptHash: ctx.scriptHash, structureHash: ctx.structureHash, revision: (Number(now.data()?.revision) || 0) + 1, proposalMarks: result.marks, previousMarks: now.data()?.marks ?? null });
      });
      return NextResponse.json({ status: "proposed", marks: result.marks }, { headers });
    }
    if (!data || data.scriptHash !== ctx.scriptHash || data.structureHash !== ctx.structureHash) throw new Error("CENTRE_STALE");
    if (!Number.isInteger(body.expectedRevision) || body.expectedRevision !== data.revision) throw new Error("CENTRE_STALE");
    validateMarks(body.marks, ctx.questions);
    const marks = body.marks as import("@/lib/marking/reviewContext").ReviewMark[];
    // Candidate answers originate from the extracted script, not the teacher edit form.
    // Prevent changing answerText in a request to bypass non-answer/evidence safeguards.
    const storedMarks = Array.isArray(data.marks) ? data.marks as import("@/lib/marking/reviewContext").ReviewMark[] : [];
    if (storedMarks.length !== marks.length || marks.some(mark => {
      const stored = storedMarks.find(item => item.questionId === mark.questionId);
      return !stored || stored.answerText !== mark.answerText;
    })) throw new Error("CENTRE_INVALID");
    const total = marks.reduce((sum, m) => sum + m.awardedMarks, 0);
    const action = body.action === "approve" ? "approve" : "save";
    if (action === "approve") {
      for (const mark of marks) {
        const previous = (data.originalProposalMarks as { questionId: string; awardedMarks: number }[] | undefined)?.find(m => m.questionId === mark.questionId);
        const missingAnswer = isExplicitNonAnswer(mark.answerText);
        const unsupportedCredit = mark.awardedMarks > 0 && missingAnswer;
        const unsupportedMethod = unsupportedWorkingClaim(mark.answerText, [mark.feedback, mark.evidence].join(" "));
        // Do not allow a teacher to approve an AI assertion of working absent from
        // the submitted answer; correct the feedback first. An explicit non-answer
        // with awarded credit requires a documented teacher override.
        if (unsupportedMethod) throw new Error("CENTRE_EVIDENCE");
        const changed = previous && previous.awardedMarks !== mark.awardedMarks;
        // A downward teacher correction must not leave explicit AI claims that the
        // candidate demonstrated a correct method. Require the teacher to edit the narrative.
        if (changed && previous.awardedMarks > mark.awardedMarks &&
          /\b(?:correct(?:ly)?[\s\w]{0,35}(?:method|working|approach|calculation)|(?:method|working|approach)[\s\w]{0,20}(?:correct|shown|demonstrated))\b/i.test([mark.feedback, mark.improvementGuidance, mark.evidence].join(" ")))
          throw new Error("CENTRE_FEEDBACK_CONFLICT");
        if ((unsupportedCredit || changed) && !(mark.teacherJustification || "").trim()) throw new Error("CENTRE_JUSTIFICATION");
        const question = ctx.questions.find(q => q.id === mark.questionId);
        if (question && mark.awardedMarks < question.maxMarks && !(mark.improvementGuidance ?? "").trim()) throw new Error("CENTRE_GUIDANCE");
      }
    }
    await ctx.examRef.firestore.runTransaction(async tx => {
      const fresh = await tx.get(ctx.reviewRef);
      const current = fresh.data();
      if (!current || current.revision !== body.expectedRevision || current.status === "approved" || current.scriptHash !== ctx.scriptHash || current.structureHash !== ctx.structureHash) throw new Error("CENTRE_STALE");
      // Recheck immutable extracted answers inside the same revision-guarded transaction.
      const currentMarks = Array.isArray(current.marks) ? current.marks as import("@/lib/marking/reviewContext").ReviewMark[] : [];
      if (currentMarks.length !== marks.length || marks.some(mark => {
        const stored = currentMarks.find(item => item.questionId === mark.questionId);
        return !stored || stored.answerText !== mark.answerText;
      })) throw new Error("CENTRE_STALE");
      tx.update(ctx.reviewRef, { marks, qualityFlags: qualityFlags(marks, ctx.questions, Array.isArray(current.alignmentWarnings) ? current.alignmentWarnings : []), total, status: action === "approve" ? "approved" : "reviewing", revision: current.revision + 1,
        updatedAt: FieldValue.serverTimestamp(), ...(action === "approve" ? { approvedAt: FieldValue.serverTimestamp(), approvedBy: ctx.actor.uid } : {}) });
      tx.set(ctx.reviewRef.collection("audit").doc(), { action, actorId: ctx.actor.uid, at: FieldValue.serverTimestamp(), previousMarks: current.marks, marks, revision: current.revision + 1 });
    });
    return NextResponse.json({ status: action === "approve" ? "approved" : "reviewing", total, marks: marks.map(mark => ({ questionId: mark.questionId, awardedMarks: mark.awardedMarks })), revision: (body.expectedRevision ?? 0) + 1 }, { headers });
  } catch (error) { return fail(error); }
}
