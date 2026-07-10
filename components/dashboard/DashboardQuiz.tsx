import LatestQuizCard from "@/components/dashboard/LatestQuizCard";
import NextBadgeCard from "@/components/dashboard/NextBadgeCard";
import type { RecentQuiz } from "@/hooks/useRecentQuiz";

type DashboardQuizProps = {
  recentQuiz: RecentQuiz | null;
  recentQuizLoading: boolean;
  unlockedBadges: string[];
  xp: number;
  completedLessons: string[];
};

export default function DashboardQuiz({
  recentQuiz,
  recentQuizLoading,
  unlockedBadges,
  xp,
  completedLessons,
}: DashboardQuizProps) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <LatestQuizCard
        quiz={recentQuiz}
        loading={recentQuizLoading}
      />

      <NextBadgeCard
        unlockedBadges={unlockedBadges}
        xp={xp}
        completedLessons={completedLessons}
      />
    </div>
  );
}