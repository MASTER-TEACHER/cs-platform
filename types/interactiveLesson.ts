import type { Lesson } from "@/types/curriculum";

export type InteractiveLessonStepType =
  | "introduction"
  | "objectives"
  | "explanation"
  | "worked-example"
  | "simulator"
  | "practice"
  | "checkpoint"
  | "exam-question"
  | "reflection"
  | "completion";

export type InteractiveLessonStep = {
  id: string;
  type: InteractiveLessonStepType;
  title: string;
  description: string;
};

export type PracticeResponse = {
  questionIndex: number;
  response: string;
  correct: boolean;
  checked: boolean;
};

export type LessonExamMarkingConfidence = "high" | "medium" | "low";

export type LessonExamMarkingResult = {
  mode: "live" | "demo";
  awardedMarks: number;
  maximumMarks: number;
  percentage: number;
  confidence: LessonExamMarkingConfidence;
  matchedPoints: string[];
  missingPoints: string[];
  feedback: string;
  improvedAnswer: string;
  teacherReviewRequired: boolean;
  markedAt: Date | null;
};

export type InteractiveLessonProgressStatus =
  "not_started" | "in_progress" | "completed";

export type InteractiveLessonProgress = {
  id: string;
  studentId: string;
  lessonId: string;
  topicId: string;
  currentStepIndex: number;
  completedStepIds: string[];
  practiceResponses: PracticeResponse[];
  checkpointResponses: PracticeResponse[];
  examResponse: string;
  examMarking: LessonExamMarkingResult | null;
  reflection: string;
  audioEnabled: boolean;
  audioRate: number;
  selectedVoiceName: string;
  practiceAccuracy: number;
  checkpointAccuracy: number;
  examAccuracy: number;
  overallAccuracy: number;
  masteryImpact: number;
  reviewAt: Date | null;
  status: InteractiveLessonProgressStatus;
  startedAt: Date | null;
  updatedAt: Date | null;
  completedAt: Date | null;
};

export type InteractiveLessonDefinition = {
  topicId: string;
  lesson: Lesson;
  steps: InteractiveLessonStep[];
};

export type LessonCompletionSummary = {
  alreadyCompleted: boolean;
  xpAwarded: number;
  practiceAccuracy: number;
  checkpointAccuracy: number;
  examAccuracy: number;
  overallAccuracy: number;
  masteryImpact: number;
  reviewAt: Date;
};
