"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

type Topology = "star" | "bus" | "mesh";

const details: Record<
  Topology,
  { title: string; benefit: string; risk: string }
> = {
  star: {
    title: "Star",
    benefit: "Easy to manage and a cable failure usually affects one device.",
    risk: "The central switch is a single point of failure.",
  },
  bus: {
    title: "Bus",
    benefit: "Uses less cable and can be inexpensive.",
    risk: "A backbone fault can disrupt the whole network.",
  },
  mesh: {
    title: "Mesh",
    benefit: "Alternative routes can improve reliability.",
    risk: "Many connections increase cost and complexity.",
  },
};

export default function NetworkTopologySimulator() {
  const [topology, setTopology] = useState<Topology>("star");

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>
      <h2 className="mt-2 text-3xl font-black">Topology Explorer</h2>

      <div className="mt-6 flex flex-wrap gap-3">
        {(Object.keys(details) as Topology[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTopology(item)}
            className={`rounded-xl px-5 py-3 font-black ${
              topology === item
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {details[item].title}
          </button>
        ))}
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <div className="flex min-h-72 items-center justify-center rounded-3xl bg-slate-950 p-8 text-white">
          <div className="text-center">
            <div className="text-7xl">
              {topology === "star" ? "✳️" : topology === "bus" ? "↔️" : "🕸️"}
            </div>
            <p className="mt-5 text-3xl font-black">
              {details[topology].title} topology
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <section className="rounded-3xl bg-emerald-50 p-6">
            <p className="font-black text-emerald-950">Advantage</p>
            <p className="mt-3 text-emerald-900">{details[topology].benefit}</p>
          </section>
          <section className="rounded-3xl bg-rose-50 p-6">
            <p className="font-black text-rose-950">Disadvantage</p>
            <p className="mt-3 text-rose-900">{details[topology].risk}</p>
          </section>
        </div>
      </div>
    </Card>
  );
}
