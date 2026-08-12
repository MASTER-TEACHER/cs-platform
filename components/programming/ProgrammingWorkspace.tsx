"use client";

import { useEffect, useMemo, useState } from "react";

import ProgrammingChallengePanel from "@/components/programming/ProgrammingChallengePanel";
import ProgrammingConsole from "@/components/programming/ProgrammingConsole";
import ProgrammingEditor from "@/components/programming/ProgrammingEditor";
import ProgrammingModeTabs from "@/components/programming/ProgrammingModeTabs";
import ProgrammingStats from "@/components/programming/ProgrammingStats";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import { useAuth } from "@/contexts/AuthContext";
import { getProgrammingChallenges } from "@/data/programming/challenges";
import { useProgrammingProgress } from "@/hooks/useProgrammingProgress";
import { evaluateProgrammingChallenge } from "@/lib/programming/evaluator";
import { runPython } from "@/services/pythonRunnerService";
import type {
  ProgrammingChallenge,
  ProgrammingDifficulty,
  ProgrammingEvaluation,
  ProgrammingExamBoard,
  ProgrammingMode,
  ProgrammingQualification,
  PythonRunResult,
} from "@/types/programming";

const exploreStarter = `name = input()
print(f"Hello, {name}!")

for number in range(1, 4):
    print(number)
`;

const emptyRun: PythonRunResult = {
  stdout: "",
  stderr: "",
  error: "",
  timedOut: false,
  durationMs: 0,
};

function toQualification(
  value: string | null | undefined,
): ProgrammingQualification {
  return value === "A_LEVEL" ? "A_LEVEL" : "GCSE";
}

function toExamBoard(
  value: string | null | undefined,
): ProgrammingExamBoard | null {
  if (value === "AQA" || value === "OCR" || value === "EDEXCEL") {
    return value;
  }

  return null;
}

export default function ProgrammingWorkspace() {
  const { profile } = useAuth();

  const qualification = toQualification(profile?.qualification);
  const examBoard = toExamBoard(profile?.examBoard);

  const [mode, setMode] = useState<ProgrammingMode>("practice");
  const [difficulty, setDifficulty] =
    useState<ProgrammingDifficulty>("foundation");
  const [challengeIndex, setChallengeIndex] = useState(0);

  const challenges = useMemo(() => {
    if (mode === "explore") return [];

    return getProgrammingChallenges({
      qualification,
      examBoard,
      difficulty,
      mode,
    });
  }, [difficulty, examBoard, mode, qualification]);

  const challenge: ProgrammingChallenge | null =
    mode === "explore"
      ? null
      : challenges[challengeIndex % Math.max(challenges.length, 1)] ?? null;

  const [code, setCode] = useState(exploreStarter);
  const [stdin, setStdin] = useState("Ada");
  const [runResult, setRunResult] = useState<PythonRunResult>(emptyRun);
  const [evaluation, setEvaluation] =
    useState<ProgrammingEvaluation | null>(null);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "The first Python run may take longer while the browser loads the runtime.",
  );

  const progress = useProgrammingProgress();

  useEffect(() => {
    setChallengeIndex(0);
  }, [difficulty, examBoard, mode, qualification]);

  useEffect(() => {
    if (mode === "explore") {
      setCode(exploreStarter);
      setStdin("Ada");
    } else if (challenge) {
      setCode(challenge.starterCode);
      setStdin(challenge.stdin ?? challenge.visibleTests[0]?.input ?? "");
    }

    setRunResult(emptyRun);
    setEvaluation(null);
    setShowHint(false);
    setShowExplanation(false);
  }, [challenge, mode]);

  async function handleRun() {
    if (!code.trim()) return;

    setRunning(true);
    setRunResult(emptyRun);
    setStatusMessage("Running Python in the browser...");

    try {
      const result = await runPython({
        code,
        stdin,
        timeoutMs: 3000,
      });

      setRunResult(result);

      if (result.timedOut) {
        setStatusMessage(
          "Execution stopped because it exceeded the time limit.",
        );
      } else if (result.error || result.stderr) {
        setStatusMessage(
          "Python returned an error. Use the console to debug it.",
        );
      } else {
        setStatusMessage("Run complete.");
      }
    } catch (error) {
      setRunResult({
        ...emptyRun,
        error:
          error instanceof Error
            ? error.message
            : "Python could not run.",
      });
      setStatusMessage("The Python runtime could not start.");
    } finally {
      setRunning(false);
    }
  }

  async function handleCheck() {
    if (!challenge || !code.trim()) return;

    setChecking(true);
    setEvaluation(null);
    setShowExplanation(false);
    setStatusMessage("Checking visible and hidden tests...");

    try {
      const result = await evaluateProgrammingChallenge(challenge, code);

      setEvaluation(result);

      const awarded = progress.recordAttempt(challenge, result.passed);

      if (result.passed) {
        setShowExplanation(true);
        setStatusMessage(
          awarded > 0
            ? `All tests passed. +${awarded} XP awarded.`
            : "All tests passed. This challenge was already completed for XP.",
        );
      } else {
        setStatusMessage(
          `${result.passedCount}/${result.totalCount} tests passed. Review the feedback and try again.`,
        );
      }
    } catch (error) {
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "The solution could not be checked.",
      );
    } finally {
      setChecking(false);
    }
  }

  function resetCurrent() {
    if (mode === "explore") {
      setCode(exploreStarter);
      setStdin("Ada");
    } else if (challenge) {
      setCode(challenge.starterCode);
      setStdin(challenge.stdin ?? challenge.visibleTests[0]?.input ?? "");
    }

    setRunResult(emptyRun);
    setEvaluation(null);
    setShowHint(false);
    setShowExplanation(false);
    setStatusMessage("Challenge reset.");
  }

  function nextChallenge() {
    if (challenges.length === 0) return;

    setChallengeIndex((current) => (current + 1) % challenges.length);
    setStatusMessage("New challenge loaded.");
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-blue-600">
              Live programming practice
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Python Programming Workspace
            </h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              Write, run, debug and test Python directly in your browser.
              Practice challenges adapt to your selected qualification and
              exam board.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 px-5 py-4 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Current curriculum
            </p>
            <p className="mt-1 font-black">
              {examBoard ?? "General"}{" "}
              {qualification === "A_LEVEL" ? "A-Level" : "GCSE"}
            </p>
          </div>
        </div>
      </section>

      <ProgrammingModeTabs value={mode} onChange={setMode} />

      {mode !== "explore" && (
        <SimulatorDifficulty
          value={difficulty}
          onChange={setDifficulty}
        />
      )}

      <ProgrammingStats
        attempts={progress.attempts}
        correct={progress.correct}
        accuracy={progress.accuracy}
        xp={progress.xp}
        streak={progress.streak}
        bestStreak={progress.bestStreak}
      />

      <section className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
        <p className="font-bold text-blue-950">{statusMessage}</p>
      </section>

      {mode !== "explore" && (
        <ProgrammingChallengePanel
          challenge={challenge}
          evaluation={evaluation}
          showHint={showHint}
          showExplanation={showExplanation}
        />
      )}

      {mode === "explore" && (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
            Explore mode
          </p>
          <h2 className="mt-2 text-2xl font-black text-emerald-950">
            Your own Python
          </h2>
          <p className="mt-3 leading-7 text-emerald-900">
            Change the program and standard input freely. Code runs inside a
            browser Web Worker and is stopped if it runs for too long.
          </p>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <ProgrammingEditor
          code={code}
          onChange={setCode}
          disabled={running || checking}
        />

        <div className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <label
              htmlFor="programming-stdin"
              className="font-black text-slate-950"
            >
              Standard input
            </label>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Put each input() value on a new line.
            </p>
            <textarea
              id="programming-stdin"
              value={stdin}
              onChange={(event) => setStdin(event.target.value)}
              disabled={running || checking}
              spellCheck={false}
              className="mt-3 min-h-28 w-full rounded-2xl border border-slate-300 px-4 py-3 font-mono text-sm outline-none focus:border-blue-500"
            />
          </section>

          <ProgrammingConsole
            stdout={runResult.stdout}
            stderr={runResult.stderr}
            error={runResult.error}
            running={running}
            durationMs={
              runResult.durationMs > 0 ? runResult.durationMs : undefined
            }
          />
        </div>
      </div>

      <section className="flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white p-5">
        <button
          type="button"
          onClick={handleRun}
          disabled={running || checking || !code.trim()}
          className="rounded-xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {running ? "Running..." : "Run code"}
        </button>

        {mode !== "explore" && (
          <button
            type="button"
            onClick={handleCheck}
            disabled={running || checking || !challenge || !code.trim()}
            className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {checking ? "Checking..." : "Check solution"}
          </button>
        )}

        {mode !== "explore" && challenge && (
          <>
            <button
              type="button"
              onClick={() => setShowHint((current) => !current)}
              className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 font-black text-amber-800 transition hover:bg-amber-100"
            >
              {showHint ? "Hide hint" : "Hint"}
            </button>

            <button
              type="button"
              onClick={() =>
                setShowExplanation((current) => !current)
              }
              className="rounded-xl border border-violet-300 bg-violet-50 px-5 py-3 font-black text-violet-800 transition hover:bg-violet-100"
            >
              {showExplanation ? "Hide explanation" : "Show explanation"}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={resetCurrent}
          disabled={running || checking}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          Reset
        </button>

        {mode !== "explore" && challenges.length > 1 && (
          <button
            type="button"
            onClick={nextChallenge}
            disabled={running || checking}
            className="rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 font-black text-blue-700 transition hover:bg-blue-100 disabled:opacity-40"
          >
            New challenge
          </button>
        )}

        <button
          type="button"
          onClick={() => setRunResult(emptyRun)}
          disabled={running}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          Clear console
        </button>
      </section>

      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-xl font-black text-amber-950">
          Learning-runner boundaries
        </h2>
        <p className="mt-3 leading-7 text-amber-900">
          Python runs on the student's device rather than on the CS Master
          server. Browser, network and process-control modules are blocked and
          long-running code is terminated. This is designed for educational
          practice; it should not be described as a security sandbox for
          hostile code.
        </p>
      </section>

      {progress.history.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black text-slate-950">
            Recent programming attempts
          </h2>

          <div className="mt-4 divide-y divide-slate-100">
            {progress.history.slice(0, 8).map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-black text-slate-800">
                    {item.challengeTitle}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.mode} · {item.difficulty}
                  </p>
                </div>

                <div className="text-sm font-black">
                  <span
                    className={
                      item.passed ? "text-emerald-700" : "text-red-700"
                    }
                  >
                    {item.passed ? "Passed" : "Not passed"}
                  </span>
                  {item.xpAwarded > 0 && (
                    <span className="ml-3 text-blue-700">
                      +{item.xpAwarded} XP
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
