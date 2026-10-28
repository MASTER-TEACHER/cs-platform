import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { loadReviewContext, validateMarks, type ReviewMark } from "@/lib/marking/reviewContext";
import { qualityFlags, isExplicitNonAnswer, unsupportedWorkingClaim } from "@/lib/marking/reviewFlags";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, requireCentreTeacher } from "@/lib/marking/centre";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };
type Selection = { paperId: string; candidateCode: string; expectedRevision: number };
const valid = (s: unknown): s is string => typeof s === "string" && /^[\w-]{1,128}$/.test(s);
export async function POST(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    if (!valid(examId)) return NextResponse.json({ error: "Invalid examination." }, { status: 400, headers });
    const examRef = centreCollection.doc(examId);
    const exam = await examRef.get();
    if (!exam.exists || exam.data()?.ownerId !== actor.uid) return NextResponse.json({ error: "Examination not found." }, { status: 404, headers });
    const body = await request.json() as { selections?: Selection[]; confirmed?: boolean; moderationNote?: string };
    if (body.confirmed !== true || !Array.isArray(body.selections) || body.selections.length < 1 || body.selections.length > 20 ||
      typeof body.moderationNote !== "string" || body.moderationNote.trim().length < 12 || body.moderationNote.length > 1000 ||
      body.selections.some(s => !valid(s?.paperId) || !valid(s?.candidateCode) || !Number.isInteger(s.expectedRevision) || s.expectedRevision < 1)) {
      return NextResponse.json({ error: "Select 1–20 reviewed proposals and provide a moderation note (12+ characters)." }, { status: 400, headers });
    }
    const keys = body.selections.map(s => `${s.paperId}_${s.candidateCode}`);
    if (new Set(keys).size !== keys.length) return NextResponse.json({ error: "Duplicate selections." }, { status: 400, headers });
    const outcomes: { paperId: string; candidateCode: string; approved: boolean; reason?: string }[] = [];
    // Each script is independently revision-guarded; partial successes are reported explicitly.
    for (const selection of body.selections) {
      try {
        const ctx = await loadReviewContext(request, examId, selection.paperId, selection.candidateCode);
        await ctx.examRef.firestore.runTransaction(async tx => {
          const snap = await tx.get(ctx.reviewRef);
          const data = snap.data();
          if (!data || !["proposed", "reviewing"].includes(data.status) || data.revision !== selection.expectedRevision ||
            data.scriptHash !== ctx.scriptHash || data.structureHash !== ctx.structureHash) throw new Error("Stale or unavailable review");
          validateMarks(data.marks, ctx.questions);
          const marks = data.marks as ReviewMark[];
          if (qualityFlags(marks, ctx.questions, Array.isArray(data.alignmentWarnings) ? data.alignmentWarnings : []).length) throw new Error("Unresolved quality flags");
          if (marks.some(m => m.confidence !== "high" || m.needsReview || isExplicitNonAnswer(m.answerText) ||
            unsupportedWorkingClaim(m.answerText, [m.feedback, m.evidence, m.improvementGuidance ?? ""].join(" ")) ||
            (m.teacherJustification ?? "").trim() || !m.feedback.trim() || !m.evidence.trim() ||
            (m.awardedMarks < (ctx.questions.find(q => q.id === m.questionId)?.maxMarks ?? 0) && !m.improvementGuidance?.trim()))) throw new Error("Manual review required");
          const originals = data.originalProposalMarks as { questionId: string; awardedMarks: number }[] | undefined;
          if (!Array.isArray(originals) || originals.length !== marks.length || marks.some(m => originals.find(o => o.questionId === m.questionId)?.awardedMarks !== m.awardedMarks)) throw new Error("Teacher override requires individual approval");
          const total = marks.reduce((sum, m) => sum + m.awardedMarks, 0);
          tx.update(ctx.reviewRef, { status: "approved", total, revision: data.revision + 1, approvedAt: FieldValue.serverTimestamp(), approvedBy: actor.uid,
            approvalMethod: "teacher_confirmed_bulk", moderationNote: body.moderationNote!.trim(), updatedAt: FieldValue.serverTimestamp(), qualityFlags: [] });
          tx.set(ctx.reviewRef.collection("audit").doc(), { action: "bulk_approve", actorId: actor.uid, at: FieldValue.serverTimestamp(), revision: data.revision + 1,
            previousMarks: marks, marks, moderationNote: body.moderationNote!.trim(), sourceRevision: data.revision });
        });
        outcomes.push({ paperId: selection.paperId, candidateCode: selection.candidateCode, approved: true });
      } catch (error) {
        outcomes.push({ paperId: selection.paperId, candidateCode: selection.candidateCode, approved: false,
          reason: error instanceof Error && /^(Stale|Unresolved|Manual|Teacher)/.test(error.message) ? error.message : "Approval validation failed; review individually." });
      }
    }
    return NextResponse.json({ outcomes, approved: outcomes.filter(o => o.approved).length, rejected: outcomes.filter(o => !o.approved).length }, { headers });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: code.startsWith("AUTH_") ? "Sign in again." : code === "CENTRE_FORBIDDEN" ? "Teacher access required." : "Bulk approval failed." },
      { status: code.startsWith("AUTH_") ? 401 : code === "CENTRE_FORBIDDEN" ? 403 : 500, headers });
  }
}
