"use client";

import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { achievements } from "@/data/achievements";

type Props = {
  unlockedBadges: string[];
  xp?: number;
  completedLessons?: string[];
};

export default function AchievementsCard({
  unlockedBadges,
  xp = 0,
  completedLessons = [],
}: Props) {
  function getProgress(achievement: any) {
    if (achievement.condition.type === "xp") {
      return Math.min(100, Math.round((xp / achievement.condition.value) * 100));
    }

    if (achievement.condition.type === "completedLessons") {
      return Math.min(
        100,
        Math.round((completedLessons.length / achievement.condition.value) * 100)
      );
    }

    if (achievement.condition.type === "lessonCompleted") {
      return completedLessons.includes(achievement.condition.value) ? 100 : 0;
    }

    return 0;
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Badge Cabinet
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Achievements
          </h2>
        </div>

        <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
          {unlockedBadges.length} unlocked
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => {
          const unlocked = unlockedBadges.includes(achievement.id);
          const progress = getProgress(achievement);

          return (
            <div
              key={achievement.id}
              className={`rounded-2xl border p-5 transition-all duration-300 ${
                unlocked
                  ? "border-yellow-300 bg-yellow-50 shadow-sm"
                  : "border-slate-200 bg-slate-50 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-5xl">
                  {unlocked ? achievement.icon : "🔒"}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    unlocked
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {achievement.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {achievement.description}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-semibold text-slate-500">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>

                <ProgressBar value={progress} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}