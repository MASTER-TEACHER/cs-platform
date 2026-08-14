"use client";

import { useEffect, useState } from "react";
import { Activity, RefreshCcw, Target } from "lucide-react";

import Card from "@/components/ui/Card";
import {
  captureInterventionBaseline,
  getInterventionImpact,
} from "@/services/analytics/interventionImpactService";
import type { InterventionImpact } from "@/types/interventionImpact";

function delta(value: number | null, suffix = ""): string {
  if (value === null) return "—";
  return value > 0 ? `+${value}${suffix}` : `${value}${suffix}`;
}

export default function InterventionImpactCard({
  interventionId,
  teacherId,
}: {
  interventionId: string;
  teacherId: string;
}) {
  const [impact, setImpact] = useState<InterventionImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingBaseline, setSavingBaseline] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const result = await getInterventionImpact({
        interventionId,
        teacherId,
      });

      setImpact(result);
    } catch (caughtError) {
      console.error("Unable to load intervention impact:", caughtError);
      setImpact(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Intervention impact could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [interventionId, teacherId]);

  if (loading) {
    return (
      <Card className="rounded-3xl border border-slate-200">
        <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
      </Card>
    );
  }

  if (!impact) {
    return error ? (
      <Card className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-700">
        {error}
      </Card>
    ) : null;
  }

  async function captureBaseline() {
    const currentImpact = impact;

    if (!currentImpact) {
      return;
    }

    try {
      setSavingBaseline(true);
      setError("");

      await captureInterventionBaseline({
        interventionId,
        teacherId,
        studentId: currentImpact.studentId,
        topic: currentImpact.topic,
      });

      await load();
    } catch (caughtError) {
      console.error("Unable to capture intervention baseline:", caughtError);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The intervention baseline could not be captured.",
      );
    } finally {
      setSavingBaseline(false);
    }
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="bg-gradient-to-r from-violet-950 via-indigo-950 to-blue-900 p-6 text-white">
        <div className="flex items-center gap-2 text-blue-200">
          <Activity className="h-5 w-5" />
          <p className="text-xs font-black uppercase tracking-[0.16em]">
            Intervention impact
          </p>
        </div>

        <h2 className="mt-2 text-2xl font-black">
          Before → after review
        </h2>

        <p className="mt-2 text-sm text-white/70">
          {impact.topic}
        </p>
      </div>

      {error && (
        <div className="border-b border-red-100 bg-red-50 px-6 py-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {impact.baseline === null ? (
        <div className="p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="font-black text-amber-950">
              No before-intervention baseline
            </p>

            <p className="mt-2 text-sm text-amber-800">
              {impact.summary}
            </p>

            <button
              type="button"
              disabled={savingBaseline}
              onClick={() => void captureBaseline()}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-700 px-4 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Target className="h-4 w-4" />
              {savingBaseline
                ? "Capturing..."
                : "Capture baseline now"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-5">
            <Metric
              label="Working grade"
              before={impact.baseline.workingGrade || "—"}
              after={impact.current.workingGrade || "—"}
              change={delta(impact.workingGradeChange)}
            />

            <Metric
              label="Grade gap"
              before={
                impact.baseline.gradeGap === null
                  ? "—"
                  : String(impact.baseline.gradeGap)
              }
              after={
                impact.current.gradeGap === null
                  ? "—"
                  : String(impact.current.gradeGap)
              }
              change={delta(impact.gradeGapChange)}
            />

            <Metric
              label="Attainment"
              before={`${impact.baseline.weightedPercentage}%`}
              after={`${impact.current.weightedPercentage}%`}
              change={delta(impact.attainmentChange, "%")}
            />

            <Metric
              label="Topic mastery"
              before={
                impact.baseline.topicMastery === null
                  ? "—"
                  : `${impact.baseline.topicMastery}%`
              }
              after={
                impact.current.topicMastery === null
                  ? "—"
                  : `${impact.current.topicMastery}%`
              }
              change={delta(impact.topicMasteryChange, "%")}
            />

            <Metric
              label="Completion"
              before={`${impact.baseline.completionRate}%`}
              after={`${impact.current.completionRate}%`}
              change={delta(impact.completionChange, "%")}
            />
          </div>

          <div className="grid gap-5 border-t border-slate-100 p-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Interpretation
              </p>

              <p className="mt-2 text-sm text-slate-700">
                {impact.summary}
              </p>

              <p className="mt-3 text-xs font-black text-slate-500">
                New graded evidence since baseline: {impact.evidenceChange}
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-blue-700">
                Recommended next action
              </p>

              <p className="mt-2 text-sm text-blue-950">
                {impact.nextAction}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={() => void load()}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh impact
        </button>
      </div>
    </Card>
  );
}

function Metric({
  label,
  before,
  after,
  change,
}: {
  label: string;
  before: string;
  after: string;
  change: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {before} →
      </p>

      <p className="mt-1 text-lg font-black text-slate-950">
        {after}
      </p>

      <p className="mt-2 text-xs font-black text-teal-700">
        Change {change}
      </p>
    </div>
  );
}
