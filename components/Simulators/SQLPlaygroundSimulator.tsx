"use client";
import { useCallback, useMemo, useState } from "react";

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

const rows = [
  { id: 101, name: "Aisha", score: 72 },
  { id: 102, name: "Daniel", score: 58 },
  { id: 103, name: "Maya", score: 84 },
  { id: 104, name: "Lewis", score: 41 },
];
type Q = { prompt: string; answer: string; hint: string; working: string };
function make(d: Difficulty): Q {
  if (d === "foundation")
    return {
      prompt: "Write the keyword used to retrieve data.",
      answer: "SELECT",
      hint: "It begins a retrieval query.",
      working: "SELECT specifies the fields/data to retrieve.",
    };
  if (d === "intermediate")
    return {
      prompt: "Which clause filters records using a condition?",
      answer: "WHERE",
      hint: "It comes after FROM.",
      working:
        "WHERE applies a condition to decide which records are returned.",
    };
  return {
    prompt: "Which clause sorts query results?",
    answer: "ORDER BY",
    hint: "It can be followed by ASC or DESC.",
    working: "ORDER BY sorts the result set; ASC and DESC control direction.",
  };
}
export default function SQLPlaygroundSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => make(d), []);
  const s = useSimulator<Q>({
    initialQuestion: make("foundation"),
    generateQuestion: gen,
    onAwardXP: addXP,
  });
  const [answer, setAnswer] = useState("");
  const [minimum, setMinimum] = useState(60);
  const [descending, setDescending] = useState(true);
  const results = useMemo(
    () =>
      rows
        .filter((r) => r.score >= minimum)
        .sort((a, b) => (descending ? b.score - a.score : a.score - b.score)),
    [minimum, descending],
  );
  const query = `SELECT Name, Score\nFROM Student\nWHERE Score >= ${minimum}\nORDER BY Score ${descending ? "DESC" : "ASC"};`;
  const reset = () => {
      setAnswer("");
      s.resetQuestion();
    },
    next = () => {
      setAnswer("");
      s.newQuestion();
    };
  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        SQL challenge + playground
      </p>
      <h2 className="mt-2 text-3xl font-black">SQL Playground</h2>
      <div className="mt-6">
        <SimulatorDifficulty
          value={s.difficulty}
          onChange={(d) => {
            setAnswer("");
            s.changeDifficulty(d);
          }}
        />
      </div>
      <div className="mt-6">
        <SimulatorStats
          attempts={s.attempts}
          correct={s.correctAnswers}
          accuracy={s.accuracy}
          xp={s.xp}
          streak={s.streak}
        />
      </div>
      <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white font-black">
        {s.question.prompt}
      </div>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toUpperCase())}
        className="mt-4 w-full rounded-xl border px-4 py-3 font-mono"
      />
      <div className="mt-5">
        <SimulatorControls
          canCheck={!!answer}
          checked={s.checked}
          hintVisible={s.hintVisible}
          workingVisible={s.workingVisible}
          onCheck={() => s.markAnswer(answer.trim() === s.question.answer)}
          onHint={s.toggleHint}
          onToggleWorking={s.toggleWorking}
          onReset={reset}
          onNewExample={next}
        />
      </div>
      <div className="mt-5">
        <SimulatorFeedback
          checked={s.checked}
          correct={s.correct}
          hintVisible={s.hintVisible}
          hint={s.question.hint}
          workingVisible={s.workingVisible}
          working={s.question.working}
          examinerTip="Read SQL in execution-friendly chunks: SELECT fields, FROM table, WHERE condition, ORDER BY field."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">Explore query construction</h3>
        <label className="mt-4 block font-bold">Minimum score: {minimum}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={minimum}
          onChange={(e) => setMinimum(Number(e.target.value))}
          className="w-full"
        />
        <button
          onClick={() => setDescending((v) => !v)}
          className="mt-3 rounded-xl bg-slate-100 px-4 py-3 font-black"
        >
          Order: {descending ? "DESC" : "ASC"}
        </button>
        <pre className="mt-4 rounded-2xl bg-slate-950 p-5 text-emerald-300">
          {query}
        </pre>
        <div className="mt-4">
          {results.map((r) => (
            <p key={r.id} className="border-b py-2">
              {r.name} — {r.score}
            </p>
          ))}
        </div>
      </section>
    </Card>
  );
}
