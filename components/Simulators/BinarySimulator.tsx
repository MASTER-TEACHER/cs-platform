"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useProgress } from "@/contexts/ProgressContext";

const placeValues = [128, 64, 32, 16, 8, 4, 2, 1];

function randomTarget() {
  return Math.floor(Math.random() * 256);
}

export default function BinarySimulator() {
  const { addXP } = useProgress();

  const [bits, setBits] = useState<number[]>(Array(8).fill(0));
  const [target, setTarget] = useState<number | null>(null);

useEffect(() => {
  setTarget(randomTarget());
}, []);
  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const denary = bits.reduce(
    (total, bit, index) => total + bit * placeValues[index],
    0
  );

  function toggleBit(index: number) {
    const updated = [...bits];
    updated[index] = updated[index] === 0 ? 1 : 0;
    setBits(updated);
    setMessage("");
  }

  function checkAnswer() {
  if (target === null) return;

  if (denary === target) {
    setCorrect(true);
    setMessage("🏆 Excellent! +50 XP earned. Keep going!");
    setScore((prev) => prev + 1);
    addXP(50);
  } else {
    setCorrect(false);
    setMessage("❌ Not quite. Try again!");
  }
}

  function nextChallenge() {
    setBits(Array(8).fill(0));
    setTarget(randomTarget());
    setMessage("");
    setCorrect(false);
  }

  return (
    <Card>
      <h2 className="text-3xl font-bold text-slate-900">
        Interactive Binary Challenge
      </h2>

      <p className="mt-2 text-slate-600">
        Build the target denary number using binary.
      </p>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
        <p className="text-sm uppercase tracking-widest text-blue-600">
          Build this number
        </p>

      <h1 className="mt-2 text-6xl font-bold text-blue-700">
  {target ?? "--"}
</h1>
      </div>

      <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
        <p className="text-sm text-slate-500">Challenge Progress</p>
        <p className="text-2xl font-bold text-emerald-700">
          {score} Correct
        </p>
      </div>

      <div className="mt-10 grid grid-cols-8 gap-3">
        {placeValues.map((value) => (
          <div key={value} className="text-center font-semibold text-slate-500">
            {value}
          </div>
        ))}

        {bits.map((bit, index) => (
          <button
            key={index}
            onClick={() => toggleBit(index)}
            className={`rounded-xl py-5 text-2xl font-bold transition-all duration-300 ${
              bit
                ? "scale-105 bg-blue-600 text-white shadow-xl"
                : "bg-slate-200 hover:scale-105 hover:bg-slate-300"
            }`}
          >
            {bit}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-100 p-6">
          <p className="text-sm text-slate-500">Current Binary</p>
          <p className="mt-3 font-mono text-3xl font-bold tracking-widest">
            {bits.join("")}
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-6">
          <p className="text-sm text-slate-500">Current Denary</p>
          <p className="mt-3 text-3xl font-bold text-blue-700">{denary}</p>
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={checkAnswer}>Check Answer</Button>
      </div>

      {message && (
        <div
          className={`mt-6 rounded-2xl p-5 text-center text-lg font-semibold ${
            correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          <p>{message}</p>

          {correct && (
            <div className="mt-5">
              <Button onClick={nextChallenge}>Next Challenge →</Button>
            </div>
          )}
        </div>
      )}

      {score >= 5 && (
        <div className="mt-6 rounded-xl bg-yellow-100 p-5 text-center font-semibold text-yellow-800">
          🏅 Binary Beginner Badge Unlocked!
        </div>
      )}
    </Card>
  );
}