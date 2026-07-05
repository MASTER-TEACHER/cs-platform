"use client";

import HeroDashboard from "@/components/dashboard/HeroDashboard";
import StatCard from "@/components/dashboard/StatCard";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import AchievementsCard from "@/components/dashboard/AchievementsCard";
import DailyMission from "@/components/dashboard/DailyMission";
import LearningJourneyCard from "@/components/dashboard/LearningJourneyCard";
import WeeklyGoalCard from "@/components/dashboard/WeeklyGoalCard";
import NextBadgeCard from "@/components/dashboard/NextBadgeCard";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Skeleton from "@/components/ui/Skeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { calculateCourseProgress } from "@/lib/progressEngine";
import { getTotalLessonCount } from "@/lib/curriculumProgress";
import { getDailyMission } from "@/lib/missionEngine";

export default function Dashboard() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-80 w-full" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>

        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const xp = profile?.xp || 0;
  const completedLessons = profile?.completedLessons || [];
  const streak = profile?.streak || 0;
  const badges = profile?.badges || [];

  const totalLessons = getTotalLessonCount();
  const progress = calculateCourseProgress(completedLessons, totalLessons);
  const mission = getDailyMission(completedLessons);
  const missionLink = mission
    ? `/learn/binary?lesson=${mission.lessonId}`
    : "/learn/binary";

  return (
    <div className="space-y-8">
      <HeroDashboard
        name={profile?.name || "Student"}
        xp={xp}
        streak={streak}
        badges={badges.length}
        completedLessons={completedLessons.length}
        missionLink={missionLink}
      />

      <LearningJourneyCard
        mission={mission}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />

      <Card>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Current Course
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {profile?.currentCourse?.toUpperCase() || "No course selected"}
            </h2>
          </div>

          <div className="w-full md:max-w-md">
            <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
              <span>Course Progress</span>
              <span>{progress}%</span>
            </div>

            <ProgressBar value={progress} />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Current XP" value={xp.toString()} icon="⭐" />
        <StatCard
          title="Lessons Completed"
          value={completedLessons.length.toString()}
          icon="📚"
        />
        <StatCard title="Streak" value={streak.toString()} icon="🔥" />
        <StatCard title="Badges" value={badges.length.toString()} icon="🏆" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DailyMission mission={mission} />
        </div>

        <WeeklyGoalCard completedThisWeek={completedLessons.length} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ContinueLearning />
        </div>

        <NextBadgeCard
          unlockedBadges={badges}
          xp={xp}
          completedLessons={completedLessons}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <QuickActions />
        <RecentActivity />

        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Beta Status
          </p>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            CS Master v0.5
          </h2>
          <p className="mt-2 text-slate-600">
            Student experience, lesson engine, XP and achievements are active.
          </p>
        </Card>
      </div>

      <AchievementsCard
        unlockedBadges={badges}
        xp={xp}
        completedLessons={completedLessons}
      />
    </div>
  );
}