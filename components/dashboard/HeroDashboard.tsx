import Link from "next/link";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { getLevelFromXP } from "@/lib/levelEngine";

type Props = {
  name: string;
  xp: number;
  streak: number;
  badges: number;
  completedLessons: number;
  missionLink?: string;
};

export default function HeroDashboard({
  name,
  xp,
  streak,
  badges,
  completedLessons,
  missionLink = "/learn/binary",
}: Props) {
  const levelData = getLevelFromXP(xp);

  return (
    <Card className="border-0 bg-gradient-to-r from-slate-950 via-blue-800 to-indigo-700 text-white">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Welcome back
          </p>

          <h1 className="mt-3 text-4xl font-bold">{name} 👋</h1>

          <p className="mt-3 max-w-2xl text-blue-100">
            Keep building your Computer Science mastery. Your next lesson is waiting.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">🔥 Streak</p>
              <p className="mt-1 text-2xl font-bold">{streak} days</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">🏆 Badges</p>
              <p className="mt-1 text-2xl font-bold">{badges}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">📚 Lessons</p>
              <p className="mt-1 text-2xl font-bold">{completedLessons}</p>
            </div>
          </div>
        </div>

        <div className="w-full rounded-3xl bg-white/10 p-6 lg:max-w-md">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Student Level
          </p>

          <h2 className="mt-2 text-5xl font-bold">Level {levelData.level}</h2>

          <p className="mt-3 text-blue-100">
            {levelData.currentLevelXP} / {levelData.xpPerLevel} XP
          </p>

          <div className="mt-5">
            <ProgressBar value={levelData.progress} />
          </div>

          <p className="mt-3 text-sm text-blue-100">
            {levelData.xpToNextLevel} XP until Level {levelData.level + 1}
          </p>

          <div className="mt-6">
            <Link href={missionLink}>
              <Button variant="secondary">Continue Learning →</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}