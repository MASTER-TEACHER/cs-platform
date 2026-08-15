import type { GradeLabel, PerformanceTrend } from "@/types/analytics";

export type StudentProgressReport = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  generatedAt: Date;
  workingGrade: GradeLabel | null;
  targetGrade: GradeLabel | null;
  gradeGap: number | null;
  workingPercentage: number | null;
  nextGrade: GradeLabel | null;
  marksToNextGrade: number | null;
  trend: PerformanceTrend;
  completionRate: number;
  confidence: string;
  strengths: Array<{ topic: string; mastery: number }>;
  priorities: Array<{ topic: string; mastery: number }>;
  recentEvidence: Array<{ title: string; percentage: number | null; completedAt: Date | null }>;
  interventionSummary: { active: number; completed: number; cancelled: number };
  teacherCommentary: string[];
  studentNextSteps: string[];
};

export type ClassProgressReport = {
  classId: string;
  className: string;
  generatedAt: Date;
  studentCount: number;
  studentsWithEvidence: number;
  averageWorkingGrade: GradeLabel | null;
  averageTargetGrade: GradeLabel | null;
  averageWeightedPercentage: number | null;
  averageCompletionRate: number;
  onOrAboveTargetPercentage: number;
  highPriorityCount: number;
  decliningCount: number;
  lowEvidenceCount: number;
  strongestTopics: Array<{ topic: string; mastery: number }>;
  priorityTopics: Array<{ topic: string; mastery: number }>;
};
