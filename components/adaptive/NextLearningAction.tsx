import Link from "next/link";
import type { AdaptiveLearningAction } from "@/types/adaptiveLearning";

export default function NextLearningAction({
  action,
}: {
  action: AdaptiveLearningAction | null;
}) {
  if (!action) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
          Next action
        </p>
        <h2 className="mt-2 text-2xl font-black text-emerald-950">
          Maintain your progress
        </h2>
        <p className="mt-3 text-sm text-emerald-800">
          Complete a mixed retrieval quiz to generate fresh evidence.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
        Recommended next action
      </p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {action.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        {action.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-600">
        <span className="rounded-full bg-white px-3 py-2">
          {action.estimatedMinutes} mins
        </span>
        <span className="rounded-full bg-white px-3 py-2">
          +{action.xpReward} XP
        </span>
        <span className="rounded-full bg-white px-3 py-2 capitalize">
          {action.priority} priority
        </span>
      </div>

      <Link
        href={action.href}
        className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-bold text-white"
      >
        Start now
      </Link>
    </div>
  );
}
