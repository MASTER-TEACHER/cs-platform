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
      prompt: 'items = ["A","B","C"]\\nWhat is items[1]?',
      answer: "B",
      hint: "Most GCSE programming languages use zero-based indexing here.",
      working: "Index 0 is A, index 1 is B.",
    },
  ],
  intermediate: [
    {
      prompt: "nums = [4,7,2]\\nnums[0] = 9\\nWhat is nums[0]?",
      answer: "9",
      hint: "The assignment updates one element.",
      working: "The value at index 0 changes from 4 to 9.",
    },
  ],
  higher: [
    {
      prompt: "nums=[3,6,9,12]\\nWhat is nums[2] + nums[0]?",
      answer: "12",
      hint: "Read indexes 2 and 0.",
      working: "nums[2]=9 and nums[0]=3, so total=12.",
    },
  ],
};
function pick(d: Difficulty) {
  return bank[d][0];
}
export default function ArraySimulator() {
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
      <h2 className="mt-2 text-3xl font-black">Array Lab</h2>
      <p className="mt-2 text-slate-600">
        Practise indexing, updating and traversing arrays.
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
        <h3 className="text-xl font-black">Array model</h3>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[3, 6, 9, 12].map((v, i) => (
            <div key={i} className="rounded-xl bg-blue-50 p-4 text-center">
              <b>{v}</b>
              <p className="text-xs">index {i}</p>
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}
