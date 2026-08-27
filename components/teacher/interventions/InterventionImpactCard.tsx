"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  RefreshCcw,
  RotateCcw,
  Target,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import Card from "@/components/ui/Card";
import {
  captureInterventionBaseline,
  getInterventionImpact,
} from "@/services/analytics/interventionImpactService";
import {
  buildInterventionReassessmentHref,
  buildInterventionReviewCycle,
  saveInterventionReviewDecision,
} from "@/services/analytics/interventionReviewCycleService";
import type { InterventionImpact } from "@/types/interventionImpact";
import type { InterventionReviewDecision } from "@/types/interventionReviewCycle";

function delta(
  value: number | null,
  suffix = "",
): string {
  if (value === null) return "—";
  return value > 0 ? `+${value}${suffix}` : `${value}${suffix}`;
}

function decisionLabel(
  value: InterventionReviewDecision,
): string {
  switch (value) {
    case "close_successful":
      return "Close as successful";
    case "retarget":
      return "Retarget support";
    case "escalate":
      return "Escalate support";
    default:
      return "Continue intervention";
  }
}

export default function InterventionImpactCard({
  interventionId,
  teacherId,
}: {
  interventionId: string;
  teacherId: string;
}) {
  const [impact, setImpact] =
    useState<InterventionImpact | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingBaseline, setSavingBaseline] = useState(false);
  const [savingDecision, setSavingDecision] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");

        return getInterventionImpact({
          interventionId,
          teacherId,
        });
      })
      .then((loadedImpact) => {
        setImpact(loadedImpact);
      })
      .catch((caughtError) => {
        console.error(
          "Unable to load intervention impact:",
          caughtError,
        );

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Intervention impact could not be loaded.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [interventionId, teacherId]);

  useEffect(() => {
    void load();
  }, [load]);

  const review = useMemo(
    () =>
      impact
        ? buildInterventionReviewCycle(impact)
        : null,
    [impact],
  );

  if (loading) {
    return (
      <Card className="rounded-3xl border border-slate-200">
        <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
      </Card>
    );
  }

  if (!impact) {
    return error ? <Card>{error}</Card> : null;
  }

  async function captureBaseline() {
    if (!impact) {
      return;
    }

    try {
      setSavingBaseline(true);

      await captureInterventionBaseline({
        interventionId,
        teacherId,
        studentId: impact.studentId,
        topic: impact.topic,
      });

      toast.success("Intervention baseline captured.");
      await load();
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : "Baseline could not be captured.",
      );
    } finally {
      setSavingBaseline(false);
    }
  }

  async function saveDecision(
    decision: InterventionReviewDecision,
  ) {
    if (!impact) {
      return;
    }

    try {
      setSavingDecision(true);

      await saveInterventionReviewDecision({
        interventionId,
        teacherId,
        decision,
        note: reviewNote,
      });

      toast.success(
        decision === "close_successful"
          ? "Intervention closed as successful."
          : "Intervention review saved.",
      );

      await load();
    } catch (caughtError) {
      toast.error(
        caughtError instanceof Error
          ? caughtError.message
          : "The intervention review could not be saved.",
      );
    } finally {
      setSavingDecision(false);
    }
  }

  const reassessmentHref =
    buildInterventionReassessmentHref({
      impact,
    });

  return (
    <div className="space-y-6">
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
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-700 px-4 text-xs font-black text-white disabled:opacity-60"
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
                  New evidence since baseline: {impact.evidenceChange}
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
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-700"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh impact
          </button>
        </div>
      </Card>

      {review && (
        <Card className="overflow-hidden rounded-3xl border border-teal-200">
          <div className="bg-gradient-to-r from-teal-950 to-cyan-800 p-6 text-white">
            <div className="flex items-center gap-2 text-teal-200">
              <ClipboardCheck className="h-5 w-5" />
              <p className="text-xs font-black uppercase tracking-[0.16em]">
                Review cycle
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-black">
              {review.headline}
            </h2>

            <p className="mt-2 max-w-4xl text-sm leading-6 text-white/75">
              {review.explanation}
            </p>
          </div>

          <div className="grid gap-5 p-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-emerald-700">
                Positive signals
              </p>

              {review.successSignals.length ? (
                <ul className="mt-3 space-y-2 text-sm text-emerald-950">
                  {review.successSignals.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-emerald-900/70">
                  No material positive change is recorded yet.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-amber-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-amber-700">
                Concerns
              </p>

              {review.concernSignals.length ? (
                <ul className="mt-3 space-y-2 text-sm text-amber-950">
                  {review.concernSignals.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2"
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-amber-900/70">
                  No material decline is recorded.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 p-6">
            {review.reassessmentRecommended && (
              <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-black text-indigo-950">
                    Focused reassessment recommended
                  </p>

                  <p className="mt-1 text-sm text-indigo-800">
                    Assign a new task on {impact.topic}, then return here once it is graded to review the change.
                  </p>
                </div>

                <Link
                  href={reassessmentHref}
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-xs font-black text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                  Assign reassessment
                </Link>
              </div>
            )}

            <label className="block">
              <span className="text-sm font-black text-slate-900">
                Teacher review note
              </span>

              <textarea
                rows={3}
                value={reviewNote}
                onChange={(event) =>
                  setReviewNote(event.target.value)
                }
                placeholder="Record why you are continuing, retargeting, closing or escalating the intervention."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </label>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={savingDecision}
                onClick={() =>
                  void saveDecision(
                    review.recommendedDecision,
                  )
                }
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-teal-600 px-4 text-xs font-black text-white disabled:opacity-60"
              >
                <ClipboardCheck className="h-4 w-4" />
                {savingDecision
                  ? "Saving..."
                  : decisionLabel(
                      review.recommendedDecision,
                    )}
              </button>

              {review.recommendedDecision !== "continue" && (
                <button
                  type="button"
                  disabled={savingDecision}
                  onClick={() =>
                    void saveDecision("continue")
                  }
                  className="inline-flex min-h-10 items-center rounded-xl border border-slate-200 px-4 text-xs font-black text-slate-700 disabled:opacity-60"
                >
                  Continue instead
                </button>
              )}

              {review.canCloseSuccessful &&
                review.recommendedDecision !==
                  "close_successful" && (
                  <button
                    type="button"
                    disabled={savingDecision}
                    onClick={() =>
                      void saveDecision(
                        "close_successful",
                      )
                    }
                    className="inline-flex min-h-10 items-center rounded-xl bg-emerald-600 px-4 text-xs font-black text-white disabled:opacity-60"
                  >
                    Close as successful
                  </button>
                )}
            </div>
          </div>
        </Card>
      )}
    </div>
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