import ContinueLearning from "@/components/dashboard/ContinueLearning";
import DailyMission from "@/components/dashboard/DailyMission";
import LearningJourneyCard from "@/components/dashboard/LearningJourneyCard";
import WeeklyGoalCard from "@/components/dashboard/WeeklyGoalCard";

type Mission = {
  topic: string;
  lesson: string;
  lessonId: string;
  xp: number;
  difficulty: string;
  estimatedTime: string;
} | null;

type DashboardLearningProps = {
  mission: Mission;
  completedLessons: string[];
  totalLessons: number;
};

export default function DashboardLearning({
  mission,
  completedLessons,
  totalLessons,
}: DashboardLearningProps) {
  return (
    <div className="space-y-6">
      <LearningJourneyCard
        mission={mission}
        completedLessons={completedLessons}
        totalLessons={totalLessons}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ContinueLearning />
        </div>

        <WeeklyGoalCard completedThisWeek={completedLessons.length} />
      </div>

      <DailyMission mission={mission} />
    </div>
  );
}