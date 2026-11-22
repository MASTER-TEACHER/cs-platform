import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireStudent, studentError } from "@/lib/question-bank/studentAccess";
import {
  findStudentQuestion,
  getStudentGuidance,
} from "@/lib/question-bank/studentCatalogue";
import {
  markPracticeAnswer,
  practiceMarkingEnabled,
  reserveDailyMarking,
  startPracticeUsage,
  type PracticeMark,
} from "@/lib/question-bank/practiceMarking";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type SubmittedAnswer = {
  questionId: string;
  answer: string;
};

export async function POST(request: Request) {
  try {
    const actor = await requireStudent(request);

    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 100000) {
      return NextResponse.json(
        { error: "Submission is too large." },
        { status: 413 }
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || !("answers" in body)) {
      return NextResponse.json(
        { error: "Invalid submission." },
        { status: 400 }
      );
    }

    const answers = (body as { answers: unknown }).answers;

    if (!Array.isArray(answers) || answers.length < 1 || answers.length > 10) {
      return NextResponse.json(
        { error: "Submit between 1 and 10 questions." },
        { status: 400 }
      );
    }

    const seen = new Set<string>();
    const validated: SubmittedAnswer[] = [];

    for (const item of answers) {
      if (!item || typeof item !== "object") {
        return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
      }

      const candidate = item as Record<string, unknown>;
      const questionId = candidate.questionId;
      const answer = candidate.answer;

      if (
        typeof questionId !== "string" ||
        typeof answer !== "string" ||
        !questionId ||
        questionId.length > 160 ||
        answer.length > 10000 ||
        seen.has(questionId) ||
        !findStudentQuestion(questionId)
      ) {
        return NextResponse.json(
          { error: "Invalid or duplicate question." },
          { status: 400 }
        );
      }

      seen.add(questionId);
      validated.push({ questionId, answer });
    }

    // Instant practice marking (formative), within daily and monthly limits.
    // Practice attempts are private to the student: they are stored under the student's own
    // record (server access only) and are NOT used in teacher analytics or progress tracking,
    // which use teacher-set assignments and assessments only.
    const marks = new Map<string, PracticeMark>();
    let markingNote = "";
    if (practiceMarkingEnabled()) {
      const answered = validated.filter(item => item.answer.trim());
      const granted = await reserveDailyMarking(actor.uid, answered.length);
      const withinBudget = granted > 0 && await startPracticeUsage();
      if (granted < answered.length) markingNote = "You have reached today's limit for instant marking, so some answers use self-review guidance.";
      if (granted > 0 && !withinBudget) markingNote = "Instant marking is paused for this month, so use the self-review guidance below.";
      if (withinBudget) {
        const toMark = answered.slice(0, granted);
        const results = await Promise.allSettled(toMark.map(item => {
          const entry = findStudentQuestion(item.questionId);
          return entry ? markPracticeAnswer(entry.question, item.answer) : Promise.reject(new Error("missing"));
        }));
        results.forEach((result, index) => {
          if (result.status === "fulfilled") marks.set(toMark[index].questionId, result.value);
          else console.error("[Student Question Bank] could not mark", toMark[index].questionId, result.reason instanceof Error ? result.reason.message : result.reason);
        });
        if (results.some(result => result.status === "rejected")) markingNote = markingNote || "Some answers could not be marked instantly; use the self-review guidance.";
      }
      for (const item of validated) {
        if (!item.answer.trim()) {
          const entry = findStudentQuestion(item.questionId);
          if (entry) marks.set(item.questionId, { awardedMarks: 0, maxMarks: entry.question.marks, feedback: "No answer was given.", improvement: "" });
        }
      }
    }

    const feedback = validated.map(item => {
      const mark = marks.get(item.questionId);
      return {
        questionId: item.questionId,
        answer: item.answer,
        ...getStudentGuidance(item.questionId),
        awardedMarks: mark ? mark.awardedMarks : null,
        maxMarks: mark?.maxMarks ?? findStudentQuestion(item.questionId)?.question.marks ?? null,
        aiFeedback: mark?.feedback ?? "",
        aiImprovement: mark?.improvement ?? "",
        markingStatus: mark ? "ai-marked" : "self-review",
      };
    });
    const markedItems = feedback.filter(item => item.awardedMarks !== null);
    const totalAwarded = markedItems.reduce((sum, item) => sum + (item.awardedMarks ?? 0), 0);
    const totalAvailable = markedItems.reduce((sum, item) => sum + (item.maxMarks ?? 0), 0);

    const doc = adminDb
      .collection("users")
      .doc(actor.uid)
      .collection("questionBankAttempts")
      .doc();

    await doc.create({
      studentId: actor.uid,
      schoolId: actor.schoolId,
      answers: validated,
      questionIds: validated.map(item => item.questionId),
      questionCount: validated.length,
      markingStatus: markedItems.length === validated.length ? "ai-marked" : markedItems.length ? "partly-ai-marked" : "self-review",
      practiceMarks: feedback.map(item => ({ questionId: item.questionId, awardedMarks: item.awardedMarks, maxMarks: item.maxMarks })),
      totalAwarded,
      totalAvailable,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        attemptId: doc.id,
        feedback,
        totalAwarded,
        totalAvailable,
        message: markedItems.length
          ? `Practice marks: ${totalAwarded}/${totalAvailable}. These are instant practice marks, not official results.${markingNote ? ` ${markingNote}` : ""}`
          : `Answers saved. Review the guidance below.${markingNote ? ` ${markingNote}` : ""}`,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const result = studentError(error);
    return NextResponse.json(
      { error: result.message },
      { status: result.status }
    );
  }
}