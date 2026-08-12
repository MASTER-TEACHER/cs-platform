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
  input: string;
};

function randomItem<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function createRun(
  character: string,
  minimum: number,
  maximum: number,
): string {
  const count = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

  return character.repeat(count);
}

function createQuestion(difficulty: DifficultyLevel): Question {
  if (difficulty === "foundation") {
    const letters = ["A", "B", "C"];

    return {
      input:
        createRun(randomItem(letters), 3, 6) +
        createRun(randomItem(letters), 2, 5) +
        createRun(randomItem(letters), 2, 5),
    };
  }

  if (difficulty === "intermediate") {
    const letters = ["A", "B", "C", "D", "1", "2"];

    return {
      input:
        createRun(randomItem(letters), 2, 7) +
        createRun(randomItem(letters), 1, 5) +
        createRun(randomItem(letters), 2, 6) +
        createRun(randomItem(letters), 1, 4),
    };
  }

  const letters = ["A", "B", "C", "D", "E", "1", "2", "3"];

  return {
    input:
      createRun(randomItem(letters), 1, 8) +
      createRun(randomItem(letters), 1, 5) +
      createRun(randomItem(letters), 1, 7) +
      createRun(randomItem(letters), 1, 5) +
      createRun(randomItem(letters), 1, 6),
  };
}

function encode(value: string): string {
  if (!value) {
    return "";
  }

  let output = "";
  let count = 1;

  for (let index = 1; index <= value.length; index += 1) {
    if (value[index] === value[index - 1]) {
      count += 1;
    } else {
      output += `${count}${value[index - 1]}`;
      count = 1;
    }
  }

  return output;
}

export default function CompressionSimulator() {
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

  const encoded = useMemo(() => encode(question.input), [question.input]);

  const difference = question.input.length - encoded.length;

  function handleCheck() {
    if (!answer.trim()) {
      return;
    }

    markAnswer(answer.trim().toUpperCase() === encoded);
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

    setAnswer(
      value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 50),
    );
  }

  return (
    <section className="space-y-6 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Compression laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Run-Length Encoding Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Compress repeated data using run-length encoding and investigate when
          RLE is effective.
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

      <section className="rounded-3xl bg-slate-950 p-7 text-white">
        <p className="text-xs font-black uppercase tracking-widest text-blue-300">
          Original sequence
        </p>

        <p className="mt-4 break-all font-mono text-4xl font-black tracking-widest">
          {question.input}
        </p>

        <p className="mt-3 text-slate-300">
          {question.input.length} characters
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label htmlFor="rle-answer" className="font-black">
          Enter the RLE encoding
        </label>

        <input
          id="rle-answer"
          value={answer}
          disabled={checked}
          onChange={(event) => handleAnswerChange(event.target.value)}
          placeholder="Example: 4A2B3C"
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 font-mono text-xl font-black uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
        />

        <div className="mt-5">
          <SimulatorControls
            canCheck={answer.trim().length > 0}
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
        successMessage={`Correct. ${question.input} compresses to ${encoded}.`}
        errorMessage={`Not quite. The correct RLE sequence is ${encoded}.`}
        hintVisible={hintVisible}
        hint="Count each consecutive group of identical characters. Write the count followed by the character, then move to the next run."
        workingVisible={workingVisible}
        working={`Original:
${question.input}

RLE:
${encoded}

Original length:
${question.input.length}

Encoded length:
${encoded.length}

Difference:
${
  difference > 0
    ? `${difference} fewer character positions`
    : difference === 0
      ? "No reduction"
      : `${Math.abs(difference)} additional character positions`
}`}
        examinerTip="RLE works best when data contains long sequences of repeated values. It can increase file size when values change frequently."
      />

      {(checked || workingVisible) && (
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              Original
            </p>

            <p className="mt-3 text-2xl font-black">{question.input.length}</p>
          </article>

          <article className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs font-black uppercase text-blue-600">
              Compressed
            </p>

            <p className="mt-3 text-2xl font-black">{encoded.length}</p>
          </article>

          <article
            className={`rounded-2xl p-5 ${
              difference > 0 ? "bg-emerald-50" : "bg-amber-50"
            }`}
          >
            <p className="text-xs font-black uppercase text-slate-500">
              Effect
            </p>

            <p className="mt-3 font-black">
              {difference > 0
                ? `Saved ${difference}`
                : difference === 0
                  ? "No reduction"
                  : `Increased by ${Math.abs(difference)}`}
            </p>
          </article>
        </section>
      )}
    </section>
  );
}
