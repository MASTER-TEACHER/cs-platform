"use client";

import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";

const processes = [
  { id: "browser", name: "Browser", memory: 3 },
  { id: "music", name: "Music", memory: 1 },
  { id: "editor", name: "Editor", memory: 4 },
  { id: "update", name: "System Update", memory: 2 },
];

export default function OperatingSystemSimulator() {
  const [activeIds, setActiveIds] = useState<string[]>(["browser", "music"]);
  const [tick, setTick] = useState(0);

  const active = useMemo(
    () => processes.filter((process) => activeIds.includes(process.id)),
    [activeIds],
  );

  const scheduled = active.length > 0 ? active[tick % active.length] : null;

  const memoryUsed = active.reduce(
    (total, process) => total + process.memory,
    0,
  );

  function toggle(id: string) {
    setActiveIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
    setTick(0);
  }

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>

      <h2 className="mt-2 text-3xl font-black text-slate-950">
        Operating-System Process Manager
      </h2>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {processes.map((process) => {
          const activeProcess = activeIds.includes(process.id);

          return (
            <button
              key={process.id}
              type="button"
              onClick={() => toggle(process.id)}
              className={`rounded-2xl border p-4 text-left ${
                activeProcess
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="font-black">{process.name}</p>
              <p className="mt-2 text-sm text-slate-600">{process.memory} GB</p>
            </button>
          );
        })}
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl bg-slate-950 p-6 text-white">
          <p className="text-xs font-black uppercase text-slate-400">
            CPU allocated to
          </p>
          <p className="mt-3 text-3xl font-black">
            {scheduled?.name ?? "No process"}
          </p>

          <button
            type="button"
            onClick={() => setTick((current) => current + 1)}
            disabled={active.length === 0}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-black disabled:bg-slate-600"
          >
            Next time slice →
          </button>
        </section>

        <section className="rounded-3xl bg-emerald-50 p-6">
          <p className="text-xs font-black uppercase text-emerald-600">
            Memory allocated
          </p>
          <p className="mt-3 text-3xl font-black text-emerald-950">
            {memoryUsed} GB
          </p>
        </section>
      </div>
    </Card>
  );
}
