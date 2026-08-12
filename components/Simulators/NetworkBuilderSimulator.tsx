"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

const devices = ["Laptop", "Desktop", "Printer", "Server"];

export default function NetworkBuilderSimulator() {
  const [connected, setConnected] = useState<string[]>(["Laptop", "Server"]);

  function toggle(device: string) {
    setConnected((current) =>
      current.includes(device)
        ? current.filter((item) => item !== device)
        : [...current, device],
    );
  }

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>
      <h2 className="mt-2 text-3xl font-black">Network Builder</h2>
      <p className="mt-3 text-slate-600">
        Connect devices to a central switch and build a simple LAN.
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="grid gap-3">
          {devices.map((device) => (
            <button
              key={device}
              type="button"
              onClick={() => toggle(device)}
              className={`rounded-2xl border p-4 text-left font-black ${
                connected.includes(device)
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              {device}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-slate-950 p-7 text-center text-white">
          <div className="text-5xl">🔀</div>
          <p className="mt-3 text-xl font-black">Switch</p>
          <p className="mt-2 text-sm text-slate-300">
            {connected.length} devices connected
          </p>
        </div>

        <div className="rounded-3xl bg-emerald-50 p-6">
          <p className="text-sm font-black uppercase text-emerald-600">
            LAN status
          </p>
          <p className="mt-3 text-2xl font-black text-emerald-950">
            {connected.length >= 2 ? "Network active" : "Add more devices"}
          </p>
          <p className="mt-3 text-sm leading-6 text-emerald-900">
            A switch forwards frames between connected devices inside the LAN.
          </p>
        </div>
      </div>
    </Card>
  );
}
