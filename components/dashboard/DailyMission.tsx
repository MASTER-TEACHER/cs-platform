"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type Props = {
  mission: {
    topic: string;
    lesson: string;
    xp: number;
    difficulty: string;
    estimatedTime: string;
  } | null;
};

export default function DailyMission({ mission }: Props) {
  if (!mission) {
    return (
      <Card>
        <h2 className="text-2xl font-bold">
          🎉 All missions complete!
        </h2>

        <p className="mt-3 text-slate-600">
          You've completed everything available.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
      <p className="text-sm uppercase tracking-wider font-semibold">
        🎯 Today's Mission
      </p>

      <h2 className="mt-4 text-3xl font-bold">
        {mission.lesson}
      </h2>

      <p className="mt-2 text-blue-100">
        {mission.topic}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs uppercase">
            Reward
          </p>

          <p className="mt-1 font-bold">
            ⭐ {mission.xp} XP
          </p>
        </div>

        <div>
          <p className="text-xs uppercase">
            Difficulty
          </p>

          <p className="mt-1 font-bold">
            {mission.difficulty}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase">
            Time
          </p>

          <p className="mt-1 font-bold">
            {mission.estimatedTime}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Button>
          Start Mission →
        </Button>
      </div>
    </Card>
  );
}