import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

type Mission = {
  topic: string;
  lesson: string;
  lessonId: string;
  xp: number;
  difficulty: string;
  estimatedTime: string;
} | null;

type Props = {
  mission: Mission;
  completedLessons: string[];
  totalLessons: number;
};

export default function LearningJourneyCard({
  mission,
  completedLessons,
  totalLessons,
}: Props) {
  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons.length / totalLessons) * 100);

  if (!mission) {
    return (
      <Card>
        <h2 className="text-2xl font-bold text-slate-900">
          🎉 Journey Complete
        </h2>
        <p className="mt-3 text-slate-600">
          You have completed all available lessons.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Learning Journey
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-900">
        {mission.topic}
      </h2>

      <p className="mt-2 text-slate-600">
        Next lesson: <span className="font-semibold">{mission.lesson}</span>
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm text-slate-500">Reward</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            ⭐ {mission.xp} XP
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm text-slate-500">Difficulty</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {mission.difficulty}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4">
          <p className="text-sm text-slate-500">Estimated Time</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {mission.estimatedTime}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
          <span>Overall Journey Progress</span>
          <span>{progress}%</span>
        </div>

        <ProgressBar value={progress} />
      </div>

      <div className="mt-8">
        <Link href={`/learn/binary?lesson=${mission.lessonId}`}>
          <Button>Continue Journey →</Button>
        </Link>
      </div>
    </Card>
  );
}