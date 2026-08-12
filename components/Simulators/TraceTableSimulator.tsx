"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";
import type { SimulatorDifficulty as SimulatorDifficultyType } from "@/components/Simulators/common/useSimulator";

type TraceVariable = "i" | "j" | "total" | "output";

type TraceRow = {
  i: number | string;
  j?: number | string;
  total: number | string;
  output: number | string;
};

type TraceChallenge = {
  title: string;
  description: string;
  pseudocode: string;
  variables: TraceVariable[];
  rows: TraceRow[];
  finalAnswer: string;
  hint: string;
  workedSolution: string;
  examinerTip: string;
};

type Feedback = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
} | null;

const XP_BY_DIFFICULTY: Record<SimulatorDifficultyType, number> = {
  foundation: 10,
  intermediate: 15,
  higher: 20,
};

function normaliseAnswer(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "").replace(/;/g, ",");
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function makeFoundationChallenge(): TraceChallenge {
  const start = Math.floor(Math.random() * 3) + 1;
  const end = start + Math.floor(Math.random() * 3) + 2;

  const rows: TraceRow[] = [];
  let total = 0;

  for (let i = start; i <= end; i += 1) {
    total += i;

    rows.push({
      i,
      total,
      output: "",
    });
  }

  // OUTPUT happens after the loop has finished,
  // so give it its own trace-table row.
  rows.push({
    i: "",
    total,
    output: total,
  });

  if (rows.length > 0) {
    rows[rows.length - 1] = {
      ...rows[rows.length - 1],
      output: total,
    };
  }

  return {
    title: "Running Total",
    description:
      "Trace a simple count-controlled loop that adds each loop value to a running total.",
    pseudocode: `total = 0

FOR i = ${start} TO ${end}
    total = total + i
NEXT i

OUTPUT total`,
    variables: ["i", "total", "output"],
    rows,
    finalAnswer: String(total),
    hint: "Start with total = 0. Work through the loop one value of i at a time and update total after every addition.",
    workedSolution: rows
      .map(
        (row, index) =>
          `Step ${index + 1}: i = ${row.i}, total = ${row.total}${
            row.output !== "" ? `, OUTPUT ${row.output}` : ""
          }`,
      )
      .join("\n"),
    examinerTip:
      "Update variables in the exact order shown by the algorithm. Do not use the next loop value too early.",
  };
}

function makeIntermediateChallenge(): TraceChallenge {
  const start = Math.floor(Math.random() * 3) + 1;
  const end = start + Math.floor(Math.random() * 3) + 2;
  const multiplier = Math.floor(Math.random() * 3) + 2;

  const rows: TraceRow[] = [];
  let total = 0;

  for (let i = start; i <= end; i += 1) {
    total += i * multiplier;

    rows.push({
      i,
      total,
      output: "",
    });
  }

  rows.push({
    i: "",
    total,
    output: total,
  });

  if (rows.length > 0) {
    rows[rows.length - 1] = {
      ...rows[rows.length - 1],
      output: total,
    };
  }

  return {
    title: "Calculated Running Total",
    description:
      "Trace a loop in which the loop variable is used inside a calculation before the running total is updated.",
    pseudocode: `total = 0

FOR i = ${start} TO ${end}
    total = total + (i * ${multiplier})
NEXT i

OUTPUT total`,
    variables: ["i", "total", "output"],
    rows,
    finalAnswer: String(total),
    hint: `For each pass, calculate i × ${multiplier} first and then add that value to total.`,
    workedSolution: rows
      .map(
        (row, index) =>
          `Step ${index + 1}: i = ${row.i}, total = ${row.total}${
            row.output !== "" ? `, OUTPUT ${row.output}` : ""
          }`,
      )
      .join("\n"),
    examinerTip:
      "When an expression appears on the right-hand side of an assignment, calculate that expression before updating the variable on the left.",
  };
}

function makeHigherChallenge(): TraceChallenge {
  const outerEnd = randomItem([2, 3]);
  const innerEnd = randomItem([2, 3]);

  const rows: TraceRow[] = [];
  let total = 0;

  for (let i = 1; i <= outerEnd; i += 1) {
    for (let j = 1; j <= innerEnd; j += 1) {
      total += i + j;

      rows.push({
        i,
        j,
        total,
        output: "",
      });
    }
  }

  // OUTPUT occurs after both loops have completed.
  rows.push({
    i: "",
    j: "",
    total,
    output: total,
  });

  if (rows.length > 0) {
    rows[rows.length - 1] = {
      ...rows[rows.length - 1],
      output: total,
    };
  }

  return {
    title: "Nested Iteration",
    description:
      "Trace nested loops and determine how frequently the inner statement executes.",
    pseudocode: `total = 0

FOR i = 1 TO ${outerEnd}
    FOR j = 1 TO ${innerEnd}
        total = total + i + j
    NEXT j
NEXT i

OUTPUT total`,
    variables: ["i", "j", "total", "output"],
    rows,
    finalAnswer: String(total),
    hint: "Complete every value of the inner loop j before increasing i. Update total once for every inner-loop execution.",
    workedSolution: rows
      .map(
        (row, index) =>
          `Step ${index + 1}: i = ${row.i}, j = ${row.j}, total = ${
            row.total
          }${row.output !== "" ? `, OUTPUT ${row.output}` : ""}`,
      )
      .join("\n"),
    examinerTip:
      "With nested loops, the inner loop completes all of its iterations for every single iteration of the outer loop.",
  };
}

function createChallenge(difficulty: SimulatorDifficultyType): TraceChallenge {
  if (difficulty === "higher") {
    return makeHigherChallenge();
  }

  if (difficulty === "intermediate") {
    return makeIntermediateChallenge();
  }

  return makeFoundationChallenge();
}

export default function TraceTableSimulator() {
  const [difficulty, setDifficulty] =
    useState<SimulatorDifficultyType>("foundation");

  const [challenge, setChallenge] = useState<TraceChallenge>(() =>
    createChallenge("foundation"),
  );

  const [answer, setAnswer] = useState("");

  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  const [questionChecked, setQuestionChecked] = useState(false);
  const [questionCorrect, setQuestionCorrect] = useState(false);

  const [showHint, setShowHint] = useState(false);
  const [showWorking, setShowWorking] = useState(false);

  const [feedback, setFeedback] = useState<Feedback>(null);

  // Hands-on procedure state
  const [currentRow, setCurrentRow] = useState(0);
  const [rowInputs, setRowInputs] = useState<Record<string, string>>({});
  const [procedureCorrectSteps, setProcedureCorrectSteps] = useState(0);
  const [procedureMistakes, setProcedureMistakes] = useState(0);
  const [procedureFeedback, setProcedureFeedback] = useState<Feedback>(null);
  const [showProcedureHint, setShowProcedureHint] = useState(false);
  const [showProcedureWorking, setShowProcedureWorking] = useState(false);

  const accuracy = useMemo(() => {
    if (attempts === 0) return 0;

    return Math.round((correct / attempts) * 100);
  }, [attempts, correct]);

  const procedureAccuracy = useMemo(() => {
    const total = procedureCorrectSteps + procedureMistakes;

    if (total === 0) return 0;

    return Math.round((procedureCorrectSteps / total) * 100);
  }, [procedureCorrectSteps, procedureMistakes]);

  const procedureComplete = currentRow >= challenge.rows.length;

  function clearQuestionInteraction() {
    setAnswer("");
    setQuestionChecked(false);
    setQuestionCorrect(false);
    setShowHint(false);
    setShowWorking(false);
    setFeedback(null);
  }

  function resetProcedure() {
    setCurrentRow(0);
    setRowInputs({});
    setProcedureCorrectSteps(0);
    setProcedureMistakes(0);
    setProcedureFeedback(null);
    setShowProcedureHint(false);
    setShowProcedureWorking(false);
  }

  function loadChallenge(nextDifficulty: SimulatorDifficultyType) {
    const nextChallenge = createChallenge(nextDifficulty);

    setChallenge(nextChallenge);
    clearQuestionInteraction();
    resetProcedure();
  }

  function handleDifficultyChange(nextDifficulty: SimulatorDifficultyType) {
    setDifficulty(nextDifficulty);
    loadChallenge(nextDifficulty);
  }

  function newQuestion() {
    loadChallenge(difficulty);
  }

  function tryAgain() {
    setAnswer("");
    setQuestionChecked(false);
    setQuestionCorrect(false);
    setFeedback(null);
  }

  function checkFinalAnswer() {
    if (!answer.trim()) {
      setFeedback({
        type: "error",
        title: "Enter an answer",
        message:
          "Complete the trace mentally or using the table below, then enter the final output.",
      });
      return;
    }

    const isCorrect =
      normaliseAnswer(answer) === normaliseAnswer(challenge.finalAnswer);

    /*
     * Analytics only change the first time this
     * particular question is checked.
     */
    if (!questionChecked) {
      setAttempts((current) => current + 1);

      if (isCorrect) {
        setCorrect((current) => current + 1);
        setStreak((current) => current + 1);
        setXp((current) => current + XP_BY_DIFFICULTY[difficulty]);
      } else {
        setStreak(0);
      }
    }

    setQuestionChecked(true);
    setQuestionCorrect(isCorrect);

    if (isCorrect) {
      setFeedback({
        type: "success",
        title: "✓ Correct",
        message: `Correct. The final output is ${challenge.finalAnswer}. You earned ${
          questionChecked ? 0 : XP_BY_DIFFICULTY[difficulty]
        } XP.`,
      });
    } else {
      setFeedback({
        type: "error",
        title: "✕ Not quite",
        message:
          "The final output is not correct. Trace the variables one execution step at a time and try again.",
      });
    }
  }

  function updateRowInput(variable: TraceVariable, value: string) {
    setRowInputs((current) => ({
      ...current,
      [variable]: value,
    }));

    setProcedureFeedback(null);
  }

  function checkProcedureRow() {
    if (procedureComplete) return;

    const expectedRow = challenge.rows[currentRow];

    const variablesToCheck = challenge.variables.filter((variable) => {
      const expectedValue = expectedRow[variable];

      return expectedValue !== "" && expectedValue !== undefined;
    });

    const missingVariable = variablesToCheck.find(
      (variable) => !String(rowInputs[variable] ?? "").trim(),
    );

    if (missingVariable) {
      setProcedureFeedback({
        type: "error",
        title: "Complete the row",
        message: `Enter a value for ${missingVariable} before checking this trace-table row.`,
      });
      return;
    }

    const incorrectVariable = variablesToCheck.find((variable) => {
      const expected = String(expectedRow[variable] ?? "");

      const actual = String(rowInputs[variable] ?? "");

      return normaliseAnswer(actual) !== normaliseAnswer(expected);
    });

    if (incorrectVariable) {
      setProcedureMistakes((current) => current + 1);

      setProcedureFeedback({
        type: "error",
        title: "✕ Try that row again",
        message: `The value entered for ${incorrectVariable} is not correct. Follow the pseudocode in execution order and recalculate this row.`,
      });

      return;
    }

    setProcedureCorrectSteps((current) => current + 1);

    const nextRow = currentRow + 1;

    if (nextRow >= challenge.rows.length) {
      setCurrentRow(nextRow);

      setProcedureFeedback({
        type: "success",
        title: "✓ Trace table complete",
        message: `Excellent. You traced every execution step correctly. The final output is ${challenge.finalAnswer}.`,
      });
    } else {
      setCurrentRow(nextRow);
      setRowInputs({});

      setProcedureFeedback({
        type: "success",
        title: "✓ Correct row",
        message: `Row ${
          currentRow + 1
        } is correct. Now calculate the next execution step.`,
      });
    }
  }

  const currentExpectedRow = !procedureComplete
    ? challenge.rows[currentRow]
    : null;

  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
        Algorithm Laboratory
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Trace Table Challenge
      </h2>

      <p className="mt-2 max-w-3xl text-slate-600">
        Predict the final result and then execute the algorithm yourself by
        calculating every trace-table row.
      </p>

      <div className="mt-7">
        <SimulatorDifficulty
          value={difficulty}
          onChange={handleDifficultyChange}
        />
      </div>

      <div className="mt-6">
        <SimulatorStats
          attempts={attempts}
          correct={correct}
          accuracy={accuracy}
          xp={xp}
          streak={streak}
        />
      </div>

      {/* Current challenge */}
      <section className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
          Current challenge
        </p>

        <h3 className="mt-2 text-xl font-black text-slate-950">
          {challenge.title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {challenge.description}
        </p>
      </section>

      {/* Pseudocode */}
      <section className="mt-5">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Pseudocode
        </p>

        <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-6 font-mono text-sm leading-8 text-white">
          {challenge.pseudocode}
        </pre>
      </section>

      {/* Final answer challenge */}
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <label className="font-black text-slate-950">
          What value or values are output?
        </label>

        <p className="mt-1 text-xs text-slate-500">
          If there is more than one output, separate the values using commas.
        </p>

        <input
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);

            if (!questionChecked) {
              setFeedback(null);
            }
          }}
          disabled={questionChecked && questionCorrect}
          placeholder="Enter the final output"
          className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono font-bold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={checkFinalAnswer}
            disabled={questionChecked && questionCorrect}
            className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white disabled:bg-slate-300"
          >
            {questionChecked ? "Answer checked" : "Check answer"}
          </button>

          <button
            type="button"
            onClick={() => setShowHint((current) => !current)}
            className="rounded-xl border border-amber-400 bg-amber-50 px-5 py-3 font-black text-amber-900"
          >
            {showHint ? "Hide hint" : "Hint"}
          </button>

          <button
            type="button"
            onClick={() => setShowWorking((current) => !current)}
            className="rounded-xl border border-violet-300 bg-violet-50 px-5 py-3 font-black text-violet-800"
          >
            {showWorking ? "Hide working" : "Show working"}
          </button>

          <button
            type="button"
            onClick={tryAgain}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-800"
          >
            Try again
          </button>

          <button
            type="button"
            onClick={newQuestion}
            className="rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 font-black text-blue-700"
          >
            New question
          </button>
        </div>
      </section>

      {showHint && (
        <section className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
            Hint
          </p>

          <p className="mt-2 leading-7 text-amber-950">{challenge.hint}</p>
        </section>
      )}

      {showWorking && (
        <section className="mt-4 rounded-2xl border border-violet-300 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
            Worked solution
          </p>

          <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-7 text-violet-950">
            {challenge.workedSolution}
          </pre>
        </section>
      )}

      {feedback && (
        <section
          className={`mt-4 rounded-2xl border p-5 ${
            feedback.type === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : feedback.type === "error"
                ? "border-red-300 bg-red-50 text-red-950"
                : "border-blue-300 bg-blue-50 text-blue-950"
          }`}
        >
          <h3 className="font-black">{feedback.title}</h3>

          <p className="mt-2 leading-7">{feedback.message}</p>

          {feedback.type === "success" && (
            <div className="mt-4 rounded-xl bg-white/70 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Examiner tip
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {challenge.examinerTip}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Hands-on practice */}
      <div className="my-7 border-t border-slate-200" />

      <section>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
          Hands-on algorithm practice
        </p>

        <h3 className="mt-2 text-2xl font-black text-slate-950">
          Perform the Trace Table
        </h3>

        <p className="mt-2 max-w-4xl leading-7 text-slate-600">
          Execute the pseudocode yourself. Enter the variable values that exist
          after each important step. The next row is unlocked only when the
          current row is correct.
        </p>

        {/* Procedure stats */}
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
              Correct steps
            </p>

            <p className="mt-2 text-2xl font-black">{procedureCorrectSteps}</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
              Mistakes
            </p>

            <p className="mt-2 text-2xl font-black">{procedureMistakes}</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
              Procedure accuracy
            </p>

            <p className="mt-2 text-2xl font-black">{procedureAccuracy}%</p>
          </article>

          <article className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
              Rows completed
            </p>

            <p className="mt-2 text-2xl font-black">
              {Math.min(currentRow, challenge.rows.length)}/
              {challenge.rows.length}
            </p>
          </article>
        </div>

        {/* Current procedure info */}
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <article className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
            <p className="text-xs font-black uppercase text-violet-600">
              Current row
            </p>

            <p className="mt-2 text-xl font-black">
              {procedureComplete ? "Complete" : currentRow + 1}
            </p>
          </article>

          <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-black uppercase text-blue-600">
              Total rows
            </p>

            <p className="mt-2 text-xl font-black">{challenge.rows.length}</p>
          </article>

          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-black uppercase text-amber-600">
              Variables
            </p>

            <p className="mt-2 text-xl font-black">
              {challenge.variables.join(", ")}
            </p>
          </article>

          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-xs font-black uppercase text-emerald-600">
              Current action
            </p>

            <p className="mt-2 text-xl font-black">
              {procedureComplete ? "Finished" : "Calculate row"}
            </p>
          </article>
        </div>

        {/* Trace table */}
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[720px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500">
                  Step
                </th>

                {challenge.variables.map((variable) => (
                  <th
                    key={variable}
                    className="px-4 py-3 text-left text-xs font-black uppercase text-slate-500"
                  >
                    {variable}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {challenge.rows.map((row, rowIndex) => {
                const completed = rowIndex < currentRow;

                const active = rowIndex === currentRow && !procedureComplete;

                return (
                  <tr key={rowIndex} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-black">{rowIndex + 1}</td>

                    {challenge.variables.map((variable) => {
                      const expectedValue = row[variable] ?? "";

                      if (completed) {
                        return (
                          <td key={variable} className="px-4 py-3">
                            <div className="rounded-xl bg-emerald-50 px-3 py-2 font-mono font-black text-emerald-800">
                              {expectedValue === "" ? "—" : expectedValue}
                            </div>
                          </td>
                        );
                      }

                      if (active) {
                        const expectedValue = currentExpectedRow?.[variable];

                        const shouldBeBlank =
                          expectedValue === "" || expectedValue === undefined;

                        if (shouldBeBlank) {
                          return (
                            <td key={variable} className="px-4 py-3">
                              <div className="rounded-xl bg-slate-50 px-3 py-2 text-center font-mono text-slate-400">
                                —
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={variable} className="px-4 py-3">
                            <input
                              value={rowInputs[variable] ?? ""}
                              onChange={(event) =>
                                updateRowInput(variable, event.target.value)
                              }
                              placeholder={variable}
                              className="w-full rounded-xl border border-blue-300 px-3 py-2 font-mono font-bold outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </td>
                        );
                      }

                      return (
                        <td key={variable} className="px-4 py-3">
                          <div className="h-10 rounded-xl bg-slate-50" />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!procedureComplete && (
          <div className="mt-4 rounded-2xl bg-slate-950 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.17em] text-blue-300">
              Row {currentRow + 1}
            </p>

            <p className="mt-2 font-black">
              Calculate the values produced by the next execution step.
            </p>

            <p className="mt-1 text-sm text-slate-300">
              Enter each visible value and record output only when the algorithm
              reaches an OUTPUT statement.
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={checkProcedureRow}
            disabled={procedureComplete}
            className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white disabled:bg-slate-300"
          >
            Check row →
          </button>

          <button
            type="button"
            onClick={() => setShowProcedureHint((current) => !current)}
            className="rounded-xl border border-amber-400 bg-amber-50 px-5 py-3 font-black text-amber-900"
          >
            {showProcedureHint ? "Hide hint" : "Hint"}
          </button>

          <button
            type="button"
            onClick={() => setShowProcedureWorking((current) => !current)}
            className="rounded-xl border border-violet-300 bg-violet-50 px-5 py-3 font-black text-violet-800"
          >
            {showProcedureWorking ? "Hide working" : "Show working"}
          </button>

          <button
            type="button"
            onClick={resetProcedure}
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black"
          >
            Reset procedure
          </button>
        </div>

        {showProcedureHint && (
          <section className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">
              Procedure hint
            </p>

            <p className="mt-2 leading-7 text-amber-950">{challenge.hint}</p>
          </section>
        )}

        {showProcedureWorking && (
          <section className="mt-4 rounded-2xl border border-violet-300 bg-violet-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">
              Worked trace
            </p>

            <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-7 text-violet-950">
              {challenge.workedSolution}
            </pre>
          </section>
        )}

        {procedureFeedback && (
          <section
            className={`mt-4 rounded-2xl border p-5 ${
              procedureFeedback.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                : "border-red-300 bg-red-50 text-red-950"
            }`}
          >
            <h3 className="font-black">{procedureFeedback.title}</h3>

            <p className="mt-2 leading-7">{procedureFeedback.message}</p>
          </section>
        )}

        {procedureComplete && (
          <section className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
              Procedure complete
            </p>

            <h3 className="mt-2 text-xl font-black text-emerald-950">
              Trace Table completed successfully
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <article className="rounded-xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Final output
                </p>

                <p className="mt-2 text-xl font-black">
                  {challenge.finalAnswer}
                </p>
              </article>

              <article className="rounded-xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Procedure accuracy
                </p>

                <p className="mt-2 text-xl font-black">{procedureAccuracy}%</p>
              </article>

              <article className="rounded-xl bg-white p-4">
                <p className="text-xs font-black uppercase text-slate-500">
                  Mistakes
                </p>

                <p className="mt-2 text-xl font-black">{procedureMistakes}</p>
              </article>
            </div>

            <button
              type="button"
              onClick={resetProcedure}
              className="mt-4 rounded-xl border border-emerald-500 bg-white px-5 py-3 font-black text-emerald-800"
            >
              Practise this trace again
            </button>
          </section>
        )}
      </section>
    </Card>
  );
}
