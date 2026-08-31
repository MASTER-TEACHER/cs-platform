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

const clamp = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

function scoredEvidence(
  evidence: AdaptiveEvidence[],
  mode?: AdaptiveEvidence["mode"],
): AdaptiveEvidence[] {
  return evidence.filter(
    (item) =>
      typeof item.score === "number" &&
      Number.isFinite(item.score) &&
      (mode ? item.mode === mode : true),
  );
}

function weightedAverage(evidence: AdaptiveEvidence[]): number {
  const scored = scoredEvidence(evidence);
  const totalWeight = scored.reduce(
    (sum, item) => sum + Math.max(0, item.weight),
    0,
  );

  if (!scored.length || totalWeight <= 0) return 0;

  return clamp(
    scored.reduce(
      (sum, item) =>
        sum + (item.score || 0) * Math.max(0, item.weight),
      0,
    ) / totalWeight,
  );
}

function scoreSequence(evidence: AdaptiveEvidence[]): number[] {
  return evidence
    .filter(
      (item) =>
        item.mode === "independent" &&
        typeof item.score === "number" &&
        item.completedAt,
    )
    .sort(
      (a, b) =>
        (a.completedAt?.getTime() || 0) -
        (b.completedAt?.getTime() || 0),
    )
    .map((item) => item.score || 0);
}

function calculateTrend(evidence: AdaptiveEvidence[]): number {
  const scores = scoreSequence(evidence);
  if (scores.length < 2) return 0;

  const midpoint = Math.ceil(scores.length / 2);
  const avg = (values: number[]) =>
    values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 0;

  return Math.round(
    avg(scores.slice(midpoint)) - avg(scores.slice(0, midpoint)),
  );
}

function latestEvidence(
  evidence: AdaptiveEvidence[],
  mode?: AdaptiveEvidence["mode"],
): AdaptiveEvidence | null {
  return (
    [...evidence]
      .filter(
        (item) =>
          item.completedAt &&
          (mode ? item.mode === mode : true),
      )
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() || 0) -
          (a.completedAt?.getTime() || 0),
      )[0] || null
  );
}

function determineState({
  masteryScore,
  independentAttempts,
  supportedEvidenceCount,
  daysSincePractice,
  trend,
}: {
  masteryScore: number;
  independentAttempts: number;
  supportedEvidenceCount: number;
  daysSincePractice: number;
  trend: number;
}): AdaptiveTopicState {
  if (independentAttempts === 0 && supportedEvidenceCount === 0) return "new";
  if (independentAttempts === 0) return "developing";

  if (
    masteryScore >= 85 &&
    independentAttempts >= 3 &&
    daysSincePractice <= 21
  ) {
    return "mastered";
  }

  if (masteryScore >= 70 && daysSincePractice > 14) {
    return "forgetting-risk";
  }

  if (masteryScore >= 70) return "secure";

  if (masteryScore < 50 || trend <= -15) return "priority";

  return "developing";
}

function difficultyFor(
  masteryScore: number,
  independentAttempts: number,
): AdaptiveDifficulty {
  if (independentAttempts === 0 || masteryScore < 45) return "foundation";
  if (masteryScore < 75) return "standard";
  return "higher";
}

function confidence({
  independentAttempts,
  independentSources,
  supportedEvidenceCount,
  averageScore,
}: {
  independentAttempts: number;
  independentSources: AdaptiveEvidenceSource[];
  supportedEvidenceCount: number;
  averageScore: number;
}): number {
  if (independentAttempts === 0) {
    return Math.min(25, supportedEvidenceCount * 5);
  }

  return clamp(
    Math.min(50, independentAttempts * 11) +
      Math.min(25, independentSources.length * 10) +
      (averageScore >= 70 ? 20 : averageScore >= 50 ? 12 : 6) +
      Math.min(5, supportedEvidenceCount),
  );
}

function priority({
  masteryScore,
  daysSincePractice,
  trend,
  independentAttempts,
  state,
}: {
  masteryScore: number;
  daysSincePractice: number;
  trend: number;
  independentAttempts: number;
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
    (100 - masteryScore) * 0.55 +
      Math.min(25, daysSincePractice * 1.5) +
      (trend < 0 ? Math.min(20, Math.abs(trend)) : 0) +
      (independentAttempts < 2 ? 10 : 0) +
      stateBoost,
  );
}

function reason({
  state,
  masteryScore,
  trend,
  daysSincePractice,
  independentAttempts,
  supportedEvidenceCount,
}: {
  state: AdaptiveTopicState;
  masteryScore: number;
  trend: number;
  daysSincePractice: number;
  independentAttempts: number;
  supportedEvidenceCount: number;
}): string {
  if (independentAttempts === 0 && supportedEvidenceCount > 0) {
    return "Learning activity has been completed, but independent assessed evidence is still needed before mastery can be estimated.";
  }

  if (state === "new") {
    return "This topic has not yet been assessed, so an initial independent learning check is needed.";
  }

  if (state === "forgetting-risk") {
    return `Independent mastery is ${masteryScore}%, but the topic has not been independently practised for ${daysSincePractice} days. Retrieval is due.`;
  }

  if (state === "priority") {
    return trend < 0
      ? `Independent mastery is ${masteryScore}% and recent independent performance has fallen by ${Math.abs(trend)} percentage points.`
      : `Independent mastery is currently ${masteryScore}%, so this topic needs immediate support and reassessment.`;
  }

  if (state === "developing") {
    return `Independent mastery is ${masteryScore}%. Further guided practice followed by an independent check is recommended.`;
  }

  if (state === "mastered") {
    return `Independent mastery is ${masteryScore}% across repeated evidence. Use occasional retrieval to maintain it.`;
  }

  return `Independent mastery is ${masteryScore}%. Continue spaced retrieval to keep the topic secure.`;
}

export function buildTopicMastery(
  groups: TopicEvidenceGroup[],
): AdaptiveTopicMastery[] {
  return groups
    .map((group, index) => {
      const independent = scoredEvidence(group.evidence, "independent");
      const supported = scoredEvidence(group.evidence, "supported");

      const independentAttempts = independent.length;
      const supportedEvidenceCount = supported.length;

      const independentAverageScore = weightedAverage(independent);
      const supportedAverageScore = weightedAverage(supported);
      const trend = calculateTrend(group.evidence);

      const latestIndependent = latestEvidence(group.evidence, "independent");
      const latestAny = latestEvidence(group.evidence);

      const latestScore =
        typeof latestIndependent?.score === "number"
          ? latestIndependent.score
          : independentAverageScore;

      const lastPractisedAt =
        latestIndependent?.completedAt || latestAny?.completedAt || null;

      const daysSincePractice = calculateDaysSince(lastPractisedAt);

      let masteryScore = 0;

      if (independentAttempts > 0) {
        const recencyPenalty = Math.min(
          20,
          Math.max(0, daysSincePractice - 7) * 1.2,
        );

        masteryScore = clamp(
          independentAverageScore * 0.75 +
            latestScore * 0.25 +
            Math.max(-10, Math.min(10, trend * 0.2)) -
            recencyPenalty,
        );
      }

      const state = determineState({
        masteryScore,
        independentAttempts,
        supportedEvidenceCount,
        daysSincePractice,
        trend,
      });

      const reviewIntervalDays = calculateReviewInterval({
        masteryScore,
        attempts: independentAttempts,
        state,
      });

      const nextReviewAt = calculateNextReviewDate({
        lastPractisedAt,
        intervalDays: reviewIntervalDays,
      });

      const evidenceSources = Array.from(
        new Set(group.evidence.map((item) => item.source)),
      );

      const independentSources = Array.from(
        new Set(independent.map((item) => item.source)),
      );

      return {
        id: `mastery-${index}`,
        topic: group.topic,
        masteryScore,
        independentAverageScore,
        supportedAverageScore,
        confidenceScore: confidence({
          independentAttempts,
          independentSources,
          supportedEvidenceCount,
          averageScore: independentAverageScore,
        }),
        priorityScore: priority({
          masteryScore,
          daysSincePractice,
          trend,
          independentAttempts,
          state,
        }),
        attempts: independentAttempts,
        independentEvidenceCount: independentAttempts,
        supportedEvidenceCount,
        averageScore: independentAverageScore,
        latestScore,
        trend,
        lastPractisedAt,
        nextReviewAt,
        daysSincePractice,
        reviewIntervalDays,
        state,
        recommendedDifficulty: difficultyFor(
          masteryScore,
          independentAttempts,
        ),
        evidenceSources,
        reason: reason({
          state,
          masteryScore,
          trend,
          daysSincePractice,
          independentAttempts,
          supportedEvidenceCount,
        }),
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
