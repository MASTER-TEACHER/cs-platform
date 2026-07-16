"use client";

import TeacherHero from "@/components/teacher/TeacherHero";
import RecentStudentActivity from "@/components/teacher/RecentStudentActivity";
import AtRiskStudents from "@/components/teacher/AtRiskStudents";
import TopStudents from "@/components/teacher/TopStudents";
import ClassPerformance from "@/components/teacher/ClassPerformance";
import TeacherQuickActions from "@/components/teacher/TeacherQuickActions";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTeacherDashboard } from "@/hooks/useTeacherDashboard";

export default function TeacherPage() {
  const { profile, loading: profileLoading } = useUserProfile();

  const {
    studentCount,
    classCount,
    assignmentCount,
    activeAssignmentCount,
    averageScore,
    completionRate,
    lessonsCompleted,
    completedToday,
    recentActivities,
    atRiskStudents,
    topStudents,
    classPerformance,
    loading: dashboardLoading,
  } = useTeacherDashboard();

  const loading = profileLoading || dashboardLoading;

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-56 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <Skeleton className="h-80 w-full" />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <TeacherHero name={profile?.name || "Teacher"} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Students"
          value={studentCount.toString()}
          icon="👨‍🎓"
        />

        <SummaryCard
          label="Classes"
          value={classCount.toString()}
          icon="🏫"
        />

        <SummaryCard
          label="Total Assignments"
          value={assignmentCount.toString()}
          icon="📋"
        />

        <SummaryCard
          label="Active Assignments"
          value={activeAssignmentCount.toString()}
          icon="✅"
        />

        <SummaryCard
          label="Average Quiz Score"
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

      <TeacherQuickActions />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentStudentActivity activities={recentActivities} />

        <TopStudents students={topStudents} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AtRiskStudents students={atRiskStudents} />

        <ClassPerformance topics={classPerformance} />
      </div>
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
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="text-3xl">{icon}</div>
      </div>
    </Card>
  );
}