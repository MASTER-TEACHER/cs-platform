"use client";

import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Gauge,
  GraduationCap,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "@/components/ui/Card";
import type {
  PerformanceTrend,
  RichStudentAnalytics,
} from "@/types/analytics";

function trendLabel(
  trend: PerformanceTrend,
): string {
  switch (trend) {
    case "strong_improvement":
      return "Strong improvement";
    case "improving":
      return "Improving";
    case "declining":
      return "Declining";
    case "stable":
      return "Stable";
    default:
      return "More evidence needed";
  }
}

function TrendIcon({
  trend,
}: {
  trend: PerformanceTrend;
}) {
  return trend === "declining" ? (
    <TrendingDown className="h-5 w-5" />
  ) : (
    <TrendingUp className="h-5 w-5" />
  );
}

export default function RichAnalyticsOverview({
  analytics,
}: {
  analytics: RichStudentAnalytics;
}) {
  const grade = analytics.grade;

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-slate-200 p-7">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-teal-600">
          Attainment intelligence
        </p>

        <h1 className="mt-2 text-3xl font-black text-slate-950">
          {analytics.interpretation.headline}
        </h1>

        <p className="mt-3 max-w-4xl leading-7 text-slate-600">
          {analytics.interpretation.summary}
        </p>

        {grade.boundarySet.source === "indicative" && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Grade bands on this page are currently <strong>CS Master indicative bands</strong>,
            not official exam-board boundaries. Official/teacher-defined boundary
            sets can replace them without changing the analytics engine.
          </div>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Working grade"
          value={grade.workingGrade || "—"}
          detail={
            grade.workingPercentage !== null
              ? `${grade.workingPercentage}% weighted attainment`
              : "Awaiting graded evidence"
          }
          icon={<GraduationCap className="h-5 w-5" />}
        />

        <MetricCard
          label="Target grade"
          value={grade.targetGrade || "Not set"}
          detail={
            grade.gradeGap === null
              ? "Teacher target not yet available"
              : grade.gradeGap >= 0
                ? "On or above target"
                : `${Math.abs(grade.gradeGap)} grade step${
                    Math.abs(grade.gradeGap) === 1 ? "" : "s"
                  } below target`
          }
          icon={<Target className="h-5 w-5" />}
        />

        <MetricCard
          label="Next grade"
          value={grade.nextGrade || "Top band"}
          detail={
            grade.percentagePointsToNextGrade !== null
              ? `${grade.percentagePointsToNextGrade} percentage point${
                  grade.percentagePointsToNextGrade === 1 ? "" : "s"
                } away`
              : "No higher band"
          }
          icon={<ArrowUpRight className="h-5 w-5" />}
        />

        <MetricCard
          label="Evidence confidence"
          value={analytics.confidence.level.replace("_", " ")}
          detail={`${analytics.confidence.score}/100 confidence score`}
          icon={<Gauge className="h-5 w-5" />}
        />
      </div>

      {grade.marksToNextGrade !== null && grade.marksToNextGradeAssessmentTitle && (
        <Card className="rounded-3xl border border-indigo-200 bg-indigo-50 p-6">
          <p className="text-sm font-black uppercase tracking-wide text-indigo-600">
            Marks to next grade
          </p>

          <p className="mt-2 text-3xl font-black text-indigo-950">
            {grade.marksToNextGrade} mark
            {grade.marksToNextGrade === 1 ? "" : "s"}
          </p>

          <p className="mt-2 text-sm leading-6 text-indigo-800">
            Based on the latest marked written assessment:
            {" "}
            <strong>{grade.marksToNextGradeAssessmentTitle}</strong>.
          </p>
        </Card>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-3xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            <h2 className="text-xl font-black text-slate-950">
              Topic mastery
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            {analytics.topics.length === 0 ? (
              <p className="text-sm text-slate-500">
                Complete graded work to build topic mastery.
              </p>
            ) : (
              analytics.topics.map((topic) => (
                <div key={topic.topic}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="font-bold text-slate-800">
                        {topic.topic}
                      </p>
                      <p className="text-xs text-slate-500">
                        {topic.evidenceCount} graded evidence item
                        {topic.evidenceCount === 1 ? "" : "s"} · {topic.status}
                      </p>
                    </div>

                    <span className="font-black text-slate-950">
                      {topic.weightedPercentage}%
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                      style={{
                        width: `${topic.weightedPercentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="rounded-3xl border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <TrendIcon trend={analytics.trend} />
            <h2 className="text-xl font-black text-slate-950">
              Performance trend
            </h2>
          </div>

          <p className="mt-3 text-2xl font-black text-slate-900">
            {trendLabel(analytics.trend)}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {analytics.trendChange === null
              ? "Complete at least three graded activities for trend analysis."
              : `${analytics.trendChange >= 0 ? "+" : ""}${analytics.trendChange} percentage points between earlier and recent evidence.`}
          </p>

          <div className="mt-5 space-y-3">
            {analytics.trendPoints.map((point) => (
              <div
                key={point.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <span className="truncate pr-4 text-sm font-semibold text-slate-700">
                  {point.title}
                </span>
                <span className="font-black text-slate-950">
                  {point.percentage}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <InsightList
          title="Strengths"
          items={analytics.interpretation.strengths}
          empty="More evidence is needed to identify strengths."
        />

        <InsightList
          title="Priority areas"
          items={analytics.interpretation.priorities}
          empty="No priority weakness has been identified yet."
        />

        <InsightList
          title="Recommended next actions"
          items={analytics.interpretation.nextActions}
          empty="Complete more graded activity for recommendations."
        />
      </div>

      <Card className="rounded-3xl border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-black text-slate-950">
            Evidence quality
          </h2>
        </div>

        <p className="mt-3 leading-7 text-slate-600">
          {analytics.confidence.explanation}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <SmallMetric
            label="Graded evidence"
            value={analytics.confidence.gradedEvidenceCount}
          />
          <SmallMetric
            label="Written exams"
            value={analytics.confidence.writtenExamCount}
          />
          <SmallMetric
            label="Quizzes"
            value={analytics.confidence.quizCount}
          />
          <SmallMetric
            label="Completion"
            value={`${analytics.completionRate}%`}
          />
        </div>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-black capitalize text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            {detail}
          </p>
        </div>
        <div className="rounded-2xl bg-teal-50 p-3 text-teal-700">
          {icon}
        </div>
      </div>
    </Card>
  );
}

function SmallMetric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function InsightList({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <Card className="rounded-3xl border border-slate-200 p-6">
      <h2 className="text-lg font-black text-slate-950">
        {title}
      </h2>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            {empty}
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
            >
              {item}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
