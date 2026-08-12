"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";

const protocols = [
  ["HTTPS", "Secure web pages"],
  ["HTTP", "Web pages"],
  ["FTP", "File transfer"],
  ["SMTP", "Sending email"],
  ["IMAP", "Accessing email on a server"],
  ["TCP", "Reliable packet delivery"],
  ["IP", "Addressing and routing"],
] as const;

export default function ProtocolSimulator() {
  const [selected, setSelected] = useState("HTTPS");

  const purpose = protocols.find(([name]) => name === selected)?.[1] ?? "";

  return (
    <Card>
      <p className="text-sm font-black uppercase tracking-widest text-blue-600">
        Interactive simulator
      </p>
      <h2 className="mt-2 text-3xl font-black">Protocol Matcher</h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {protocols.map(([name]) => (
          <button
            key={name}
            type="button"
            onClick={() => setSelected(name)}
            className={`rounded-2xl px-4 py-4 font-black ${
              selected === name
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-7 rounded-3xl bg-indigo-50 p-7 text-center">
        <p className="text-sm font-black uppercase text-indigo-600">
          {selected}
        </p>
        <p className="mt-3 text-3xl font-black text-indigo-950">{purpose}</p>
      </div>
    </Card>
  );
}
