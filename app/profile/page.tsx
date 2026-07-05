"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import AchievementsCard from "@/components/dashboard/AchievementsCard";
import Skeleton from "@/components/ui/Skeleton";
import { useUserProfile } from "@/hooks/useUserProfile";
import { calculateCourseProgress } from "@/lib/progressEngine";
import { getTotalLessonCount } from "@/lib/curriculumProgress";

export default function ProfilePage() {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const xp = profile?.xp || 0;
  const completedLessons = profile?.completedLessons || [];
  const badges = profile?.badges || [];
  const streak = profile?.streak || 0;

  const totalLessons = getTotalLessonCount();
  const progress = calculateCourseProgress(completedLessons, totalLessons);

  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-900 to-blue-700 text-white">
        <div className="text-6xl">👤</div>

        <h1 className="mt-6 text-4xl font-bold">
          {profile?.name || "Student"}
        </h1>

        <p className="mt-2 text-blue-100">
          {profile?.email || "No email found"}
        </p>

        <p className="mt-4 inline-flex rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
          {profile?.currentCourse?.toUpperCase() || "No course selected"}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <p className="text-sm text-slate-500">XP</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{xp}</h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Lessons</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {completedLessons.length}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Badges</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {badges.length}
          </h2>
        </Card>

        <Card>
          <p className="text-sm text-slate-500">Streak</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {streak}
          </h2>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex justify-between text-sm font-semibold text-slate-600">
          <span>Course Progress</span>
          <span>{progress}%</span>
        </div>

        <ProgressBar value={progress} />
      </Card>

      <AchievementsCard
        unlockedBadges={badges}
        xp={xp}
        completedLessons={completedLessons}
      />
    </div>
  );
}