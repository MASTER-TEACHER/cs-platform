import {
  TOPIC_DEVELOPING_THRESHOLD,
  TOPIC_SECURE_THRESHOLD,
} from "@/data/analytics/analyticsConfig";
import { getRecencyMultiplier } from "@/data/analytics/analyticsConfig";
import type {
  AnalyticsEvidence,
  TopicMastery,
} from "@/types/analytics";

function normaliseTopic(topic: string): string {
  const cleaned = topic.trim();

  return cleaned || "General Computer Science";
}

export function buildTopicMastery(
  evidence: AnalyticsEvidence[],
): TopicMastery[] {
  const graded = evidence.filter(
    (item) =>
      item.graded &&
      typeof item.percentage === "number",
  );

  const byTopic = new Map<
    string,
    AnalyticsEvidence[]
  >();

  for (const item of graded) {
    const topic = normaliseTopic(item.topic);
    const current = byTopic.get(topic) || [];

    current.push(item);
    byTopic.set(topic, current);
  }

  const rows: TopicMastery[] = [];

  for (const [topic, items] of byTopic) {
    let weightedTotal = 0;
    let totalWeight = 0;

    for (const item of items) {
      const weight =
        item.weight *
        getRecencyMultiplier(item.completedAt);

      weightedTotal +=
        (item.percentage as number) * weight;

      totalWeight += weight;
    }

    const weightedPercentage =
      totalWeight > 0
        ? Math.round(weightedTotal / totalWeight)
        : 0;

    const recent = [...items].sort(
      (a, b) =>
        (b.completedAt?.getTime() ?? 0) -
        (a.completedAt?.getTime() ?? 0),
    )[0];

    const recentPercentage =
      recent?.percentage ?? weightedPercentage;

    const status =
      weightedPercentage >= TOPIC_SECURE_THRESHOLD
        ? "secure"
        : weightedPercentage >=
            TOPIC_DEVELOPING_THRESHOLD
          ? "developing"
          : "priority";

    rows.push({
      topic,
      evidenceCount: items.length,
      weightedPercentage,
      recentPercentage,
      status,
    });
  }

  return rows.sort(
    (a, b) =>
      b.weightedPercentage - a.weightedPercentage,
  );
}
