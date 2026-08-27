"use client";

import { useEffect, useMemo, useState } from "react";

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
  values: number[];
  target: number;
};

type ProcedureFeedbackType = "success" | "error" | "info" | null;

function createSortedValues(length: number): number[] {
  const values = new Set<number>();

  while (values.size < length) {
    values.add(Math.floor(Math.random() * 90) + 10);
  }

  return Array.from(values).sort((a, b) => a - b);
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const length =
    difficulty === "foundation" ? 7 : difficulty === "intermediate" ? 9 : 11;

  const values = createSortedValues(length);

  const allowMissing = difficulty !== "foundation" && Math.random() < 0.25;

  if (allowMissing) {
    let target = Math.floor(Math.random() * 90) + 10;

    while (values.includes(target)) {
      target = Math.floor(Math.random() * 90) + 10;
    }

    return {
      values,
      target,
    };
  }

  return {
    values,
    target: values[Math.floor(Math.random() * values.length)],
  };
}

function createWorking(question: Question): string {
  let low = 0;
  let high = question.values.length - 1;

  const steps: string[] = [];

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const middleValue = question.values[middle];

    steps.push(`Search area: index ${low} to ${high}`);

    steps.push(`Middle index = ${middle}, value = ${middleValue}`);

    if (middleValue === question.target) {
      steps.push(
        `${middleValue} equals ${question.target}, so the target is found at index ${middle}.`,
      );

      return steps.join("\n\n");
    }

    if (question.target < middleValue) {
      steps.push(
        `${question.target} is smaller than ${middleValue}, so discard the right half.`,
      );

      high = middle - 1;
    } else {
      steps.push(
        `${question.target} is larger than ${middleValue}, so discard the left half.`,
      );

      low = middle + 1;
    }
  }

  steps.push("The search area is empty, so the target is not present.");

  return steps.join("\n\n");
}

export default function BinarySearchSimulator() {
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

  /*
   * =========================================================
   * SCORED CHALLENGE
   * =========================================================
   */

  const [answer, setAnswer] = useState("");

  const expectedIndex = question.values.indexOf(question.target);

  const numericAnswer = Number(answer);

  const canCheck = answer.trim() !== "" && Number.isInteger(numericAnswer);

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    markAnswer(numericAnswer === expectedIndex);
  }

  function handleTryAgain() {
    setAnswer("");
    resetQuestion();
  }

  const working = useMemo(() => createWorking(question), [question]);

  /*
   * =========================================================
   * PROCEDURAL TRAINER
   * =========================================================
   */

  const [low, setLow] = useState(0);

  const [high, setHigh] = useState(question.values.length - 1);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [procedureComplete, setProcedureComplete] = useState(false);

  const [foundProcedurally, setFoundProcedurally] = useState(false);

  const [procedureCorrectSteps, setProcedureCorrectSteps] = useState(0);

  const [procedureMistakes, setProcedureMistakes] = useState(0);

  const [discardCount, setDiscardCount] = useState(0);

  const [procedureFeedback, setProcedureFeedback] = useState("");

  const [procedureFeedbackType, setProcedureFeedbackType] =
    useState<ProcedureFeedbackType>(null);

  /*
   * Keep the procedural search bounds synchronised with the latest
   * generated question. This fixes the temporary LOW=0, HIGH=0,
   * MIDDLE=0 state after changing difficulty or creating a new question.
   */
  useEffect(() => {
    void Promise.resolve().then(() => {
      setLow(0);
      setHigh(question.values.length - 1);
      setSelectedIndex(null);
      setProcedureComplete(false);
      setFoundProcedurally(false);
      setProcedureCorrectSteps(0);
      setProcedureMistakes(0);
      setDiscardCount(0);
      setProcedureFeedback("");
      setProcedureFeedbackType(null);
    });
  }, [question]);

  const safeHigh =
    high >= question.values.length ? question.values.length - 1 : high;

  const middle = low <= safeHigh ? Math.floor((low + safeHigh) / 2) : -1;

  const middleValue = middle >= 0 ? question.values[middle] : undefined;

  const procedureAttempts = procedureCorrectSteps + procedureMistakes;

  const procedureAccuracy =
    procedureAttempts === 0
      ? 0
      : Math.round((procedureCorrectSteps / procedureAttempts) * 100);

  function resetProcedure() {
    setLow(0);
    setHigh(question.values.length - 1);

    setSelectedIndex(null);

    setProcedureComplete(false);
    setFoundProcedurally(false);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
    setDiscardCount(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function handleNewQuestion() {
    setAnswer("");

    setLow(0);
    setHigh(question.values.length - 1);

    setSelectedIndex(null);

    setProcedureComplete(false);
    setFoundProcedurally(false);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
    setDiscardCount(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    newQuestion();
  }

  function handleDifficultyChange(nextDifficulty: DifficultyLevel) {
    setAnswer("");

    setLow(0);
    setHigh(question.values.length - 1);

    setSelectedIndex(null);

    setProcedureComplete(false);
    setFoundProcedurally(false);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
    setDiscardCount(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    changeDifficulty(nextDifficulty);
  }

  function initialiseProcedureIfNeeded() {
    if (high !== question.values.length - 1 && high !== 0) {
      return;
    }

    /*
     * When a newly generated question has a different list length,
     * the old high value may temporarily be 0.
     */
    if (
      low === 0 &&
      high === 0 &&
      question.values.length > 1 &&
      !procedureComplete &&
      procedureCorrectSteps === 0 &&
      discardCount === 0
    ) {
      setHigh(question.values.length - 1);
    }
  }

  function recordMistake(message: string) {
    setProcedureMistakes((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("error");
  }

  function recordSuccess(message: string) {
    setProcedureCorrectSteps((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("success");
  }

  function selectMiddle(index: number) {
    if (difficulty === "foundation" || procedureComplete) {
      return;
    }

    initialiseProcedureIfNeeded();

    setSelectedIndex(index);
    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function validateMiddleSelection(): boolean {
    if (difficulty === "foundation") {
      return true;
    }

    if (selectedIndex === null) {
      recordMistake("Select the middle item of the current search area first.");

      return false;
    }

    if (selectedIndex < low || selectedIndex > safeHigh) {
      recordMistake(
        `Index ${selectedIndex} is outside the current search area.`,
      );

      return false;
    }

    if (selectedIndex !== middle) {
      recordMistake(
        `That is not the correct middle index. The current search area runs from ${low} to ${safeHigh}.`,
      );

      return false;
    }

    return true;
  }

  function completeNotFound() {
    setProcedureComplete(true);
    setFoundProcedurally(false);

    setProcedureFeedback(
      "The search area is now empty. The target is not present.",
    );

    setProcedureFeedbackType("success");
  }

  function handleSearchLeft() {
    if (procedureComplete) {
      return;
    }

    initialiseProcedureIfNeeded();

    if (!validateMiddleSelection()) {
      return;
    }

    if (middleValue === undefined) {
      return;
    }

    if (middleValue === question.target) {
      recordMistake(
        `${middleValue} equals the target. Do not discard either half — the target has been found.`,
      );

      return;
    }

    if (question.target > middleValue) {
      recordMistake(
        `${question.target} is greater than ${middleValue}. The target cannot be in the left half.`,
      );

      return;
    }

    recordSuccess(
      `Correct. ${question.target} < ${middleValue}, so discard the middle value and everything to its right.`,
    );

    setDiscardCount((current) => current + 1);

    const nextHigh = middle - 1;

    setHigh(nextHigh);
    setSelectedIndex(null);

    if (low > nextHigh) {
      setTimeout(() => {
        completeNotFound();
      }, 0);
    }
  }

  function handleSearchRight() {
    if (procedureComplete) {
      return;
    }

    initialiseProcedureIfNeeded();

    if (!validateMiddleSelection()) {
      return;
    }

    if (middleValue === undefined) {
      return;
    }

    if (middleValue === question.target) {
      recordMistake(
        `${middleValue} equals the target. Do not discard either half — the target has been found.`,
      );

      return;
    }

    if (question.target < middleValue) {
      recordMistake(
        `${question.target} is smaller than ${middleValue}. The target cannot be in the right half.`,
      );

      return;
    }

    recordSuccess(
      `Correct. ${question.target} > ${middleValue}, so discard the middle value and everything to its left.`,
    );

    setDiscardCount((current) => current + 1);

    const nextLow = middle + 1;

    setLow(nextLow);
    setSelectedIndex(null);

    if (nextLow > safeHigh) {
      setTimeout(() => {
        completeNotFound();
      }, 0);
    }
  }

  function handleFound() {
    if (procedureComplete) {
      return;
    }

    initialiseProcedureIfNeeded();

    if (!validateMiddleSelection()) {
      return;
    }

    if (middleValue === undefined) {
      return;
    }

    if (middleValue !== question.target) {
      recordMistake(
        `${middleValue} does not equal ${question.target}, so the target has not been found.`,
      );

      return;
    }

    setProcedureCorrectSteps((current) => current + 1);

    setProcedureFeedback(
      `Correct. ${middleValue} equals ${question.target}. The target is at index ${middle}.`,
    );

    setProcedureFeedbackType("success");

    setFoundProcedurally(true);
    setProcedureComplete(true);
  }

  /*
   * Foundation still needs a Found action because otherwise a student could
   * only choose left/right when the middle already equals the target.
   */

  return (
    <section className="space-y-8 rounded-3xl border border-indigo-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-indigo-600">
          Algorithm laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Binary Search Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Predict the target position, then perform Binary Search by selecting
          middle values and repeatedly discarding the correct half.
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

      {/* ==================================================== */}
      {/* SCORED CHALLENGE                                     */}
      {/* ==================================================== */}

      <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-indigo-600">
          Final-answer challenge
        </p>

        <h3 className="mt-2 text-xl font-black">
          At which index will {question.target} be found?
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          The list is sorted. Enter -1 if the target is not present.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {question.values.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="rounded-2xl bg-white px-5 py-4 text-center"
            >
              <p className="text-xs font-bold text-slate-400">{index}</p>

              <p className="mt-1 text-xl font-black">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label htmlFor="binary-search-answer" className="font-black">
          Your answer
        </label>

        <input
          id="binary-search-answer"
          type="number"
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Enter the index"
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 text-xl font-black outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-100"
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
        successMessage={
          expectedIndex === -1
            ? "Correct. The target is not present, so the answer is -1."
            : `Correct. The target is at index ${expectedIndex}.`
        }
        errorMessage={`Not quite. The correct answer is ${expectedIndex}.`}
        hintVisible={hintVisible}
        hint="Find the middle item. If the target is smaller, keep the left half. If it is larger, keep the right half."
        workingVisible={workingVisible}
        working={working}
        examinerTip="Binary Search requires sorted data. Each successful decision removes roughly half of the remaining search area."
      />

      {/* ==================================================== */}
      {/* PROCEDURAL TRAINER                                   */}
      {/* ==================================================== */}

      <div className="border-t border-slate-200 pt-8">
        <p className="text-sm font-black uppercase tracking-widest text-violet-600">
          Hands-on algorithm practice
        </p>

        <h3 className="mt-2 text-2xl font-black">Perform Binary Search</h3>

        <p className="mt-2 max-w-4xl leading-7 text-slate-600">
          Identify the middle item, compare it with the target and decide which
          half of the remaining search area can be discarded.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Correct steps
            </p>

            <p className="mt-2 text-2xl font-black">{procedureCorrectSteps}</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Mistakes
            </p>

            <p className="mt-2 text-2xl font-black">{procedureMistakes}</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Procedure accuracy
            </p>

            <p className="mt-2 text-2xl font-black">{procedureAccuracy}%</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Halves discarded
            </p>

            <p className="mt-2 text-2xl font-black">{discardCount}</p>
          </article>
        </div>

        <section className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Target
              </p>

              <p className="mt-2 text-2xl font-black">{question.target}</p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Low
              </p>

              <p className="mt-2 text-2xl font-black">
                {procedureComplete ? "—" : low}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                High
              </p>

              <p className="mt-2 text-2xl font-black">
                {procedureComplete ? "—" : safeHigh}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Middle
              </p>

              <p className="mt-2 text-2xl font-black">
                {procedureComplete ? "Complete" : middle}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 rounded-3xl bg-slate-950 p-7">
          <div className="flex flex-wrap justify-center gap-4">
            {question.values.map((value, index) => {
              const discarded = index < low || index > safeHigh;

              const automaticMiddle =
                difficulty === "foundation" &&
                index === middle &&
                !procedureComplete;

              const selected = selectedIndex === index;

              const found =
                procedureComplete &&
                foundProcedurally &&
                value === question.target;

              return (
                <button
                  key={`${value}-${index}`}
                  type="button"
                  disabled={
                    difficulty === "foundation" ||
                    procedureComplete ||
                    discarded
                  }
                  onClick={() => selectMiddle(index)}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-2xl font-black transition ${
                    found
                      ? "border-emerald-300 bg-emerald-500 text-white"
                      : selected || automaticMiddle
                        ? "border-indigo-300 bg-indigo-600 text-white"
                        : discarded
                          ? "border-slate-700 bg-slate-900 text-slate-600"
                          : "border-slate-600 bg-slate-800 text-white hover:border-indigo-400"
                  }`}
                >
                  <span>{value}</span>

                  <span className="absolute -bottom-6 text-xs font-bold text-slate-400">
                    {index}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 text-center text-sm text-slate-300">
            {procedureComplete ? (
              foundProcedurally ? (
                <p className="font-black text-emerald-300">
                  Target found. Binary Search complete.
                </p>
              ) : (
                <p className="font-black text-amber-300">
                  Search area empty. Target not found.
                </p>
              )
            ) : difficulty === "foundation" ? (
              <p>
                The middle item is highlighted. Compare it with the target and
                choose the correct action.
              </p>
            ) : selectedIndex === null ? (
              <p>Select the middle item of the current search area.</p>
            ) : (
              <p>
                Selected index {selectedIndex}. Decide whether to search left,
                search right or declare the target found.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSearchLeft}
            disabled={procedureComplete}
            className="rounded-xl border border-blue-300 bg-blue-50 px-6 py-3 font-black text-blue-800 disabled:opacity-40"
          >
            ← Search left
          </button>

          <button
            type="button"
            onClick={handleFound}
            disabled={procedureComplete}
            className="rounded-xl border border-emerald-300 bg-emerald-50 px-6 py-3 font-black text-emerald-800 disabled:opacity-40"
          >
            Target found
          </button>

          <button
            type="button"
            onClick={handleSearchRight}
            disabled={procedureComplete}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-black text-white disabled:bg-slate-300"
          >
            Search right →
          </button>

          <button
            type="button"
            onClick={resetProcedure}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black"
          >
            Reset procedure
          </button>
        </div>

        {procedureFeedback && (
          <section
            className={`mt-6 rounded-2xl border p-5 ${
              procedureFeedbackType === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : procedureFeedbackType === "error"
                  ? "border-red-300 bg-red-50 text-red-900"
                  : "border-blue-300 bg-blue-50 text-blue-900"
            }`}
          >
            <p className="font-black">
              {procedureFeedbackType === "success"
                ? "✓ Correct procedure"
                : procedureFeedbackType === "error"
                  ? "✕ Try that step again"
                  : "Procedure update"}
            </p>

            <p className="mt-2 leading-7">{procedureFeedback}</p>
          </section>
        )}

        {procedureComplete && (
          <section className="mt-6 rounded-3xl border border-emerald-300 bg-emerald-50 p-6">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
              Procedure complete
            </p>

            <h4 className="mt-2 text-2xl font-black text-emerald-950">
              Binary Search completed
            </h4>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Result
                </p>

                <p className="mt-2 font-black">
                  {foundProcedurally
                    ? `Found at index ${expectedIndex}`
                    : "Target not present"}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Procedure accuracy
                </p>

                <p className="mt-2 text-2xl font-black">{procedureAccuracy}%</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Mistakes
                </p>

                <p className="mt-2 text-2xl font-black">{procedureMistakes}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
