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

type ProcedureFeedbackType = "success" | "error" | "info" | null;

function createValues(length: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * 20) + 1);
}

function createQuestion(difficulty: DifficultyLevel): Question {
  return {
    values: createValues(
      difficulty === "foundation" ? 5 : difficulty === "intermediate" ? 6 : 7,
    ),
  };
}

function normaliseList(value: string): number[] {
  return value
    .split(/[\s,]+/)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

export default function BubbleSortSimulator() {
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
   * ---------------------------------------------------------
   * Scored challenge
   * ---------------------------------------------------------
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

  /*
   * ---------------------------------------------------------
   * Procedural trainer state
   * ---------------------------------------------------------
   */

  const [procedureValues, setProcedureValues] = useState<number[]>(
    question.values,
  );

  const [compareIndex, setCompareIndex] = useState(0);
  const [pass, setPass] = useState(1);

  const [swappedInPass, setSwappedInPass] = useState(false);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const [procedureComplete, setProcedureComplete] = useState(false);

  const [awaitingEndPass, setAwaitingEndPass] = useState(false);

  const [procedureCorrectSteps, setProcedureCorrectSteps] = useState(0);

  const [procedureMistakes, setProcedureMistakes] = useState(0);

  const [passesCompleted, setPassesCompleted] = useState(0);

  const [procedureFeedback, setProcedureFeedback] = useState("");

  const [procedureFeedbackType, setProcedureFeedbackType] =
    useState<ProcedureFeedbackType>(null);

  const procedureAttempts = procedureCorrectSteps + procedureMistakes;

  const procedureAccuracy =
    procedureAttempts === 0
      ? 0
      : Math.round((procedureCorrectSteps / procedureAttempts) * 100);

  const pairLeft = compareIndex;
  const pairRight = compareIndex + 1;

  const currentLeft = procedureValues[pairLeft];
  const currentRight = procedureValues[pairRight];

  const shouldSwap =
    currentLeft !== undefined &&
    currentRight !== undefined &&
    currentLeft > currentRight;

  const lastComparisonIndex = procedureValues.length - pass - 1;

  const currentPairIsLastInPass = compareIndex >= lastComparisonIndex;

  /*
   * Foundation:
   * simulator automatically identifies the pair.
   *
   * Intermediate / Higher:
   * student selects the pair.
   */
  const pairReady =
    difficulty === "foundation" ||
    (selectedIndices.length === 2 &&
      selectedIndices.includes(pairLeft) &&
      selectedIndices.includes(pairRight));

  function resetProcedure(values = question.values) {
    setProcedureValues([...values]);
    setCompareIndex(0);
    setPass(1);
    setSwappedInPass(false);
    setSelectedIndices([]);
    setProcedureComplete(false);
    setAwaitingEndPass(false);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
    setPassesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function handleNewQuestion() {
    setAnswer("");

    /*
     * We clear the old procedure immediately.
     * When the hook generates the next question, the fallback rendering
     * below uses question.values until the student starts the trainer.
     */
    setProcedureValues([]);
    setCompareIndex(0);
    setPass(1);
    setSwappedInPass(false);
    setSelectedIndices([]);
    setProcedureComplete(false);
    setAwaitingEndPass(false);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
    setPassesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    newQuestion();
  }

  function handleDifficultyChange(nextDifficulty: DifficultyLevel) {
    setAnswer("");

    setProcedureValues([]);
    setCompareIndex(0);
    setPass(1);
    setSwappedInPass(false);
    setSelectedIndices([]);
    setProcedureComplete(false);
    setAwaitingEndPass(false);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
    setPassesCompleted(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    changeDifficulty(nextDifficulty);
  }

  /*
   * If a new question has been generated, procedureValues may temporarily
   * be empty. In that case use the new question list.
   */
  const displayedProcedureValues =
    procedureValues.length === question.values.length
      ? procedureValues
      : question.values;

  function ensureProcedureInitialised(): number[] {
    if (procedureValues.length === question.values.length) {
      return procedureValues;
    }

    const initial = [...question.values];

    setProcedureValues(initial);

    return initial;
  }

  function selectProcedureValue(index: number) {
    if (difficulty === "foundation" || procedureComplete || awaitingEndPass) {
      return;
    }

    setProcedureFeedback("");
    setProcedureFeedbackType(null);

    setSelectedIndices((current) => {
      if (current.includes(index)) {
        return current.filter((item) => item !== index);
      }

      if (current.length >= 2) {
        return [index];
      }

      return [...current, index];
    });
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

  function validateSelectedPair(): boolean {
    if (difficulty === "foundation") {
      return true;
    }

    if (selectedIndices.length !== 2) {
      recordMistake(
        "Select exactly two adjacent values before choosing Keep or Swap.",
      );

      return false;
    }

    const ordered = [...selectedIndices].sort((a, b) => a - b);

    if (ordered[1] - ordered[0] !== 1) {
      recordMistake(
        "Bubble sort compares adjacent values only. Select two neighbouring items.",
      );

      return false;
    }

    if (ordered[0] !== pairLeft || ordered[1] !== pairRight) {
      recordMistake(
        `That is not the next comparison. Bubble sort must now compare index ${pairLeft} with index ${pairRight}.`,
      );

      return false;
    }

    return true;
  }

  function advanceAfterCorrectDecision(didSwap: boolean, nextValues: number[]) {
    const nextSwappedInPass = swappedInPass || didSwap;

    setProcedureValues(nextValues);
    setSwappedInPass(nextSwappedInPass);
    setSelectedIndices([]);

    /*
     * We have reached the end of the current pass.
     */
    if (currentPairIsLastInPass) {
      /*
       * Higher students must explicitly recognise the end of a pass.
       */
      if (difficulty === "higher") {
        setAwaitingEndPass(true);

        setProcedureFeedback(
          "Correct decision. You have reached the end of this pass. Decide what should happen next.",
        );

        setProcedureFeedbackType("info");

        return;
      }

      finishPass(nextSwappedInPass, nextValues);

      return;
    }

    setCompareIndex((current) => current + 1);
  }

  function finishPass(hadSwap: boolean, currentValues: number[]) {
    setPassesCompleted((current) => current + 1);
    setAwaitingEndPass(false);
    setSelectedIndices([]);

    /*
     * No swap during a complete pass means the list is sorted.
     */
    if (!hadSwap) {
      setProcedureComplete(true);

      setProcedureFeedback(
        "Excellent. A complete pass produced no swaps, so the list is sorted.",
      );

      setProcedureFeedbackType("success");

      return;
    }

    /*
     * Every pass fixes at least one value at the right-hand side.
     */
    if (pass >= currentValues.length - 1) {
      setProcedureComplete(true);

      setProcedureFeedback(
        "Excellent. All required passes are complete and the list is sorted.",
      );

      setProcedureFeedbackType("success");

      return;
    }

    setPass((current) => current + 1);
    setCompareIndex(0);
    setSwappedInPass(false);

    setProcedureFeedback(
      `Pass ${pass} complete. Begin pass ${pass + 1} from the left-hand side.`,
    );

    setProcedureFeedbackType("success");
  }

  function handleSwap() {
    if (procedureComplete || awaitingEndPass) {
      return;
    }

    const currentValues = ensureProcedureInitialised();

    if (!validateSelectedPair()) {
      return;
    }

    const left = currentValues[pairLeft];
    const right = currentValues[pairRight];

    if (left === undefined || right === undefined) {
      return;
    }

    if (left <= right) {
      recordMistake(
        `${left} is not greater than ${right}. These values are already in ascending order, so they should be kept.`,
      );

      return;
    }

    const nextValues = [...currentValues];

    [nextValues[pairLeft], nextValues[pairRight]] = [
      nextValues[pairRight],
      nextValues[pairLeft],
    ];

    recordSuccess(
      `Correct. ${left} > ${right}, so the adjacent values must be swapped.`,
    );

    advanceAfterCorrectDecision(true, nextValues);
  }

  function handleKeep() {
    if (procedureComplete || awaitingEndPass) {
      return;
    }

    const currentValues = ensureProcedureInitialised();

    if (!validateSelectedPair()) {
      return;
    }

    const left = currentValues[pairLeft];
    const right = currentValues[pairRight];

    if (left === undefined || right === undefined) {
      return;
    }

    if (left > right) {
      recordMistake(
        `${left} > ${right}. Bubble sort requires these adjacent values to be swapped.`,
      );

      return;
    }

    recordSuccess(
      `Correct. ${left} ≤ ${right}, so the values remain in this order.`,
    );

    advanceAfterCorrectDecision(false, [...currentValues]);
  }

  function handleEndPass() {
    if (difficulty !== "higher" || procedureComplete) {
      return;
    }

    if (!awaitingEndPass) {
      recordMistake(
        "The pass is not finished yet. Continue comparing the next adjacent pair.",
      );

      return;
    }

    setProcedureCorrectSteps((current) => current + 1);

    finishPass(
      swappedInPass ||
        /*
         * If the final comparison was a swap, procedureValues has already
         * changed. We can determine whether the current pass contained a
         * swap by comparing against the sorted state through swappedInPass,
         * but the final action may have been the first swap in the pass.
         *
         * The safest indicator is that the list at this point differs from
         * the pass-start ordering only through valid swaps. For the purpose
         * of early termination, a pass with any final swap must continue.
         *
         * currentPairIsLastInPass plus shouldSwap before mutation cannot be
         * used here after state updates, so we conservatively treat an end
         * pass as having swaps unless swappedInPass is false AND the list is
         * currently sorted.
         */
        !displayedProcedureValues.every(
          (value, index, array) => index === 0 || array[index - 1] <= value,
        ),
      displayedProcedureValues,
    );
  }

  const working = `Starting list:

${question.values.join(", ")}

Bubble sort procedure:

1. Start at the left of the list.
2. Compare two adjacent values.
3. If the left value is greater than the right value, swap them.
4. Otherwise keep them in the same order.
5. Move one position to the right.
6. Continue until the end of the pass.
7. Repeat passes until a full pass produces no swaps.

Final sorted list:

${sortedValues.join(", ")}`;

  const automaticPairIndices =
    difficulty === "foundation" ? [pairLeft, pairRight] : [];

  const highlightedIndices =
    difficulty === "foundation" ? automaticPairIndices : selectedIndices;

  return (
    <section className="space-y-8 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Algorithm laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black">Bubble Sort Challenge</h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Predict the final order, then perform Bubble Sort yourself using the
          correct comparisons, swaps and passes.
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

      {/* ---------------------------------------------------- */}
      {/* Scored final-list challenge                           */}
      {/* ---------------------------------------------------- */}

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Final-order challenge
        </p>

        <h3 className="mt-2 text-xl font-black">
          Sort this list into ascending order.
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">
          {question.values.map((value, itemIndex) => (
            <div
              key={`${value}-${itemIndex}`}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black"
            >
              {value}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 p-6">
        <label htmlFor="bubble-answer" className="font-black">
          Enter the final sorted list
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Separate values using commas or spaces.
        </p>

        <input
          id="bubble-answer"
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Example: 2, 3, 6, 7, 9"
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
        hint="Bubble sort compares adjacent values. If the value on the left is larger, swap the pair."
        workingVisible={workingVisible}
        working={working}
        examinerTip="Bubble sort compares adjacent items, swaps incorrectly ordered pairs and repeats passes until a complete pass produces no swaps."
      />

      {/* ---------------------------------------------------- */}
      {/* Hands-on procedural trainer                           */}
      {/* ---------------------------------------------------- */}

      <div className="border-t border-slate-200 pt-8">
        <p className="text-sm font-black uppercase tracking-widest text-violet-600">
          Hands-on algorithm practice
        </p>

        <h3 className="mt-2 text-2xl font-black">Perform Bubble Sort</h3>

        <p className="mt-2 max-w-4xl leading-7 text-slate-600">
          Follow the actual Bubble Sort procedure. Make each comparison and
          decide whether the adjacent values should be kept or swapped.
        </p>

        {/* Procedural stats */}

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
              Passes completed
            </p>

            <p className="mt-2 text-2xl font-black">{passesCompleted}</p>
          </article>
        </div>

        {/* Current procedure status */}

        <section className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Current pass
              </p>

              <p className="mt-2 text-2xl font-black">
                {procedureComplete ? "Complete" : pass}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Current comparison
              </p>

              <p className="mt-2 text-2xl font-black">
                {procedureComplete
                  ? "Finished"
                  : awaitingEndPass
                    ? "End of pass"
                    : `${pairLeft} and ${pairRight}`}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Difficulty behaviour
              </p>

              <p className="mt-2 font-black">
                {difficulty === "foundation"
                  ? "Pair highlighted for you"
                  : difficulty === "intermediate"
                    ? "Select the correct adjacent pair"
                    : "Select pair and recognise pass completion"}
              </p>
            </div>
          </div>
        </section>

        {/* Values */}

        <div className="mt-6 rounded-3xl bg-slate-950 p-7">
          <div className="flex flex-wrap justify-center gap-4">
            {displayedProcedureValues.map((value, itemIndex) => {
              const selected = highlightedIndices.includes(itemIndex);

              const fixed =
                itemIndex > displayedProcedureValues.length - pass - 1;

              return (
                <button
                  key={`${value}-${itemIndex}`}
                  type="button"
                  disabled={
                    difficulty === "foundation" ||
                    procedureComplete ||
                    awaitingEndPass
                  }
                  onClick={() => selectProcedureValue(itemIndex)}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-2xl font-black transition ${
                    selected
                      ? "border-blue-300 bg-blue-600 text-white"
                      : fixed
                        ? "border-emerald-400 bg-emerald-500 text-white"
                        : "border-slate-600 bg-slate-800 text-white hover:border-blue-400"
                  }`}
                >
                  <span>{value}</span>

                  <span className="absolute -bottom-6 text-xs font-bold text-slate-400">
                    {itemIndex}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 text-center text-sm text-slate-300">
            {procedureComplete ? (
              <p className="font-black text-emerald-300">Sorting complete.</p>
            ) : awaitingEndPass ? (
              <p className="font-black text-amber-300">
                You have reached the end of this pass.
              </p>
            ) : difficulty === "foundation" ? (
              <p>
                The current adjacent pair is highlighted. Decide whether to keep
                or swap it.
              </p>
            ) : selectedIndices.length === 0 ? (
              <p>
                Select the next two adjacent values that Bubble Sort should
                compare.
              </p>
            ) : selectedIndices.length === 1 ? (
              <p>Select the second adjacent value.</p>
            ) : pairReady ? (
              <p>Correct pair selected. Decide whether to Keep or Swap.</p>
            ) : (
              <p>
                Decide whether this is the correct pair for the next comparison.
              </p>
            )}
          </div>
        </div>

        {/* Actions */}

        <div className="mt-6 flex flex-wrap gap-3">
          {!awaitingEndPass && !procedureComplete && (
            <>
              <button
                type="button"
                onClick={handleKeep}
                className="rounded-xl border border-emerald-300 bg-emerald-50 px-6 py-3 font-black text-emerald-800 transition hover:bg-emerald-100"
              >
                Keep order
              </button>

              <button
                type="button"
                onClick={handleSwap}
                className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white transition hover:bg-blue-700"
              >
                Swap
              </button>
            </>
          )}

          {difficulty === "higher" && awaitingEndPass && !procedureComplete && (
            <button
              type="button"
              onClick={handleEndPass}
              className="rounded-xl bg-violet-600 px-6 py-3 font-black text-white transition hover:bg-violet-700"
            >
              End pass →
            </button>
          )}

          <button
            type="button"
            onClick={() => resetProcedure()}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-black text-slate-800"
          >
            Reset procedure
          </button>
        </div>

        {/* Procedure feedback */}

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
              Bubble Sort completed successfully
            </h4>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Final list
                </p>

                <p className="mt-2 font-mono text-lg font-black">
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
