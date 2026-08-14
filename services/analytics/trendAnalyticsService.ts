import {
  TREND_DECLINE,
  TREND_IMPROVEMENT,
  TREND_STRONG_IMPROVEMENT,
} from "@/data/analytics/analyticsConfig";
import type {
  AnalyticsEvidence,
  PerformanceTrend,
  TrendPoint,
} from "@/types/analytics";

export function buildTrend(
  evidence: AnalyticsEvidence[],
): {
  trend: PerformanceTrend;
  change: number | null;
  points: TrendPoint[];
} {
  const points = evidence
    .filter(
      (item) =>
        item.graded &&
        typeof item.percentage === "number",
    )
    .sort(
      (a, b) =>
        (a.completedAt?.getTime() ?? 0) -
        (b.completedAt?.getTime() ?? 0),
    )
    .slice(-8)
    .map((item) => ({
      id: item.id,
      title: item.title,
      percentage: item.percentage as number,
      completedAt: item.completedAt,
    }));

  if (points.length < 3) {
    return {
      trend: "insufficient_evidence",
      change: null,
      points,
    };
  }

  const split = Math.max(
    1,
    Math.floor(points.length / 2),
  );

  const early = points.slice(0, split);
  const recent = points.slice(split);

  const average = (values: number[]) =>
    values.reduce((total, value) => total + value, 0) /
    values.length;

  const earlyAverage = average(
    early.map((point) => point.percentage),
  );

  const recentAverage = average(
    recent.map((point) => point.percentage),
  );

  const change = Math.round(
    recentAverage - earlyAverage,
  );

  let trend: PerformanceTrend = "stable";

  if (change >= TREND_STRONG_IMPROVEMENT) {
    trend = "strong_improvement";
  } else if (change >= TREND_IMPROVEMENT) {
    trend = "improving";
  } else if (change <= TREND_DECLINE) {
    trend = "declining";
  }

  return {
    trend,
    change,
    points,
  };
}
