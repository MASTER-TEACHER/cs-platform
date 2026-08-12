import type { AdaptiveTopicState } from "@/types/adaptiveLearning";

export function calculateDaysSince(date: Date | null): number {
  if (!date) return 999;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
}

export function calculateReviewInterval({
  masteryScore,
  attempts,
  state,
}: {
  masteryScore: number;
  attempts: number;
  state: AdaptiveTopicState;
}): number {
  if (state === "priority" || state === "new" || state === "forgetting-risk") {
    return 1;
  }
  if (masteryScore < 50) return 2;
  if (masteryScore < 70) return 4;
  if (masteryScore < 85) return Math.min(10, 5 + attempts);
  return Math.min(30, 10 + attempts * 2);
}

export function calculateNextReviewDate({
  lastPractisedAt,
  intervalDays,
}: {
  lastPractisedAt: Date | null;
  intervalDays: number;
}): Date {
  const date = lastPractisedAt ? new Date(lastPractisedAt) : new Date();
  date.setDate(date.getDate() + intervalDays);
  return date;
}
