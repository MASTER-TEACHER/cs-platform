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
  values: number[];
};

type ProcedurePhase =
  "select-key" | "compare" | "shift" | "insert" | "complete";

type ProcedureFeedbackType = "success" | "error" | "info" | null;

function createUniqueValues(length: number): number[] {
  const values = new Set<number>();

  while (values.size < length) {
    values.add(Math.floor(Math.random() * 40) + 1);
  }

  return Array.from(values);
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const length =
    difficulty === "foundation" ? 5 : difficulty === "intermediate" ? 6 : 8;

  return {
    values: createUniqueValues(length),
  };
}

function normaliseList(value: string): number[] {
  return value
    .split(/[\s,]+/)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

function createWorking(question: Question): string {
  const working = [...question.values];
  const lines: string[] = [];

  lines.push(`Starting list: ${working.join(", ")}`);
  lines.push("");

  for (let currentIndex = 1; currentIndex < working.length; currentIndex += 1) {
    const key = working[currentIndex];
    let comparisonIndex = currentIndex - 1;

    lines.push(`Pass ${currentIndex}`);
    lines.push(`Key value = ${key}`);

    while (comparisonIndex >= 0 && working[comparisonIndex] > key) {
      lines.push(
        `${working[comparisonIndex]} > ${key}, so shift ${working[comparisonIndex]} one position to the right.`,
      );

      working[comparisonIndex + 1] = working[comparisonIndex];
      comparisonIndex -= 1;
    }

    working[comparisonIndex + 1] = key;

    lines.push(`Insert ${key} at index ${comparisonIndex + 1}.`);

    lines.push(`List: ${working.join(", ")}`);
    lines.push("");
  }

  lines.push(`Sorted list: ${working.join(", ")}`);

  return lines.join("\n");
}

export default function InsertionSortSimulator() {
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
   * FINAL-ORDER CHALLENGE
   * =========================================================
   */

  const [answer, setAnswer] = useState("");

  const sortedValues = useMemo(
    () => [...question.values].sort((a, b) => a - b),
    [question.values],
  );

  const submittedValues = normaliseList(answer);

  const canCheck = submittedValues.length === question.values.length;

  function handleCheck() {
    if (!canCheck) {
      return;
    }

    const matches = sortedValues.every(
      (value, index) => value === submittedValues[index],
    );

    markAnswer(matches);
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

  const [procedureValues, setProcedureValues] = useState<number[]>([
    ...question.values,
  ]);

  /*
   * currentIndex is the value that should become the next key.
   * Index 0 is already treated as sorted.
   */
  const [currentIndex, setCurrentIndex] = useState(1);

  const [keyValue, setKeyValue] = useState<number | null>(null);

  /*
   * comparisonIndex tracks the current value being compared
   * against the key inside the sorted section.
   */
  const [comparisonIndex, setComparisonIndex] = useState<number | null>(null);

  /*
   * holeIndex is the position where the key will eventually
   * be inserted after larger items shift right.
   */
  const [holeIndex, setHoleIndex] = useState<number | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [phase, setPhase] = useState<ProcedurePhase>("select-key");

  const [procedureCorrectSteps, setProcedureCorrectSteps] = useState(0);

  const [procedureMistakes, setProcedureMistakes] = useState(0);

  const [comparisons, setComparisons] = useState(0);

  const [shifts, setShifts] = useState(0);

  const [passesCompleted, setPassesCompleted] = useState(0);

  const [procedureFeedback, setProcedureFeedback] = useState("");

  const [procedureFeedbackType, setProcedureFeedbackType] =
    useState<ProcedureFeedbackType>(null);

  const procedureAttempts = procedureCorrectSteps + procedureMistakes;

  const procedureAccuracy =
    procedureAttempts === 0
      ? 0
      : Math.round((procedureCorrectSteps / procedureAttempts) * 100);

  function recordSuccess(message: string) {
    setProcedureCorrectSteps((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("success");
  }

  function recordMistake(message: string) {
    setProcedureMistakes((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("error");
  }

  function recordInfo(message: string) {
    setProcedureFeedback(message);
    setProcedureFeedbackType("info");
  }

  function resetProcedureWithValues(values: number[]) {
    setProcedureValues([...values]);

    setCurrentIndex(1);

    setKeyValue(null);
    setComparisonIndex(null);
    setHoleIndex(null);
    setSelectedIndex(null);

    setPhase("select-key");

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setComparisons(0);
    setShifts(0);
    setPassesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function resetProcedure() {
    resetProcedureWithValues(question.values);
  }

  function handleNewQuestion() {
    setAnswer("");

    setProcedureValues([]);
    setCurrentIndex(1);

    setKeyValue(null);
    setComparisonIndex(null);
    setHoleIndex(null);
    setSelectedIndex(null);

    setPhase("select-key");

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setComparisons(0);
    setShifts(0);
    setPassesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    newQuestion();
  }

  function handleDifficultyChange(nextDifficulty: DifficultyLevel) {
    setAnswer("");

    setProcedureValues([]);
    setCurrentIndex(1);

    setKeyValue(null);
    setComparisonIndex(null);
    setHoleIndex(null);
    setSelectedIndex(null);

    setPhase("select-key");

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setComparisons(0);
    setShifts(0);
    setPassesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    changeDifficulty(nextDifficulty);
  }

  /*
   * Because useSimulator generates a new question after
   * handleNewQuestion/changeDifficulty, we lazily restore
   * procedureValues from the latest question when necessary.
   */
  const displayedProcedureValues =
    procedureValues.length === question.values.length
      ? procedureValues
      : [...question.values];

  /*
   * =========================================================
   * KEY SELECTION
   * =========================================================
   */

  function selectItem(index: number) {
    if (phase === "complete") {
      return;
    }

    if (phase === "select-key") {
      if (difficulty === "foundation") {
        return;
      }

      setSelectedIndex(index);
      setProcedureFeedback("");
      setProcedureFeedbackType(null);
      return;
    }

    if (phase === "compare") {
      if (difficulty !== "higher") {
        return;
      }

      setSelectedIndex(index);
      setProcedureFeedback("");
      setProcedureFeedbackType(null);
      return;
    }

    if (phase === "shift") {
      if (difficulty === "foundation") {
        return;
      }

      setSelectedIndex(index);
      setProcedureFeedback("");
      setProcedureFeedbackType(null);
      return;
    }

    if (phase === "insert") {
      if (difficulty === "foundation") {
        return;
      }

      setSelectedIndex(index);
      setProcedureFeedback("");
      setProcedureFeedbackType(null);
    }
  }

  function beginPass() {
    const values = displayedProcedureValues;

    if (currentIndex >= values.length) {
      setPhase("complete");
      return;
    }

    const expectedKey = values[currentIndex];

    if (difficulty === "foundation") {
      setKeyValue(expectedKey);
      setHoleIndex(currentIndex);
      setComparisonIndex(currentIndex - 1);
      setSelectedIndex(null);

      recordSuccess(
        `The next key is ${expectedKey}. Compare it with the value immediately to its left.`,
      );

      setPhase("compare");
      return;
    }

    if (selectedIndex === null) {
      recordMistake("Select the next unsorted value to use as the key.");
      return;
    }

    if (selectedIndex !== currentIndex) {
      recordMistake(
        `Not quite. In insertion sort, the next key must be the first value immediately after the sorted section. Select index ${currentIndex}.`,
      );
      return;
    }

    setKeyValue(expectedKey);
    setHoleIndex(currentIndex);
    setComparisonIndex(currentIndex - 1);
    setSelectedIndex(null);

    recordSuccess(
      `Correct. ${expectedKey} is the key for pass ${currentIndex}.`,
    );

    setPhase("compare");
  }

  /*
   * =========================================================
   * COMPARISON
   * =========================================================
   */

  function performComparison() {
    if (phase !== "compare" || keyValue === null || comparisonIndex === null) {
      return;
    }

    if (comparisonIndex < 0) {
      setPhase("insert");

      recordInfo(
        `${keyValue} belongs at the beginning of the sorted section. Insert the key into the open position.`,
      );

      return;
    }

    if (difficulty === "higher" && selectedIndex !== comparisonIndex) {
      recordMistake(
        "Select the value immediately to the left of the current hole before making the comparison.",
      );

      return;
    }

    const comparisonValue = displayedProcedureValues[comparisonIndex];

    setComparisons((current) => current + 1);
    setSelectedIndex(null);

    if (comparisonValue > keyValue) {
      recordSuccess(
        `Correct comparison. ${comparisonValue} > ${keyValue}, so ${comparisonValue} must shift one place to the right.`,
      );

      setPhase("shift");
      return;
    }

    recordSuccess(
      `Correct. ${comparisonValue} ≤ ${keyValue}, so the shifting stops here.`,
    );

    setPhase("insert");
  }

  /*
   * =========================================================
   * SHIFT
   * =========================================================
   */

  function performShift() {
    if (
      phase !== "shift" ||
      keyValue === null ||
      comparisonIndex === null ||
      holeIndex === null
    ) {
      return;
    }

    const expectedShiftIndex = comparisonIndex;

    if (difficulty !== "foundation" && selectedIndex !== expectedShiftIndex) {
      recordMistake(
        "Select the larger value that must move one position to the right.",
      );

      return;
    }

    const comparisonValue = displayedProcedureValues[comparisonIndex];

    if (comparisonValue <= keyValue) {
      recordMistake(
        `${comparisonValue} should not move because it is not greater than the key ${keyValue}.`,
      );

      return;
    }

    const updated = [...displayedProcedureValues];

    updated[holeIndex] = comparisonValue;

    setProcedureValues(updated);

    const newHoleIndex = comparisonIndex;
    const nextComparisonIndex = comparisonIndex - 1;

    setHoleIndex(newHoleIndex);
    setComparisonIndex(nextComparisonIndex);

    setShifts((current) => current + 1);
    setSelectedIndex(null);

    recordSuccess(
      `Correct. ${comparisonValue} shifts one position to the right.`,
    );

    if (nextComparisonIndex < 0) {
      setPhase("insert");
      return;
    }

    setPhase("compare");
  }

  /*
   * =========================================================
   * INSERT KEY
   * =========================================================
   */

  function insertKey() {
    if (phase !== "insert" || keyValue === null || holeIndex === null) {
      return;
    }

    if (difficulty !== "foundation" && selectedIndex !== holeIndex) {
      recordMistake(
        "Select the open position where the key should be inserted.",
      );

      return;
    }

    const updated = [...displayedProcedureValues];

    updated[holeIndex] = keyValue;

    setProcedureValues(updated);

    setPassesCompleted((current) => current + 1);

    recordSuccess(
      `Correct. ${keyValue} is inserted at index ${holeIndex}. The sorted section now extends through index ${currentIndex}.`,
    );

    const nextIndex = currentIndex + 1;

    setCurrentIndex(nextIndex);

    setKeyValue(null);
    setComparisonIndex(null);
    setHoleIndex(null);
    setSelectedIndex(null);

    if (nextIndex >= updated.length) {
      setPhase("complete");
      return;
    }

    setPhase("select-key");
  }

  /*
   * =========================================================
   * FOUNDATION AUTO CONTROLS
   * =========================================================
   */

  function foundationAction() {
    if (phase === "select-key") {
      beginPass();
      return;
    }

    if (phase === "compare") {
      performComparison();
      return;
    }

    if (phase === "shift") {
      performShift();
      return;
    }

    if (phase === "insert") {
      insertKey();
    }
  }

  /*
   * =========================================================
   * LABELS
   * =========================================================
   */

  const phaseLabel =
    phase === "select-key"
      ? "Select key"
      : phase === "compare"
        ? "Compare"
        : phase === "shift"
          ? "Shift"
          : phase === "insert"
            ? "Insert key"
            : "Complete";

  const sortedBoundary =
    phase === "complete"
      ? displayedProcedureValues.length - 1
      : Math.max(0, currentIndex - 1);

  return (
    <section className="space-y-8 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      {/* ==================================================== */}
      {/* HEADER                                               */}
      {/* ==================================================== */}

      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Algorithm laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Insertion Sort Challenge
        </h2>

        <p className="mt-3 max-w-4xl leading-7 text-slate-600">
          Predict the final order and then perform insertion sort yourself by
          selecting key values, comparing backwards through the sorted section,
          shifting larger values and inserting each key into its correct
          position.
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
      {/* FINAL ANSWER CHALLENGE                               */}
      {/* ==================================================== */}

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Final-order challenge
        </p>

        <h3 className="mt-2 text-xl font-black">
          Sort this list into ascending order.
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">
          {question.values.map((value, index) => (
            <div
              key={`${value}-${index}`}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black"
            >
              {value}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label htmlFor="insertion-sort-answer" className="font-black">
          Enter the final sorted list
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Separate values using commas or spaces.
        </p>

        <input
          id="insertion-sort-answer"
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Example: 1, 3, 4, 7, 9"
          className="mt-3 w-full rounded-2xl border border-slate-300 px-5 py-4 font-mono text-xl font-black outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
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
        successMessage={`Correct. The sorted list is ${sortedValues.join(", ")}.`}
        errorMessage={`Not quite. The correct sorted order is ${sortedValues.join(", ")}.`}
        hintVisible={hintVisible}
        hint="Insertion sort treats the first value as sorted. It then takes the next value as a key and moves backwards through the sorted section until the correct insertion position is found."
        workingVisible={workingVisible}
        working={working}
        examinerTip="Insertion sort builds a sorted section one item at a time. Larger values are shifted right to create space for the key."
      />

      {/* ==================================================== */}
      {/* PROCEDURAL TRAINER                                   */}
      {/* ==================================================== */}

      <div className="border-t border-slate-200 pt-8">
        <p className="text-sm font-black uppercase tracking-widest text-violet-600">
          Hands-on algorithm practice
        </p>

        <h3 className="mt-2 text-2xl font-black">Perform Insertion Sort</h3>

        <p className="mt-2 max-w-4xl leading-7 text-slate-600">
          Build the sorted section yourself. Choose the next key, compare it
          backwards through the sorted values, shift larger values to the right
          and insert the key into the correct position.
        </p>

        {/* STATS */}

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
              Phase
            </p>

            <p className="mt-2 text-2xl font-black">{phaseLabel}</p>
          </article>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-blue-600">
              Comparisons
            </p>

            <p className="mt-2 text-2xl font-black">{comparisons}</p>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-amber-600">
              Shifts
            </p>

            <p className="mt-2 text-2xl font-black">{shifts}</p>
          </article>

          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
              Passes completed
            </p>

            <p className="mt-2 text-2xl font-black">{passesCompleted}</p>
          </article>
        </div>

        {/* CURRENT PASS INFO */}

        {phase !== "complete" && (
          <section className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <div className="grid gap-5 md:grid-cols-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                  Current pass
                </p>

                <p className="mt-2 text-xl font-black">{currentIndex}</p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                  Sorted section
                </p>

                <p className="mt-2 text-xl font-black">
                  Index 0–{sortedBoundary}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                  Key value
                </p>

                <p className="mt-2 text-xl font-black">
                  {keyValue ?? "Choose key"}
                </p>
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                  Current action
                </p>

                <p className="mt-2 text-xl font-black">{phaseLabel}</p>
              </div>
            </div>
          </section>
        )}

        {/* ARRAY */}

        <div className="mt-6 rounded-3xl bg-slate-950 p-8">
          <div className="flex flex-wrap justify-center gap-3">
            {displayedProcedureValues.map((value, index) => {
              const selected = selectedIndex === index;

              const isSorted = index <= sortedBoundary && phase !== "complete";

              const isKey = keyValue !== null && index === holeIndex;

              const isComparison =
                phase === "compare" && index === comparisonIndex;

              const isCurrentKeyCandidate =
                phase === "select-key" && index === currentIndex;

              return (
                <button
                  key={`${value}-${index}`}
                  type="button"
                  onClick={() => selectItem(index)}
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-xl font-black transition ${
                    phase === "complete"
                      ? "border-emerald-400 bg-emerald-500 text-white"
                      : selected
                        ? "border-violet-300 bg-violet-600 text-white"
                        : isKey
                          ? "border-amber-300 bg-amber-500 text-slate-950"
                          : isComparison
                            ? "border-fuchsia-300 bg-fuchsia-600 text-white"
                            : isCurrentKeyCandidate &&
                                difficulty === "foundation"
                              ? "border-blue-300 bg-blue-600 text-white"
                              : isSorted
                                ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                                : "border-slate-600 bg-slate-800 text-white hover:border-blue-400"
                  }`}
                >
                  {value}

                  <span className="absolute -bottom-7 text-xs font-bold text-slate-400">
                    {index}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-12 text-center text-sm text-slate-300">
            {phase === "select-key"
              ? difficulty === "foundation"
                ? "The next key is highlighted."
                : "Select the first unsorted value as the next key."
              : phase === "compare"
                ? difficulty === "higher"
                  ? "Select the value immediately to the left of the hole and compare it with the key."
                  : "Compare the value immediately to the left with the key."
                : phase === "shift"
                  ? difficulty === "foundation"
                    ? "Shift the highlighted larger value one place to the right."
                    : "Select the larger value that must shift one place to the right."
                  : phase === "insert"
                    ? difficulty === "foundation"
                      ? "Insert the key into the open position."
                      : "Select the open position where the key belongs."
                    : "Insertion Sort is complete."}
          </p>
        </div>

        {/* CONTROLS */}

        {phase !== "complete" && (
          <div className="mt-6 flex flex-wrap gap-3">
            {difficulty === "foundation" && (
              <button
                type="button"
                onClick={foundationAction}
                className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white"
              >
                {phase === "select-key"
                  ? "Use next key →"
                  : phase === "compare"
                    ? "Compare values →"
                    : phase === "shift"
                      ? "Shift value →"
                      : "Insert key →"}
              </button>
            )}

            {difficulty !== "foundation" && phase === "select-key" && (
              <button
                type="button"
                onClick={beginPass}
                className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white"
              >
                Confirm key
              </button>
            )}

            {difficulty !== "higher" &&
              difficulty !== "foundation" &&
              phase === "compare" && (
                <button
                  type="button"
                  onClick={performComparison}
                  className="rounded-xl bg-violet-600 px-6 py-3 font-black text-white"
                >
                  Compare with key
                </button>
              )}

            {difficulty === "higher" && phase === "compare" && (
              <button
                type="button"
                onClick={performComparison}
                className="rounded-xl bg-violet-600 px-6 py-3 font-black text-white"
              >
                Confirm comparison
              </button>
            )}

            {difficulty !== "foundation" && phase === "shift" && (
              <button
                type="button"
                onClick={performShift}
                className="rounded-xl bg-amber-500 px-6 py-3 font-black text-slate-950"
              >
                Shift selected value →
              </button>
            )}

            {difficulty !== "foundation" && phase === "insert" && (
              <button
                type="button"
                onClick={insertKey}
                className="rounded-xl bg-emerald-600 px-6 py-3 font-black text-white"
              >
                Insert key
              </button>
            )}

            <button
              type="button"
              onClick={resetProcedure}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black"
            >
              Reset procedure
            </button>
          </div>
        )}

        {/* FEEDBACK */}

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

        {/* COMPLETE */}

        {phase === "complete" && (
          <section className="mt-6 rounded-3xl border border-emerald-300 bg-emerald-50 p-6">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-700">
              Procedure complete
            </p>

            <h4 className="mt-2 text-2xl font-black text-emerald-950">
              Insertion Sort completed successfully
            </h4>

            <div className="mt-5 rounded-2xl bg-slate-950 p-6">
              <div className="flex flex-wrap justify-center gap-3">
                {displayedProcedureValues.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black text-white"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Final list
                </p>

                <p className="mt-2 font-mono font-black">
                  {displayedProcedureValues.join(", ")}
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Accuracy
                </p>

                <p className="mt-2 text-2xl font-black">{procedureAccuracy}%</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Comparisons
                </p>

                <p className="mt-2 text-2xl font-black">{comparisons}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Shifts
                </p>

                <p className="mt-2 text-2xl font-black">{shifts}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Passes
                </p>

                <p className="mt-2 text-2xl font-black">{passesCompleted}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetProcedure}
              className="mt-5 rounded-xl border border-slate-300 bg-white px-6 py-3 font-black"
            >
              Practise this list again
            </button>
          </section>
        )}
      </div>
    </section>
  );
}
