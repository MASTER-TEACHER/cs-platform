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
  options: string[];
  answer: string;
  hint: string;
  working: string;
};
const bank: Record<Difficulty, Q[]> = {
  foundation: [
    {
      prompt: "In a Student table, which field is the best primary key?",
      options: ["StudentID", "FirstName", "Score"],
      answer: "StudentID",
      hint: "A primary key must uniquely identify each record.",
      working:
        "StudentID is designed to be unique; names and scores can repeat.",
    },
  ],
  intermediate: [
    {
      prompt: "Which term describes one complete row in a database table?",
      options: ["Record", "Field", "Query"],
      answer: "Record",
      hint: "Think about one complete entity instance.",
      working: "A row is a record; each column is a field.",
    },
  ],
  higher: [
    {
      prompt: "Why is StudentID better than Name as a primary key?",
      options: [
        "It is unique and stable",
        "It is easier to spell",
        "It stores more data",
      ],
      answer: "It is unique and stable",
      hint: "Consider uniqueness and change over time.",
      working:
        "Names can duplicate or change. A stable unique identifier is safer.",
    },
  ],
};
function pick(d: Difficulty) {
  const a = bank[d];
  return a[Math.floor(Math.random() * a.length)];
}
type Student = { id: number; name: string; score: number };
const initial = [
  { id: 101, name: "Aisha", score: 72 },
  { id: 102, name: "Daniel", score: 58 },
  { id: 103, name: "Maya", score: 84 },
];
export default function DatabaseSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => pick(d), []);
  const s = useSimulator<Q>({
    initialQuestion: pick("foundation"),
    generateQuestion: gen,
    onAwardXP: addXP,
  });
  const [choice, setChoice] = useState("");
  const [students, setStudents] = useState<Student[]>(initial);
  const [name, setName] = useState("");
  const [score, setScore] = useState(50);
  const reset = () => {
      setChoice("");
      s.resetQuestion();
    },
    next = () => {
      setChoice("");
      s.newQuestion();
    };
  const add = () => {
    if (!name.trim()) return;
    setStudents((x) => [
      ...x,
      { id: Math.max(...x.map((v) => v.id)) + 1, name: name.trim(), score },
    ]);
    setName("");
  };
  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Challenge + table builder
      </p>
      <h2 className="mt-2 text-3xl font-black">Relational Database Lab</h2>
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
      <section className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">
        <p className="font-black">{s.question.prompt}</p>
      </section>
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
          examinerTip="Use precise database vocabulary: table, record, field, primary key and foreign key."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">Explore: build records</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_140px_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student name"
            className="rounded-xl border px-4 py-3"
          />
          <input
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={(e) =>
              setScore(Math.max(0, Math.min(100, Number(e.target.value))))
            }
            className="rounded-xl border px-4 py-3"
          />
          <button
            onClick={add}
            className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white"
          >
            Add record
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-3 text-left">StudentID 🔑</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="p-3 font-mono">{v.id}</td>
                  <td className="p-3">{v.name}</td>
                  <td className="p-3">{v.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Card>
  );
}
