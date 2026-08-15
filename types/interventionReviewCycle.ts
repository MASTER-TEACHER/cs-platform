export type InterventionReviewDecision =
  | "continue"
  | "retarget"
  | "close_successful"
  | "escalate";

export type InterventionReviewPhase =
  | "baseline_needed"
  | "awaiting_evidence"
  | "ready_to_review"
  | "successful"
  | "needs_retargeting"
  | "escalation_recommended";

export type InterventionReviewCycle = {
  phase: InterventionReviewPhase;
  headline: string;
  explanation: string;
  evidenceReady: boolean;
  reassessmentRecommended: boolean;
  canCloseSuccessful: boolean;
  recommendedDecision: InterventionReviewDecision;
  successSignals: string[];
  concernSignals: string[];
};

export type SavedInterventionReviewDecision = {
  decision: InterventionReviewDecision;
  note: string;
  reviewedAt: Date | null;
};
