export type AdaptiveTopicState =
  "new" | "priority" | "developing" | "secure" | "forgetting-risk" | "mastered";

export type AdaptiveDifficulty = "foundation" | "standard" | "higher";

export type AdaptiveActionType = "lesson" | "quiz" | "exam" | "review";

export type AdaptiveEvidenceSource =
  "quiz" | "exam" | "lesson" | "intervention";

export type AdaptiveEvidence = {
  id: string;
  topic: string;
  source: AdaptiveEvidenceSource;
  score: number | null;
  completedAt: Date | null;
  weight: number;
};

export type AdaptiveTopicMastery = {
  id: string;
  topic: string;
  masteryScore: number;
  confidenceScore: number;
  priorityScore: number;
  attempts: number;
  averageScore: number;
  latestScore: number;
  trend: number;
  lastPractisedAt: Date | null;
  nextReviewAt: Date;
  daysSincePractice: number;
  reviewIntervalDays: number;
  state: AdaptiveTopicState;
  recommendedDifficulty: AdaptiveDifficulty;
  evidenceSources: AdaptiveEvidenceSource[];
  reason: string;
};

export type AdaptiveLearningAction = {
  id: string;
  type: AdaptiveActionType;
  title: string;
  description: string;
  topic: string;
  href: string;
  estimatedMinutes: number;
  xpReward: number;
  priority: "high" | "medium" | "low";
};

export type AdaptiveLearningPlan = {
  studentId: string;
  generatedAt: Date;
  overallMastery: number;
  examReadiness: number;
  confidence: number;
  currentGrade: string;
  predictedGrade: string;
  dueForReviewCount: number;
  priorityTopicCount: number;
  secureTopicCount: number;
  nextAction: AdaptiveLearningAction | null;
  actions: AdaptiveLearningAction[];
  topics: AdaptiveTopicMastery[];
};
