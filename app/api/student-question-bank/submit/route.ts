import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireStudent, studentError } from "@/lib/question-bank/studentAccess";
import {
  findStudentQuestion,
  getStudentGuidance,
} from "@/lib/question-bank/studentCatalogue";

export const dynamic = "force-dynamic";

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

    const feedback = validated.map(item => ({
      questionId: item.questionId,
      answer: item.answer,
      ...getStudentGuidance(item.questionId),
      awardedMarks: null,
      markingStatus: "self-review",
    }));

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
      markingStatus: "self-review",
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        attemptId: doc.id,
        feedback,
        message: "Answers saved. Review the guidance below.",
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