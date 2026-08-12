export type InterventionStatus = "active" | "completed" | "cancelled";
export type InterventionPriority = "high" | "medium" | "low";
export type InterventionStepType = "lesson" | "quiz" | "exam" | "review";
export type InterventionStepStatus =
  "not_started" | "in_progress" | "completed";

export type InterventionStep = {
  id: string;
  type: InterventionStepType;
  title: string;
  description: string;
  href: string;
  sourceId: string;
  sourceCollection: "assignments" | "examAssignments" | "classAssignments" | "";
  status: InterventionStepStatus;
  xpReward: number;
  completedAt: Date | null;
};

export type Intervention = {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  title: string;
  topic: string;
  reason: string;
  priority: InterventionPriority;
  status: InterventionStatus;
  baselineScore: number;
  currentScore: number;
  impact: number;
  dueDate: Date | null;
  steps: InterventionStep[];
  createdAt: Date | null;
  updatedAt: Date | null;
  completedAt: Date | null;
};

export type CreateInterventionInput = {
  teacherId: string;
  teacherName?: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  classId?: string;
  className?: string;
  title: string;
  topic: string;
  reason: string;
  priority: InterventionPriority;
  baselineScore: number;
  dueDate: Date;
  pathway: "lesson" | "quiz" | "exam" | "complete";
  lessonHref?: string;
  quizAssignmentId?: string;
  examAssignmentId?: string;
  xpPerStep?: number;
};
