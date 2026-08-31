import type {
  AdaptiveDifficulty,
  AdaptiveTopicState,
} from "@/types/adaptiveLearning";

export type TutorMessageRole = "student" | "assistant";

export type TutorMessage = {
  id: string;
  role: TutorMessageRole;
  content: string;
  createdAt: Date | null;
  mode?: "live" | "demo";
};

export type TutorConversation = {
  id: string;
  studentId: string;
  title: string;
  messages: TutorMessage[];
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type TutorTopicContext = {
  topic: string;
  masteryScore: number;
  confidenceScore: number;
  attempts: number;
  independentEvidenceCount: number;
  supportedEvidenceCount: number;
  state: AdaptiveTopicState;
  recommendedDifficulty: AdaptiveDifficulty;
};

export type TutorRecommendationType =
  | "lesson"
  | "quiz"
  | "exam"
  | "programming"
  | "review";

export type TutorStudentContext = {
  studentId: string;
  name: string;
  qualification: string;
  examBoard: string;
  currentCourse: string;

  overallMastery: number;
  examReadiness: number;
  confidence: number;

  // Compatibility aliases used by existing UI text.
  combinedAverage: number;
  quizAverage: number;
  examAverage: number;

  currentGrade: string;
  predictedGrade: string;
  improvementTrend: number;

  completedLessons: number;
  completedAssessments: number;
  awaitingMarking: number;

  independentEvidenceCount: number;
  supportedEvidenceCount: number;
  dueForReviewCount: number;

  strongestTopics: TutorTopicContext[];
  priorityTopics: TutorTopicContext[];

  recommendedActions: {
    title: string;
    description: string;
    topic: string;
    type: TutorRecommendationType;
    href: string;
  }[];
};

export type TutorResponse = {
  reply: string;
  mode: "live" | "demo";
  suggestedPrompts: string[];
  recommendations: {
    title: string;
    description: string;
    href: string;
    type: TutorRecommendationType;
  }[];
  warning?: string;
};
