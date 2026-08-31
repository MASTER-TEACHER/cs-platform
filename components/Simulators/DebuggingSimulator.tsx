"use client";

import { useCallback, useState } from "react";

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
  code: string;
  question: string;
  acceptedAnswers: string[];
  hint: string;
  working: string;
};

const bank: Record<Difficulty, Q[]> = {
  foundation: [
    {
      code: `print("Hello"`,
      question: "What type of error is this?",
      acceptedAnswers: [
        "syntax",
        "syntax error",
        "syntaxerror",
        "syntax-error",
        "missing closing parenthesis",
        "missing parenthesis",
        "missing bracket",
      ],
      hint: "The code cannot be parsed correctly.",
      working:
        "A closing parenthesis is missing, causing a syntax error.",
    },
  ],

  intermediate: [
    {
      code: `x = 10
y = 0
print(x / y)`,
      question: "What type of error occurs?",
      acceptedAnswers: [
        "runtime",
        "runtime error",
        "runtimeerror",
        "run time error",
        "zero division error",
        "zerodivisionerror",
        "division by zero",
      ],
      hint: "The syntax is valid but execution fails.",
      working:
        "Division by zero occurs while the program runs, so this is a runtime error.",
    },
  ],

  higher: [
    {
      code: `age = 18

if age > 18:
    print("adult")`,
      question:
        "The requirement says 18 should count as adult. What type of error is this?",
      acceptedAnswers: [
        "logic",
        "logic error",
        "logical error",
        "logicerror",
        "incorrect condition",
        "wrong condition",
      ],
      hint: "The program runs but gives the wrong result.",
      working:
        "The condition should be age >= 18, so this is a logic error.",
    },
  ],
};

function pick(difficulty: Difficulty): Q {
  return bank[difficulty][0];
}

function normaliseAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:()[\]{}'"`]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ");
}

function isAcceptedAnswer(
  response: string,
  acceptedAnswers: string[],
): boolean {
  const normalisedResponse =
    normaliseAnswer(response);

  return acceptedAnswers.some(
    (acceptedAnswer) =>
      normaliseAnswer(
        acceptedAnswer,
      ) === normalisedResponse,
  );
}

export default function DebuggingSimulator() {
  const { addXP } = useProgress();

  const generateQuestion = useCallback(
    (difficulty: Difficulty) =>
      pick(difficulty),
    [],
  );

  const simulator = useSimulator<Q>({
    initialQuestion:
      pick("foundation"),

    generateQuestion,

    onAwardXP: addXP,
  });

  const [answer, setAnswer] =
    useState("");

  function resetQuestion() {
    setAnswer("");
    simulator.resetQuestion();
  }

  function newExample() {
    setAnswer("");
    simulator.newQuestion();
  }

  function changeDifficulty(
    difficulty: Difficulty,
  ) {
    setAnswer("");
    simulator.changeDifficulty(
      difficulty,
    );
  }

  function checkAnswer() {
    const correct =
      isAcceptedAnswer(
        answer,
        simulator.question
          .acceptedAnswers,
      );

    simulator.markAnswer(
      correct,
    );
  }

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive programming
        challenge
      </p>

      <h2 className="mt-2 text-3xl font-black">
        Debugging Lab
      </h2>

      <p className="mt-2 text-slate-600">
        Find syntax, logic and
        runtime problems.
      </p>

      <div className="mt-6">
        <SimulatorDifficulty
          value={
            simulator.difficulty
          }
          onChange={
            changeDifficulty
          }
        />
      </div>

      <div className="mt-6">
        <SimulatorStats
          attempts={
            simulator.attempts
          }
          correct={
            simulator.correctAnswers
          }
          accuracy={
            simulator.accuracy
          }
          xp={simulator.xp}
          streak={
            simulator.streak
          }
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950 text-white">
        <div className="border-b border-slate-800 px-5 py-3">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">
            Python
          </p>
        </div>

        <pre className="whitespace-pre-wrap px-5 py-5 font-mono text-sm leading-7">
          {simulator.question.code}
        </pre>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
          Question
        </p>

        <p className="mt-2 font-bold text-slate-950">
          {
            simulator.question
              .question
          }
        </p>
      </div>

      <input
        value={answer}
        onChange={(event) =>
          setAnswer(
            event.target.value,
          )
        }
        placeholder="Your answer"
        className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-5">
        <SimulatorControls
          canCheck={
            !!answer.trim()
          }
          checked={
            simulator.checked
          }
          hintVisible={
            simulator.hintVisible
          }
          workingVisible={
            simulator.workingVisible
          }
          onCheck={
            checkAnswer
          }
          onHint={
            simulator.toggleHint
          }
          onToggleWorking={
            simulator.toggleWorking
          }
          onReset={
            resetQuestion
          }
          onNewExample={
            newExample
          }
        />
      </div>

      <div className="mt-5">
        <SimulatorFeedback
          checked={
            simulator.checked
          }
          correct={
            simulator.correct
          }
          hintVisible={
            simulator.hintVisible
          }
          hint={
            simulator.question.hint
          }
          workingVisible={
            simulator.workingVisible
          }
          working={
            simulator.question
              .working
          }
          examinerTip="Trace the code carefully and use precise programming vocabulary in written explanations."
        />
      </div>

      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">
          Debugging routine
        </h3>

        <p className="mt-3">
          Reproduce → isolate →
          identify error type →
          correct → retest.
        </p>
      </section>
    </Card>
  );
}
