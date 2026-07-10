"use client";

import Skeleton from "@/components/ui/Skeleton";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardLearning from "@/components/dashboard/DashboardLearning";
import DashboardQuiz from "@/components/dashboard/DashboardQuiz";
import DashboardActivity from "@/components/dashboard/DashboardActivity";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useRecentQuiz } from "@/hooks/useRecentQuiz";
import { getDailyMission } from "@/lib/missionEngine";
import { getTotalLessonCount } from "@/lib/curriculumProgress";

export default function DashboardPage() {
  const { profile, loading } = useUserProfile();
  const { quiz: recentQuiz, loading: recentQuizLoading } = useRecentQuiz();

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-72 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const name = profile?.name || "Student";
  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;
  const badges = profile?.badges || [];
  const completedLessons = profile?.completedLessons || [];

  const totalLessons = getTotalLessonCount();
  const mission = getDailyMission(completedLessons);

  return (
    <div className="space-y-8">
      <DashboardHero
        name={name}
        xp={xp}
        streak={streak}
        badges={badges.length}
      />

      <DashboardStats
        xp={xp}
        completedLessons={completedLessons.length}
        streak={streak}
        badges={badges.length}
      />

      <DashboardLearning
        mission={mission}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />

      <DashboardQuiz
        recentQuiz={recentQuiz}
        recentQuizLoading={recentQuizLoading}
        unlockedBadges={badges}
        xp={xp}
        completedLessons={completedLessons}
      />

      <DashboardActivity
        unlockedBadges={badges}
        xp={xp}
        completedLessons={completedLessons}
      />
    </div>
  );
}