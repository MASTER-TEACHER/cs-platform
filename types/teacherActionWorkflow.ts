export type TeacherActionType =
  | "intervention"
  | "lesson"
  | "quiz"
  | "exam"
  | "programming"
  | "monitor";

export type TeacherActionRecommendation = {
  type: TeacherActionType;
  title: string;
  reason: string;
  focusTopic: string;
  suggestedInstruction: string;
  priority: "high" | "medium" | "monitor" | "none";
};

export type TeacherInterventionHistoryItem = {
  id: string;
  studentId: string;
  teacherId: string;
  topic: string;
  title: string;
  status: string;
  priority: string;
  pathway: string;
  stepCount: number;
  completedStepCount: number;
  createdAt: Date | null;
  completedAt: Date | null;
};
