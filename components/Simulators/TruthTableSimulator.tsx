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
  expression: string;
  a: number;
  b: number;
  answer: string;
  hint: string;
  working: string;
};
function make(d: Difficulty): Q {
  const a = Math.random() > 0.5 ? 1 : 0,
    b = Math.random() > 0.5 ? 1 : 0;
  if (d === "foundation") {
    const expression = "A AND B",
      ans = a && b ? "1" : "0";
    return {
      expression,
      a,
      b,
      answer: ans,
      hint: "AND outputs 1 only when both inputs are 1.",
      working: `A=${a}, B=${b}. AND → ${ans}.`,
    };
  }
  if (d === "intermediate") {
    const expression = "A XOR B",
      ans = a !== b ? "1" : "0";
    return {
      expression,
      a,
      b,
      answer: ans,
      hint: "XOR outputs 1 when the inputs differ.",
      working: `A=${a}, B=${b}. XOR → ${ans}.`,
    };
  }
  const ans = a === 1 && b === 0 ? "1" : "0";
  return {
    expression: "A AND NOT B",
    a,
    b,
    answer: ans,
    hint: "Calculate NOT B first.",
    working: `B=${b}, so NOT B=${b ? 0 : 1}. Then ${a} AND ${b ? 0 : 1} → ${ans}.`,
  };
}
export default function TruthTableSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => make(d), []);
  const s = useSimulator<Q>({
    initialQuestion: make("foundation"),
    generateQuestion: gen,
    onAwardXP: addXP,
  });
  const [answer, setAnswer] = useState("");
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
        Interactive truth-table challenge
      </p>
      <h2 className="mt-2 text-3xl font-black">Truth Table Builder</h2>
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
      <section className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
        <p className="text-sm text-slate-400">Calculate Q for</p>
        <p className="mt-2 text-2xl font-black">Q = {s.question.expression}</p>
        <p className="mt-3 font-mono">
          A = {s.question.a} &nbsp; B = {s.question.b}
        </p>
      </section>
      <div className="mt-4 flex gap-3">
        {["0", "1"].map((v) => (
          <button
            key={v}
            onClick={() => setAnswer(v)}
            className={`h-16 w-20 rounded-xl text-2xl font-black ${answer === v ? "bg-blue-600 text-white" : "bg-slate-100"}`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="mt-5">
        <SimulatorControls
          canCheck={!!answer}
          checked={s.checked}
          hintVisible={s.hintVisible}
          workingVisible={s.workingVisible}
          onCheck={() => s.markAnswer(answer === s.question.answer)}
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
          examinerTip="For compound expressions, create intermediate columns such as NOT B before calculating the final output."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">Reference combinations</h3>
        <div className="mt-4 grid grid-cols-4 gap-2 font-mono">
          {[
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ].map(([x, y]) => (
            <div
              key={`${x}${y}`}
              className="rounded-xl bg-slate-50 p-4 text-center"
            >
              A={x} B={y}
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}
