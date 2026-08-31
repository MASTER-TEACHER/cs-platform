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

type Direction = "left" | "right";

type Question = {
  value: number;
  bits: number;
  direction: Direction;
  places: number;
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

function toBinary(value: number, bits: number): string {
  return value.toString(2).padStart(bits, "0").slice(-bits);
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const bits = bitsForDifficulty(difficulty);

  const maximum = 2 ** bits - 1;

  const value = Math.floor(Math.random() * (maximum + 1));

  const direction: Direction = Math.random() > 0.5 ? "left" : "right";

  const maximumPlaces =
    difficulty === "foundation" ? 1 : difficulty === "intermediate" ? 2 : 3;

  const places = Math.floor(Math.random() * maximumPlaces) + 1;

  return {
    value,
    bits,
    direction,
    places,
  };
}

export default function BinaryShiftSimulator() {
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

  const startingBinary = useMemo(
    () => toBinary(question.value, question.bits),
    [question],
  );

  const rawResult =
    question.direction === "left"
      ? question.value * 2 ** question.places
      : Math.floor(question.value / 2 ** question.places);

  const maximum = 2 ** question.bits - 1;

  const overflow = question.direction === "left" && rawResult > maximum;

  /*
   * A fixed-width register keeps only
   * the lowest available bits.
   */
  const storedResult = rawResult & maximum;

  const resultBinary = toBinary(storedResult, question.bits);

  const cleanedAnswer = answer.replace(/[^01]/g, "");

  function handleCheck() {
    if (cleanedAnswer.length !== question.bits) {
      return;
    }

    markAnswer(cleanedAnswer === resultBinary);
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

  function handleAnswerChange(value: string) {
    if (checked) {
      return;
    }

    setAnswer(value.replace(/[^01]/g, "").slice(0, question.bits));
  }

  const operationText =
    question.direction === "left"
      ? `Left shift ${question.places} place${question.places === 1 ? "" : "s"}`
      : `Right shift ${question.places} place${
          question.places === 1 ? "" : "s"
        }`;

  const mathematicalEffect =
    question.direction === "left"
      ? `Multiplying ${question.value} by ${
          2 ** question.places
        } gives ${rawResult}.`
      : `Integer-dividing ${question.value} by ${
          2 ** question.places
        } gives ${rawResult}.`;

  const working = `Starting value:
${startingBinary}
Denary: ${question.value}

Operation:
${operationText}

${mathematicalEffect}

Shift every bit ${question.direction} by ${question.places} place${
    question.places === 1 ? "" : "s"
  }.

Empty positions are filled with 0.

Stored ${question.bits}-bit result:
${resultBinary}

Stored denary result:
${storedResult}${
    overflow
      ? `

Overflow occurs because ${rawResult} cannot be represented using only ${question.bits} bits.`
      : ""
  }`;

  return (
    <section className="space-y-6 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Binary laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Binary Shift Simulator
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Shift binary values left and right, reason about multiplication and
          division, and identify overflow.
        </p>
      </header>

      <SimulatorDifficulty
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      <SimulatorStats
        attempts={attempts}
        correct={correctAnswers}
        accuracy={accuracy}
        xp={xp}
        streak={streak}
      />

      <div
        className={`rounded-2xl border p-5 ${
          overflow
            ? "border-amber-200 bg-amber-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Register width
            </p>

            <p className="mt-1 text-xl font-black">{question.bits} bits</p>
          </div>

          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Overflow
            </p>

            <p className="mt-1 text-xl font-black">{overflow ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl bg-slate-950 p-6 text-white">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-300">
              Starting value
            </p>

            <p className="mt-3 font-mono text-3xl font-black tracking-widest">
              {startingBinary}
            </p>

            <p className="mt-2 text-slate-300">Denary: {question.value}</p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-300">
              Operation
            </p>

            <p className="mt-3 text-3xl font-black">
              {question.direction === "left" ? "← Left" : "Right →"}
            </p>

            <p className="mt-2 text-slate-300">
              Shift {question.places} place
              {question.places === 1 ? "" : "s"}
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-blue-300">
              Result
            </p>

            <p className="mt-3 font-mono text-3xl font-black tracking-widest text-emerald-300">
              {checked || workingVisible
                ? resultBinary
                : "?".repeat(question.bits)}
            </p>

            <p className="mt-2 text-slate-300">
              Denary: {checked || workingVisible ? storedResult : "?"}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 p-5">
          <p className="font-black">Mathematical effect</p>

          <p className="mt-2 text-slate-600">
            {question.direction === "left"
              ? `A left shift by ${question.places} place(s) multiplies by ${2 ** question.places}.`
              : `A right shift by ${question.places} place(s) performs integer division by ${2 ** question.places}.`}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 p-5">
          <p className="font-black">Operation</p>

          <p className="mt-2 text-2xl font-black text-blue-700"> </p>
           <p>
  {question.direction === "left"
    ? `× ${2 ** question.places}`
    : `÷ ${2 ** question.places}`}
</p>
        </article>
      </div>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label htmlFor="binary-shift-answer" className="font-black">
          Enter the {question.bits}-bit result
        </label>

        <input
          id="binary-shift-answer"
          type="text"
          inputMode="numeric"
          value={answer}
          disabled={checked}
          onChange={(event) => handleAnswerChange(event.target.value)}
          maxLength={question.bits}
          placeholder={`Enter ${question.bits} bits`}
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 font-mono text-xl font-black tracking-widest outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
        />

        <div className="mt-5">
          <SimulatorControls
            canCheck={cleanedAnswer.length === question.bits}
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
        </div>
      </section>

      <SimulatorFeedback
        checked={checked}
        correct={correct}
        successMessage={`Correct. The stored result is ${resultBinary}.`}
        errorMessage={`Not quite. The correct ${question.bits}-bit result is ${resultBinary}.`}
        hintVisible={hintVisible}
        hint={
          question.direction === "left"
            ? `Move every bit ${question.places} place(s) to the left and fill empty positions on the right with zero.`
            : `Move every bit ${question.places} place(s) to the right and fill empty positions on the left with zero.`
        }
        workingVisible={workingVisible}
        working={working}
        examinerTip="A left shift multiplies an unsigned value by a power of two; a right shift performs integer division by a power of two. Always consider whether bits are lost."
      />

      <section className="rounded-3xl bg-slate-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          Denary check
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-600">Starting value</p>

            <p className="text-2xl font-black">{question.value}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600">Operation</p>

            <p className="text-2xl font-black"></p>
             <p>
  {question.direction === "left"
    ? `× ${2 ** question.places}`
    : `÷ ${2 ** question.places}`}
</p>
          </div>

          <div>
            <p className="text-sm text-slate-600">Stored result</p>

            <p className="text-2xl font-black">{storedResult}</p>
          </div>
        </div>
      </section>
    </section>
  );
}
