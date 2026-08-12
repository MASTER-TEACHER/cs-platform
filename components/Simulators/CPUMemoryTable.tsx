import type { CPUMemoryLocation } from "@/types/cpuSimulator";

type Props = {
  memory: CPUMemoryLocation[];
  activeAddress: number | null;
};

export default function CPUMemoryTable({ memory, activeAddress }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h3 className="text-lg font-black text-slate-950">Main Memory</h3>
        <p className="mt-1 text-sm text-slate-600">
          Instructions are stored at numbered memory addresses.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-black uppercase tracking-wider text-slate-500">
              <th className="px-5 py-3">Address</th>
              <th className="px-5 py-3">Instruction</th>
              <th className="px-5 py-3">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {memory.map((location) => {
              const active = activeAddress === location.address;
              return (
                <tr
                  key={location.address}
                  className={`border-b border-slate-100 transition ${
                    active ? "bg-amber-100" : "bg-white"
                  }`}
                >
                  <td className="px-5 py-4 font-mono font-black">
                    {location.address}
                  </td>
                  <td className="px-5 py-4 font-mono font-black text-blue-700">
                    {location.instruction}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {location.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
