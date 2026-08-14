"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { useAuth } from "@/contexts/AuthContext";
import { getRichStudentAnalytics } from "@/services/analytics/richStudentAnalyticsService";

import type { RichStudentAnalytics } from "@/types/analytics";

function SnapshotCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-950">
            {value}
          </p>

          {description && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StudentAnalyticsSnapshot() {
  const { user } = useAuth();

  const [analytics, setAnalytics] =
    useState<RichStudentAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      if (!user?.uid) {
        if (!cancelled) {
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);

        const result =
          await getRichStudentAnalytics(user.uid);

        if (!cancelled) {
          setAnalytics(result);
        }
      } catch (error) {
        console.error(
          "Unable to load student analytics snapshot:",
          error,
        );

        if (!cancelled) {
          setAnalytics(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  if (loading) {
    return (
      <Card className="rounded-3xl border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-3 h-8 w-64 rounded bg-slate-200" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </Card>
    );
  }

  if (!analytics) {
    return null;
  }

  const { grade, confidence, interpretation } =
    analytics;

  const targetDescription =
    grade.targetGrade === null
      ? "Your teacher has not set a target grade yet."
      : grade.gradeGap === null
        ? "Target grade available."
        : grade.gradeGap >= 0
          ? "You are currently on or above target."
          : `${Math.abs(
              grade.gradeGap,
            )} grade step${
              Math.abs(grade.gradeGap) === 1
                ? ""
                : "s"
            } below target.`;

  const nextGradeDescription =
    grade.percentagePointsToNextGrade !== null
      ? `${grade.percentagePointsToNextGrade} percentage point${
          grade.percentagePointsToNextGrade === 1
            ? ""
            : "s"
        } from the next indicative grade band.`
      : "You are currently in the highest available grade band.";

  const marksDescription =
    grade.marksToNextGradeAssessmentTitle
      ? `Based on ${grade.marksToNextGradeAssessmentTitle}.`
      : "Complete a marked written assessment to calculate this.";

  return (
    <Card className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="bg-gradient-to-r from-teal-700 via-cyan-700 to-blue-700 p-6 text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />

              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/80">
                Attainment Intelligence
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-black">
              Your current progress
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/85">
              {interpretation.summary}
            </p>
          </div>

          <Link
            href="/analytics"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-black text-teal-800 transition hover:bg-slate-100"
          >
            View full analytics
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SnapshotCard
            label="Working grade"
            value={grade.workingGrade || "—"}
            description={
              grade.workingPercentage !== null
                ? `${grade.workingPercentage}% weighted attainment`
                : "More graded evidence is required."
            }
            icon={
              <GraduationCap className="h-5 w-5" />
            }
          />

          <SnapshotCard
            label="Target grade"
            value={grade.targetGrade || "Not set"}
            description={targetDescription}
            icon={<Target className="h-5 w-5" />}
          />

          <SnapshotCard
            label="Next grade"
            value={grade.nextGrade || "Top band"}
            description={nextGradeDescription}
            icon={
              <TrendingUp className="h-5 w-5" />
            }
          />

          <SnapshotCard
            label="Marks to next grade"
            value={
              grade.marksToNextGrade !== null
                ? String(grade.marksToNextGrade)
                : "—"
            }
            description={marksDescription}
            icon={
              <ArrowUpRight className="h-5 w-5" />
            }
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1.5">
            Evidence confidence:{" "}
            <strong className="capitalize text-slate-800">
              {confidence.level}
            </strong>
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1.5">
            {confidence.gradedEvidenceCount} graded
            evidence item
            {confidence.gradedEvidenceCount === 1
              ? ""
              : "s"}
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1.5">
            Completion {analytics.completionRate}%
          </span>
        </div>
      </div>
    </Card>
  );
}