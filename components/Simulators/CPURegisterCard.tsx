import type { CPURegisterName } from "@/types/cpuSimulator";

type Props = {
  register: CPURegisterName;
  label: string;
  value: string | number;
  active: boolean;
  description: string;
};

export default function CPURegisterCard({
  register,
  label,
  value,
  active,
  description,
}: Props) {
  return (
    <article
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        active
          ? "scale-[1.02] border-blue-400 bg-blue-50 shadow-lg"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <h3 className="mt-1 text-2xl font-black text-slate-950">
            {register}
          </h3>
        </div>

        {active && (
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black uppercase text-white">
            Active
          </span>
        )}
      </div>

      <div className="mt-4 rounded-xl bg-slate-950 px-4 py-3 font-mono text-xl font-black text-emerald-300">
        {value === "" ? "—" : value}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
