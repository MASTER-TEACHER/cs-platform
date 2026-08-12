"use client";

import { useState } from "react";

import { useProgress } from "@/contexts/ProgressContext";

import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";

import {
  useSimulator,
  type SimulatorDifficulty as DifficultyLevel,
} from "@/components/Simulators/common/useSimulator";

const hexDigits = "0123456789ABCDEF".split("");

type Question = {
  target: number;
  digits: number;
};

function digitsForDifficulty(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case "foundation":
      return 2;

    case "intermediate":
      return 3;

    case "higher":
      return 4;
  }
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const digits = digitsForDifficulty(difficulty);

  const maximum = 16 ** digits - 1;

  return {
    digits,
    target: Math.floor(Math.random() * maximum) + 1,
  };
}

export default function HexSimulator() {
  const { addXP } = useProgress();

  const simulator = useSimulator<Question>({
    initialQuestion: createQuestion("foundation"),
    generateQuestion: createQuestion,

    xpByDifficulty: {
      foundation: 10,
      intermediate: 15,
      higher: 20,
    },

    onAwardXP: addXP,
  });

  const {
    difficulty,
    question,

    checked,
    correct,

    hintVisible,
    workingVisible,

    attempts,
    correctAnswers,
    accuracy,
    xp,
    streak,

    markAnswer,
    resetQuestion,
    newQuestion,
    changeDifficulty,

    toggleHint,
    toggleWorking,
  } = simulator;

  const [answer, setAnswer] = useState("");

  const correctHex = question.target
    .toString(16)
    .toUpperCase()
    .padStart(question.digits, "0");

  function addDigit(digit: string) {
    if (checked || answer.length >= question.digits) {
      return;
    }

    setAnswer((current) => current + digit);
  }

  function deleteDigit() {
    if (checked) {
      return;
    }

    setAnswer((current) => current.slice(0, -1));
  }

  function handleCheck() {
    if (answer.length !== question.digits) {
      return;
    }

    markAnswer(answer === correctHex);
  }

  function handleTryAgain() {
    setAnswer("");
    resetQuestion();
  }

  function handleNewQuestion() {
    setAnswer("");
    newQuestion();
  }

  function handleDifficultyChange(nextDifficulty: DifficultyLevel) {
    setAnswer("");
    changeDifficulty(nextDifficulty);
  }

  const placeValues = Array.from(
    { length: question.digits },
    (_, index) => 16 ** (question.digits - index - 1),
  );

  const working = correctHex
    .split("")
    .map((digit, index) => {
      const decimalDigit = parseInt(digit, 16);

      return `${digit} × ${placeValues[index]} = ${
        decimalDigit * placeValues[index]
      }`;
    })
    .join("\n");

  return (
    <section className="space-y-6 rounded-3xl border border-violet-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-violet-600">
          Hexadecimal laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Hexadecimal Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Convert denary values into hexadecimal and build accuracy across
          repeated challenges.
        </p>
      </header>

      <SimulatorDifficulty
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      <section className="rounded-3xl border border-violet-200 bg-violet-50 p-6 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-violet-600">
          Convert this denary number
        </p>

        <p className="mt-3 text-6xl font-black text-violet-900">
          {question.target}
        </p>

        <p className="mt-3 text-sm text-violet-700">
          Enter a {question.digits}-digit hexadecimal value.
        </p>
      </section>

      <SimulatorStats
        attempts={attempts}
        correct={correctAnswers}
        accuracy={accuracy}
        xp={xp}
        streak={streak}
      />

      <section className="rounded-3xl bg-slate-950 p-6 text-center text-white">
        <p className="text-xs font-black uppercase tracking-widest text-violet-300">
          Your hexadecimal answer
        </p>

        <p className="mt-4 font-mono text-5xl font-black tracking-widest">
          {answer || "_".repeat(question.digits)}
        </p>
      </section>

      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {hexDigits.map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={checked || answer.length >= question.digits}
            onClick={() => addDigit(digit)}
            className="rounded-xl bg-slate-100 py-4 text-xl font-black text-slate-950 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={deleteDigit}
        disabled={checked || answer.length === 0}
        className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Delete last digit
      </button>

      <SimulatorControls
        canCheck={answer.length === question.digits}
        checked={checked}
        hintVisible={hintVisible}
        workingVisible={workingVisible}
        resetLabel="Try again"
        newExampleLabel="New question"
        onCheck={handleCheck}
        onHint={toggleHint}
        onToggleWorking={toggleWorking}
        onReset={handleTryAgain}
        onNewExample={handleNewQuestion}
      />

      <SimulatorFeedback
        checked={checked}
        correct={correct}
        successMessage={`Excellent. ${question.target} in denary is ${correctHex} in hexadecimal.`}
        errorMessage={`Not quite. The correct hexadecimal value is ${correctHex}.`}
        hintVisible={hintVisible}
        hint="Remember that each hexadecimal digit represents a value from 0 to 15. Divide or reason using powers of 16."
        workingVisible={workingVisible}
        working={`${working}

Add the values together to obtain ${question.target}.`}
        examinerTip="Remember that hexadecimal uses A, B, C, D, E and F to represent denary values 10 to 15."
      />
    </section>
  );
}
