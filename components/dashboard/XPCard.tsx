"use client";

import Card from "@/components/ui/Card";
import { useProgress } from "@/contexts/ProgressContext";

export default function XPCard() {
  const { xp, completedLessons } = useProgress();

  return (
    <Card>
      <h2 className="text-xl font-bold">Your Progress</h2>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-sm text-slate-500">XP</p>
          <h3 className="text-4xl font-bold text-blue-600">
            {xp}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Lessons Completed
          </p>

          <h3 className="text-4xl font-bold text-green-600">
            {completedLessons}
          </h3>
        </div>
      </div>
    </Card>
  );
}