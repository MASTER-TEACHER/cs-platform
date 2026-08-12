export default function MasteryProgress({ value }: { value: number }) {
  const safe = Math.max(0, Math.min(100, value));

  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
