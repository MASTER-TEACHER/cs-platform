import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { InterventionImpact } from "@/types/interventionImpact";
import type {
  InterventionReviewCycle,
  InterventionReviewDecision,
} from "@/types/interventionReviewCycle";

function changeText(
  label: string,
  value: number | null,
  suffix = "",
): string | null {
  if (value === null || value === 0) {
    return null;
  }

  const direction =
    value > 0 ? "increased" : "decreased";

  return `${label} ${direction} by ${Math.abs(value)}${suffix}.`;
}

export function buildInterventionReviewCycle(
  impact: InterventionImpact,
): InterventionReviewCycle {
  const allChanges = [
    changeText("Attainment", impact.attainmentChange, "%"),
    changeText("Completion", impact.completionChange, "%"),
    changeText("Topic mastery", impact.topicMasteryChange, "%"),
    changeText("Working grade", impact.workingGradeChange),
  ].filter((value): value is string => Boolean(value));

  const successSignals = allChanges.filter(
    (value) => value.includes("increased"),
  );

  const concernSignals = allChanges.filter(
    (value) => value.includes("decreased"),
  );

  if (!impact.baseline) {
    return {
      phase: "baseline_needed",
      headline: "Capture a baseline before judging impact",
      explanation:
        "This intervention does not yet have a reliable before-intervention comparison point.",
      evidenceReady: false,
      reassessmentRecommended: false,
      canCloseSuccessful: false,
      recommendedDecision: "continue",
      successSignals,
      concernSignals,
    };
  }

  if (impact.impactStatus === "awaiting_new_evidence") {
    return {
      phase: "awaiting_evidence",
      headline: "The intervention needs a reassessment",
      explanation:
        "The baseline exists, but there is no new graded evidence yet. Assign a focused reassessment before deciding whether the intervention worked.",
      evidenceReady: false,
      reassessmentRecommended: true,
      canCloseSuccessful: false,
      recommendedDecision: "continue",
      successSignals,
      concernSignals,
    };
  }

  if (impact.impactStatus === "improving") {
    return {
      phase: "successful",
      headline: "Evidence indicates that the intervention is working",
      explanation:
        "Multiple post-intervention indicators have improved. The teacher can continue briefly for consolidation or close the intervention as successful.",
      evidenceReady: true,
      reassessmentRecommended: false,
      canCloseSuccessful: true,
      recommendedDecision: "close_successful",
      successSignals,
      concernSignals,
    };
  }

  if (impact.impactStatus === "declining") {
    return {
      phase: "escalation_recommended",
      headline: "The current support is not producing the required improvement",
      explanation:
        "Multiple indicators have weakened since the baseline. Review the misconception, change the support strategy and use a focused reassessment.",
      evidenceReady: true,
      reassessmentRecommended: true,
      canCloseSuccessful: false,
      recommendedDecision: "escalate",
      successSignals,
      concernSignals,
    };
  }

  if (impact.impactStatus === "mixed") {
    return {
      phase: "needs_retargeting",
      headline: "Some evidence improved, but the intervention needs retargeting",
      explanation:
        "The response is mixed. Keep the successful elements, retarget the weak area and collect another meaningful assessment.",
      evidenceReady: true,
      reassessmentRecommended: true,
      canCloseSuccessful: false,
      recommendedDecision: "retarget",
      successSignals,
      concernSignals,
    };
  }

  return {
    phase: "ready_to_review",
    headline: "New evidence is available for teacher review",
    explanation:
      "There is post-intervention evidence, but the overall change is not yet large enough to classify as improving or declining.",
    evidenceReady: true,
    reassessmentRecommended: true,
    canCloseSuccessful: false,
    recommendedDecision: "continue",
    successSignals,
    concernSignals,
  };
}

export function buildInterventionReassessmentHref({
  impact,
}: {
  impact: InterventionImpact;
}): string {
  return (
    `/teacher/assignment-wizard?source=intervention-review` +
    `&studentId=${encodeURIComponent(impact.studentId)}` +
    `&topic=${encodeURIComponent(impact.topic)}` +
    `&interventionId=${encodeURIComponent(impact.interventionId)}`
  );
}

export async function saveInterventionReviewDecision({
  interventionId,
  teacherId,
  decision,
  note,
}: {
  interventionId: string;
  teacherId: string;
  decision: InterventionReviewDecision;
  note: string;
}): Promise<void> {
  const reference = doc(
    db,
    "interventions",
    interventionId,
  );

  const update: Record<string, unknown> = {
    reviewDecision: decision,
    reviewNote: note.trim(),
    reviewedAt: serverTimestamp(),
    reviewedBy: teacherId.trim(),
    updatedAt: serverTimestamp(),
  };

  if (decision === "close_successful") {
    update.status = "completed";
    update.completedAt = serverTimestamp();
  }

  if (decision === "escalate") {
    update.status = "active";
    update.escalatedAt = serverTimestamp();
  }

  if (decision === "retarget") {
    update.status = "active";
    update.retargetedAt = serverTimestamp();
  }

  await updateDoc(reference, update);
}
