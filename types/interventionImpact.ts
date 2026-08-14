export type InterventionAnalyticsBaseline = {
  capturedAt: Date | null;
  workingGrade: string | null;
  targetGrade: string | null;
  gradeGap: number | null;
  weightedPercentage: number;
  trend: string;
  completionRate: number;
  evidenceCount: number;
  topic: string;
  topicMastery: number | null;
};

export type InterventionImpactStatus =
  | "baseline_missing"
  | "awaiting_new_evidence"
  | "improving"
  | "mixed"
  | "no_change"
  | "declining";

export type InterventionImpact = {
  interventionId: string;
  studentId: string;
  title: string;
  topic: string;
  status: string;
  createdAt: Date | null;
  baseline: InterventionAnalyticsBaseline | null;
  current: InterventionAnalyticsBaseline;
  impactStatus: InterventionImpactStatus;
  workingGradeChange: number | null;
  gradeGapChange: number | null;
  attainmentChange: number;
  completionChange: number;
  topicMasteryChange: number | null;
  evidenceChange: number;
  summary: string;
  nextAction: string;
};
