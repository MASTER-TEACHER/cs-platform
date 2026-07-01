"use client";

import ContinueLearning from "@/components/dashboard/ContinueLearning";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useProgress } from "@/contexts/ProgressContext";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCard from "@/components/dashboard/StatCard";
import TodaysGoal from "@/components/dashboard/TodaysGoal";
import QuickActions from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  const { xp, completedLessons } = useProgress();

  return (
    <div className="space-y-6">
      <WelcomeBanner name="Champ" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Current XP" value={xp.toString()} icon="⭐" />
        <StatCard title="Lessons" value={completedLessons.toString()} icon="📚" />
        <StatCard title="Streak" value="3" icon="🔥" />
        <StatCard title="Badges" value="1" icon="🏆" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

  <div className="lg:col-span-2">
    <ContinueLearning />
  </div>

  <TodaysGoal />

</div>

<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

  <RecentActivity />

  <QuickActions />

</div>
    </div>
  );
}