"use client";

import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";
import {
  useSimulator,
  type SimulatorDifficulty as Difficulty,
} from "@/components/Simulators/common/useSimulator";
import Card from "@/components/ui/Card";
import { useProgress } from "@/contexts/ProgressContext";

type Q = {
  id: string;
  prompt: string;
  answer: string;
  hint: string;
  working: string;
};

const bank: Record<Difficulty, Q[]> = {
  foundation: [
    {
      id: "foundation-addition",
      prompt: [
        "x = 3",
        "y = 2",
        "print(x + y)",
      ].join("\n"),
      answer: "5",
      hint:
        "Evaluate the expression inside print.",
      working:
        "x is 3 and y is 2, so 3 + 2 = 5.",
    },
    {
      id: "foundation-subtraction",
      prompt: [
        "score = 10",
        "lost = 4",
        "print(score - lost)",
      ].join("\n"),
      answer: "6",
      hint:
        "Subtract lost from score.",
      working:
        "10 - 4 = 6.",
    },
    {
      id: "foundation-multiplication",
      prompt: [
        "width = 4",
        "height = 3",
        "print(width * height)",
      ].join("\n"),
      answer: "12",
      hint:
        "Multiply width by height.",
      working:
        "4 × 3 = 12.",
    },
    {
      id: "foundation-variable-update",
      prompt: [
        "x = 5",
        "x = x + 2",
        "print(x)",
      ].join("\n"),
      answer: "7",
      hint:
        "Update x before evaluating print.",
      working:
        "x starts at 5, then becomes 7.",
    },
    {
      id: "foundation-integer-division",
      prompt: [
        "apples = 9",
        "people = 3",
        "print(apples // people)",
      ].join("\n"),
      answer: "3",
      hint:
        "The // operator performs integer division.",
      working:
        "9 // 3 = 3.",
    },
  ],

  intermediate: [
    {
      id: "intermediate-loop-total",
      prompt: [
        "total = 0",
        "for n in [2, 3, 4]:",
        "    total += n",
        "print(total)",
      ].join("\n"),
      answer: "9",
      hint:
        "Trace total after each loop.",
      working:
        "0 → 2 → 5 → 9, so the output is 9.",
    },
    {
      id: "intermediate-condition",
      prompt: [
        "age = 15",
        "if age >= 13:",
        '    print("Teen")',
        "else:",
        '    print("Child")',
      ].join("\n"),
      answer: "teen",
      hint:
        "Check whether 15 is greater than or equal to 13.",
      working:
        "15 >= 13 is True, so Teen is printed.",
    },
    {
      id: "intermediate-list-index",
      prompt: [
        'names = ["Ada", "Alan", "Grace"]',
        "print(names[1])",
      ].join("\n"),
      answer: "alan",
      hint:
        "Python list indexes start at 0.",
      working:
        "Index 0 is Ada, so index 1 is Alan.",
    },
    {
      id: "intermediate-range",
      prompt: [
        "total = 0",
        "for i in range(1, 4):",
        "    total += i",
        "print(total)",
      ].join("\n"),
      answer: "6",
      hint:
        "range(1, 4) produces 1, 2 and 3.",
      working:
        "1 + 2 + 3 = 6.",
    },
  ],

  higher: [
    {
      id: "higher-mystery",
      prompt: [
        "def mystery(n):",
        "    if n % 2 == 0:",
        "        return n // 2",
        "    return n * 3 + 1",
        "",
        "print(mystery(7))",
      ].join("\n"),
      answer: "22",
      hint:
        "7 is odd, so use the second return.",
      working:
        "7 × 3 + 1 = 22.",
    },
    {
      id: "higher-function",
      prompt: [
        "def calculate(a, b):",
        "    return a * b + 2",
        "",
        "print(calculate(3, 4))",
      ].join("\n"),
      answer: "14",
      hint:
        "Substitute 3 and 4 into the function.",
      working:
        "3 × 4 + 2 = 14.",
    },
    {
      id: "higher-nested-condition",
      prompt: [
        "x = 12",
        "if x > 10:",
        "    if x % 2 == 0:",
        '        print("A")',
        "    else:",
        '        print("B")',
        "else:",
        '    print("C")',
      ].join("\n"),
      answer: "a",
      hint:
        "Evaluate both conditions in order.",
      working:
        "12 > 10 and 12 is even, so A is printed.",
    },
    {
      id: "higher-list-comprehension",
      prompt: [
        "values = [1, 2, 3, 4]",
        "result = [x * 2 for x in values if x % 2 == 0]",
        "print(result)",
      ].join("\n"),
      answer: "[4, 8]",
      hint:
        "Only even values are doubled.",
      working:
        "2 becomes 4 and 4 becomes 8, giving [4, 8].",
    },
  ],
};

function normaliseAnswer(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function pickDifferentQuestion(
  difficulty: Difficulty,
  previousId?: string,
): Q {
  const questions =
    bank[difficulty];

  if (questions.length === 1) {
    return questions[0];
  }

  const alternatives =
    previousId
      ? questions.filter(
          (question) =>
            question.id !== previousId,
        )
      : questions;

  const pool =
    alternatives.length > 0
      ? alternatives
      : questions;

  const randomIndex =
    Math.floor(
      Math.random() *
        pool.length,
    );

  return pool[randomIndex];
}

function calculateFirstAttemptStreak(
  results: Array<{
    firstAttemptCorrect: boolean;
  }>,
): number {
  let streak = 0;

  for (
    let index =
      results.length - 1;
    index >= 0;
    index -= 1
  ) {
    if (
      !results[index]
        .firstAttemptCorrect
    ) {
      break;
    }

    streak += 1;
  }

  return streak;
}

export default function PythonPlaygroundSimulator() {
  const {
    addXP,
  } =
    useProgress();

  const previousQuestionId =
    useRef<string | undefined>(
      undefined,
    );

  const gen =
    useCallback(
      (
        difficulty: Difficulty,
      ) => {
        const question =
          pickDifferentQuestion(
            difficulty,
            previousQuestionId.current,
          );

        previousQuestionId.current =
          question.id;

        return question;
      },
      [],
    );

  const initialQuestion =
    bank.foundation[0];

  if (
    previousQuestionId.current ===
    undefined
  ) {
    previousQuestionId.current =
      initialQuestion.id;
  }

  const s =
    useSimulator<Q>({
      initialQuestion,
      generateQuestion: gen,
      onAwardXP: addXP,
    });

  const [
    answer,
    setAnswer,
  ] =
    useState("");

  /*
   * ---------------------------------------------------------
   * FIRST-ATTEMPT ATTAINMENT ANALYTICS
   * ---------------------------------------------------------
   *
   * "Questions", "Correct", "Accuracy" and "Streak" represent
   * first-attempt performance.
   *
   * Retrying a question successfully is still preserved by
   * useSimulator as eventuallyCorrect, and can still earn XP,
   * but it must not rewrite first-attempt attainment evidence.
   */
  const firstAttemptStats =
    useMemo(() => {
      const results =
        s.questionResults;

      const questions =
        results.length;

      const correct =
        results.filter(
          (result) =>
            result.firstAttemptCorrect,
        ).length;

      const accuracy =
        questions === 0
          ? 0
          : Math.round(
              (correct /
                questions) *
                100,
            );

      const streak =
        calculateFirstAttemptStreak(
          results,
        );

      return {
        questions,
        correct,
        accuracy,
        streak,
      };
    }, [
      s.questionResults,
    ]);

  function reset() {
    setAnswer("");
    s.resetQuestion();
  }

  function next() {
    setAnswer("");
    s.newQuestion();
  }

  function changeDifficulty(
    difficulty: Difficulty,
  ) {
    setAnswer("");

    previousQuestionId.current =
      undefined;

    s.changeDifficulty(
      difficulty,
    );
  }

  const answerIsCorrect =
    normaliseAnswer(answer) ===
    normaliseAnswer(
      s.question.answer,
    );

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive programming challenge
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Python Practice Lab
      </h2>

      <p className="mt-2 text-slate-600">
        Predict output and reason about short Python programs.
      </p>

      <div className="mt-6">
        <SimulatorDifficulty
          value={
            s.difficulty
          }
          onChange={
            changeDifficulty
          }
        />
      </div>

      <div className="mt-6">
        <SimulatorStats
          attempts={
            firstAttemptStats
              .questions
          }
          correct={
            firstAttemptStats
              .correct
          }
          accuracy={
            firstAttemptStats
              .accuracy
          }
          xp={
            s.xp
          }
          streak={
            firstAttemptStats
              .streak
          }
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
        <div className="border-b border-slate-800 px-5 py-3">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Python
          </p>
        </div>

        <pre
          className="
            overflow-x-auto
            whitespace-pre
            px-6
            py-5
            font-mono
            text-base
            leading-8
            text-white
          "
        >
          <code>
            {
              s.question.prompt
            }
          </code>
        </pre>
      </div>

      <label
        htmlFor="python-practice-answer"
        className="sr-only"
      >
        Your answer
      </label>

      <input
        id="python-practice-answer"
        name="pythonPracticeAnswer"
        value={answer}
        onChange={(event) =>
          setAnswer(
            event.target.value,
          )
        }
        placeholder="Your answer"
        autoComplete="off"
        className="
          mt-4
          w-full
          rounded-xl
          border
          border-slate-300
          px-4
          py-3
          font-mono
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      />

      <div className="mt-5">
        <SimulatorControls
          canCheck={
            answer
              .trim()
              .length > 0
          }
          checked={
            s.checked
          }
          hintVisible={
            s.hintVisible
          }
          workingVisible={
            s.workingVisible
          }
          onCheck={() =>
            s.markAnswer(
              answerIsCorrect,
            )
          }
          onHint={
            s.toggleHint
          }
          onToggleWorking={
            s.toggleWorking
          }
          onReset={
            reset
          }
          onNewExample={
            next
          }
        />
      </div>

      <div className="mt-5">
        <SimulatorFeedback
          checked={
            s.checked
          }
          correct={
            s.correct
          }
          hintVisible={
            s.hintVisible
          }
          hint={
            s.question.hint
          }
          workingVisible={
            s.workingVisible
          }
          working={
            s.question.working
          }
          examinerTip="Trace the code carefully and use precise programming vocabulary in written explanations."
        />
      </div>

      <section className="mt-8 rounded-3xl border p-6">
  <h3 className="text-xl font-black">
    Live-practice{" "}
    {s.difficulty.charAt(0).toUpperCase() + s.difficulty.slice(1)}
  </h3>

  <p className="mt-3 text-slate-600">
    {s.difficulty === "foundation" &&
      "Build confidence through safe prediction and tracing of short Python programs."}

    {s.difficulty === "intermediate" &&
      "Develop GCSE-level programming skills through more complex prediction, tracing and reasoning tasks."}

    {s.difficulty === "higher" &&
      "Challenge yourself with demanding Python problems involving functions, iteration, data structures and deeper program reasoning."}
  </p>
</section>
    </Card>
  );
}
