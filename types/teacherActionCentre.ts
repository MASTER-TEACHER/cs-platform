export type TeacherActionPriority = "critical" | "high" | "medium" | "low";
export type TeacherActionKind =
  | "student_support"
  | "topic_reteach"
  | "completion"
  | "assessment"
  | "class_setup"
  | "evidence";

export type TeacherActionItem = {
  id: string;
  kind: TeacherActionKind;
  priority: TeacherActionPriority;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  studentId?: string;
  studentName?: string;
  topic?: string;
  metric?: string;
};

export type TeacherActionCentreSummary = {
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  totalCount: number;
  headline: string;
  actions: TeacherActionItem[];
};

export type TeacherActionCentreInput = {
  studentCount: number;
  classCount: number;
  assignmentCount: number;
  activeAssignmentCount: number;
  averageScore: number;
  completionRate: number;
  atRiskStudents: Array<{
    id: string;
    name: string;
    weakTopic: string;
    averageScore: number;
    recommendedAction: string;
  }>;
  classPerformance: Array<{
    id: string;
    topic: string;
    averageScore: number;
  }>;
};
