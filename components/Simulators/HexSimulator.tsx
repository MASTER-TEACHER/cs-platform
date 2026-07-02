"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useProgress } from "@/contexts/ProgressContext";

const hexDigits = "0123456789ABCDEF".split("");

function randomTarget() {
  return Math.floor(Math.random() * 256);
}

export default function HexSimulator() {
  const { addXP } = useProgress();

  const [target, setTarget] = useState(randomTarget());
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const correctHex = target.toString(16).toUpperCase().padStart(2, "0");

  function addDigit(digit: string) {
    if (answer.length < 2) {
      setAnswer((prev) => prev + digit);
      setMessage("");
    }
  }

  function clearAnswer() {
    setAnswer("");
    setMessage("");
    setCorrect(false);
  }

  function checkAnswer() {
    if (answer === correctHex) {
      setCorrect(true);
      setMessage("🏆 Excellent! +50 XP earned.");
      setScore((prev) => prev + 1);
      addXP(50);
    } else {
      setCorrect(false);
      setMessage(`❌ Not quite. The correct answer is ${correctHex}.`);
    }
  }

  function nextChallenge() {
    setTarget(randomTarget());
    setAnswer("");
    setMessage("");
    setCorrect(false);
  }

  return (
    <Card>
      <h2 className="text-3xl font-bold text-slate-900">
        Interactive Hexadecimal Challenge
      </h2>

      <p className="mt-2 text-slate-600">
        Convert the target denary number into hexadecimal.
      </p>

      <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-6 text-center">
        <p className="text-sm uppercase tracking-widest text-purple-600">
          Convert this denary number
        </p>

        <h1 className="mt-2 text-6xl font-bold text-purple-700">{target}</h1>
      </div>

      <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
        <p className="text-sm text-slate-500">Challenge Progress</p>
        <p className="text-2xl font-bold text-emerald-700">
          {score} Correct
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-100 p-6 text-center">
        <p className="text-sm text-slate-500">Your Hexadecimal Answer</p>
        <p className="mt-3 font-mono text-5xl font-bold tracking-widest text-slate-900">
          {answer || "__"}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-3">
        {hexDigits.map((digit) => (
          <button
            key={digit}
            onClick={() => addDigit(digit)}
            className="rounded-xl bg-slate-200 py-4 text-xl font-bold transition hover:scale-105 hover:bg-purple-100"
          >
            {digit}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Button onClick={checkAnswer}>Check Answer</Button>
        <button
          onClick={clearAnswer}
          className="w-full rounded-xl border border-slate-300 px-6 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Clear
        </button>
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
          🏅 Hex Hero Badge Unlocked!
        </div>
      )}
    </Card>
  );
}