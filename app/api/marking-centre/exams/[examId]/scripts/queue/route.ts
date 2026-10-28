import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { qualityFlags } from "@/lib/marking/reviewFlags";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };
export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
    const ref = centreCollection.doc(examId);
    const exam = await ref.get();
    if (!exam.exists || exam.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
    const [scripts, reviews, structures] = await Promise.all([
      ref.collection("candidateScripts").limit(1000).get(),
      ref.collection("markingReviews").limit(1000).get(),
      ref.collection("paperStructures").limit(20).get(),
    ]);
    const reviewByKey = new Map(reviews.docs.map(d => [d.id, d.data()]));
    const questionsByPaper = new Map(structures.docs.map(d => [d.id, Array.isArray(d.data().questions) ? d.data().questions : []]));
    const rows = scripts.docs.map(doc => {
      const script = doc.data();
      const review = reviewByKey.get(`${script.paperId}_${script.candidateCode}`);
      const marks = Array.isArray(review?.marks) ? review.marks : [];
      const flags = marks.length ? qualityFlags(marks, questionsByPaper.get(script.paperId) || [], Array.isArray(review?.alignmentWarnings) ? review.alignmentWarnings : []) : [];
      const approved = review?.status === "approved";
      return {
        paperId: script.paperId, candidateCode: script.candidateCode,
        filename: script.originalName || "Candidate script",
        status: approved ? "approved" : review?.status || "unprocessed",
        revision: Number(review?.revision) || 0,
        bulkEligible: review?.status === "proposed" && flags.length === 0 && marks.length > 0 &&
          marks.every((m: { confidence?: string; needsReview?: boolean; teacherJustification?: string }) => m.confidence === "high" && !m.needsReview && !m.teacherJustification) &&
          Array.isArray(review?.originalProposalMarks) && review.originalProposalMarks.length === marks.length &&
          marks.every((m: { questionId: string; awardedMarks: number }) => review.originalProposalMarks.some((o: { questionId: string; awardedMarks: number }) => o.questionId === m.questionId && o.awardedMarks === m.awardedMarks)),
        flags, flagged: flags.length > 0,
        // A hash is checked again by the review endpoint before approval.
        sourceVerificationRequired: true,
      };
    });
    rows.sort((a, b) => Number(b.flagged) - Number(a.flagged) || (a.status === "approved" ? 1 : 0) - (b.status === "approved" ? 1 : 0) || a.candidateCode.localeCompare(b.candidateCode));
    return NextResponse.json({ rows, summary: { uploaded: rows.length, approved: rows.filter(r => r.status === "approved").length, flagged: rows.filter(r => r.flagged).length, awaitingProposal: rows.filter(r => r.status === "unprocessed").length } }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
