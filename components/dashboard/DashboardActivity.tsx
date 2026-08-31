import AchievementsCard from "@/components/dashboard/AchievementsCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";

import type { RecentQuiz } from "@/hooks/useRecentQuiz";
import type { StudentJourneyMission } from "@/services/studentJourneyService";

type DashboardActivityProps = {
  unlockedBadges: string[];
  xp: number;
  completedLessons: string[];
  mission: StudentJourneyMission | null;
  recentQuiz: RecentQuiz | null;
};

export default function DashboardActivity({
  unlockedBadges,
  xp,
  completedLessons,
  mission,
  recentQuiz,
}: DashboardActivityProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <QuickActions mission={mission} />

        <RecentActivity
          mission={mission}
          recentQuiz={recentQuiz}
        />
      </div>

      <AchievementsCard
        unlockedBadges={unlockedBadges}
        xp={xp}
        completedLessons={completedLessons}
      />
    </div>
  );
}
