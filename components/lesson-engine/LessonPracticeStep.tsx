"use client";

import { useEffect, useState } from "react";

import ReadAloudButton from "@/components/audio/ReadAloudButton";
import type { PracticeQuestion } from "@/types/curriculum";
import type { PracticeResponse } from "@/types/interactiveLesson";

type Props = {
  questions: PracticeQuestion[];
  initialResponses: PracticeResponse[];
  onChange: (responses: PracticeResponse[]) => void;
};

function normaliseAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");
}

function isAcceptedAnswer(
  response: string,
  question: PracticeQuestion,
): boolean {
  const normalisedResponse = normaliseAnswer(response);

  const acceptedAnswers = [
    question.answer,
    ...(question.acceptedAnswers ?? []),
  ].map(normaliseAnswer);

  return acceptedAnswers.includes(normalisedResponse);
}

function createInitialResponses(
  questions: PracticeQuestion[],
  existingResponses: PracticeResponse[],
): PracticeResponse[] {
  return questions.map((_, index) => {
    const existingResponse = existingResponses.find(
      (response) => response.questionIndex === index,
    );

    return (
      existingResponse ?? {
        questionIndex: index,
        response: "",
        correct: false,
        checked: false,
      }
    );
  });
}

export default function LessonPracticeStep({
  questions,
  initialResponses,
  onChange,
}: Props) {
  const [responses, setResponses] = useState<PracticeResponse[]>(() =>
    createInitialResponses(questions, initialResponses),
  );

  useEffect(() => {
    setResponses(createInitialResponses(questions, initialResponses));
  }, [questions, initialResponses]);

  function updateResponse(
    questionIndex: number,
    updates: Partial<PracticeResponse>,
  ) {
    const updatedResponses = responses.map((response) =>
      response.questionIndex === questionIndex
        ? {
            ...response,
            ...updates,
          }
        : response,
    );

    setResponses(updatedResponses);
    onChange(updatedResponses);
  }

  function checkAnswer(questionIndex: number) {
    const question = questions[questionIndex];

    const response = responses.find(
      (item) => item.questionIndex === questionIndex,
    );

    if (!question || !response) {
      return;
    }

    updateResponse(questionIndex, {
      checked: true,
      correct: isAcceptedAnswer(response.response, question),
    });
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="italic text-slate-500">
          Practice questions are coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {questions.map((question, index) => {
        const response = responses.find(
          (item) => item.questionIndex === index,
        ) ?? {
          questionIndex: index,
          response: "",
          correct: false,
          checked: false,
        };

        return (
          <article
            key={`${question.question}-${index}`}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                  Question {index + 1}
                </p>

                <h3 className="mt-2 text-lg font-black text-slate-950">
                  {question.question}
                </h3>
              </div>

              <ReadAloudButton text={question.question} label="Read question" />
            </div>

            {question.hint && (
              <details className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <summary className="cursor-pointer font-bold text-amber-900">
                  Show hint
                </summary>

                <p className="mt-2 text-sm text-amber-800">{question.hint}</p>
              </details>
            )}

            <input
              type="text"
              value={response.response}
              onChange={(event) =>
                updateResponse(index, {
                  response: event.target.value,
                  checked: false,
                  correct: false,
                })
              }
              placeholder="Type your answer..."
              className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => checkAnswer(index)}
              disabled={!response.response.trim()}
              className="mt-4 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Check answer
            </button>

            {response.checked && (
              <div
                className={`mt-5 rounded-2xl border p-4 ${
                  response.correct
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-red-200 bg-red-50 text-red-900"
                }`}
              >
                <p className="font-black">
                  {response.correct ? "✅ Correct" : "❌ Not quite"}
                </p>

                <p className="mt-2 text-sm leading-6">
                  {response.correct
                    ? question.feedback || "Excellent work."
                    : "Review the explanation and try the question again."}
                </p>

                {!response.correct && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-bold">
                      Show correct answer
                    </summary>

                    <p className="mt-2 text-sm">{question.answer}</p>
                  </details>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
