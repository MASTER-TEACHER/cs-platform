import Link from "next/link";

import Card from "@/components/ui/Card";

import type {
  StudentJourneyMission,
} from "@/services/studentJourneyService";

type Props = {
  mission: StudentJourneyMission | null;
  curriculumTitle: string;
};

export default function ContinueLearning({
  mission,
  curriculumTitle,
}: Props) {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Continue Learning
      </p>

      {!mission ? (
        <>
          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            🎉 Curriculum complete
          </h2>

          <p className="mt-3 text-slate-600">
            You have completed every currently available lesson in{" "}
            {curriculumTitle}.
          </p>

          <Link
            href="/adaptive-learning"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Review adaptive recommendations →
          </Link>
        </>
      ) : (
        <>
          <p className="mt-5 text-sm font-semibold text-slate-500">
            Current topic
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {mission.topic}
          </h2>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Next lesson
          </p>

          <h3 className="mt-1 text-xl font-semibold text-slate-800">
            {mission.lesson}
          </h3>

          <p className="mt-3 text-sm text-slate-500">
            {mission.estimatedTime} · {mission.xp} XP
          </p>

          <Link
            href={mission.href}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Continue lesson →
          </Link>
        </>
      )}
    </Card>
  );
}
