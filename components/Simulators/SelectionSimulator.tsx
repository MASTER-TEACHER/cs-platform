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
      prompt:
        'score = 65\\nif score >= 40: result = "Pass"\\nelse: result = "Fail"\\nWhat is result?',
      answer: "Pass",
      hint: "Check the condition score >= 40.",
      working: "65 >= 40 is true, so the Pass branch runs.",
    },
  ],
  intermediate: [
    {
      prompt:
        'score = 75\\nif score >= 70: result="Distinction"\\nelif score >= 40: result="Pass"\\nelse: result="Fail"',
      answer: "Distinction",
      hint: "The first true branch runs.",
      working: "75 >= 70 is true, so later branches are skipped.",
    },
  ],
  higher: [
    {
      prompt: 'x=8\\nif x%2==0 and x>5: result="A"\\nelse: result="B"',
      answer: "A",
      hint: "Both parts of AND must be true.",
      working: "8 is even and greater than 5, so result is A.",
    },
  ],
};
function pick(d: Difficulty) {
  return bank[d][0];
}
export default function SelectionSimulator() {
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
      <h2 className="mt-2 text-3xl font-black">Selection Lab</h2>
      <p className="mt-2 text-slate-600">
        Predict which branch an IF / ELIF / ELSE statement follows.
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
        <h3 className="text-xl font-black">Explore selection</h3>
        <p className="mt-3">
          Change conditions mentally and predict which branch would execute
          before revealing the answer above.
        </p>
      </section>
    </Card>
  );
}
