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

type Q = { prompt: string; answer: string; hint: string; working: string };
const bank: Record<Difficulty, Q[]> = {
  foundation: [
    {
      prompt: "Which flowchart shape represents a decision?",
      answer: "diamond",
      hint: "A decision has alternative paths.",
      working: "A diamond represents a decision/condition.",
    },
  ],
  intermediate: [
    {
      prompt: "Which shape is normally used for input/output?",
      answer: "parallelogram",
      hint: "Think of READ/PRINT operations.",
      working: "A parallelogram represents input/output.",
    },
  ],
  higher: [
    {
      prompt:
        "A loop continues while score < 10. Which symbol tests score < 10?",
      answer: "diamond",
      hint: "The loop condition is a decision.",
      working: "The condition belongs in a decision diamond.",
    },
  ],
};
function pick(d: Difficulty) {
  return bank[d][0];
}
export default function FlowchartSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => pick(d), []);
  const s = useSimulator<Q>({
    initialQuestion: pick("foundation"),
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
        Interactive programming challenge
      </p>
      <h2 className="mt-2 text-3xl font-black">Flowchart Lab</h2>
      <p className="mt-2 text-slate-600">
        Choose and trace correct flowchart decisions.
      </p>
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
      <pre className="mt-6 whitespace-pre-wrap rounded-2xl bg-slate-950 p-5 text-white">
        {s.question.prompt}
      </pre>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Your answer"
        className="mt-4 w-full rounded-xl border px-4 py-3 font-mono"
      />
      <div className="mt-5">
        <SimulatorControls
          canCheck={!!answer}
          checked={s.checked}
          hintVisible={s.hintVisible}
          workingVisible={s.workingVisible}
          onCheck={() =>
            s.markAnswer(
              answer.trim().toLowerCase() === s.question.answer.toLowerCase(),
            )
          }
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
          examinerTip="Trace the code carefully and use precise programming vocabulary in written explanations."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">Flowchart symbols</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-full bg-emerald-50 p-4 text-center font-bold">
            Start / End
          </div>
          <div className="rounded-xl bg-blue-50 p-4 text-center font-bold">
            Process
          </div>
          <div className="rotate-0 bg-amber-50 p-4 text-center font-bold">
            ◇ Decision
          </div>
        </div>
      </section>
    </Card>
  );
}
