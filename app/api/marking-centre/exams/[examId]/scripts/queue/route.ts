import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { tieredFlags, watchList, sampleStatus, onlyCheckedChanges, fullyChecked, type ApprovedReview } from "@/lib/marking/reviewPolicy";
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
    // Same fingerprint the review route uses: a script marked against an older version
    // of the paper's questions (e.g. before missing questions were added) is out of date.
    const hashByPaper = new Map(structures.docs.filter(d => d.data().status === "approved" && Array.isArray(d.data().questions))
      .map(d => [d.id, createHash("sha256").update(JSON.stringify(d.data().questions)).digest("hex")]));
    // Out-of-date reviews say nothing about the current questions: leave them out of the sample.
    const allReviews = reviews.docs.map(d => d.data()).filter(r => !hashByPaper.get(r.paperId) || !r.structureHash || r.structureHash === hashByPaper.get(r.paperId)) as ApprovedReview[];
    const watch = watchList(allReviews);
    const rows = scripts.docs.map(doc => {
      const script = doc.data();
      const review = reviewByKey.get(`${script.paperId}_${script.candidateCode}`);
      const marks = Array.isArray(review?.marks) ? review.marks : [];
      const checked: string[] = Array.isArray(review?.checkedQuestions) ? review.checkedQuestions : [];
      const flags = marks.length ? tieredFlags(script.paperId, marks, questionsByPaper.get(script.paperId) || [], Array.isArray(review?.alignmentWarnings) ? review.alignmentWarnings : [], watch, checked) : [];
      const checks = flags.filter(f => f.tier === "check").length;
      const current = hashByPaper.get(script.paperId);
      const outdated = Boolean(review && current && review.structureHash && review.structureHash !== current);
      const approved = review?.status === "approved" && !outdated;
      return {
        paperId: script.paperId, candidateCode: script.candidateCode,
        filename: script.originalName || "Candidate script",
        status: outdated ? "outdated" : approved ? "approved" : review?.status || "unprocessed",
        revision: Number(review?.revision) || 0,
        bulkEligible: review?.status === "proposed" && flags.length === 0 && marks.length > 0 &&
          marks.every((m: { confidence?: string; needsReview?: boolean; teacherJustification?: string }) => m.confidence === "high" && !m.needsReview && !m.teacherJustification) &&
          Array.isArray(review?.originalProposalMarks) && review.originalProposalMarks.length === marks.length &&
          marks.every((m: { questionId: string; awardedMarks: number }) => review.originalProposalMarks.some((o: { questionId: string; awardedMarks: number }) => o.questionId === m.questionId && o.awardedMarks === m.awardedMarks)),
        // Eligible for bulk approval once the teacher confirms they have reviewed the flagged questions.
        bulkEligibleWithFlags: ["proposed", "reviewing"].includes(review?.status) && marks.length > 0 &&
          Array.isArray(review?.originalProposalMarks) && review.originalProposalMarks.length === marks.length &&
          marks.every((m: { questionId: string; awardedMarks: number }) => review.originalProposalMarks.some((o: { questionId: string; awardedMarks: number }) => o.questionId === m.questionId && o.awardedMarks === m.awardedMarks)),
        // Sample moderation: approvable together once the paper's sample has passed (checked again on approval).
        sampleReady: ["proposed", "reviewing"].includes(review?.status) && checks === 0 && onlyCheckedChanges(marks, review?.originalProposalMarks, checked),
        aiTotal: marks.reduce((n: number, m: { awardedMarks: number }) => n + (Number(m.awardedMarks) || 0), 0),
        flags, flagged: flags.length > 0, checks,
        // A hash is checked again by the review endpoint before approval.
        sourceVerificationRequired: true,
      };
    });
    const samples = [...new Set(rows.map(r => r.paperId))].map(paperId => sampleStatus(paperId, allReviews,
      rows.filter(r => r.paperId === paperId && ["proposed", "reviewing"].includes(r.status)).map(r => ({ candidateCode: r.candidateCode, aiTotal: r.aiTotal })),
      rows.filter(r => r.paperId === paperId).length, watch,
      (questionsByPaper.get(paperId) as { maxMarks: number }[] ?? []).reduce((n, q) => n + (Number(q.maxMarks) || 0), 0),
      fullyChecked(rows.filter(r => r.paperId === paperId && ["proposed", "reviewing"].includes(r.status)).map(r => reviewByKey.get(`${paperId}_${r.candidateCode}`) ?? {}))));
    rows.sort((a, b) => b.checks - a.checks || Number(b.flagged) - Number(a.flagged) || (a.status === "approved" ? 1 : 0) - (b.status === "approved" ? 1 : 0) || a.candidateCode.localeCompare(b.candidateCode));
    return NextResponse.json({ rows, summary: { uploaded: rows.length, approved: rows.filter(r => r.status === "approved").length, flagged: rows.filter(r => r.checks > 0 && r.status !== "approved").length, awaitingProposal: rows.filter(r => r.status === "unprocessed").length }, samples, watch }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
