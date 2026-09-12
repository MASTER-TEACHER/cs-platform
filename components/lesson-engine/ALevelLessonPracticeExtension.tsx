"use client";

import { useMemo, useState } from "react";

import { getALevelLessonQuestions } from "@/data/a-level/questionBank";
import type { ALevelExamBoard } from "@/types/aLevelPractice";

type Props = {
  board: ALevelExamBoard;
  topicId: string;
  lessonTitle: string;
};

export default function ALevelLessonPracticeExtension({
  board,
  topicId,
  lessonTitle,
}: Props) {
  const questions = useMemo(
    () =>
      getALevelLessonQuestions({
        board,
        topicId,
        lessonTitle,
      }),
    [board, topicId, lessonTitle],
  );

  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [reveal, setReveal] = useState(false);

  if (questions.length === 0) {
    return null;
  }

  const current =
    questions[Math.min(index, questions.length - 1)];

  function newQuestion() {
    setIndex((currentIndex) =>
      questions.length <= 1
        ? 0
        : (currentIndex + 1) % questions.length,
    );
    setResponse("");
    setReveal(false);
  }

  return (
    <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-700">
            A-level lesson extension
          </p>
          <h3 className="mt-2 text-xl font-black text-slate-950">
            More exam-style practice
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            This extra practice is matched to the current A-level topic. It does not replace the lesson questions you must complete.
          </p>
        </div>

        <button
          type="button"
          onClick={newQuestion}
          className="rounded-xl bg-indigo-700 px-4 py-2 font-black text-white"
        >
          New question
        </button>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">
            {current.subtopic}
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800">
            {current.marks} marks
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
            {current.difficulty}
          </span>
        </div>

        <p className="mt-4 font-bold leading-7 text-slate-950">
          {current.question}
        </p>

        <textarea
          rows={5}
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          className="mt-4 w-full resize-y rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Plan or write your answer..."
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setReveal((value) => !value)}
            className="rounded-xl border border-indigo-300 bg-white px-4 py-2 font-black text-indigo-800"
          >
            {reveal ? "Hide answer" : "Check mark points"}
          </button>

          <button
            type="button"
            onClick={newQuestion}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-black text-slate-800"
          >
            New question
          </button>
        </div>

        {reveal ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="font-black text-emerald-950">
                Mark points
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-900">
                {current.markPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="font-black text-blue-950">
                Model answer
              </p>
              <p className="mt-2 text-sm leading-6 text-blue-900">
                {current.modelAnswer}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
