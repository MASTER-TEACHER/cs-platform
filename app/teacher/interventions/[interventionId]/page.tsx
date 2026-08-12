"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import {
  getInterventionById,
  updateInterventionImpact,
  updateInterventionStatus,
} from "@/services/interventionService";
import { getStudentAnalytics } from "@/services/studentAnalyticsService";
import { useAuth } from "@/contexts/AuthContext";
import type { Intervention } from "@/types/intervention";

export default function InterventionDetailPage() {
  const params = useParams<{ interventionId: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<Intervention | null>(null);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      setItem(await getInterventionById(params.interventionId));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, [params.interventionId]);
  async function refreshImpact() {
    if (!item || !user?.uid) return;
    const analytics = await getStudentAnalytics(item.studentId, user.uid);
    if (!analytics)
      return toast.error("Current analytics could not be loaded.");
    await updateInterventionImpact(
      item.id,
      analytics.metrics.combinedAssessmentAverage,
    );
    toast.success("Impact refreshed.");
    void load();
  }
  if (loading) return <Skeleton className="h-96" />;
  if (!item) return <Card>Intervention not found.</Card>;
  const completed = item.steps.filter((s) => s.status === "completed").length;
  return (
    <div className="space-y-8">
      <Card className="border-0 bg-gradient-to-r from-slate-950 to-teal-950 text-white">
        <p className="text-sm font-bold uppercase text-teal-200">
          Intervention detail
        </p>
        <h1 className="mt-2 text-4xl font-black">{item.studentName}</h1>
        <p className="mt-3 text-teal-100">
          {item.title} · {item.topic}
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/teacher/interventions"
            className="rounded-xl border border-white/20 px-5 py-3 font-bold"
          >
            ← Intervention Centre
          </Link>
          <Link
            href={`/teacher/students/${item.studentId}`}
            className="rounded-xl border border-white/20 px-5 py-3 font-bold"
          >
            Student Analytics
          </Link>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Baseline" value={`${item.baselineScore}%`} />
        <Metric label="Current" value={`${item.currentScore}%`} />
        <Metric
          label="Impact"
          value={`${item.impact >= 0 ? "+" : ""}${item.impact}%`}
        />
        <Metric label="Progress" value={`${completed}/${item.steps.length}`} />
      </div>
      <Card>
        <h2 className="text-2xl font-black">Pathway</h2>
        <div className="mt-5 space-y-4">
          {item.steps.map((step, index) => (
            <div key={step.id} className="flex gap-4 rounded-2xl border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-black text-teal-700">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between gap-3">
                  <h3 className="font-black">{step.title}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase">
                    {step.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h2 className="text-2xl font-black">Teacher actions</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => void refreshImpact()}
            className="rounded-xl bg-teal-600 px-5 py-3 font-bold text-white"
          >
            Refresh Impact
          </button>
          {item.status !== "completed" && (
            <button
              onClick={() =>
                void updateInterventionStatus(item.id, "completed").then(load)
              }
              className="rounded-xl border px-5 py-3 font-bold"
            >
              Mark Completed
            </button>
          )}
          {item.status !== "cancelled" && (
            <button
              onClick={() =>
                void updateInterventionStatus(item.id, "cancelled").then(load)
              }
              className="rounded-xl border border-red-300 px-5 py-3 font-bold text-red-700"
            >
              Cancel
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </Card>
  );
}
