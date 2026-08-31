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
export type TutorStudentContext = {
  studentId: string;
  name: string;
  qualification: string;
  examBoard: string;
  currentCourse: string;
  combinedAverage: number;
  quizAverage: number;
  examAverage: number;
  currentGrade: string;
  predictedGrade: string;
  improvementTrend: number;
  completedLessons: number;
  completedAssessments: number;
  awaitingMarking: number;
  strongestTopics: { topic: string; averageScore: number; attempts: number }[];
  priorityTopics: { topic: string; averageScore: number; attempts: number }[];
  recommendedActions: {
    title: string;
    description: string;
    topic: string;
    type: "lesson" | "quiz" | "exam";
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
    type: "lesson" | "quiz" | "exam";
  }[];
  warning?: string;
};
