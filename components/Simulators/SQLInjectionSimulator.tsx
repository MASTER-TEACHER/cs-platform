"use client";

import { useCallback, useState } from "react";

import SimulatorControls from "@/components/Simulators/common/SimulatorControls";
import SimulatorDifficulty from "@/components/Simulators/common/SimulatorDifficulty";
import SimulatorFeedback from "@/components/Simulators/common/SimulatorFeedback";
import SimulatorStats from "@/components/Simulators/common/SimulatorStats";
import {
  useSimulator,
  type SimulatorDifficulty as Difficulty,
} from "@/components/Simulators/common/useSimulator";
import Card from "@/components/ui/Card";
import { useProgress } from "@/contexts/ProgressContext";

type SecurityClassification = "safe" | "unsafe";

type Question = {
  input: string;
  answer: SecurityClassification;
  hint: string;
  working: string;
};

const QUESTION_BANK: Record<Difficulty, Question[]> = {
  foundation: [
    {
      input: "alice@example.com",
      answer: "safe",
      hint: "This looks like ordinary user data.",
      working: "Ordinary data is not itself an injection payload.",
    },
    {
      input: "' OR '1'='1",
      answer: "unsafe",
      hint: "Look for SQL syntax inside user input.",
      working:
        "The input contains a condition intended to alter the structure or logic of a SQL query.",
    },
  ],

  intermediate: [
    {
      input: "admin' --",
      answer: "unsafe",
      hint: "A quote and comment marker can change query structure.",
      working:
        "This attempts to terminate a value and comment out the remainder of a query.",
    },
    {
      input: "Chris O'Neil",
      answer: "safe",
      hint: "An apostrophe can occur legitimately in data.",
      working:
        "Legitimate apostrophes demonstrate why parameterised queries are safer than attempting to blacklist individual characters.",
    },
  ],

  higher: [
    {
      input: "1; DROP TABLE Users; --",
      answer: "unsafe",
      hint: "Look for an additional SQL statement.",
      working:
        "This is an injection-style example containing an additional destructive SQL command. Secure applications must treat this text only as data.",
    },
    {
      input: "Robert'); SELECT * FROM Users; --",
      answer: "unsafe",
      hint: "The input tries to escape the intended value.",
      working:
        "The text attempts to alter the intended query structure and append another SQL statement. Parameterised queries prevent user input from being interpreted as SQL instructions.",
    },
  ],
};

const CLASSIFICATIONS: SecurityClassification[] = ["safe", "unsafe"];

function pickQuestion(difficulty: Difficulty): Question {
  const questions = QUESTION_BANK[difficulty];

  return questions[Math.floor(Math.random() * questions.length)];
}

export default function SQLInjectionSimulator() {
  const { addXP } = useProgress();

  const generateQuestion = useCallback(
    (difficulty: Difficulty) => pickQuestion(difficulty),
    [],
  );

  const simulator = useSimulator<Question>({
    initialQuestion: pickQuestion("foundation"),
    generateQuestion,
    onAwardXP: addXP,
  });

  const [answer, setAnswer] = useState<SecurityClassification | null>(null);

  function resetQuestion() {
    setAnswer(null);
    simulator.resetQuestion();
  }

  function newQuestion() {
    setAnswer(null);
    simulator.newQuestion();
  }

  function changeDifficulty(difficulty: Difficulty) {
    setAnswer(null);
    simulator.changeDifficulty(difficulty);
  }

  function checkAnswer() {
    simulator.markAnswer(answer === simulator.question.answer);
  }

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Defensive security simulator
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-950">
        SQL Injection Defence
      </h2>

      <p className="mt-3 max-w-4xl text-slate-600">
        Recognise suspicious input and learn why parameterised queries protect
        databases. Examples are presented only to explain defensive programming.
      </p>

      <div className="mt-6">
        <SimulatorDifficulty
          value={simulator.difficulty}
          onChange={changeDifficulty}
        />
      </div>

      <div className="mt-6">
        <SimulatorStats
          attempts={simulator.attempts}
          correct={simulator.correctAnswers}
          accuracy={simulator.accuracy}
          xp={simulator.xp}
          streak={simulator.streak}
        />
      </div>

      <section className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
          Classify this input
        </p>

        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-all font-mono text-xl font-black text-white">
          {simulator.question.input}
        </pre>
      </section>

      <div className="mt-4 flex flex-wrap gap-3">
        {CLASSIFICATIONS.map((classification) => (
          <button
            key={classification}
            type="button"
            onClick={() => setAnswer(classification)}
            disabled={simulator.checked}
            className={`rounded-xl px-5 py-3 font-black capitalize transition ${
              answer === classification
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
            } disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {classification}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <SimulatorControls
          canCheck={answer !== null}
          checked={simulator.checked}
          hintVisible={simulator.hintVisible}
          workingVisible={simulator.workingVisible}
          onCheck={checkAnswer}
          onHint={simulator.toggleHint}
          onToggleWorking={simulator.toggleWorking}
          onReset={resetQuestion}
          onNewExample={newQuestion}
        />
      </div>

      <div className="mt-5">
        <SimulatorFeedback
          checked={simulator.checked}
          correct={simulator.correct}
          hintVisible={simulator.hintVisible}
          hint={simulator.question.hint}
          workingVisible={simulator.workingVisible}
          working={simulator.question.working}
          successMessage={`Correct. This input is classified as ${simulator.question.answer}.`}
          errorMessage={`Not quite. This example should be classified as ${simulator.question.answer}. Review how user input can affect query structure.`}
          examinerTip="The key defence is parameterised queries: user input is treated as data rather than executable SQL."
        />
      </div>

      <section className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
          Defensive programming principle
        </p>

        <p className="mt-2 leading-7 text-emerald-950">
          Applications should use parameterised queries rather than constructing
          SQL statements by concatenating untrusted user input.
        </p>
      </section>
    </Card>
  );
}
