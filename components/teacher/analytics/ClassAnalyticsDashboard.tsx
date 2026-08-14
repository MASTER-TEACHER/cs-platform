"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Gauge,
  Target,
  TrendingDown,
  Users,
} from "lucide-react";

import Card from "@/components/ui/Card";
import GradeDistribution from "@/components/teacher/analytics/GradeDistribution";
import TargetGradeControl from "@/components/teacher/analytics/TargetGradeControl";
import type { TeacherClassAnalytics } from "@/types/teacherAnalytics";

function priorityClasses(priority: string): string {
  if (priority === "high") return "bg-red-100 text-red-700";
  if (priority === "medium") return "bg-amber-100 text-amber-700";
  if (priority === "monitor") return "bg-blue-100 text-blue-700";

  return "bg-emerald-100 text-emerald-700";
}

export default function ClassAnalyticsDashboard({
  analytics,
  teacherId,
  onRefresh,
}: {
  analytics: TeacherClassAnalytics;
  teacherId: string;
  onRefresh: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Average working grade"
          value={analytics.averageWorkingGrade || "—"}
          detail={
            analytics.averageWeightedPercentage !== null
              ? `${analytics.averageWeightedPercentage}% weighted attainment`
              : "Awaiting graded evidence"
          }
          icon={<BarChart3 className="h-5 w-5" />}
        />

        <Metric
          label="Average target"
          value={analytics.averageTargetGrade || "Not set"}
          detail={`${analytics.targetNotSetCount} target${
            analytics.targetNotSetCount === 1 ? "" : "s"
          } still to set`}
          icon={<Target className="h-5 w-5" />}
        />

        <Metric
          label="On / above target"
          value={`${analytics.onOrAboveTargetPercentage}%`}
          detail={`${analytics.onOrAboveTargetCount} student${
            analytics.onOrAboveTargetCount === 1 ? "" : "s"
          }`}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <Metric
          label="High priority"
          value={String(analytics.highPriorityCount)}
          detail={`${analytics.decliningCount} declining · ${analytics.lowEvidenceCount} low evidence`}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border border-slate-200 p-6">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Grade distribution
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Current working-grade distribution for this class.
              </p>
            </div>
          </div>

          <GradeDistribution items={analytics.gradeDistribution} />
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-6">
          <div className="mb-5 flex items-center gap-3">
            <Gauge className="h-5 w-5 text-teal-600" />
            <div>
              <h2 className="text-xl font-black text-slate-950">
                Class mastery priorities
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Lowest-performing topics are shown first.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {analytics.topicAnalytics.length === 0 ? (
              <p className="text-sm text-slate-500">
                Complete graded work to build class mastery.
              </p>
            ) : (
              analytics.topicAnalytics.slice(0, 8).map((topic) => (
                <div key={topic.topic}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        {topic.topic}
                      </p>
                      <p className="text-xs text-slate-500">
                        {topic.studentCount} student
                        {topic.studentCount === 1 ? "" : "s"} · {topic.status}
                      </p>
                    </div>

                    <span className="font-black text-slate-950">
                      {topic.weightedPercentage}%
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                      style={{
                        width: `${topic.weightedPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-3xl border border-slate-200">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-teal-600">
              Student analytics
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">
              Target and intervention tracker
            </h2>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              {analytics.studentCount} students
            </span>
            <span>
              Completion {analytics.averageCompletionRate}%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1180px] w-full text-left">
            <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Working</th>
                <th className="px-5 py-4">Target</th>
                <th className="px-5 py-4">Gap</th>
                <th className="px-5 py-4">Next grade</th>
                <th className="px-5 py-4">Marks to next</th>
                <th className="px-5 py-4">Trend</th>
                <th className="px-5 py-4">Confidence</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {analytics.students.map((student) => (
                <tr key={student.studentId} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-black text-slate-900">
                      {student.studentName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {student.studentEmail}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xl font-black text-slate-950">
                      {student.workingGrade || "—"}
                    </span>
                    <p className="mt-1 text-xs text-slate-500">
                      {student.workingPercentage !== null
                        ? `${student.workingPercentage}%`
                        : "No grade"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <TargetGradeControl
                      studentId={student.studentId}
                      classId={student.classId}
                      teacherId={teacherId}
                      qualification={student.qualification}
                      value={student.targetGrade}
                      onSaved={onRefresh}
                    />
                  </td>

                  <td className="px-5 py-4 font-black">
                    {student.gradeGap === null
                      ? "—"
                      : student.gradeGap >= 0
                        ? `+${student.gradeGap}`
                        : student.gradeGap}
                  </td>

                  <td className="px-5 py-4 font-black">
                    {student.nextGrade || "—"}
                  </td>

                  <td className="px-5 py-4 font-black">
                    {student.marksToNextGrade ?? "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold capitalize text-slate-700">
                      {student.trend === "declining" && (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      {student.trend.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="px-5 py-4 capitalize">
                    {student.confidence}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black capitalize ${priorityClasses(
                        student.interventionPriority,
                      )}`}
                    >
                      {student.interventionPriority}
                    </span>

                    {student.interventionReasons[0] && (
                      <p className="mt-2 max-w-[220px] text-xs leading-5 text-slate-500">
                        {student.interventionReasons[0]}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      href={`/teacher/analytics/${student.studentId}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800"
                    >
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
        </div>

        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          {icon}
        </div>
      </div>
    </Card>
  );
}
