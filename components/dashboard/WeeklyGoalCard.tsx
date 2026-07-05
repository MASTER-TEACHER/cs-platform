import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

type Props = {
  completedThisWeek: number;
  weeklyTarget?: number;
};

export default function WeeklyGoalCard({
  completedThisWeek,
  weeklyTarget = 10,
}: Props) {
  const progress = Math.min(
    100,
    Math.round((completedThisWeek / weeklyTarget) * 100)
  );

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Weekly Goal
      </p>

      <h2 className="mt-3 text-2xl font-bold text-slate-900">
        {completedThisWeek} / {weeklyTarget} Lessons
      </h2>

      <p className="mt-2 text-slate-600">
        Complete {weeklyTarget} lessons this week to stay on track.
      </p>

      <div className="mt-6">
        <ProgressBar value={progress} />
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-500">
        {progress}% complete
      </p>
    </Card>
  );
}