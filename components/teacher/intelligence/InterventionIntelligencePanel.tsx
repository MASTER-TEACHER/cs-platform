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
import { getPriorityStudents } from "@/services/analytics/teacherIntelligenceIntegrationService";

function badge(priority: string): string {
  if (priority === "high") return "bg-red-100 text-red-700";
  if (priority === "medium") return "bg-amber-100 text-amber-700";
  if (priority === "monitor") return "bg-blue-100 text-blue-700";
  return "bg-emerald-100 text-emerald-700";
}

export default function InterventionIntelligencePanel() {
  const { portfolio, loading, error } = useTeacherIntelligence();

  if (loading) {
    return (
      <Card className="h-52 animate-pulse rounded-3xl bg-slate-100">
        <div className="h-full" />
      </Card>
    );
  }

  if (error || !portfolio) {
    return null;
  }

  const students = getPriorityStudents(portfolio).filter(
    (student) => student.priority !== "none",
  );

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="flex flex-col gap-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-amber-50 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-xs font-black uppercase tracking-[0.16em]">
              Analytics priorities
            </p>
          </div>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Students requiring attention
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Priorities are generated from target gaps, recent trends,
            completion, evidence confidence and topic mastery.
          </p>
        </div>

        <Link
          href="/teacher/analytics"
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-black text-white"
        >
          Open full analytics
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {students.length === 0 ? (
          <div className="p-7 text-sm text-slate-500">
            No students currently meet the analytics intervention thresholds.
          </div>
        ) : (
          students.slice(0, 12).map((student) => (
            <div
              key={`${student.classId}-${student.studentId}`}
              className="grid gap-4 p-5 lg:grid-cols-[1.4fr_.7fr_.7fr_1fr_1.4fr_auto] lg:items-center"
            >
              <div>
                <p className="font-black text-slate-950">
                  {student.studentName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {student.className}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Working / target
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {student.workingGrade} → {student.targetGrade}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Gap
                </p>
                <p className="mt-1 font-black text-slate-900">
                  {student.gap === null
                    ? "—"
                    : student.gap >= 0
                      ? `+${student.gap}`
                      : student.gap}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Weakest topic
                </p>
                <p className="mt-1 text-sm font-black text-slate-900">
                  {student.weakestTopic}
                </p>
                {student.weakestTopicPercentage !== null && (
                  <p className="text-xs text-slate-500">
                    {student.weakestTopicPercentage}% mastery
                  </p>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black capitalize ${badge(
                      student.priority,
                    )}`}
                  >
                    {student.priority}
                  </span>

                  {student.trend === "declining" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Declining
                    </span>
                  )}

                  {student.gap !== null && student.gap < 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
                      <Target className="h-3.5 w-3.5" />
                      Below target
                    </span>
                  )}
                </div>

                {student.reasons[0] && (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {student.reasons[0]}
                  </p>
                )}
              </div>

              <Link
                href={`/teacher/analytics/${student.studentId}`}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 text-xs font-black text-white"
              >
                Review
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
