"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import ReadAloudButton from "@/components/audio/ReadAloudButton";
import type { ExamQuestion } from "@/types/curriculum";
import type { LessonExamMarkingResult } from "@/types/interactiveLesson";

type Props = {
  topic: string;
  lessonTitle: string;
  question: ExamQuestion;
  response: string;
  marking: LessonExamMarkingResult | null;
  onChange: (response: string) => void;
  onMarked: (result: LessonExamMarkingResult) => void;
};

export default function LessonExamQuestionStep({
  topic,
  lessonTitle,
  question,
  response,
  marking,
  onChange,
  onMarked,
}: Props) {
  const [markingNow, setMarkingNow] = useState(false);

  async function markResponse() {
    if (!response.trim()) {
      toast.error("Write an answer before requesting marking.");
      return;
    }

    try {
      setMarkingNow(true);

      const apiResponse = await fetch("/api/ai/mark-lesson-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          lessonTitle,
          question: question.question,
          maximumMarks: question.marks,
          modelAnswer: question.answer,
          markScheme: question.markScheme ?? [],
          guidance: question.guidance ?? [],
          studentResponse: response,
        }),
      });

      const result = (await apiResponse.json()) as
        LessonExamMarkingResult | { error?: string };

      if (!apiResponse.ok || !("awardedMarks" in result)) {
        throw new Error(
          "error" in result && result.error
            ? result.error
            : "The response could not be marked.",
        );
      }

      onMarked({
        ...result,
        markedAt: result.markedAt ? new Date(result.markedAt) : new Date(),
      });

      toast.success("Exam response marked.");
    } catch (error) {
      console.error("Lesson exam marking error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "The response could not be marked.",
      );
    } finally {
      setMarkingNow(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Exam-style question
          </p>

          <h2 className="mt-2 text-xl font-black leading-8 text-slate-950">
            {question.question}
          </h2>

          <span className="mt-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-bold text-indigo-800">
            {question.marks} {question.marks === 1 ? "mark" : "marks"}
          </span>
        </div>

        <ReadAloudButton text={question.question} label="Read question" />
      </div>

      {question.guidance && question.guidance.length > 0 && (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-black text-amber-950">Examiner guidance</p>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-900">
            {question.guidance.map((guidanceItem) => (
              <li key={guidanceItem}>{guidanceItem}</li>
            ))}
          </ul>
        </div>
      )}

      <label className="mt-6 block font-bold text-slate-800">Your answer</label>

      <textarea
        rows={9}
        value={response}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Write your exam response here..."
        className="mt-2 w-full resize-y rounded-2xl border border-slate-300 p-4 leading-7 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void markResponse()}
          disabled={markingNow || !response.trim()}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {markingNow
            ? "Marking..."
            : marking
              ? "Mark again"
              : "Mark my answer"}
        </button>

        <p className="text-sm text-slate-500">
          Your response is saved automatically. Marking uses live AI when
          available and a conservative demo fallback otherwise.
        </p>
      </div>

      {marking && (
        <div className="mt-6 space-y-4 rounded-3xl border border-indigo-200 bg-indigo-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase text-indigo-600">
                Examiner result
              </p>
              <p className="mt-1 text-3xl font-black text-indigo-950">
                {marking.awardedMarks}/{marking.maximumMarks}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <span className="rounded-full bg-white px-3 py-1 text-indigo-800">
                {marking.percentage}%
              </span>
              <span className="rounded-full bg-white px-3 py-1 capitalize text-indigo-800">
                {marking.confidence} confidence
              </span>
              <span className="rounded-full bg-white px-3 py-1 uppercase text-indigo-800">
                {marking.mode}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4">
            <p className="font-black text-slate-950">Feedback</p>
            <p className="mt-2 leading-7 text-slate-700">{marking.feedback}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-black text-emerald-950">Matched points</p>
              {marking.matchedPoints.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-emerald-900">
                  {marking.matchedPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-emerald-900">
                  No clear marking points were matched.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="font-black text-rose-950">Missing points</p>
              {marking.missingPoints.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-rose-900">
                  {marking.missingPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-rose-900">
                  No additional marking points were identified.
                </p>
              )}
            </div>
          </div>

          <details className="rounded-2xl bg-white p-4">
            <summary className="cursor-pointer font-black text-slate-950">
              View improved answer
            </summary>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
              {marking.improvedAnswer}
            </p>
          </details>

          {marking.teacherReviewRequired && (
            <p className="rounded-2xl bg-amber-100 p-4 text-sm font-bold text-amber-950">
              This result should be reviewed because the decision is provisional
              or the response requires examiner judgement.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
