export default function RevisionPlanProgress({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = total ? Math.round((completed / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm font-bold text-slate-600">
        <span>
          {completed}/{total} steps
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
