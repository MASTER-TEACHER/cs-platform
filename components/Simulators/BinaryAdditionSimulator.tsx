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
  left: number;
  right: number;
  bits: number;
};

type ColumnCalculation = {
  leftBits: number[];
  rightBits: number[];
  resultBits: number[];
  carryInto: number[];
  carryOut: number[];
  finalCarry: number;
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

  /*
   * Avoid generating 0 + 0 too frequently because it is not
   * particularly useful practice.
   */
  const left = Math.floor(Math.random() * (maximum + 1));
  let right = Math.floor(Math.random() * (maximum + 1));

  if (left === 0 && right === 0) {
    right = 1;
  }

  return {
    left,
    right,
    bits,
  };
}

function calculateColumns(
  left: number,
  right: number,
  bits: number,
): ColumnCalculation {
  const leftBits = toBinary(left, bits).split("").map(Number);

  const rightBits = toBinary(right, bits).split("").map(Number);

  const resultBits = Array<number>(bits).fill(0);
  const carryInto = Array<number>(bits).fill(0);
  const carryOut = Array<number>(bits).fill(0);

  let carry = 0;

  for (let index = bits - 1; index >= 0; index -= 1) {
    carryInto[index] = carry;

    const sum = leftBits[index] + rightBits[index] + carry;

    resultBits[index] = sum % 2;

    carry = sum >= 2 ? 1 : 0;

    carryOut[index] = carry;
  }

  return {
    leftBits,
    rightBits,
    resultBits,
    carryInto,
    carryOut,
    finalCarry: carry,
  };
}

function expectedBinaryAnswer(question: Question): string {
  const total = question.left + question.right;

  const maximumRepresentable = 2 ** question.bits - 1;

  const overflow = total > maximumRepresentable;

  return overflow
    ? toBinary(total, question.bits + 1)
    : toBinary(total, question.bits);
}

function createWorkingText(
  calculation: ColumnCalculation,
  expectedAnswer: string,
): string {
  const lines: string[] = [];

  calculation.leftBits
    .map((leftBit, index) => ({
      index,
      leftBit,
    }))
    .reverse()
    .forEach(({ index, leftBit }, displayIndex) => {
      const rightBit = calculation.rightBits[index];

      const carryIn = calculation.carryInto[index];

      const total = leftBit + rightBit + carryIn;

      const resultBit = calculation.resultBits[index];

      const carryOut = calculation.carryOut[index];

      const carryText = carryIn > 0 ? ` + ${carryIn} carry` : "";

      lines.push(
        `Column ${displayIndex + 1}: ${leftBit} + ${rightBit}${carryText} = ${total}. Write ${resultBit}, carry ${carryOut}.`,
      );
    });

  lines.push("");
  lines.push(`Final binary result: ${expectedAnswer}`);

  return lines.join("\n");
}

export default function BinaryAdditionSimulator() {
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

  const [answer, setAnswer] = useState("");

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

  const calculation = useMemo(
    () => calculateColumns(question.left, question.right, question.bits),
    [question.left, question.right, question.bits],
  );

  const total = question.left + question.right;

  const maximumRepresentable = 2 ** question.bits - 1;

  const overflow = total > maximumRepresentable;

  const expectedAnswer = expectedBinaryAnswer(question);

  const cleanedAnswer = answer.replace(/[^01]/g, "");

  const answerLength = overflow ? question.bits + 1 : question.bits;

  const workingText = useMemo(
    () => createWorkingText(calculation, expectedAnswer),
    [calculation, expectedAnswer],
  );

  function handleCheckAnswer() {
    if (!cleanedAnswer || checked) {
      return;
    }

    markAnswer(cleanedAnswer === expectedAnswer);
  }

  function handleReset() {
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
    /*
     * Do not clear the framework's checked state here.
     * Once a question has been scored, that question stays scored.
     *
     * This prevents students repeatedly editing and rechecking
     * one question to inflate attempts, XP or accuracy.
     */
    if (checked) {
      return;
    }

    const cleaned = value.replace(/[^01]/g, "").slice(0, answerLength);

    setAnswer(cleaned);
  }

  const hint = overflow
    ? `Work from right to left. Remember the four binary addition rules: 0 + 0 = 0, 0 + 1 = 1, 1 + 1 = 10, and 1 + 1 + 1 = 11. This question also requires more than ${question.bits} bits.`
    : "Work from the rightmost column to the left. Remember that 1 + 1 produces 0 with a carry of 1.";

  const examinerTip =
    "In an exam, show carry bits clearly above the appropriate columns. If the result needs more bits than the register can hold, identify this as overflow.";

  return (
    <section className="space-y-6 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Binary laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Binary Addition Simulator
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Add binary numbers column by column, follow the carry bits, identify
          overflow and build your accuracy and streak across multiple questions.
        </p>
      </header>

      <SimulatorDifficulty
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm font-bold text-blue-950">
          Current challenge:{" "}
          <span className="font-black">
            {question.bits}-bit binary addition
          </span>
        </p>

        <p className="mt-1 text-sm text-blue-800">
          Correct answers at this difficulty award{" "}
          <strong>
            {difficulty === "foundation"
              ? "10 XP"
              : difficulty === "intermediate"
                ? "15 XP"
                : "20 XP"}
          </strong>
          .
        </p>
      </div>

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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Register width
            </p>

            <p className="mt-1 text-xl font-black text-slate-950">
              {question.bits} bits
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Overflow
            </p>

            <p
              className={`mt-1 text-xl font-black ${
                overflow ? "text-amber-800" : "text-emerald-800"
              }`}
            >
              {overflow ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl bg-slate-950 p-6 text-white">
        <div className="overflow-x-auto">
          <div className="mx-auto min-w-max font-mono text-2xl font-black">
            {workingVisible && (
              <div className="mb-2 flex justify-end gap-3 text-sm text-amber-300">
                {calculation.carryInto.map((carry, index) => (
                  <span key={`carry-${index}`} className="w-7 text-center">
                    {carry || " "}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3">
              {calculation.leftBits.map((bit, index) => (
                <span key={`left-${index}`} className="w-7 text-center">
                  {bit}
                </span>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-end gap-3">
              <span className="mr-2 text-blue-300">+</span>

              {calculation.rightBits.map((bit, index) => (
                <span key={`right-${index}`} className="w-7 text-center">
                  {bit}
                </span>
              ))}
            </div>

            <div className="mt-3 border-t border-slate-600 pt-3">
              <div className="flex justify-end gap-3">
                {expectedAnswer.split("").map((bit, index) => (
                  <span
                    key={`result-${index}`}
                    className="w-7 text-center text-emerald-300"
                  >
                    {checked || workingVisible ? bit : "?"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label
          htmlFor="binary-addition-answer"
          className="font-black text-slate-950"
        >
          Your binary answer
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Enter exactly {answerLength} binary digit
          {answerLength === 1 ? "" : "s"}.
        </p>

        <input
          id="binary-addition-answer"
          type="text"
          inputMode="numeric"
          value={answer}
          onChange={(event) => handleAnswerChange(event.target.value)}
          disabled={checked}
          maxLength={answerLength}
          placeholder={`Enter ${answerLength} bits`}
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 font-mono text-xl font-black tracking-widest text-slate-950 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        />

        <div className="mt-5">
          <SimulatorControls
            canCheck={cleanedAnswer.length === answerLength}
            checked={checked}
            hintVisible={hintVisible}
            workingVisible={workingVisible}
            checkLabel="Check answer"
            resetLabel="Try again"
            newExampleLabel="New question"
            onCheck={handleCheckAnswer}
            onHint={toggleHint}
            onToggleWorking={toggleWorking}
            onReset={handleReset}
            onNewExample={handleNewQuestion}
          />
        </div>
      </section>

      <SimulatorFeedback
        checked={checked}
        correct={correct}
        successMessage={`Excellent. ${expectedAnswer} is the correct binary result. ${
          difficulty === "foundation"
            ? "You earned 10 XP."
            : difficulty === "intermediate"
              ? "You earned 15 XP."
              : "You earned 20 XP."
        }`}
        errorMessage={`The submitted answer is not correct. The correct result is ${expectedAnswer}. Review the carry bits and use the worked solution before trying a new question.`}
        hintVisible={hintVisible}
        hint={hint}
        workingVisible={workingVisible}
        working={workingText}
        examinerTip={examinerTip}
      />

      {workingVisible && (
        <section className="space-y-3">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">
              Detailed working
            </p>

            <h3 className="mt-1 text-xl font-black text-slate-950">
              Column-by-column calculation
            </h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {calculation.leftBits
              .map((leftBit, index) => ({
                index,
                leftBit,
              }))
              .reverse()
              .map(({ index, leftBit }, displayIndex) => {
                const rightBit = calculation.rightBits[index];

                const carryIn = calculation.carryInto[index];

                const columnTotal = leftBit + rightBit + carryIn;

                const resultBit = calculation.resultBits[index];

                const carryOut = calculation.carryOut[index];

                return (
                  <article
                    key={`column-${index}`}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                      Column {displayIndex + 1}
                    </p>

                    <p className="mt-3 font-mono text-lg font-black text-slate-950">
                      {leftBit} + {rightBit}
                      {carryIn ? " + 1 carry" : ""}
                    </p>

                    <p className="mt-2 text-slate-600">Total: {columnTotal}</p>

                    <p className="mt-1 font-bold text-slate-950">
                      Write {resultBit}
                    </p>

                    <p className="mt-1 font-bold text-slate-950">
                      Carry {carryOut}
                    </p>
                  </article>
                );
              })}
          </div>
        </section>
      )}

      <section
        className={`rounded-3xl border p-6 ${
          overflow
            ? "border-amber-300 bg-amber-50"
            : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">
          Denary check
        </p>

        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-600">First value</p>

            <p className="text-2xl font-black text-slate-950">
              {question.left}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600">Second value</p>

            <p className="text-2xl font-black text-slate-950">
              {question.right}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-600">Total</p>

            <p className="text-2xl font-black text-slate-950">{total}</p>
          </div>
        </div>

        {overflow && (
          <p className="mt-4 font-semibold leading-7 text-amber-900">
            The mathematical result needs more than {question.bits} bits. An
            unsigned {question.bits}-bit register therefore cannot store the
            complete result, so overflow occurs.
          </p>
        )}
      </section>
    </section>
  );
}
