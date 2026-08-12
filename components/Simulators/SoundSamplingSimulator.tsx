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

type QuestionType = "file-size" | "duration" | "bit-depth";

type Question = {
  sampleRate: number;
  bitDepth: number;
  duration: number;
  fileSize: number;
  questionType: QuestionType;
};

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function createQuestion(difficulty: DifficultyLevel): Question {
  if (difficulty === "foundation") {
    const sampleRate = randomItem([4, 8, 10, 12]);

    const bitDepth = randomItem([2, 4, 8]);

    const duration = randomItem([2, 5, 10]);

    return {
      sampleRate,
      bitDepth,
      duration,
      fileSize: sampleRate * bitDepth * duration,
      questionType: "file-size",
    };
  }

  if (difficulty === "intermediate") {
    const sampleRate = randomItem([8, 12, 16, 20, 24]);

    const bitDepth = randomItem([4, 6, 8, 10, 12]);

    const duration = randomItem([5, 10, 15, 20]);

    const questionType = Math.random() > 0.5 ? "file-size" : "duration";

    return {
      sampleRate,
      bitDepth,
      duration,
      fileSize: sampleRate * bitDepth * duration,
      questionType,
    };
  }

  const sampleRate = randomItem([16, 20, 24, 28, 32]);

  const bitDepth = randomItem([8, 10, 12, 14, 16]);

  const duration = randomItem([5, 10, 15, 20, 30]);

  const questionType = randomItem<QuestionType>([
    "file-size",
    "duration",
    "bit-depth",
  ]);

  return {
    sampleRate,
    bitDepth,
    duration,
    fileSize: sampleRate * bitDepth * duration,
    questionType,
  };
}

function expectedAnswer(question: Question): number {
  switch (question.questionType) {
    case "duration":
      return question.duration;

    case "bit-depth":
      return question.bitDepth;

    default:
      return question.fileSize;
  }
}

function questionText(question: Question): string {
  switch (question.questionType) {
    case "duration":
      return "Calculate the duration of the sound in seconds.";

    case "bit-depth":
      return "Calculate the bit depth used for the recording.";

    default:
      return "Calculate the uncompressed sound file size in bits.";
  }
}

export default function SoundSamplingSimulator() {
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

  const [exploreSampleRate, setExploreSampleRate] = useState(8);

  const [exploreBitDepth, setExploreBitDepth] = useState(4);

  const [exploreDuration, setExploreDuration] = useState(10);

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
    if (question.questionType === "file-size") {
      return `Sound file size formula:

Sample rate × Bit depth × Duration

${question.sampleRate} × ${question.bitDepth} × ${question.duration}

= ${question.fileSize} bits`;
    }

    if (question.questionType === "duration") {
      return `Duration formula:

File size ÷ (Sample rate × Bit depth)

${question.fileSize} ÷ (${question.sampleRate} × ${question.bitDepth})

${question.fileSize} ÷ ${question.sampleRate * question.bitDepth}

= ${question.duration} seconds`;
    }

    return `Bit depth formula:

File size ÷ (Sample rate × Duration)

${question.fileSize} ÷ (${question.sampleRate} × ${question.duration})

${question.fileSize} ÷ ${question.sampleRate * question.duration}

= ${question.bitDepth} bits`;
  }, [question]);

  const hint =
    question.questionType === "file-size"
      ? "Use: sample rate × bit depth × duration."
      : question.questionType === "duration"
        ? "Rearrange the file-size formula so duration is on its own."
        : "Rearrange the file-size formula so bit depth is on its own.";

  const explorerFileSize =
    exploreSampleRate * exploreBitDepth * exploreDuration;

  const samples = useMemo(
    () =>
      Array.from(
        {
          length: exploreSampleRate,
        },
        (_, index) => Math.sin((index / exploreSampleRate) * Math.PI * 2),
      ),
    [exploreSampleRate],
  );

  return (
    <section className="space-y-8 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Sound representation laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Sound Sampling Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Calculate sound storage requirements and explore how sample rate, bit
          depth and duration affect a digital recording.
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

        <h3 className="mt-2 text-xl font-black text-slate-950">
          {questionText(question)}
        </h3>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              Sample rate
            </p>

            <p className="mt-2 text-2xl font-black">{question.sampleRate} Hz</p>
          </article>

          <article className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              Bit depth
            </p>

            <p className="mt-2 text-2xl font-black">
              {question.questionType === "bit-depth"
                ? "?"
                : `${question.bitDepth} bits`}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase text-slate-500">
              Duration
            </p>

            <p className="mt-2 text-2xl font-black">
              {question.questionType === "duration"
                ? "?"
                : `${question.duration} s`}
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
        <label htmlFor="sound-answer" className="font-black">
          Your answer
        </label>

        <input
          id="sound-answer"
          type="number"
          min={0}
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder={
            question.questionType === "duration"
              ? "Enter seconds"
              : question.questionType === "bit-depth"
                ? "Enter bits"
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
        examinerTip="Write down the sound file-size formula first, substitute the values carefully, and remember that the basic answer is measured in bits unless the question asks for another unit."
      />

      <div className="border-t border-slate-200 pt-8">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-violet-600">
            Explore the concept
          </p>

          <h3 className="mt-2 text-2xl font-black">Sound Sampling Explorer</h3>

          <p className="mt-2 text-slate-600">
            Change the variables to see their effect on the waveform and
            calculated storage requirement.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="rounded-2xl bg-slate-50 p-5 font-bold">
            Sample rate: {exploreSampleRate} Hz
            <input
              type="range"
              min={4}
              max={32}
              value={exploreSampleRate}
              onChange={(event) =>
                setExploreSampleRate(Number(event.target.value))
              }
              className="mt-4 w-full"
            />
          </label>

          <label className="rounded-2xl bg-slate-50 p-5 font-bold">
            Bit depth: {exploreBitDepth} bits
            <input
              type="range"
              min={2}
              max={16}
              value={exploreBitDepth}
              onChange={(event) =>
                setExploreBitDepth(Number(event.target.value))
              }
              className="mt-4 w-full"
            />
          </label>

          <label className="rounded-2xl bg-slate-50 p-5 font-bold">
            Duration: {exploreDuration} seconds
            <input
              type="number"
              min={1}
              value={exploreDuration}
              onChange={(event) =>
                setExploreDuration(Math.max(1, Number(event.target.value) || 1))
              }
              className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-blue-50 p-5">
            <p className="text-xs font-black uppercase text-blue-600">
              Samples/sec
            </p>

            <p className="mt-2 text-2xl font-black">{exploreSampleRate}</p>
          </article>

          <article className="rounded-2xl bg-violet-50 p-5">
            <p className="text-xs font-black uppercase text-violet-600">
              Levels
            </p>

            <p className="mt-2 text-2xl font-black">
              {(2 ** exploreBitDepth).toLocaleString()}
            </p>
          </article>

          <article className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-xs font-black uppercase text-emerald-700">
              File size
            </p>

            <p className="mt-2 text-2xl font-black">
              {explorerFileSize.toLocaleString()} bits
            </p>
          </article>
        </div>

        <div className="mt-6 flex h-56 items-center gap-1 rounded-3xl bg-slate-950 p-6">
          {samples.map((sample, index) => (
            <div
              key={index}
              className="flex-1 rounded-full bg-emerald-400"
              style={{
                height: `${Math.max(6, Math.abs(sample) * 90)}%`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
