import type { ProgrammingAssignmentResultsSummary } from "@/types/programmingAssignment";

function formatDate(value: Date | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default function ProgrammingAssignmentResults({
  summary,
}: {
  summary: ProgrammingAssignmentResultsSummary;
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Students"
          value={summary.results.length}
        />
        <Metric
          label="Completed"
          value={summary.completed}
        />
        <Metric
          label="In progress"
          value={summary.inProgress}
        />
        <Metric
          label="Not started"
          value={summary.notStarted}
        />
        <Metric
          label="Average tests"
          value={`${summary.averagePercentage}%`}
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-xl font-black text-slate-950">
            Student programming results
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Completion: {summary.completionPercentage}%
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  Student
                </th>
                <th className="px-5 py-4">
                  Status
                </th>
                <th className="px-5 py-4">
                  Attempts
                </th>
                <th className="px-5 py-4">
                  Tests
                </th>
                <th className="px-5 py-4">
                  Percentage
                </th>
                <th className="px-5 py-4">
                  Completed
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {summary.results.map((result) => (
                <tr key={result.studentId}>
                  <td className="px-5 py-4 font-bold text-slate-900">
                    {result.studentName}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge
                      status={result.status}
                    />
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {result.attempts}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {result.totalTests > 0
                      ? `${result.passedCount}/${result.totalTests}`
                      : "—"}
                  </td>

                  <td className="px-5 py-4 font-black text-slate-800">
                    {result.attempts > 0
                      ? `${result.percentage}%`
                      : "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(
                      result.completedAt,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "not_started"
    | "in_progress"
    | "completed";
}) {
  const classes = {
    not_started:
      "bg-slate-100 text-slate-700",
    in_progress:
      "bg-amber-100 text-amber-800",
    completed:
      "bg-emerald-100 text-emerald-800",
  };

  const labels = {
    not_started: "Not started",
    in_progress: "In progress",
    completed: "Completed",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${classes[status]}`}
    >
      {labels[status]}
    </span>
  );
}
