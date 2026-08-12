"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

const routes = [
  ["A", "Router 1", "Router 3", "Destination"],
  ["B", "Router 2", "Router 4", "Destination"],
  ["C", "Router 1", "Router 4", "Destination"],
];

export default function PacketRoutingSimulator() {
  const [packet, setPacket] = useState(0);

  const route = routes[packet % routes.length];

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>
      <h2 className="mt-2 text-3xl font-black">Packet Routing</h2>
      <p className="mt-3 text-slate-600">
        Send packets and observe that packets from one message can take
        different routes.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {route.map((node, index) => (
          <div key={`${node}-${index}`} className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 px-5 py-4 font-black text-blue-950">
              {node}
            </div>
            {index < route.length - 1 && <span className="text-2xl">→</span>}
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-2xl bg-emerald-50 p-5">
        <p className="font-black text-emerald-950">
          Packet {packet + 1} uses route {route[0]}
        </p>
        <p className="mt-2 text-sm text-emerald-900">
          Sequence numbers allow packets to be reordered at the destination.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setPacket((current) => current + 1)}
        className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-black text-white"
      >
        Send next packet →
      </button>
    </Card>
  );
}
