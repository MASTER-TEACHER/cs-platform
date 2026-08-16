"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCcw,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import {
  buildInterventionEffectivenessItem,
  buildInterventionEffectivenessSummary,
  type InterventionEffectivenessSource,
} from "@/services/analytics/interventionEffectivenessService";
import { getInterventionImpact } from "@/services/analytics/interventionImpactService";
import type {
  InterventionEffectivenessItem,
  InterventionEffectivenessStatus,
} from "@/types/interventionEffectiveness";

function badgeStyle(status: InterventionEffectivenessStatus): string {
  switch (status) {
    case "improving":
      return "bg-emerald-100 text-emerald-800";
    case "declining":
      return "bg-red-100 text-red-800";
    case "awaiting_evidence":
      return "bg-indigo-100 text-indigo-800";
    case "baseline_needed":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function changeText(value: number | null, suffix = ""): string {
  if (value === null) return "—";
  if (value > 0) return `+${value}${suffix}`;
  return `${value}${suffix}`;
}

export default function InterventionEffectivenessOverview({
  teacherId,
  interventions,
}: {
  teacherId: string;
  interventions: InterventionEffectivenessSource[];
}) {
  const [items, setItems] = useState<InterventionEffectivenessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!teacherId.trim() || interventions.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const results = await Promise.all(
        interventions.map(async (intervention) => {
          try {
            const impact = await getInterventionImpact({
              interventionId: intervention.id,
              teacherId,
            });

            if (!impact) return null;

            return buildInterventionEffectivenessItem({
              source: intervention,
              impact,
            });
          } catch (caughtError) {
            console.error(
              `Unable to load intervention effectiveness for ${intervention.id}:`,
              caughtError,
            );

            return null;
          }
        }),
      );

      setItems(
        results.filter(
          (item): item is InterventionEffectivenessItem => Boolean(item),
        ),
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Intervention effectiveness could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [teacherId, interventions]);

  const summary = useMemo(
    () => buildInterventionEffectivenessSummary(items),
    [items],
  );

  return (
    <Card className="overflow-hidden rounded-3xl border border-teal-200 p-0">
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-emerald-900 p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-200">
              Intervention effectiveness intelligence
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Which interventions are producing improvement?
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-white/70">
              Compare each intervention baseline with subsequent graded
              evidence. Statuses are decision-support signals and should be
              reviewed alongside the underlying assessment evidence.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-teal-950"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh effectiveness
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-bold text-amber-900">
            {error}
          </div>
        </div>
      ) : interventions.length === 0 ? (
        <div className="p-6">
          <p className="font-black text-slate-950">
            No interventions available yet
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Create an intervention and capture a baseline before effectiveness
            can be evaluated.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-5">
            <Summary
              label="Improving"
              value={summary.improving}
              icon={<CheckCircle2 className="h-5 w-5" />}
              tone="emerald"
            />
            <Summary
              label="Limited change"
              value={summary.limitedChange}
              icon={<Activity className="h-5 w-5" />}
              tone="slate"
            />
            <Summary
              label="Declining"
              value={summary.declining}
              icon={<AlertTriangle className="h-5 w-5" />}
              tone="red"
            />
            <Summary
              label="Awaiting evidence"
              value={summary.awaitingEvidence}
              icon={<Clock3 className="h-5 w-5" />}
              tone="indigo"
            />
            <Summary
              label="Success rate"
              value={
                summary.successfulRate === null
                  ? "—"
                  : `${summary.successfulRate}%`
              }
              icon={<Target className="h-5 w-5" />}
              tone="teal"
            />
          </div>

          {summary.baselineNeeded > 0 && (
            <div className="mx-6 mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <span className="font-black">
                {summary.baselineNeeded} intervention
                {summary.baselineNeeded === 1 ? "" : "s"} need a baseline.
              </span>{" "}
              Effectiveness cannot be judged reliably until a before-intervention
              comparison point exists.
            </div>
          )}

          <div className="border-t border-slate-100">
            <div className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr_0.8fr_auto] gap-3 bg-slate-50 px-6 py-3 text-xs font-black uppercase tracking-wide text-slate-400">
              <span>Learner / topic</span>
              <span>Status</span>
              <span>Attainment</span>
              <span>Mastery</span>
              <span>Evidence</span>
              <span>Action</span>
            </div>

            {summary.items.map((item) => (
              <div
                key={item.interventionId}
                className="grid gap-4 border-t border-slate-100 px-6 py-5 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.8fr_auto] lg:items-center"
              >
                <div>
                  <p className="font-black text-slate-950">
                    {item.studentName}
                  </p>
                  <p className="mt-1 text-sm font-bold text-teal-700">
                    {item.topic}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.summary}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${badgeStyle(
                      item.effectivenessStatus,
                    )}`}
                  >
                    {item.headline}
                  </span>
                </div>

                <p className="font-black text-slate-800">
                  {changeText(item.attainmentChange, "%")}
                </p>

                <p className="font-black text-slate-800">
                  {changeText(item.topicMasteryChange, "%")}
                </p>

                <p className="font-black text-slate-800">
                  +{item.evidenceChange}
                </p>

                <Link
                  href={item.reviewHref}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white"
                >
                  Review
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <div className="border-t border-teal-100 bg-teal-50 px-6 py-4 text-xs font-bold leading-5 text-teal-950">
            Success rate only uses interventions with enough post-baseline
            evidence to classify as improving, limited/mixed change or declining.
            Interventions awaiting evidence or a baseline are excluded.
          </div>
        </>
      )}
    </Card>
  );
}

function Summary({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  tone: "emerald" | "slate" | "red" | "indigo" | "teal";
}) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-50 text-red-700",
    indigo: "bg-indigo-50 text-indigo-700",
    teal: "bg-teal-50 text-teal-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles[tone]}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
