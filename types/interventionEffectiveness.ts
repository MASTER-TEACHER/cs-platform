export type InterventionEffectivenessStatus =
  | "improving"
  | "limited_change"
  | "declining"
  | "awaiting_evidence"
  | "baseline_needed";

export type InterventionEffectivenessItem = {
  interventionId: string;
  studentId: string;
  studentName: string;
  topic: string;
  interventionStatus: string;
  effectivenessStatus: InterventionEffectivenessStatus;
  headline: string;
  summary: string;
  evidenceChange: number;
  attainmentChange: number | null;
  topicMasteryChange: number | null;
  completionChange: number | null;
  workingGradeChange: number | null;
  recommendedAction: string;
  reviewHref: string;
};

export type InterventionEffectivenessSummary = {
  total: number;
  improving: number;
  limitedChange: number;
  declining: number;
  awaitingEvidence: number;
  baselineNeeded: number;
  reviewReady: number;
  successfulRate: number | null;
  items: InterventionEffectivenessItem[];
};
