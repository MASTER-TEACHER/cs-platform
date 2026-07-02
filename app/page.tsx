"use client";

import ContinueLearning from "@/components/dashboard/ContinueLearning";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useProgress } from "@/contexts/ProgressContext";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import Card from "@/components/ui/Card";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Dashboard() {
  const { xp, completedLessons } = useProgress();
  const profile = useUserProfile();

  return (
    <div className="space-y-6">
      <WelcomeBanner name={profile?.name || "Student"} />

      <Card>
        <h2 className="text-xl font-bold text-slate-900">Current Course</h2>
        <p className="mt-2 text-slate-600">
          {profile?.currentCourse?.toUpperCase() || "No course selected"}
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Current XP" value={xp.toString()} icon="⭐" />
        <StatCard title="Lessons" value={completedLessons.toString()} icon="📚" />
        <StatCard title="Streak" value={(profile?.streak || 0).toString()} icon="🔥" />
        <StatCard title="Badges" value="1" icon="🏆" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContinueLearning />
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}