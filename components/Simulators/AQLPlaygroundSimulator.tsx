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

type Q = {
  prompt: string;
  answer: string;
  options: string[];
  hint: string;
  working: string;
};
const bank: Record<Difficulty, Q[]> = {
  foundation: [
    {
      prompt: "Which action changes an existing record?",
      answer: "UPDATE",
      options: ["INSERT", "UPDATE", "DELETE"],
      hint: "The record already exists.",
      working: "UPDATE changes values in existing records.",
    },
  ],
  intermediate: [
    {
      prompt: "Which action adds a new record?",
      answer: "INSERT",
      options: ["SELECT", "INSERT", "UPDATE"],
      hint: "Think 'put a new row into the table'.",
      working: "INSERT adds a new record.",
    },
  ],
  higher: [
    {
      prompt: "Which action permanently removes matching records?",
      answer: "DELETE",
      options: ["DELETE", "SELECT", "ORDER BY"],
      hint: "This is destructive and should use a careful condition.",
      working: "DELETE removes records that match its condition.",
    },
  ],
};
function pick(d: Difficulty) {
  const a = bank[d];
  return a[Math.floor(Math.random() * a.length)];
}
export default function AQLPlaygroundSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => pick(d), []);
  const s = useSimulator<Q>({
    initialQuestion: pick("foundation"),
    generateQuestion: gen,
    onAwardXP: addXP,
  });
  const [choice, setChoice] = useState("");
  const [records, setRecords] = useState([
    { id: 1, name: "Ada", score: 70 },
    { id: 2, name: "Grace", score: 82 },
  ]);
  const reset = () => {
      setChoice("");
      s.resetQuestion();
    },
    next = () => {
      setChoice("");
      s.newQuestion();
    };
  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Database action challenge
      </p>
      <h2 className="mt-2 text-3xl font-black">Database Action Playground</h2>
      <p className="mt-2 text-slate-600">
        Practise selecting the correct action, then safely explore
        add/update/delete operations.
      </p>
      <div className="mt-6">
        <SimulatorDifficulty
          value={s.difficulty}
          onChange={(d) => {
            setChoice("");
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
      <div className="mt-4 flex flex-wrap gap-3">
        {s.question.options.map((o) => (
          <button
            key={o}
            onClick={() => setChoice(o)}
            className={`rounded-xl px-4 py-3 font-black ${choice === o ? "bg-blue-600 text-white" : "bg-slate-100"}`}
          >
            {o}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <SimulatorControls
          canCheck={!!choice}
          checked={s.checked}
          hintVisible={s.hintVisible}
          workingVisible={s.workingVisible}
          onCheck={() => s.markAnswer(choice === s.question.answer)}
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
          examinerTip="Always distinguish retrieving data from changing data. UPDATE and DELETE should use precise conditions."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">Explore actions</h3>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() =>
              setRecords((r) => [
                ...r,
                {
                  id: Math.max(...r.map((x) => x.id)) + 1,
                  name: "New Student",
                  score: 50,
                },
              ])
            }
            className="rounded-xl bg-emerald-100 px-4 py-3 font-black"
          >
            INSERT record
          </button>
          <button
            onClick={() =>
              setRecords((r) =>
                r.map((x, i) => (i === 0 ? { ...x, score: x.score + 1 } : x)),
              )
            }
            className="rounded-xl bg-blue-100 px-4 py-3 font-black"
          >
            UPDATE first
          </button>
          <button
            onClick={() => setRecords((r) => r.slice(0, -1))}
            disabled={records.length <= 1}
            className="rounded-xl bg-rose-100 px-4 py-3 font-black disabled:opacity-40"
          >
            DELETE last
          </button>
        </div>
        {records.map((r) => (
          <p key={r.id} className="mt-3 rounded-xl bg-slate-50 p-3 font-mono">
            {r.id} | {r.name} | {r.score}
          </p>
        ))}
      </section>
    </Card>
  );
}
