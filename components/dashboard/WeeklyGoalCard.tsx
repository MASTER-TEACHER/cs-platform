import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

type Props = {
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
};

export default function WeeklyGoalCard({
  completedLessons,
  totalLessons,
  progressPercentage,
}: Props) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Curriculum Progress
      </p>

      <h2 className="mt-3 text-2xl font-bold text-slate-900">
        {completedLessons} / {totalLessons} Lessons
      </h2>

      <p className="mt-2 text-slate-600">
        Progress is calculated only from lessons available in your
        selected qualification and exam board.
      </p>

      <div className="mt-6">
        <ProgressBar
          value={progressPercentage}
        />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-500">
        {progressPercentage}% complete
      </p>
    </Card>
  );
}
