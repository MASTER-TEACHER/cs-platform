"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Target,
  TrendingDown,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { useTeacherIntelligence } from "@/hooks/useTeacherIntelligence";
import {
  buildReportSummary,
  getPriorityStudents,
} from "@/services/analytics/teacherIntelligenceIntegrationService";

export default function TeacherPrioritySnapshot() {
  const {
    portfolio,
    loading,
    error,
    refresh,
  } = useTeacherIntelligence();

  if (loading) {
    return (
      <Card className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-teal-800 p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">
            Teacher intelligence
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Priority actions
          </h2>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-hidden rounded-3xl border border-amber-200">
        <div className="bg-amber-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">
            Teacher intelligence
          </p>

          <h2 className="mt-2 text-xl font-black text-amber-950">
            Priority snapshot unavailable
          </h2>

          <p className="mt-2 text-sm text-amber-800">
            {error}
          </p>

          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-4 rounded-xl bg-amber-700 px-4 py-2 text-sm font-black text-white"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  if (!portfolio) {
    return null;
  }

  const summary =
    buildReportSummary(portfolio);

  const priorityStudents =
    getPriorityStudents(portfolio)
      .filter(
        (student) =>
          student.priority !== "none",
      )
      .slice(0, 3);

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-teal-800 p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">
              Teacher intelligence
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Priority actions
            </h2>

            <p className="mt-2 text-sm text-white/70">
              Students and trends that may need attention next.
            </p>
          </div>

          <Link
            href="/teacher/analytics"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-teal-900"
          >
            Full analytics
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <Summary
          label="Below target"
          value={summary.belowTarget}
          icon={<Target className="h-5 w-5" />}
        />

        <Summary
          label="High priority"
          value={summary.highPriority}
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <Summary
          label="Declining"
          value={summary.declining}
          icon={<TrendingDown className="h-5 w-5" />}
        />

        <Summary
          label="Low evidence"
          value={summary.lowEvidence}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <div className="border-t border-slate-100 px-6 pb-6">
        <p className="py-4 text-xs font-black uppercase tracking-wide text-slate-400">
          Review next
        </p>

        {priorityStudents.length === 0 ? (
          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="font-black text-emerald-900">
              No immediate priorities
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              No students currently meet the intervention thresholds.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-3">
            {priorityStudents.map(
              (student) => (
                <Link
                  key={`${student.classId}-${student.studentId}`}
                  href={`/teacher/analytics/${student.studentId}`}
                  className="rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50"
                >
                  <p className="font-black text-slate-900">
                    {student.studentName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {student.workingGrade} →{" "}
                    {student.targetGrade} ·{" "}
                    {student.priority}
                  </p>

                  {student.reasons[0] && (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {student.reasons[0]}
                    </p>
                  )}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function Summary({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
      <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
        {icon}
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-2xl font-black text-slate-950">
          {value}
        </p>
      </div>
    </div>
  );
}
