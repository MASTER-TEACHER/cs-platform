const items = [
  ["Priority", "bg-red-100 text-red-700"],
  ["Developing", "bg-amber-100 text-amber-700"],
  ["Secure", "bg-emerald-100 text-emerald-700"],
  ["Mastered", "bg-violet-100 text-violet-700"],
  ["Not assessed", "bg-slate-100 text-slate-600"],
] as const;

export default function KnowledgeMapLegend() {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(([label, className]) => (
        <span
          key={label}
          className={`rounded-full px-3 py-1 text-xs font-bold ${className}`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
