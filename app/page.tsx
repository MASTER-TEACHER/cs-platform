"use client";

import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCard from "@/components/dashboard/StatCard";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import AchievementsCard from "@/components/dashboard/AchievementsCard";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { calculateCourseProgress } from "@/lib/progressEngine";
import { getTotalLessonCount } from "@/lib/curriculumProgress";

export default function Dashboard() {
  const profile = useUserProfile();

  const xp = profile?.xp || 0;
  const completedLessons = profile?.completedLessons || [];
  const streak = profile?.streak || 0;
  // profile type may not include 'badges' in its definition; coerce safely
  const badges: string[] = ((profile as any)?.badges as string[]) || [];

  const totalLessons = getTotalLessonCount();
  const progress = calculateCourseProgress(completedLessons, totalLessons);

  return (
    <div className="space-y-8">
      <WelcomeBanner name={profile?.name || "Student"} />

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
          <ContinueLearning />
        </div>

        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AchievementsCard
            unlockedBadges={badges}
            xp={xp}
            completedLessons={completedLessons}
          />
        </div>

        <RecentActivity />
      </div>
    </div>
  );
}