import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, centreError, requireCentreTeacher } from "@/lib/marking/centre";
import { tieredFlags, watchList, type ApprovedReview } from "@/lib/marking/reviewPolicy";
import type { MarkQuestion, ReviewMark } from "@/lib/marking/reviewContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };
type Context = { params: Promise<{ examId: string }> };
const OPEN = ["proposed", "reviewing"];
const safe = (s: unknown, pattern: RegExp): s is string => typeof s === "string" && pattern.test(s);
const PAPER = /^paper-\d{1,2}$/;
const QUESTION = /^[\w().\- ]{1,40}$/;
const CODE = /^[A-Z0-9][A-Z0-9_-]{0,127}$/;

// CHECK BY QUESTION
// Examiners check one question across every script rather than one script at a time.
// GET lists the questions still needing a check (or every candidate's answer to one question);
// POST records the teacher's decision (keep or change) for each candidate on that question.
// Approval itself still happens separately and re-verifies every script.

async function load(request: Request, context: Context) {
  const actor = await requireAuthenticatedUser(request);
  requireCentreTeacher(actor);
  const { examId } = await context.params;
  if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("CENTRE_NOT_FOUND");
  const ref = centreCollection.doc(examId);
  const exam = await ref.get();
  if (!exam.exists || exam.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
  return { actor, ref };
}

export async function GET(request: Request, context: Context) {
  try {
    const { ref } = await load(request, context);
    const url = new URL(request.url);
    const paperId = url.searchParams.get("paperId");
    const questionId = url.searchParams.get("questionId");
    if (!safe(paperId, PAPER)) throw new Error("CENTRE_NOT_FOUND");
    const [structure, reviews] = await Promise.all([
      ref.collection("paperStructures").doc(paperId).get(),
      ref.collection("markingReviews").limit(1000).get(),
    ]);
    const questions = (Array.isArray(structure.data()?.questions) ? structure.data()!.questions : []) as MarkQuestion[];
    const all = reviews.docs.map(d => d.data() as ApprovedReview & Record<string, unknown>);
    const watch = watchList(all);
    const open = all.filter(r => r.paperId === paperId && OPEN.includes(String(r.status)) && Array.isArray(r.marks) && r.marks.length);
    const flagsFor = (r: (typeof open)[number]) => tieredFlags(paperId, r.marks as ReviewMark[], questions,
      Array.isArray(r.alignmentWarnings) ? r.alignmentWarnings as string[] : [], watch, Array.isArray(r.checkedQuestions) ? r.checkedQuestions as string[] : []);

    if (!questionId) {
      // Which questions still need checking, and on how many scripts.
      const counts = new Map<string, number>();
      for (const review of open) {
        for (const id of new Set(flagsFor(review).filter(f => f.tier === "check" && f.questionId !== "*").map(f => f.questionId))) counts.set(id, (counts.get(id) ?? 0) + 1);
      }
      const order = new Map(questions.map((q, i) => [q.id, i]));
      return NextResponse.json({ questions: [...counts.entries()].map(([id, scripts]) => ({ questionId: id, scripts, maxMarks: questions.find(q => q.id === id)?.maxMarks ?? 0 }))
        .sort((a, b) => (order.get(a.questionId) ?? 999) - (order.get(b.questionId) ?? 999)) }, { headers });
    }

    if (!safe(questionId, QUESTION)) throw new Error("CENTRE_NOT_FOUND");
    const question = questions.find(q => q.id === questionId);
    if (!question) throw new Error("CENTRE_NOT_FOUND");
    const items = open.map(review => {
      const mark = (review.marks as ReviewMark[]).find(m => m.questionId === questionId);
      if (!mark) return null;
      const original = (review.originalProposalMarks as { questionId: string; awardedMarks: number }[] | undefined)?.find(o => o.questionId === questionId);
      const flags = flagsFor(review).filter(f => f.questionId === questionId);
      return {
        candidateCode: String(review.candidateCode), revision: Number(review.revision) || 0,
        answerText: mark.answerText, awardedMarks: mark.awardedMarks, aiMarks: original?.awardedMarks ?? mark.awardedMarks,
        feedback: mark.feedback, improvementGuidance: mark.improvementGuidance ?? "", evidence: mark.evidence.slice(0, 900),
        checked: Array.isArray(review.checkedQuestions) && (review.checkedQuestions as string[]).includes(questionId),
        needsCheck: flags.some(f => f.tier === "check"),
        reasons: flags.map(f => f.detail).slice(0, 4),
      };
    }).filter(Boolean).sort((a, b) => Number(b!.needsCheck) - Number(a!.needsCheck) || a!.candidateCode.localeCompare(b!.candidateCode));
    return NextResponse.json({ question: { id: question.id, maxMarks: question.maxMarks, criteria: question.criteria, notes: question.notes ?? "" }, items }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}

type Decision = { candidateCode: string; expectedRevision: number; awardedMarks: number; reason?: string; feedback?: string };

export async function POST(request: Request, context: Context) {
  try {
    const { actor, ref } = await load(request, context);
    const body = await request.json() as { paperId?: string; questionId?: string; decisions?: Decision[] };
    if (!safe(body.paperId, PAPER) || !safe(body.questionId, QUESTION) || !Array.isArray(body.decisions) || body.decisions.length < 1 || body.decisions.length > 60 ||
      body.decisions.some(d => !safe(d?.candidateCode, CODE) || !Number.isInteger(d.expectedRevision) || !Number.isInteger(d.awardedMarks) ||
        (d.reason !== undefined && (typeof d.reason !== "string" || d.reason.length > 1500)) || (d.feedback !== undefined && (typeof d.feedback !== "string" || d.feedback.length > 3000)))) {
      return NextResponse.json({ error: "Invalid decisions." }, { status: 400, headers });
    }
    const paperId = body.paperId, questionId = body.questionId;
    const structure = await ref.collection("paperStructures").doc(paperId).get();
    const question = ((structure.data()?.questions ?? []) as MarkQuestion[]).find(q => q.id === questionId);
    if (!question) return NextResponse.json({ error: "Question not found." }, { status: 404, headers });

    const outcomes: { candidateCode: string; saved: boolean; reason?: string }[] = [];
    for (const decision of body.decisions) {
      try {
        if (decision.awardedMarks < 0 || decision.awardedMarks > question.maxMarks) throw new Error("Mark out of range");
        const reviewRef = ref.collection("markingReviews").doc(`${paperId}_${decision.candidateCode}`);
        await ref.firestore.runTransaction(async tx => {
          const snap = await tx.get(reviewRef);
          const data = snap.data();
          if (!data || !OPEN.includes(data.status) || data.revision !== decision.expectedRevision) throw new Error("Stale: reload the question");
          const marks = (Array.isArray(data.marks) ? data.marks : []) as ReviewMark[];
          const index = marks.findIndex(m => m.questionId === questionId);
          if (index < 0) throw new Error("Question not in this script");
          const mark = marks[index];
          const original = (data.originalProposalMarks as { questionId: string; awardedMarks: number }[] | undefined)?.find(o => o.questionId === questionId)?.awardedMarks ?? mark.awardedMarks;
          const changed = decision.awardedMarks !== mark.awardedMarks;
          const max = question.maxMarks;
          const next: ReviewMark = changed ? {
            ...mark,
            awardedMarks: decision.awardedMarks,
            // The AI's feedback explained the AI's mark, so it is replaced when the mark changes.
            feedback: decision.feedback?.trim() || (decision.awardedMarks >= max
              ? `Your teacher reviewed this answer and awarded full marks (${decision.awardedMarks}/${max}).`
              : `Your teacher reviewed this answer and awarded ${decision.awardedMarks} out of ${max} marks.`),
            improvementGuidance: decision.awardedMarks >= max ? "" : (mark.improvementGuidance?.trim() || "Review the mark scheme points for this question."),
            teacherJustification: decision.reason?.trim() || `Teacher changed the mark from ${original} to ${decision.awardedMarks} after checking the answer against the mark scheme.`,
            confidence: "high", needsReview: false,
          } : {
            ...mark,
            ...(decision.feedback?.trim() ? { feedback: decision.feedback.trim() } : {}),
            confidence: "high", needsReview: false,
          };
          const updated = marks.map((m, i) => i === index ? next : m);
          const total = updated.reduce((n, m) => n + m.awardedMarks, 0);
          tx.update(reviewRef, {
            marks: updated, total, status: "reviewing", revision: data.revision + 1,
            checkedQuestions: FieldValue.arrayUnion(questionId), updatedAt: FieldValue.serverTimestamp(),
          });
          tx.set(reviewRef.collection("audit").doc(), {
            action: changed ? "question_check_changed" : "question_check_kept", questionId, actorId: actor.uid, at: FieldValue.serverTimestamp(),
            revision: data.revision + 1, previousMarks: marks, marks: updated,
          });
        });
        outcomes.push({ candidateCode: decision.candidateCode, saved: true });
      } catch (error) {
        outcomes.push({ candidateCode: decision.candidateCode, saved: false, reason: error instanceof Error ? error.message.slice(0, 120) : "Not saved" });
      }
    }
    return NextResponse.json({ outcomes, saved: outcomes.filter(o => o.saved).length }, { headers });
  } catch (error) {
    const result = centreError(error);
    return NextResponse.json({ error: result.error }, { status: result.status, headers });
  }
}
