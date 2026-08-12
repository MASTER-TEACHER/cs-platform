import type { AdaptiveLearningPlan } from "@/types/adaptiveLearning";

export default function AdaptiveLearningSummary({
  plan,
}: {
  plan: AdaptiveLearningPlan;
}) {
  const metrics = [
    ["Overall mastery", `${plan.overallMastery}%`],
    ["Exam readiness", `${plan.examReadiness}%`],
    ["Confidence", `${plan.confidence}%`],
    ["Predicted grade", plan.predictedGrade],
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map(([label, value]) => (
        <div
          key={label}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
      ))}
    </section>
  );
}
