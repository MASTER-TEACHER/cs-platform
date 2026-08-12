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
      prompt: "One customer can place many orders. What relationship is this?",
      answer: "One-to-many",
      options: ["One-to-one", "One-to-many", "Many-to-many"],
      hint: "Count how many orders one customer may have.",
      working:
        "One CustomerID can appear in many Order records, so the relationship is one-to-many.",
    },
  ],
  intermediate: [
    {
      prompt: "Which field in Order should link back to Customer?",
      answer: "CustomerID",
      options: ["OrderID", "CustomerID", "OrderDate"],
      hint: "Use the primary key of Customer as a foreign key.",
      working:
        "CustomerID is the Customer primary key and becomes a foreign key in Order.",
    },
  ],
  higher: [
    {
      prompt:
        "A student can join many clubs and each club has many students. What is required?",
      answer: "A linking table",
      options: [
        "A linking table",
        "A duplicate primary key",
        "No relationship",
      ],
      hint: "Relational databases resolve many-to-many relationships.",
      working:
        "Create a junction/linking table containing the keys from Student and Club.",
    },
  ],
};
function pick(d: Difficulty) {
  const a = bank[d];
  return a[Math.floor(Math.random() * a.length)];
}
export default function EntityRelationshipSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => pick(d), []);
  const s = useSimulator<Q>({
    initialQuestion: pick("foundation"),
    generateQuestion: gen,
    onAwardXP: addXP,
  });
  const [choice, setChoice] = useState("");
  const [show, setShow] = useState(true);
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
        Interactive ER challenge
      </p>
      <h2 className="mt-2 text-3xl font-black">Entity Relationship Designer</h2>
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
      <div className="mt-4 grid gap-3">
        {s.question.options.map((o) => (
          <button
            key={o}
            onClick={() => setChoice(o)}
            className={`rounded-xl border p-4 text-left font-bold ${choice === o ? "border-blue-600 bg-blue-50" : "border-slate-200"}`}
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
          examinerTip="Show cardinality clearly and identify primary/foreign keys when explaining relationships."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <button
          onClick={() => setShow((v) => !v)}
          className="rounded-xl bg-blue-600 px-4 py-3 font-black text-white"
        >
          {show ? "Hide" : "Show"} keys
        </button>
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="rounded-2xl bg-blue-50 p-5">
            <b>Customer</b>
            <p>{show ? "🔑 " : ""}CustomerID</p>
            <p>Name</p>
          </div>
          <div className="text-center font-black">
            1 ───── ∞<br />
            <span className="text-sm">one-to-many</span>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <b>Order</b>
            <p>{show ? "🔑 " : ""}OrderID</p>
            <p>{show ? "🔗 " : ""}CustomerID</p>
          </div>
        </div>
      </section>
    </Card>
  );
}
