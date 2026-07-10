import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AchievementsCard from "@/components/dashboard/AchievementsCard";

type DashboardActivityProps = {
  unlockedBadges: string[];
  xp: number;
  completedLessons: string[];
};

export default function DashboardActivity({
  unlockedBadges,
  xp,
  completedLessons,
}: DashboardActivityProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <QuickActions />
        <RecentActivity />
      </div>

      <AchievementsCard
        unlockedBadges={unlockedBadges}
        xp={xp}
        completedLessons={completedLessons}
      />
    </div>
  );
}