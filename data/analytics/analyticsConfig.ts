import type { AnalyticsEvidenceType } from "@/types/analytics";

export const ANALYTICS_EVIDENCE_WEIGHTS: Record<
  AnalyticsEvidenceType,
  number
> = {
  written_exam: 1,
  quiz: 0.55,
  ai_quiz: 0.55,
  programming: 0.4,
  lesson: 0.15,
};

/*
 * Recency multiplier.
 *
 * Recent evidence should influence the current working grade more strongly
 * than old evidence, without discarding older assessment history.
 */
export function getRecencyMultiplier(
  completedAt: Date | null,
  now = new Date(),
): number {
  if (!completedAt) return 0.75;

  const ageInDays = Math.max(
    0,
    (now.getTime() - completedAt.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (ageInDays <= 30) return 1;
  if (ageInDays <= 90) return 0.9;
  if (ageInDays <= 180) return 0.8;

  return 0.7;
}

export const TOPIC_SECURE_THRESHOLD = 70;
export const TOPIC_DEVELOPING_THRESHOLD = 50;

export const TREND_STRONG_IMPROVEMENT = 10;
export const TREND_IMPROVEMENT = 4;
export const TREND_DECLINE = -4;
