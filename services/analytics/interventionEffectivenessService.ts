import { buildInterventionReviewCycle } from "@/services/analytics/interventionReviewCycleService";
import type { InterventionImpact } from "@/types/interventionImpact";
import type {
  InterventionEffectivenessItem,
  InterventionEffectivenessStatus,
  InterventionEffectivenessSummary,
} from "@/types/interventionEffectiveness";

export type InterventionEffectivenessSource = {
  id: string;
  studentName: string;
  topic: string;
  status: string;
};

function effectivenessStatus(
  impact: InterventionImpact,
): InterventionEffectivenessStatus {
  if (!impact.baseline) {
    return "baseline_needed";
  }

  if (impact.impactStatus === "awaiting_new_evidence") {
    return "awaiting_evidence";
  }

  if (impact.impactStatus === "improving") {
    return "improving";
  }

  if (impact.impactStatus === "declining") {
    return "declining";
  }

  return "limited_change";
}

function headlineForStatus(
  status: InterventionEffectivenessStatus,
): string {
  switch (status) {
    case "improving":
      return "Improving";
    case "declining":
      return "Declining";
    case "awaiting_evidence":
      return "Awaiting reassessment";
    case "baseline_needed":
      return "Baseline required";
    default:
      return "Limited / mixed change";
  }
}

function statusRank(
  status: InterventionEffectivenessStatus,
): number {
  switch (status) {
    case "declining":
      return 0;
    case "baseline_needed":
      return 1;
    case "awaiting_evidence":
      return 2;
    case "limited_change":
      return 3;
    case "improving":
      return 4;
  }
}

export function buildInterventionEffectivenessItem({
  source,
  impact,
}: {
  source: InterventionEffectivenessSource;
  impact: InterventionImpact;
}): InterventionEffectivenessItem {
  const status = effectivenessStatus(impact);
  const review = buildInterventionReviewCycle(impact);

  return {
    interventionId: source.id,
    studentId: impact.studentId,
    studentName: source.studentName,
    topic: impact.topic || source.topic,
    interventionStatus: source.status,
    effectivenessStatus: status,
    headline: headlineForStatus(status),
    summary: impact.summary,
    evidenceChange: impact.evidenceChange,
    attainmentChange: impact.attainmentChange,
    topicMasteryChange: impact.topicMasteryChange,
    completionChange: impact.completionChange,
    workingGradeChange: impact.workingGradeChange,
    recommendedAction: review.explanation,
    reviewHref: `/teacher/interventions/${encodeURIComponent(source.id)}`,
  };
}

export function buildInterventionEffectivenessSummary(
  items: InterventionEffectivenessItem[],
): InterventionEffectivenessSummary {
  const improving = items.filter(
    (item) => item.effectivenessStatus === "improving",
  ).length;

  const limitedChange = items.filter(
    (item) => item.effectivenessStatus === "limited_change",
  ).length;

  const declining = items.filter(
    (item) => item.effectivenessStatus === "declining",
  ).length;

  const awaitingEvidence = items.filter(
    (item) => item.effectivenessStatus === "awaiting_evidence",
  ).length;

  const baselineNeeded = items.filter(
    (item) => item.effectivenessStatus === "baseline_needed",
  ).length;

  const reviewReady = improving + limitedChange + declining;

  const successfulRate =
    reviewReady > 0
      ? Math.round((improving / reviewReady) * 100)
      : null;

  return {
    total: items.length,
    improving,
    limitedChange,
    declining,
    awaitingEvidence,
    baselineNeeded,
    reviewReady,
    successfulRate,
    items: [...items].sort((first, second) => {
      const statusDifference =
        statusRank(first.effectivenessStatus) -
        statusRank(second.effectivenessStatus);

      if (statusDifference !== 0) {
        return statusDifference;
      }

      return first.studentName.localeCompare(second.studentName);
    }),
  };
}
