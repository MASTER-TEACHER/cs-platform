import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";
import { achievements } from "@/data/achievements";

type Props = {
  unlockedBadges: string[];
  xp: number;
  completedLessons: string[];
};

export default function NextBadgeCard({
  unlockedBadges,
  xp,
  completedLessons,
}: Props) {
  const nextBadge = achievements.find(
    (achievement) => !unlockedBadges.includes(achievement.id)
  );

  if (!nextBadge) {
    return (
      <Card>
        <h2 className="text-2xl font-bold text-slate-900">
          🏆 All Badges Unlocked
        </h2>
        <p className="mt-2 text-slate-600">Legend status achieved.</p>
      </Card>
    );
  }

  let progress = 0;

  if (nextBadge.condition.type === "xp") {
    progress = Math.min(100, Math.round((xp / Number(nextBadge.condition.value)) * 100));
  }

  if (nextBadge.condition.type === "completedLessons") {
    progress = Math.min(
      100,
      Math.round((completedLessons.length / Number(nextBadge.condition.value)) * 100)
    );
  }

  if (nextBadge.condition.type === "lessonCompleted") {
    progress = completedLessons.includes(String(nextBadge.condition.value)) ? 100 : 0;
  }

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Next Badge
      </p>

      <div className="mt-4 text-5xl">🔒</div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900">
        {nextBadge.title}
      </h2>

      <p className="mt-2 text-slate-600">{nextBadge.description}</p>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm font-semibold text-slate-600">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <ProgressBar value={progress} />
      </div>
    </Card>
  );
}