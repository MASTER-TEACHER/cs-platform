"use client";
import Link from "next/link";
import toast from "react-hot-toast";
import RevisionPlanProgress from "@/components/revision-plan/RevisionPlanProgress";
import { updateInterventionStep } from "@/services/interventionService";
import type { Intervention, InterventionStep } from "@/types/intervention";
export default function RevisionPlanCard({
  intervention,
  studentId,
  onUpdated,
}: {
  intervention: Intervention;
  studentId: string;
  onUpdated: () => void;
}) {
  const completed = intervention.steps.filter(
    (s) => s.status === "completed",
  ).length;
  async function markComplete(step: InterventionStep) {
    try {
      await updateInterventionStep(
        intervention.id,
        studentId,
        step.id,
        "completed",
      );
      toast.success("Step completed.");
      onUpdated();
    } catch {
      toast.error("Step could not be updated.");
    }
  }
  return (
    <article className="rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <div>
          <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold uppercase text-teal-700">
            {intervention.priority} priority
          </span>
          <h2 className="mt-4 text-2xl font-black">{intervention.title}</h2>
          <p className="font-bold text-teal-700">{intervention.topic}</p>
          <p className="mt-3 text-sm text-slate-600">{intervention.reason}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-center">
          <p className="text-xs font-bold uppercase text-slate-500">Baseline</p>
          <p className="text-2xl font-black">{intervention.baselineScore}%</p>
        </div>
      </div>
      <div className="mt-6">
        <RevisionPlanProgress
          completed={completed}
          total={intervention.steps.length}
        />
      </div>
      <div className="mt-6 space-y-4">
        {intervention.steps.map((step, index) => (
          <div key={step.id} className="rounded-2xl border p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-black text-blue-700">
                  {index + 1}
                </div>
                <div>
                  <p className="font-black">{step.title}</p>
                  <p className="text-sm text-slate-600">{step.description}</p>
                  <p className="mt-2 text-xs font-bold text-amber-700">
                    +{step.xpReward} XP
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {step.href && (
                  <Link
                    href={step.href}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white"
                  >
                    {step.status === "completed" ? "Review" : "Start"}
                  </Link>
                )}
                {!step.sourceId && step.status !== "completed" && (
                  <button
                    onClick={() => void markComplete(step)}
                    className="rounded-xl border px-4 py-2 text-sm font-bold"
                  >
                    Mark Complete
                  </button>
                )}
                <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold capitalize">
                  {step.status.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
