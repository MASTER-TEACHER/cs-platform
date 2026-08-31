import Link from "next/link";

import Card from "@/components/ui/Card";

import type {
  StudentJourneyMission,
} from "@/services/studentJourneyService";

type Props = {
  mission: StudentJourneyMission | null;
};

export default function DailyMission({
  mission,
}: Props) {
  if (!mission) {
    return (
      <Card>
        <h2 className="text-2xl font-bold">
          🎉 All available lessons complete
        </h2>

        <p className="mt-3 text-slate-600">
          Use Adaptive Learning, quizzes and exam practice to
          strengthen retention and exam readiness.
        </p>

        <Link
          href="/adaptive-learning"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          Open Adaptive Learning →
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
      <p className="text-sm font-semibold uppercase tracking-wider">
        🎯 Today&apos;s Mission
      </p>

      <h2 className="mt-4 text-3xl font-bold">
        {mission.lesson}
      </h2>

      <p className="mt-2 text-blue-100">
        {mission.topic}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <Link
        href={mission.href}
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-white/40"
      >
        Start Mission →
      </Link>
    </Card>
  );
}
