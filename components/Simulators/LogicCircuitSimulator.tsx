"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

export default function LogicCircuitSimulator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);

  const x = a === 1 || b === 1 ? 1 : 0;
  const q = x === 1 && c === 1 ? 1 : 0;

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>
      <h2 className="mt-2 text-3xl font-black">Logic Circuit Builder</h2>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setA((value) => (value === 0 ? 1 : 0))}
          className="rounded-2xl bg-slate-950 px-6 py-5 text-white"
        >
          <p className="text-xs font-black uppercase text-slate-400">A</p>
          <p className="mt-2 text-4xl font-black">{a}</p>
        </button>

        <button
          type="button"
          onClick={() => setB((value) => (value === 0 ? 1 : 0))}
          className="rounded-2xl bg-slate-950 px-6 py-5 text-white"
        >
          <p className="text-xs font-black uppercase text-slate-400">B</p>
          <p className="mt-2 text-4xl font-black">{b}</p>
        </button>

        <button
          type="button"
          onClick={() => setC((value) => (value === 0 ? 1 : 0))}
          className="rounded-2xl bg-slate-950 px-6 py-5 text-white"
        >
          <p className="text-xs font-black uppercase text-slate-400">C</p>
          <p className="mt-2 text-4xl font-black">{c}</p>
        </button>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl bg-blue-50 p-6 text-center">
          <p className="font-black">X = A OR B</p>
          <p className="mt-2 text-4xl font-black">{x}</p>
        </div>
        <div className="rounded-3xl bg-violet-50 p-6 text-center">
          <p className="font-black">Q = X AND C</p>
          <p className="mt-2 text-4xl font-black">{q}</p>
        </div>
        <div className="rounded-3xl bg-emerald-50 p-6 text-center">
          <p className="font-black">Final output</p>
          <p className="mt-2 text-4xl font-black">{q}</p>
        </div>
      </div>
    </Card>
  );
}
