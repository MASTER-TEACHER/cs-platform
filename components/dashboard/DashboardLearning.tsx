import ContinueLearning from "@/components/dashboard/ContinueLearning";
import DailyMission from "@/components/dashboard/DailyMission";
import LearningJourneyCard from "@/components/dashboard/LearningJourneyCard";
import WeeklyGoalCard from "@/components/dashboard/WeeklyGoalCard";

import type {
  StudentJourneyMission,
} from "@/services/studentJourneyService";

type DashboardLearningProps = {
  mission: StudentJourneyMission | null;
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
  curriculumTitle: string;
};

export default function DashboardLearning({
  mission,
  completedLessons,
  totalLessons,
  progressPercentage,
  curriculumTitle,
}: DashboardLearningProps) {
  return (
    <div className="space-y-6">
      <LearningJourneyCard
        mission={mission}
        completedLessons={
          completedLessons
        }
        totalLessons={totalLessons}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ContinueLearning
            mission={mission}
            curriculumTitle={
              curriculumTitle
            }
          />
        </div>

        <WeeklyGoalCard
          completedLessons={
            completedLessons
          }
          totalLessons={
            totalLessons
          }
          progressPercentage={
            progressPercentage
          }
        />
      </div>

      <DailyMission mission={mission} />
    </div>
  );
}
