import type {
  AdaptiveDifficulty,
  AdaptiveEvidence,
  AdaptiveEvidenceSource,
  AdaptiveTopicMastery,
  AdaptiveTopicState,
} from "@/types/adaptiveLearning";
import {
  calculateDaysSince,
  calculateNextReviewDate,
  calculateReviewInterval,
} from "@/services/spacedRepetitionService";

type TopicEvidenceGroup = {
  topic: string;
  evidence: AdaptiveEvidence[];
};

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function weightedAverage(evidence: AdaptiveEvidence[]): number {
  const scored = evidence.filter((item) => typeof item.score === "number");
  const totalWeight = scored.reduce((sum, item) => sum + item.weight, 0);
  if (!scored.length || totalWeight === 0) return 0;
  return Math.round(
    scored.reduce((sum, item) => sum + (item.score || 0) * item.weight, 0) /
      totalWeight,
  );
}

function scoreSequence(evidence: AdaptiveEvidence[]): number[] {
  return evidence
    .filter((item) => typeof item.score === "number" && item.completedAt)
    .sort(
      (first, second) =>
        (first.completedAt?.getTime() || 0) -
        (second.completedAt?.getTime() || 0),
    )
    .map((item) => item.score || 0);
}

function calculateTrend(evidence: AdaptiveEvidence[]): number {
  const scores = scoreSequence(evidence);
  if (scores.length < 2) return 0;
  const midpoint = Math.ceil(scores.length / 2);
  const average = (values: number[]) =>
    values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;
  return Math.round(
    average(scores.slice(midpoint)) - average(scores.slice(0, midpoint)),
  );
}

function latestEvidence(evidence: AdaptiveEvidence[]): AdaptiveEvidence | null {
  return (
    [...evidence]
      .filter((item) => item.completedAt)
      .sort(
        (first, second) =>
          (second.completedAt?.getTime() || 0) -
          (first.completedAt?.getTime() || 0),
      )[0] || null
  );
}

function determineState({
  masteryScore,
  attempts,
  daysSincePractice,
  trend,
}: {
  masteryScore: number;
  attempts: number;
  daysSincePractice: number;
  trend: number;
}): AdaptiveTopicState {
  if (attempts === 0) return "new";
  if (masteryScore >= 85 && attempts >= 3 && daysSincePractice <= 21) {
    return "mastered";
  }
  if (masteryScore >= 70 && daysSincePractice > 14) {
    return "forgetting-risk";
  }
  if (masteryScore >= 70) return "secure";
  if (masteryScore < 50 || trend <= -15) return "priority";
  return "developing";
}

function difficultyFor(masteryScore: number): AdaptiveDifficulty {
  if (masteryScore < 45) return "foundation";
  if (masteryScore < 75) return "standard";
  return "higher";
}

function confidence({
  attempts,
  sources,
  averageScore,
}: {
  attempts: number;
  sources: AdaptiveEvidenceSource[];
  averageScore: number;
}): number {
  return clamp(
    Math.min(55, attempts * 12) +
      Math.min(25, sources.length * 10) +
      (averageScore >= 70 ? 20 : averageScore >= 50 ? 12 : 6),
  );
}

function priority({
  masteryScore,
  daysSincePractice,
  trend,
  attempts,
  state,
}: {
  masteryScore: number;
  daysSincePractice: number;
  trend: number;
  attempts: number;
  state: AdaptiveTopicState;
}): number {
  const stateBoost =
    state === "priority"
      ? 15
      : state === "forgetting-risk"
        ? 12
        : state === "new"
          ? 10
          : 0;
  return clamp(
    Math.round(
      (100 - masteryScore) * 0.55 +
        Math.min(25, daysSincePractice * 1.5) +
        (trend < 0 ? Math.min(20, Math.abs(trend)) : 0) +
        (attempts < 2 ? 10 : 0) +
        stateBoost,
    ),
  );
}

function reason({
  state,
  masteryScore,
  trend,
  daysSincePractice,
}: {
  state: AdaptiveTopicState;
  masteryScore: number;
  trend: number;
  daysSincePractice: number;
}): string {
  if (state === "new") {
    return "This topic has not yet been assessed, so an initial learning check is needed.";
  }
  if (state === "forgetting-risk") {
    return `Mastery is ${masteryScore}%, but the topic has not been practised for ${daysSincePractice} days. Retrieval is due.`;
  }
  if (state === "priority") {
    return trend < 0
      ? `Mastery is ${masteryScore}% and recent performance has fallen by ${Math.abs(trend)} percentage points.`
      : `Mastery is currently ${masteryScore}%, so this topic needs immediate support.`;
  }
  if (state === "developing") {
    return `Mastery is ${masteryScore}%. Further guided practice is needed.`;
  }
  if (state === "mastered") {
    return `Mastery is ${masteryScore}% across repeated evidence. Use occasional retrieval to maintain it.`;
  }
  return `Mastery is ${masteryScore}%. Continue spaced retrieval to keep the topic secure.`;
}

export function buildTopicMastery(
  groups: TopicEvidenceGroup[],
): AdaptiveTopicMastery[] {
  return groups
    .map((group, index) => {
      const attempts = group.evidence.filter(
        (item) => typeof item.score === "number",
      ).length;
      const averageScore = weightedAverage(group.evidence);
      const trend = calculateTrend(group.evidence);
      const latest = latestEvidence(group.evidence);
      const latestScore =
        typeof latest?.score === "number" ? latest.score : averageScore;
      const lastPractisedAt = latest?.completedAt || null;
      const daysSincePractice = calculateDaysSince(lastPractisedAt);
      const recencyPenalty = Math.min(
        20,
        Math.max(0, daysSincePractice - 7) * 1.2,
      );
      const masteryScore = clamp(
        Math.round(
          averageScore * 0.7 +
            latestScore * 0.2 +
            Math.max(-10, Math.min(10, trend * 0.2)) -
            recencyPenalty,
        ),
      );
      const evidenceSources = Array.from(
        new Set(group.evidence.map((item) => item.source)),
      );
      const state = determineState({
        masteryScore,
        attempts,
        daysSincePractice,
        trend,
      });
      const reviewIntervalDays = calculateReviewInterval({
        masteryScore,
        attempts,
        state,
      });
      const nextReviewAt = calculateNextReviewDate({
        lastPractisedAt,
        intervalDays: reviewIntervalDays,
      });

      return {
        id: `mastery-${index}`,
        topic: group.topic,
        masteryScore,
        confidenceScore: confidence({
          attempts,
          sources: evidenceSources,
          averageScore,
        }),
        priorityScore: priority({
          masteryScore,
          daysSincePractice,
          trend,
          attempts,
          state,
        }),
        attempts,
        averageScore,
        latestScore,
        trend,
        lastPractisedAt,
        nextReviewAt,
        daysSincePractice,
        reviewIntervalDays,
        state,
        recommendedDifficulty: difficultyFor(masteryScore),
        evidenceSources,
        reason: reason({ state, masteryScore, trend, daysSincePractice }),
      };
    })
    .sort((first, second) => second.priorityScore - first.priorityScore);
}
