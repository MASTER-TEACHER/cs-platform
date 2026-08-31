export type AdaptiveTopicState =
  | "new"
  | "priority"
  | "developing"
  | "secure"
  | "forgetting-risk"
  | "mastered";

export type AdaptiveDifficulty = "foundation" | "standard" | "higher";

export type AdaptiveActionType =
  | "lesson"
  | "quiz"
  | "exam"
  | "programming"
  | "review";

export type AdaptiveEvidenceSource =
  | "quiz"
  | "exam"
  | "lesson"
  | "programming"
  | "intervention";

export type AdaptiveEvidenceMode = "independent" | "supported";

export type AdaptiveEvidence = {
  id: string;
  topic: string;
  source: AdaptiveEvidenceSource;
  mode: AdaptiveEvidenceMode;
  score: number | null;
  completedAt: Date | null;
  weight: number;
};

export type AdaptiveTopicMastery = {
  id: string;
  topic: string;
  masteryScore: number;
  independentAverageScore: number;
  supportedAverageScore: number;
  confidenceScore: number;
  priorityScore: number;
  attempts: number;
  independentEvidenceCount: number;
  supportedEvidenceCount: number;
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
  qualification: string;
  examBoard: string;
  currentCourse: string;
  overallMastery: number;
  examReadiness: number;
  confidence: number;
  independentEvidenceCount: number;
  supportedEvidenceCount: number;
  currentGrade: string;
  predictedGrade: string;
  dueForReviewCount: number;
  priorityTopicCount: number;
  secureTopicCount: number;
  nextAction: AdaptiveLearningAction | null;
  actions: AdaptiveLearningAction[];
  topics: AdaptiveTopicMastery[];
};
