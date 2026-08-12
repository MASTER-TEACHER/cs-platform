"use client";

import type { ProgrammingMode } from "@/types/programming";

type Props = {
  value: ProgrammingMode;
  onChange: (mode: ProgrammingMode) => void;
};

const modes: Array<{
  value: ProgrammingMode;
  title: string;
  description: string;
}> = [
  {
    value: "practice",
    title: "Practice",
    description: "Write code that passes visible and hidden tests.",
  },
  {
    value: "debug",
    title: "Debug",
    description: "Repair broken programs and reason about the fault.",
  },
  {
    value: "explore",
    title: "Explore",
    description: "Run your own Python in an isolated browser worker.",
  },
];

export default function ProgrammingModeTabs({ value, onChange }: Props) {
  return (
    <section className="grid gap-3 lg:grid-cols-3">
      {modes.map((mode) => {
        const active = value === mode.value;

        return (
          <button
            key={mode.value}
            type="button"
            onClick={() => onChange(mode.value)}
            className={`rounded-2xl border-2 p-5 text-left transition ${
              active
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <p className="text-lg font-black text-slate-950">
              {mode.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {mode.description}
            </p>
          </button>
        );
      })}
    </section>
  );
}
