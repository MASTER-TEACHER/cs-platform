import Link from "next/link";
import type { AdaptiveLearningPlan } from "@/types/adaptiveLearning";

export default function AdaptiveLearningCard({
  plan,
  loading,
}: {
  plan: AdaptiveLearningPlan | null;
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-3xl bg-slate-200" />;
  }

  if (!plan) return null;

  return (
    <section className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
            Adaptive learning engine
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            {plan.nextAction?.title || "Maintain your progress"}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {plan.nextAction?.description ||
              "Complete a mixed retrieval quiz to update your mastery profile."}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            ["Mastery", `${plan.overallMastery}%`],
            ["Due", plan.dueForReviewCount.toString()],
            ["Grade", plan.predictedGrade],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-500">
                {label}
              </p>
              <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {plan.nextAction && (
          <Link
            href={plan.nextAction.href}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
          >
            Start next action
          </Link>
        )}
        <Link
          href="/adaptive-learning"
          className="rounded-xl border border-indigo-300 bg-white px-5 py-3 font-bold text-indigo-700"
        >
          View learning plan
        </Link>
      </div>
    </section>
  );
}
