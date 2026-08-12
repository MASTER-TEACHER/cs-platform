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
  target: number;
};

type ProcedureFeedbackType = "success" | "error" | "info" | null;

function createUniqueValues(length: number): number[] {
  const values = new Set<number>();

  while (values.size < length) {
    values.add(Math.floor(Math.random() * 90) + 10);
  }

  return Array.from(values);
}

function createQuestion(difficulty: DifficultyLevel): Question {
  const length =
    difficulty === "foundation" ? 6 : difficulty === "intermediate" ? 8 : 10;

  const values = createUniqueValues(length);

  const allowMissing = difficulty !== "foundation" && Math.random() < 0.3;

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
  const expectedIndex = question.values.indexOf(question.target);

  const lines: string[] = [];

  for (let index = 0; index < question.values.length; index += 1) {
    const value = question.values[index];

    if (value === question.target) {
      lines.push(
        `Index ${index}: compare ${value} with ${question.target} → found`,
      );
      break;
    }

    lines.push(
      `Index ${index}: compare ${value} with ${question.target} → not equal`,
    );
  }

  if (expectedIndex === -1) {
    lines.push("");
    lines.push("The end of the list is reached.");
    lines.push("The target is not present, so the answer is -1.");
  } else {
    lines.push("");
    lines.push(`The target is found at index ${expectedIndex}.`);
  }

  return lines.join("\n");
}

export default function LinearSearchSimulator() {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const [visitedIndices, setVisitedIndices] = useState<number[]>([]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [procedureComplete, setProcedureComplete] = useState(false);

  const [foundProcedurally, setFoundProcedurally] = useState(false);

  const [procedureCorrectSteps, setProcedureCorrectSteps] = useState(0);

  const [procedureMistakes, setProcedureMistakes] = useState(0);

  const [procedureFeedback, setProcedureFeedback] = useState("");

  const [procedureFeedbackType, setProcedureFeedbackType] =
    useState<ProcedureFeedbackType>(null);

  const procedureAttempts = procedureCorrectSteps + procedureMistakes;

  const procedureAccuracy =
    procedureAttempts === 0
      ? 0
      : Math.round((procedureCorrectSteps / procedureAttempts) * 100);

  function resetProcedure() {
    setCurrentIndex(0);
    setVisitedIndices([]);
    setSelectedIndex(null);

    setProcedureComplete(false);
    setFoundProcedurally(false);

    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);

    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function handleNewQuestion() {
    setAnswer("");
    resetProcedure();
    newQuestion();
  }

  function handleDifficultyChange(nextDifficulty: DifficultyLevel) {
    setAnswer("");
    resetProcedure();
    changeDifficulty(nextDifficulty);
  }

  function recordProcedureMistake(message: string) {
    setProcedureMistakes((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("error");
  }

  function recordProcedureSuccess(message: string) {
    setProcedureCorrectSteps((current) => current + 1);
    setProcedureFeedback(message);
    setProcedureFeedbackType("success");
  }

  /*
   * Foundation:
   * current item is highlighted automatically.
   *
   * Intermediate / Higher:
   * student must click the next correct index.
   */
  function selectIndex(index: number) {
    if (difficulty === "foundation" || procedureComplete) {
      return;
    }

    setSelectedIndex(index);
    setProcedureFeedback("");
    setProcedureFeedbackType(null);
  }

  function checkCurrentValue(indexToCheck: number) {
    const value = question.values[indexToCheck];

    if (value === undefined) {
      return;
    }

    setVisitedIndices((current) =>
      current.includes(indexToCheck) ? current : [...current, indexToCheck],
    );

    /*
     * Target found.
     */
    if (value === question.target) {
      recordProcedureSuccess(
        `Correct. ${value} matches the target ${question.target}. The search stops at index ${indexToCheck}.`,
      );

      setFoundProcedurally(true);
      setProcedureComplete(true);
      setSelectedIndex(null);

      return;
    }

    /*
     * Not found yet.
     */
    recordProcedureSuccess(
      `Correct. ${value} does not match ${question.target}, so Linear Search moves to the next index.`,
    );

    if (indexToCheck >= question.values.length - 1) {
      setProcedureComplete(true);
      setFoundProcedurally(false);

      setProcedureFeedback(
        `Correct. ${value} does not match ${question.target}. The end of the list has been reached, so the target is not present.`,
      );

      setProcedureFeedbackType("success");
      setSelectedIndex(null);

      return;
    }

    setCurrentIndex(indexToCheck + 1);
    setSelectedIndex(null);
  }

  function handleCheckNext() {
    if (procedureComplete) {
      return;
    }

    /*
     * Foundation automatically uses the correct current index.
     */
    if (difficulty === "foundation") {
      checkCurrentValue(currentIndex);
      return;
    }

    if (selectedIndex === null) {
      recordProcedureMistake(
        "Select the next item that Linear Search should inspect.",
      );

      return;
    }

    if (selectedIndex !== currentIndex) {
      if (selectedIndex < currentIndex) {
        recordProcedureMistake(
          `Index ${selectedIndex} has already been passed. Linear Search continues sequentially from index ${currentIndex}.`,
        );
      } else {
        recordProcedureMistake(
          `You cannot skip ahead to index ${selectedIndex}. Linear Search must inspect index ${currentIndex} next.`,
        );
      }

      return;
    }

    checkCurrentValue(selectedIndex);
  }

  /*
   * Higher students must explicitly recognise when the current value
   * is the target instead of simply pressing Check next.
   */
  function handleFound() {
    if (difficulty !== "higher" || procedureComplete) {
      return;
    }

    if (selectedIndex === null) {
      recordProcedureMistake(
        "Select the value you believe matches the target first.",
      );

      return;
    }

    if (selectedIndex !== currentIndex) {
      recordProcedureMistake(
        `Linear Search must inspect index ${currentIndex} before any later item.`,
      );

      return;
    }

    const value = question.values[selectedIndex];

    if (value !== question.target) {
      recordProcedureMistake(
        `${value} does not equal ${question.target}, so the target has not been found.`,
      );

      return;
    }

    setVisitedIndices((current) =>
      current.includes(selectedIndex) ? current : [...current, selectedIndex],
    );

    setProcedureCorrectSteps((current) => current + 1);

    setProcedureFeedback(
      `Correct. ${value} equals ${question.target}. Linear Search stops at index ${selectedIndex}.`,
    );

    setProcedureFeedbackType("success");
    setFoundProcedurally(true);
    setProcedureComplete(true);
  }

  return (
    <section className="space-y-8 rounded-3xl border border-blue-200 bg-white p-6 shadow-sm md:p-8">
      <header>
        <p className="text-sm font-black uppercase tracking-widest text-blue-600">
          Algorithm laboratory
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950">
          Linear Search Challenge
        </h2>

        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Predict where a target will be found, then perform Linear Search
          yourself by inspecting the list in the correct order.
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

      <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          Final-answer challenge
        </p>

        <h3 className="mt-2 text-xl font-black">
          At which index will {question.target} be found?
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          Indexing starts at 0. Enter -1 if the target is not present.
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
        <label htmlFor="linear-search-answer" className="font-black">
          Your answer
        </label>

        <input
          id="linear-search-answer"
          type="number"
          value={answer}
          disabled={checked}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Enter the index"
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
        successMessage={
          expectedIndex === -1
            ? "Correct. The target is not present, so the answer is -1."
            : `Correct. The target is found at index ${expectedIndex}.`
        }
        errorMessage={`Not quite. The correct answer is ${expectedIndex}.`}
        hintVisible={hintVisible}
        hint="Linear Search starts at index 0 and checks every value from left to right until the target is found."
        workingVisible={workingVisible}
        working={working}
        examinerTip="Linear Search checks items sequentially. It does not require the data to be sorted."
      />

      {/* ==================================================== */}
      {/* PROCEDURAL TRAINER                                   */}
      {/* ==================================================== */}

      <div className="border-t border-slate-200 pt-8">
        <p className="text-sm font-black uppercase tracking-widest text-violet-600">
          Hands-on algorithm practice
        </p>

        <h3 className="mt-2 text-2xl font-black">Perform Linear Search</h3>

        <p className="mt-2 max-w-4xl leading-7 text-slate-600">
          Follow Linear Search exactly. Inspect each item sequentially and stop
          only when the target is found or the end of the list is reached.
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
              Items checked
            </p>

            <p className="mt-2 text-2xl font-black">{visitedIndices.length}</p>
          </article>
        </div>

        <section className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Target
              </p>

              <p className="mt-2 text-2xl font-black">{question.target}</p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Next required index
              </p>

              <p className="mt-2 text-2xl font-black">
                {procedureComplete ? "Complete" : currentIndex}
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-widest text-violet-600">
                Difficulty behaviour
              </p>

              <p className="mt-2 font-black">
                {difficulty === "foundation"
                  ? "Next item highlighted"
                  : difficulty === "intermediate"
                    ? "Select the next legal item"
                    : "Select item and recognise when target is found"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6 rounded-3xl bg-slate-950 p-7">
          <div className="flex flex-wrap justify-center gap-4">
            {question.values.map((value, index) => {
              const visited = visitedIndices.includes(index);

              const automaticCurrent =
                difficulty === "foundation" &&
                index === currentIndex &&
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
                  disabled={difficulty === "foundation" || procedureComplete}
                  onClick={() => selectIndex(index)}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-2xl font-black transition ${
                    found
                      ? "border-emerald-300 bg-emerald-500 text-white"
                      : selected || automaticCurrent
                        ? "border-blue-300 bg-blue-600 text-white"
                        : visited
                          ? "border-slate-500 bg-slate-700 text-slate-300"
                          : "border-slate-600 bg-slate-800 text-white hover:border-blue-400"
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
                  Target found. Linear Search is complete.
                </p>
              ) : (
                <p className="font-black text-amber-300">
                  End of list reached. Target not found.
                </p>
              )
            ) : difficulty === "foundation" ? (
              <p>
                The next required item is highlighted. Check it against the
                target.
              </p>
            ) : selectedIndex === null ? (
              <p>Select the next item Linear Search must inspect.</p>
            ) : (
              <p>Selected index {selectedIndex}. Decide the next action.</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCheckNext}
            disabled={procedureComplete}
            className="rounded-xl bg-blue-600 px-6 py-3 font-black text-white disabled:bg-slate-300"
          >
            Check next item
          </button>

          {difficulty === "higher" && (
            <button
              type="button"
              onClick={handleFound}
              disabled={procedureComplete}
              className="rounded-xl border border-emerald-300 bg-emerald-50 px-6 py-3 font-black text-emerald-800 disabled:opacity-40"
            >
              Target found
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
              Linear Search completed
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
