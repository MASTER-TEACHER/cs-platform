import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

type Props = {
  xp: number;
};

export default function LevelCard({ xp }: Props) {
  const xpPerLevel = 500;

  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentLevelXP = xp % xpPerLevel;
  const progress = Math.round((currentLevelXP / xpPerLevel) * 100);

  return (
    <Card className="border-0 bg-gradient-to-r from-slate-900 to-blue-700 text-white">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">
        Student Level
      </p>

      <h2 className="mt-3 text-4xl font-bold">Level {level}</h2>

      <p className="mt-2 text-blue-100">
        {currentLevelXP} / {xpPerLevel} XP to next level
      </p>

      <div className="mt-6">
        <ProgressBar value={progress} />
      </div>
    </Card>
  );
}