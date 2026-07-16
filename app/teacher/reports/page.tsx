"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";

export default function TeacherReportsPage() {
  const {
    studentCount,
    classCount,
    assignmentCount,
    activeAssignmentCount,
    averageScore,
    completionRate,
    lessonsCompleted,
    completedToday,
    atRiskStudents,
    topStudents,
    classPerformance,
    loading,
  } = useTeacherDashboard();

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>

        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-100">
              Teacher Portal
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Reports
            </h1>

            <p className="mt-3 max-w-2xl text-emerald-100">
              Review whole-platform performance, completion and student support
              information.
            </p>
          </div>

          <Link
            href="/teacher"
            className="rounded-xl bg-white px-5 py-3 text-center font-bold text-teal-700 transition hover:bg-emerald-50"
          >
            ← Teacher Dashboard
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Students" value={studentCount.toString()} icon="👨‍🎓" />
        <SummaryCard label="Classes" value={classCount.toString()} icon="🏫" />
        <SummaryCard
          label="Assignments"
          value={assignmentCount.toString()}
          icon="📋"
        />
        <SummaryCard
          label="Active Assignments"
          value={activeAssignmentCount.toString()}
          icon="✅"
        />
        <SummaryCard
          label="Average Score"
          value={`${averageScore}%`}
          icon="📊"
        />
        <SummaryCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon="📈"
        />
        <SummaryCard
          label="Completed Today"
          value={completedToday.toString()}
          icon="🕒"
        />
        <SummaryCard
          label="Lessons Completed"
          value={lessonsCompleted.toString()}
          icon="📚"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Intervention Report
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Students Requiring Support
          </h2>

          {atRiskStudents.length === 0 ? (
            <p className="mt-6 text-slate-600">
              No students are currently flagged for targeted support.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {atRiskStudents.map((student) => (
                <div
                  key={student.id}
                  className="rounded-2xl border border-red-200 bg-red-50 p-5"
                >
                  <p className="font-bold text-slate-900">{student.name}</p>

                  <p className="mt-2 text-sm text-slate-700">
                    Average score:{" "}
                    <span className="font-bold">{student.averageScore}%</span>
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {student.recommendedAction}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
            Achievement Report
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Top Students
          </h2>

          {topStudents.length === 0 ? (
            <p className="mt-6 text-slate-600">
              No student ranking data is available yet.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {topStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {index + 1}. {student.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      🔥 {student.streak} streak · 🏆 {student.badges} badges
                    </p>
                  </div>

                  <p className="font-bold text-amber-700">
                    ⭐ {student.xp} XP
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Topic Report
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Performance by Topic
        </h2>

        {classPerformance.length === 0 ? (
          <p className="mt-6 text-slate-600">
            No topic performance information is available yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {classPerformance.map((topic) => (
              <div
                key={topic.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-bold text-slate-900">{topic.topic}</p>

                  <p className="font-bold text-blue-700">
                    {topic.averageScore}%
                  </p>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, topic.averageScore)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}