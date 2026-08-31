import Link from "next/link";

import Card from "@/components/ui/Card";
import type { RecentQuiz } from "@/hooks/useRecentQuiz";
import type { StudentJourneyMission } from "@/services/studentJourneyService";

type Props = {
  mission: StudentJourneyMission | null;
  recentQuiz: RecentQuiz | null;
};

export default function RecentActivity({
  mission,
  recentQuiz,
}: Props) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Current learning context
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        What&apos;s happening now
      </h2>

      <div className="mt-6 space-y-4">
        {recentQuiz ? (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">
              Latest current-curriculum quiz
            </p>

            <p className="mt-1 font-bold text-slate-900">
              {recentQuiz.title}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {recentQuiz.scorePercent}% · {recentQuiz.earnedXP} XP
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
            No current-curriculum quiz result yet.
          </div>
        )}

        {mission ? (
          <div className="rounded-xl bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-700">
              Next curriculum lesson
            </p>

            <p className="mt-1 font-bold text-slate-900">
              {mission.lesson}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {mission.topic} · {mission.estimatedTime}
            </p>

            <Link
              href={mission.href}
              className="mt-3 inline-flex font-bold text-blue-700 hover:text-blue-900"
            >
              Continue →
            </Link>
          </div>
        ) : (
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            All currently available curriculum lessons are complete.
          </div>
        )}
      </div>
    </Card>
  );
}
