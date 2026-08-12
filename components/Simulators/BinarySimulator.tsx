"use client";

import { useMemo, useState } from "react";

import { useProgress } from "@/contexts/ProgressContext";

import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";

import {
  useSimulator,
  type SimulatorDifficulty as DifficultyLevel,
} from "@/components/Simulators/common/useSimulator";

type Question = {
  target: number;
  bits: number;
};

function bitsForDifficulty(difficulty: DifficultyLevel): number {
  switch (difficulty) {
    case "foundation":
      return 4;

    case "intermediate":
      return 8;

    case "higher":
      return 16;
  }
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const bits = bitsForDifficulty(difficulty);

  const maximum = 2 ** bits - 1;

  return {
    bits,
    target: Math.floor(Math.random() * maximum) + 1,
  };
}

function createPlaceValues(bits: number): number[] {
  return Array.from({ length: bits }, (_, index) => 2 ** (bits - index - 1));
}

export default function BinarySimulator() {
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

  const placeValues = useMemo(
    () => createPlaceValues(question.bits),
    [question.bits],
  );

  const [bits, setBits] = useState<number[]>(() => Array(4).fill(0));

  /*
   * Ensure the interactive bit array matches
   * the current question width.
   */
  const displayedBits =
    bits.length === question.bits ? bits : Array(question.bits).fill(0);

  const denary = displayedBits.reduce(
    (total, bit, index) => total + bit * placeValues[index],
    0,
  );

  function toggleBit(index: number) {
    if (checked) {
      return;
    }

    setBits((current) => {
      const source =
        current.length === question.bits
          ? [...current]
          : Array(question.bits).fill(0);

      source[index] = source[index] === 0 ? 1 : 0;

      return source;
    });
  }

  function handleCheck() {
    markAnswer(denary === question.target);
  }

  function handleTryAgain() {
    setBits(Array(question.bits).fill(0));

    resetQuestion();
  }

  function handleNewQuestion() {
    setBits(Array(question.bits).fill(0));

    newQuestion();
  }

  function handleDifficultyChange(nextDifficulty: DifficultyLevel) {
    const nextBits = bitsForDifficulty(nextDifficulty);

    setBits(Array(nextBits).fill(0));

    changeDifficulty(nextDifficulty);
  }

  const targetBinary = question.target.toString(2).padStart(question.bits, "0");

  return (
    <section className="space-y-6 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Binary laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Binary Number Builder
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Build a target denary value by switching binary bits on and off.
        </p>
      </header>

      <SimulatorDifficulty
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Build this denary number
        </p>

        <p className="mt-2 text-5xl font-black text-blue-900">
          {question.target}
        </p>

        <p className="mt-2 text-sm text-blue-700">
          Use a {question.bits}-bit binary number.
        </p>
      </div>

      <SimulatorStats
        attempts={attempts}
        correct={correctAnswers}
        accuracy={accuracy}
        xp={xp}
        streak={streak}
      />

      <section className="overflow-x-auto rounded-3xl bg-slate-950 p-6">
        <div
          className="grid min-w-max gap-3"
          style={{
            gridTemplateColumns: `repeat(${question.bits}, minmax(52px, 1fr))`,
          }}
        >
          {placeValues.map((value) => (
            <div
              key={`place-${value}`}
              className="text-center text-xs font-black text-blue-300"
            >
              {value}
            </div>
          ))}

          {displayedBits.map((bit, index) => (
            <button
              key={`bit-${index}`}
              type="button"
              onClick={() => toggleBit(index)}
              disabled={checked}
              className={`rounded-xl py-5 text-2xl font-black transition ${
                bit
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              } disabled:cursor-not-allowed`}
            >
              {bit}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            Current binary
          </p>

          <p className="mt-3 break-all font-mono text-2xl font-black tracking-widest text-slate-950">
            {displayedBits.join("")}
          </p>
        </article>

        <article className="rounded-2xl bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            Current denary
          </p>

          <p className="mt-3 text-3xl font-black text-blue-900">{denary}</p>
        </article>
      </div>

      <SimulatorControls
        checked={checked}
        hintVisible={hintVisible}
        workingVisible={workingVisible}
        checkLabel="Check answer"
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
        successMessage={`Excellent. ${displayedBits.join(
          "",
        )} represents ${question.target} in denary.`}
        errorMessage={`Not quite. Your current binary value represents ${denary}, not ${question.target}.`}
        hintVisible={hintVisible}
        hint="Start with the largest place value. If it fits into the remaining denary value, switch that bit to 1 and subtract the place value."
        workingVisible={workingVisible}
        working={`The target is ${question.target}.

Its ${question.bits}-bit binary representation is:

${targetBinary}

Place values:
${placeValues.join("  ")}`}
        examinerTip="When converting denary to binary, work systematically through the place values from largest to smallest."
      />
    </section>
  );
}
