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
  character: string;
};

const foundationCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const intermediateCharacters = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."0123456789",
];

const higherCharacters = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ..."abcdefghijklmnopqrstuvwxyz",
  ..."0123456789",
  " ",
  "!",
  "?",
  "@",
  "#",
  "$",
  "%",
  "&",
];

function characterPool(difficulty: DifficultyLevel): string[] {
  switch (difficulty) {
    case "foundation":
      return foundationCharacters;

    case "intermediate":
      return intermediateCharacters;

    case "higher":
      return higherCharacters;
  }
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const pool = characterPool(difficulty);

  return {
    character: pool[Math.floor(Math.random() * pool.length)] ?? "A",
  };
}

export default function CharacterEncodingSimulator() {
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

  const characterCode = question.character.codePointAt(0) ?? 0;

  const binaryCode = useMemo(
    () => characterCode.toString(2).padStart(8, "0"),
    [characterCode],
  );

  const cleanedAnswer = answer.replace(/[^01]/g, "");

  function handleCheck() {
    if (cleanedAnswer.length !== 8) {
      return;
    }

    markAnswer(cleanedAnswer === binaryCode);
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

    setAnswer(value.replace(/[^01]/g, "").slice(0, 8));
  }

  const displayCharacter =
    question.character === " " ? "Space" : question.character;

  return (
    <section className="space-y-6 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Character encoding laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Character Encoding Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Convert characters into their numerical and binary representations.
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

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-8 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Encode this character
        </p>

        <p className="mt-4 text-7xl font-black text-slate-950">
          {displayCharacter}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label
          htmlFor="character-binary-answer"
          className="font-black text-slate-950"
        >
          Enter the 8-bit binary code
        </label>

        <input
          id="character-binary-answer"
          value={answer}
          disabled={checked}
          inputMode="numeric"
          maxLength={8}
          onChange={(event) => handleAnswerChange(event.target.value)}
          placeholder="Enter 8 bits"
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 font-mono text-xl font-black tracking-widest outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
        />

        <div className="mt-5">
          <SimulatorControls
            canCheck={cleanedAnswer.length === 8}
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
        successMessage={`Correct. ${displayCharacter} has code ${characterCode}, which is ${binaryCode} in 8-bit binary.`}
        errorMessage={`Not quite. The correct 8-bit binary representation is ${binaryCode}.`}
        hintVisible={hintVisible}
        hint={`First determine the character code. For this challenge the numerical code is ${characterCode}. Convert that denary value into 8-bit binary.`}
        workingVisible={workingVisible}
        working={`Character: ${displayCharacter}

Character code: ${characterCode}

Convert ${characterCode} into binary:

${binaryCode}

Therefore:

${displayCharacter} → ${characterCode} → ${binaryCode}`}
        examinerTip="Remember that characters are stored as numeric codes. The numeric code is ultimately represented using binary inside the computer."
      />

      <section className="rounded-3xl bg-slate-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          Encoding relationship
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-600">Character</p>

            <p className="mt-1 text-2xl font-black">{displayCharacter}</p>
          </div>

          <div>
            <p className="text-sm text-slate-600">Numerical code</p>

            <p className="mt-1 text-2xl font-black">
              {checked || workingVisible ? characterCode : "?"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600">Binary</p>

            <p className="mt-1 font-mono text-2xl font-black">
              {checked || workingVisible ? binaryCode : "????????"}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}
