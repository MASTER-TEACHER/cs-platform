"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

const steps = [
  "User enters a domain name",
  "Browser checks local cache",
  "A DNS resolver is contacted",
  "DNS returns the matching IP address",
  "Browser contacts the web server",
];

export default function DNSJourneySimulator() {
  const [step, setStep] = useState(0);

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>
      <h2 className="mt-2 text-3xl font-black">DNS Journey</h2>

      <div className="mt-7 rounded-3xl bg-slate-950 p-8 text-white">
        <p className="text-sm font-black uppercase text-slate-400">
          Step {step + 1} of {steps.length}
        </p>
        <p className="mt-4 text-3xl font-black">{steps[step]}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
          className="rounded-xl border border-slate-300 px-5 py-3 font-black disabled:opacity-40"
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={() =>
            setStep((current) => Math.min(steps.length - 1, current + 1))
          }
          disabled={step === steps.length - 1}
          className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white disabled:bg-slate-300"
        >
          Next →
        </button>

        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-xl bg-slate-100 px-5 py-3 font-black"
        >
          Reset
        </button>
      </div>
    </Card>
  );
}
