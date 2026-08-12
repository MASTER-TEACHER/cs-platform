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
      prompt: "score = 10\\nscore = 15\\nWhat is score?",
      answer: "15",
      hint: "The second assignment replaces the first value.",
      working: "score starts at 10, then score = 15 overwrites it.",
    },
  ],
  intermediate: [
    {
      prompt: "x = 4\\ny = x + 3\\nWhat is y?",
      answer: "7",
      hint: "Substitute x into the expression.",
      working: "x is 4, so y = 4 + 3 = 7.",
    },
  ],
  higher: [
    {
      prompt: "a = 5\\nb = a\\na = 9\\nWhat is b?",
      answer: "5",
      hint: "Assignment copies the value at that moment.",
      working: "b receives 5 before a changes to 9.",
    },
  ],
};
function pick(d: Difficulty) {
  return bank[d][0];
}
export default function VariablesSimulator() {
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
      <h2 className="mt-2 text-3xl font-black">Variable Memory</h2>
      <p className="mt-2 text-slate-600">
        Predict and explore how assignment changes values.
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
        <h3 className="text-xl font-black">Explore variable memory</h3>
        <p className="mt-3 text-slate-600">
          Change the values and observe the memory state.
        </p>
        <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-emerald-300">
          name = "student"
          <br />
          score = 10
        </div>
      </section>
    </Card>
  );
}
