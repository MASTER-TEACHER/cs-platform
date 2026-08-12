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

type QuestionType = "file-size" | "colour-depth" | "pixel-count";

type Question = {
  width: number;
  height: number;
  colourDepth: number;
  pixelCount: number;
  fileSize: number;
  questionType: QuestionType;
};

const palette = ["#ffffff", "#111827", "#2563eb", "#ef4444"];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createQuestion(difficulty: DifficultyLevel): Question {
  if (difficulty === "foundation") {
    const width = randomItem([4, 8, 10]);

    const height = randomItem([4, 8, 10]);

    const colourDepth = randomItem([1, 2, 4]);

    const pixelCount = width * height;

    return {
      width,
      height,
      colourDepth,
      pixelCount,
      fileSize: pixelCount * colourDepth,
      questionType: "file-size",
    };
  }

  if (difficulty === "intermediate") {
    const width = randomItem([8, 12, 16, 20]);

    const height = randomItem([8, 12, 16, 20]);

    const colourDepth = randomItem([1, 2, 4, 8]);

    const pixelCount = width * height;

    return {
      width,
      height,
      colourDepth,
      pixelCount,
      fileSize: pixelCount * colourDepth,

      questionType: Math.random() > 0.5 ? "file-size" : "pixel-count",
    };
  }

  const width = randomItem([16, 24, 32, 40]);

  const height = randomItem([16, 24, 32, 40]);

  const colourDepth = randomItem([2, 4, 8, 16]);

  const pixelCount = width * height;

  return {
    width,
    height,
    colourDepth,
    pixelCount,
    fileSize: pixelCount * colourDepth,

    questionType: randomItem<QuestionType>([
      "file-size",
      "colour-depth",
      "pixel-count",
    ]),
  };
}

function expectedAnswer(question: Question): number {
  switch (question.questionType) {
    case "colour-depth":
      return question.colourDepth;

    case "pixel-count":
      return question.pixelCount;

    default:
      return question.fileSize;
  }
}

function questionText(question: Question): string {
  switch (question.questionType) {
    case "colour-depth":
      return "Calculate the colour depth in bits per pixel.";

    case "pixel-count":
      return "Calculate the total number of pixels.";

    default:
      return "Calculate the raw bitmap file size in bits.";
  }
}

export default function ImageRepresentationSimulator() {
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

  const expected = expectedAnswer(question);

  const numericAnswer = Number(answer);

  const canCheck = answer.trim() !== "" && Number.isFinite(numericAnswer);

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    markAnswer(numericAnswer === expected);
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

  const working = useMemo(() => {
    if (question.questionType === "pixel-count") {
      return `Pixel count formula:

Width × Height

${question.width} × ${question.height}

= ${question.pixelCount} pixels`;
    }

    if (question.questionType === "colour-depth") {
      return `Colour depth formula:

File size ÷ Number of pixels

First calculate the number of pixels:

${question.width} × ${question.height}
= ${question.pixelCount}

Then:

${question.fileSize} ÷ ${question.pixelCount}

= ${question.colourDepth} bits per pixel`;
    }

    return `Bitmap size formula:

Width × Height × Colour depth

${question.width} × ${question.height} × ${question.colourDepth}

= ${question.fileSize} bits`;
  }, [question]);

  const hint =
    question.questionType === "pixel-count"
      ? "Multiply the image width by its height."
      : question.questionType === "colour-depth"
        ? "Calculate the number of pixels first, then divide the file size by the number of pixels."
        : "Use: width × height × colour depth.";

  /*
   * Pixel editor explorer
   */
  const [editorSize, setEditorSize] = useState(8);

  const [colour, setColour] = useState(1);

  const [pixels, setPixels] = useState<number[]>(Array(64).fill(0));

  const editorColourDepth = 2;

  const editorFileSize = editorSize * editorSize * editorColourDepth;

  function resizeEditor(nextSize: number) {
    setEditorSize(nextSize);

    setPixels(Array(nextSize * nextSize).fill(0));
  }

  function paint(index: number) {
    setPixels((current) =>
      current.map((value, itemIndex) => (itemIndex === index ? colour : value)),
    );
  }

  function resetCanvas() {
    setPixels(Array(editorSize * editorSize).fill(0));

    setColour(1);
  }

  function randomPattern() {
    setPixels(
      Array.from(
        {
          length: editorSize * editorSize,
        },
        () =>
          Math.random() > 0.65 ? Math.floor(Math.random() * palette.length) : 0,
      ),
    );
  }

  return (
    <section className="space-y-8 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Image representation laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Bitmap Representation Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Calculate bitmap storage requirements and explore how pixels,
          resolution and colour depth represent digital images.
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

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Current challenge
        </p>

        <h3 className="mt-2 text-xl font-black">{questionText(question)}</h3>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase text-slate-500">Width</p>

            <p className="mt-2 text-2xl font-black">{question.width}</p>
          </article>

          <article className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              Height
            </p>

            <p className="mt-2 text-2xl font-black">{question.height}</p>
          </article>

          <article className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              Colour depth
            </p>

            <p className="mt-2 text-2xl font-black">
              {question.questionType === "colour-depth"
                ? "?"
                : `${question.colourDepth} bits`}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              File size
            </p>

            <p className="mt-2 text-2xl font-black">
              {question.questionType === "file-size"
                ? "?"
                : `${question.fileSize} bits`}
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label htmlFor="bitmap-answer" className="font-black">
          Your answer
        </label>

        <input
          id="bitmap-answer"
          type="number"
          min={0}
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder={
            question.questionType === "pixel-count"
              ? "Enter number of pixels"
              : question.questionType === "colour-depth"
                ? "Enter bits per pixel"
                : "Enter file size in bits"
          }
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 text-xl font-black outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
        />

        <div className="mt-5">
          <SimulatorControls
            canCheck={canCheck}
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
        successMessage={`Correct. The answer is ${expected}.`}
        errorMessage={`Not quite. The correct answer is ${expected}.`}
        hintVisible={hintVisible}
        hint={hint}
        workingVisible={workingVisible}
        working={working}
        examinerTip="For an uncompressed bitmap, start with width × height to find the number of pixels, then multiply by colour depth when calculating the storage requirement."
      />

      <div className="border-t border-slate-200 pt-8">
        <p className="text-sm font-black uppercase tracking-widest text-violet-600">
          Explore the concept
        </p>

        <h3 className="mt-2 text-2xl font-black">Bitmap Pixel Editor</h3>

        <p className="mt-2 text-slate-600">
          Paint pixels and observe how resolution affects the raw bitmap size.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <select
            value={editorSize}
            onChange={(event) => resizeEditor(Number(event.target.value))}
            className="rounded-2xl border border-slate-300 px-4 py-3 font-bold"
          >
            <option value={4}>4 × 4</option>

            <option value={8}>8 × 8</option>

            <option value={12}>12 × 12</option>
          </select>

          <div className="rounded-2xl bg-blue-50 p-4 font-bold">
            Colour depth: {editorColourDepth} bits
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4 font-bold">
            Size: {editorFileSize} bits
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {palette.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => setColour(index)}
              className={`h-12 w-12 rounded-xl border-4 ${
                colour === index ? "border-blue-600" : "border-slate-200"
              }`}
              style={{
                backgroundColor: item,
              }}
              aria-label={`Select colour ${index + 1}`}
            />
          ))}

          <button
            type="button"
            onClick={resetCanvas}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black"
          >
            Reset canvas
          </button>

          <button
            type="button"
            onClick={randomPattern}
            className="rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 font-black text-blue-700"
          >
            New pattern
          </button>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950 p-6">
          <div
            className="mx-auto grid max-w-xl overflow-hidden rounded-2xl bg-white"
            style={{
              gridTemplateColumns: `repeat(${editorSize}, minmax(0, 1fr))`,
            }}
          >
            {pixels.map((pixel, index) => (
              <button
                key={index}
                type="button"
                onClick={() => paint(index)}
                className="aspect-square border border-slate-300"
                style={{
                  backgroundColor: palette[pixel],
                }}
                aria-label={`Pixel ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-blue-600">
            Storage calculation
          </p>

          <p className="mt-2 font-mono text-lg font-black">
            {editorSize} × {editorSize} × {editorColourDepth} = {editorFileSize}{" "}
            bits
          </p>
        </div>
      </div>
    </section>
  );
}
