import StatCard from "@/components/dashboard/StatCard";

type DashboardStatsProps = {
  xp: number;
  completedLessons: number;
  streak: number;
  badges: number;
};

export default function DashboardStats({
  xp,
  completedLessons,
  streak,
  badges,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Current XP"
        value={xp.toString()}
        icon="⭐"
      />

      <StatCard
        title="Lessons Completed"
        value={completedLessons.toString()}
        icon="📚"
      />

      <StatCard
        title="Current Streak"
        value={streak.toString()}
        icon="🔥"
      />

      <StatCard
        title="Badges"
        value={badges.toString()}
        icon="🏆"
      />
    </div>
  );
}