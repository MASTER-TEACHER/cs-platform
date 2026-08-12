import Link from "next/link";

import Card from "@/components/ui/Card";

type ClassSummaryProps = {
  studentCount: number;
  classCount: number;
  assignmentCount: number;
  activeAssignmentCount: number;
  completionRate: number;
};

export default function ClassSummary({
  studentCount,
  classCount,
  assignmentCount,
  activeAssignmentCount,
  completionRate,
}: ClassSummaryProps) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Teaching Summary
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Workload overview
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <MetricBox label="Classes" value={classCount.toString()} />
        <MetricBox label="Students" value={studentCount.toString()} />
        <MetricBox label="Assignments" value={assignmentCount.toString()} />
        <MetricBox
          label="Currently active"
          value={activeAssignmentCount.toString()}
        />
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-700">
            Overall assignment completion
          </p>

          <p className="font-bold text-slate-900">{completionRate}%</p>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{
              width: `${Math.min(100, Math.max(0, completionRate))}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/teacher/classes"
          className="rounded-xl bg-blue-600 px-5 py-3 text-center font-bold text-white transition hover:bg-blue-700"
        >
          Manage Classes
        </Link>

        <Link
          href="/teacher/assignments"
          className="rounded-xl border border-slate-300 px-5 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
        >
          View Assignments
        </Link>
      </div>
    </Card>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-500">{label}</p>

      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
