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
  plain: string;
  shift: number;
  answer: string;
  hint: string;
  working: string;
};
const enc = (t: string, k: number) =>
  t
    .toUpperCase()
    .replace(/[A-Z]/g, (c) =>
      String.fromCharCode(65 + ((c.charCodeAt(0) - 65 + k) % 26)),
    );
const words = {
  foundation: ["CAT", "DATA", "CODE"],
  intermediate: ["BINARY", "NETWORK", "PYTHON"],
  higher: ["ALGORITHM", "ENCRYPTION", "COMPUTER"],
};
function make(d: Difficulty): Q {
  const w = words[d][Math.floor(Math.random() * words[d].length)],
    shift =
      d === "foundation"
        ? 1 + Math.floor(Math.random() * 3)
        : 1 + Math.floor(Math.random() * 12);
  return {
    plain: w,
    shift,
    answer: enc(w, shift),
    hint: `Move every letter ${shift} places forward through the alphabet.`,
    working: `${w} → ${enc(w, shift)} using a Caesar shift of ${shift}.`,
  };
}
export default function CaesarCipherSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => make(d), []);
  const s = useSimulator<Q>({
    initialQuestion: make("foundation"),
    generateQuestion: gen,
    onAwardXP: addXP,
  });
  const [answer, setAnswer] = useState("");
  const [lab, setLab] = useState("HELLO");
  const [shift, setShift] = useState(3);
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
        Interactive challenge + explorer
      </p>
      <h2 className="mt-2 text-3xl font-black">Caesar Cipher</h2>
      <p className="mt-3 text-slate-600">
        Encrypt text by shifting letters through the alphabet.
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
      <section className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
        <p>
          Encrypt <b>{s.question.plain}</b> using shift{" "}
          <b>{s.question.shift}</b>.
        </p>
      </section>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toUpperCase())}
        className="mt-4 w-full rounded-xl border px-4 py-3 font-mono"
        placeholder="Ciphertext"
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
          examinerTip="A Caesar cipher is useful for learning substitution, but it is not secure modern encryption."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">Explore mode</h3>
        <input
          value={lab}
          onChange={(e) => setLab(e.target.value)}
          className="mt-4 w-full rounded-xl border px-4 py-3"
        />
        <label className="mt-4 block font-bold">Shift: {shift}</label>
        <input
          type="range"
          min="1"
          max="25"
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-emerald-300">
          {enc(lab, shift)}
        </div>
      </section>
    </Card>
  );
}
