import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };

// AI ACCURACY CHECK
// Compares the AI's original proposal with the marks the teacher finally approved, for every
// individually approved script (bulk-approved scripts are excluded: nobody checked them).
// Protocol for a fair test: mark 5+ scripts on paper first WITHOUT looking at the AI, then enter
// your marks (overriding where needed) and approve. This report then shows how often you agree.
const MIN_SCRIPTS = 5;
const QUESTION_AGREEMENT_TARGET = 0.9;   // 90% of question marks identical
const TOTAL_TOLERANCE = 2;               // every script total within ±2 marks

type Mark = { questionId: string; awardedMarks: number };

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
    const ref = centreCollection.doc(examId);
    const exam = await ref.get();
    if (!exam.exists || exam.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");

    const reviews = await ref.collection("markingReviews").where("status", "==", "approved").limit(1000).get();
    const perQuestion = new Map<string, { compared: number; agreed: number; absDiff: number; aiHigher: number; aiLower: number }>();
    const scripts: { paperId: string; candidateCode: string; aiTotal: number; teacherTotal: number; difference: number; questionsChanged: string[] }[] = [];

    for (const doc of reviews.docs) {
      const data = doc.data();
      if (typeof data.approvalMethod === "string" && data.approvalMethod.startsWith("teacher_confirmed_bulk")) continue;
      const finalMarks: Mark[] = Array.isArray(data.marks) ? data.marks : [];
      const original: Mark[] = Array.isArray(data.originalProposalMarks) ? data.originalProposalMarks : [];
      if (!finalMarks.length || original.length !== finalMarks.length) continue;
      let aiTotal = 0, teacherTotal = 0;
      const changed: string[] = [];
      for (const mark of finalMarks) {
        const ai = original.find(o => o.questionId === mark.questionId);
        if (!ai || !Number.isFinite(ai.awardedMarks) || !Number.isFinite(mark.awardedMarks)) continue;
        aiTotal += ai.awardedMarks;
        teacherTotal += mark.awardedMarks;
        const q = perQuestion.get(mark.questionId) ?? { compared: 0, agreed: 0, absDiff: 0, aiHigher: 0, aiLower: 0 };
        q.compared++;
        const diff = ai.awardedMarks - mark.awardedMarks;
        if (diff === 0) q.agreed++; else changed.push(`${mark.questionId} (AI ${ai.awardedMarks}, you ${mark.awardedMarks})`);
        if (diff > 0) q.aiHigher++;
        if (diff < 0) q.aiLower++;
        q.absDiff += Math.abs(diff);
        perQuestion.set(mark.questionId, q);
      }
      scripts.push({ paperId: data.paperId, candidateCode: data.candidateCode, aiTotal, teacherTotal, difference: aiTotal - teacherTotal, questionsChanged: changed });
    }

    const questions = [...perQuestion.entries()].map(([questionId, q]) => ({
      questionId, compared: q.compared,
      agreementRate: q.compared ? q.agreed / q.compared : 0,
      meanAbsoluteDifference: q.compared ? q.absDiff / q.compared : 0,
      aiTooGenerous: q.aiHigher, aiTooHarsh: q.aiLower,
    })).sort((a, b) => a.agreementRate - b.agreementRate || a.questionId.localeCompare(b.questionId, undefined, { numeric: true }));

    const totalCompared = questions.reduce((n, q) => n + q.compared, 0);
    const totalAgreed = [...perQuestion.values()].reduce((n, q) => n + q.agreed, 0);
    const questionAgreement = totalCompared ? totalAgreed / totalCompared : 0;
    const withinTolerance = scripts.filter(s => Math.abs(s.difference) <= TOTAL_TOLERANCE).length;
    const meanTotalDifference = scripts.length ? scripts.reduce((n, s) => n + Math.abs(s.difference), 0) / scripts.length : 0;
    const bias = scripts.length ? scripts.reduce((n, s) => n + s.difference, 0) / scripts.length : 0;

    let verdict: "not_enough_data" | "ready_for_bulk_approval" | "keep_reviewing";
    let advice: string;
    if (scripts.length < MIN_SCRIPTS) {
      verdict = "not_enough_data";
      advice = `Compare at least ${MIN_SCRIPTS} scripts (currently ${scripts.length}). Mark them on paper first without looking at the AI, then enter your marks and approve each one individually.`;
    } else if (questionAgreement >= QUESTION_AGREEMENT_TARGET && withinTolerance === scripts.length) {
      verdict = "ready_for_bulk_approval";
      advice = `The AI matched your marks on ${(questionAgreement * 100).toFixed(0)}% of questions and every script total was within ±${TOTAL_TOLERANCE}. Bulk-approving unflagged scripts is supported by this evidence; keep spot-checking about 1 in 10.`;
    } else {
      const weak = questions.filter(q => q.agreementRate < QUESTION_AGREEMENT_TARGET).slice(0, 5).map(q => q.questionId);
      verdict = "keep_reviewing";
      advice = `Agreement is ${(questionAgreement * 100).toFixed(0)}% of questions and ${withinTolerance}/${scripts.length} scripts were within ±${TOTAL_TOLERANCE}. Keep reviewing${weak.length ? `, especially question(s) ${weak.join(", ")}` : ""}; check their criteria and guidance in step 4.`;
    }

    return NextResponse.json({
      verdict, advice,
      summary: { scriptsCompared: scripts.length, questionAgreement, scriptsWithinTolerance: withinTolerance, totalTolerance: TOTAL_TOLERANCE, meanTotalDifference, averageBias: bias, minimumScripts: MIN_SCRIPTS, agreementTarget: QUESTION_AGREEMENT_TARGET },
      questions, scripts,
    }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
