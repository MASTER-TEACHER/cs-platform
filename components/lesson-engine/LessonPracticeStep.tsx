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

/*
 * Words that add little semantic meaning when comparing
 * short-answer responses.
 */
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "because",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "that",
  "the",
  "their",
  "this",
  "to",
  "was",
  "were",
  "which",
  "with",
]);

/*
 * Small CS-focused synonym map.
 *
 * We deliberately keep this conservative. The purpose is to
 * recognise equivalent terminology, not to make marking vague.
 */
const SYNONYM_MAP: Record<string, string> = {
  attributes: "data",
  attribute: "data",

  properties: "data",
  property: "data",

  variables: "data",
  variable: "data",

  state: "data",

  instances: "instance",

  classes: "class",

  objects: "object",

  protects: "protect",
  protected: "protect",
  protecting: "protect",

  hides: "hide",
  hidden: "hide",
  hiding: "hide",

  prevents: "prevent",
  prevented: "prevent",
  preventing: "prevent",

  changes: "change",
  changed: "change",
  changing: "change",

  modifies: "change",
  modified: "change",
  modifying: "change",

  accesses: "access",
  accessed: "access",
  accessing: "access",

  methods: "method",

  behaviours: "behaviour",
  behaviors: "behaviour",
  behavior: "behaviour",
};

function normaliseAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[()[\]{}"'`]/g, " ")
    .replace(/[.,!?;:]/g, " ")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicaliseWord(word: string): string {
  const cleaned = word.trim().toLowerCase();

  if (!cleaned) {
    return "";
  }

  return SYNONYM_MAP[cleaned] ?? cleaned;
}

function meaningfulTokens(value: string): string[] {
  return normaliseAnswer(value)
    .split(" ")
    .map(canonicaliseWord)
    .filter(Boolean)
    .filter((word) => !STOP_WORDS.has(word));
}

function uniqueTokens(tokens: string[]): string[] {
  return Array.from(new Set(tokens));
}

function tokenOverlapScore(
  responseTokens: string[],
  acceptedTokens: string[],
): number {
  if (
    responseTokens.length === 0 ||
    acceptedTokens.length === 0
  ) {
    return 0;
  }

  const responseSet = new Set(responseTokens);

  const matched = acceptedTokens.filter((token) =>
    responseSet.has(token),
  ).length;

  return matched / acceptedTokens.length;
}

function containsAllTokens(
  responseTokens: string[],
  requiredTokens: string[],
): boolean {
  const responseSet = new Set(responseTokens);

  return requiredTokens.every((token) =>
    responseSet.has(token),
  );
}

/*
 * Some short CS questions have a well-established pair of
 * concepts that must be present together.
 *
 * These rules stop the generic similarity matcher from becoming
 * too generous.
 */
function matchesKnownConcept(
  response: string,
  question: PracticeQuestion,
): boolean {
  const questionText = normaliseAnswer(question.question);
  const tokens = uniqueTokens(meaningfulTokens(response));

  /*
   * "What is an object?"
   *
   * A correct answer needs both:
   * - instance
   * - class
   *
   * This accepts:
   * "An object is an instance of a class."
   * "A class instance."
   *
   * but rejects:
   * "A class."
   */
  if (
    questionText.includes("what is an object") ||
    questionText.includes("define an object")
  ) {
    return containsAllTokens(tokens, [
      "instance",
      "class",
    ]);
  }

  /*
   * "What does encapsulation protect?"
   *
   * Valid GCSE responses commonly refer to protecting/hiding
   * data/state/attributes from direct or unauthorised access or
   * modification.
   */
  if (questionText.includes("encapsulation")) {
    const hasDataConcept =
      tokens.includes("data");

    const hasProtectionConcept =
      tokens.includes("protect") ||
      tokens.includes("hide") ||
      tokens.includes("prevent");

    const hasAccessConcept =
      tokens.includes("access") ||
      tokens.includes("change");

    /*
     * Accept either:
     * - data + protection idea
     * - data + access/change idea
     */
    return (
      hasDataConcept &&
      (hasProtectionConcept || hasAccessConcept)
    );
  }

  return false;
}

function isAcceptedAnswer(
  response: string,
  question: PracticeQuestion,
): boolean {
  const normalisedResponse = normaliseAnswer(response);

  if (!normalisedResponse) {
    return false;
  }

  const acceptedAnswers = [
    question.answer,
    ...(question.acceptedAnswers ?? []),
  ]
    .filter(Boolean)
    .map(normaliseAnswer);

  /*
   * 1. Exact normalised match.
   */
  if (acceptedAnswers.includes(normalisedResponse)) {
    return true;
  }

  /*
   * 2. Known CS concept rules.
   *
   * These are intentionally more precise than simple keyword
   * matching.
   */
  if (matchesKnownConcept(response, question)) {
    return true;
  }

  /*
   * 3. Conservative semantic-token comparison.
   *
   * This handles wording differences such as:
   *
   * Model:
   * "An instance created from a class."
   *
   * Student:
   * "An object is an instance of a class."
   *
   * We require meaningful overlap rather than a single keyword.
   */
  const responseTokens = uniqueTokens(
    meaningfulTokens(response),
  );

  if (responseTokens.length < 2) {
    return false;
  }

  return acceptedAnswers.some((acceptedAnswer) => {
    const acceptedTokens = uniqueTokens(
      meaningfulTokens(acceptedAnswer),
    );

    if (acceptedTokens.length === 0) {
      return false;
    }

    /*
     * Very short model answers should effectively require all
     * important concepts.
     */
    if (acceptedTokens.length <= 2) {
      return containsAllTokens(
        responseTokens,
        acceptedTokens,
      );
    }

    const score = tokenOverlapScore(
      responseTokens,
      acceptedTokens,
    );

    /*
     * Require at least two meaningful concepts AND at least
     * two-thirds of the model answer's meaningful concepts.
     */
    const matchedCount = acceptedTokens.filter((token) =>
      responseTokens.includes(token),
    ).length;

    return matchedCount >= 2 && score >= 0.66;
  });
}

function createInitialResponses(
  questions: PracticeQuestion[],
  existingResponses: PracticeResponse[],
): PracticeResponse[] {
  return questions.map((_, index) => {
    const existingResponse = existingResponses.find(
      (response) =>
        response.questionIndex === index,
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
  const [responses, setResponses] = useState<
    PracticeResponse[]
  >(() =>
    createInitialResponses(
      questions,
      initialResponses,
    ),
  );

  useEffect(() => {
    void Promise.resolve().then(() => {
      setResponses(
        createInitialResponses(
          questions,
          initialResponses,
        ),
      );
    });
  }, [questions, initialResponses]);

  function updateResponse(
    questionIndex: number,
    updates: Partial<PracticeResponse>,
  ) {
    const updatedResponses = responses.map(
      (response) =>
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

  function checkAnswer(
    questionIndex: number,
  ) {
    const question =
      questions[questionIndex];

    const response = responses.find(
      (item) =>
        item.questionIndex === questionIndex,
    );

    if (!question || !response) {
      return;
    }

    updateResponse(questionIndex, {
      checked: true,
      correct: isAcceptedAnswer(
        response.response,
        question,
      ),
    });
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="italic text-slate-500">
          No guided-practice questions are required for this lesson.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {questions.map(
        (question, index) => {
          const response =
            responses.find(
              (item) =>
                item.questionIndex === index,
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

                <ReadAloudButton
                  text={question.question}
                  label="Read question"
                />
              </div>

              {question.hint && (
                <details className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <summary className="cursor-pointer font-bold text-amber-900">
                    Show hint
                  </summary>

                  <p className="mt-2 text-sm text-amber-800">
                    {question.hint}
                  </p>
                </details>
              )}

              <label
                htmlFor={`guided-practice-${index}`}
                className="sr-only"
              >
                Answer question {index + 1}
              </label>

              <input
                id={`guided-practice-${index}`}
                name={`guidedPracticeAnswer${index}`}
                type="text"
                value={response.response}
                onChange={(event) =>
                  updateResponse(index, {
                    response:
                      event.target.value,
                    checked: false,
                    correct: false,
                  })
                }
                placeholder="Type your answer..."
                autoComplete="off"
                className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  checkAnswer(index)
                }
                disabled={
                  !response.response.trim()
                }
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
                    {response.correct
                      ? "✅ Correct"
                      : "❌ Not quite"}
                  </p>

                  <p className="mt-2 text-sm leading-6">
                    {response.correct
                      ? question.feedback ||
                        "Excellent work."
                      : "Review the explanation and try the question again."}
                  </p>

                  {!response.correct && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-bold">
                        Show correct answer
                      </summary>

                      <p className="mt-2 text-sm">
                        {question.answer}
                      </p>
                    </details>
                  )}
                </div>
              )}
            </article>
          );
        },
      )}
    </div>
  );
}
