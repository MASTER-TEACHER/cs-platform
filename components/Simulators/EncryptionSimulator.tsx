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

type Q = {
  plain: string;
  key: number;
  answer: string;
  hint: string;
  working: string;
};
const toy = (t: string, k: number) =>
  Array.from(t.toUpperCase())
    .map((c) =>
      /[A-Z]/.test(c)
        ? String.fromCharCode(65 + ((c.charCodeAt(0) - 65 + k) % 26))
        : c,
    )
    .join("");
const words = {
  foundation: ["DATA", "CODE"],
  intermediate: ["NETWORK", "SECURITY"],
  higher: ["CONFIDENTIAL", "AUTHENTICATE"],
};
function make(d: Difficulty): Q {
  const plain = words[d][Math.floor(Math.random() * words[d].length)],
    key = 2 + Math.floor(Math.random() * 8),
    answer = toy(plain, key);
  return {
    plain,
    key,
    answer,
    hint: "Apply the same teaching-model key to each alphabetic character.",
    working: `Plaintext ${plain} becomes ${answer} with teaching key ${key}.`,
  };
}
export default function EncryptionSimulator() {
  const { addXP } = useProgress();
  const gen = useCallback((d: Difficulty) => make(d), []);
  const s = useSimulator<Q>({
    initialQuestion: make("foundation"),
    generateQuestion: gen,
    onAwardXP: addXP,
  });
  const [answer, setAnswer] = useState("");
  const [lab, setLab] = useState("COMPUTER SCIENCE");
  const [key, setKey] = useState(4);
  const result = useMemo(() => toy(lab, key), [lab, key]);
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
      <h2 className="mt-2 text-3xl font-black">Encryption Explorer</h2>
      <p className="mt-3 text-slate-600">
        Learn plaintext, ciphertext and keys using a deliberately simple
        teaching cipher. It is not production cryptography.
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
        <p className="text-xs uppercase text-slate-400">Challenge</p>
        <p className="mt-2 text-xl font-black">
          Encrypt {s.question.plain} with teaching key {s.question.key}.
        </p>
      </section>
      <input
        value={answer}
        onChange={(e) => setAnswer(e.target.value.toUpperCase())}
        placeholder="Predicted ciphertext"
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
          examinerTip="Encryption transforms plaintext into ciphertext using a key. Modern encryption uses secure algorithms, not this classroom model."
        />
      </div>
      <section className="mt-8 rounded-3xl border p-6">
        <h3 className="text-xl font-black">Explore mode</h3>
        <input
          value={lab}
          onChange={(e) => setLab(e.target.value)}
          className="mt-4 w-full rounded-xl border px-4 py-3"
        />
        <label className="mt-4 block font-bold">Teaching key: {key}</label>
        <input
          type="range"
          min="1"
          max="25"
          value={key}
          onChange={(e) => setKey(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-4 rounded-xl bg-slate-950 p-4 font-mono text-emerald-300">
          {result}
        </div>
      </section>
    </Card>
  );
}
