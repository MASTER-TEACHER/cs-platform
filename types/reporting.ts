import type {
  AnalyticsEvidenceSourceCounts,
  EvidenceConfidence,
  GradeLabel,
  PerformanceTrend,
} from "@/types/analytics";
import type {
  ExamAnalysisConfidence,
  ExamGradeDistributionItem,
} from "@/types/examIntelligence";

export type ReportTopicRow = {
  topic: string;
  mastery: number;
};

export type ReportEvidenceRow = {
  title: string;
  percentage: number | null;
  completedAt: Date | null;
};

export type ReportInterventionSummary = {
  active: number;
  completed: number;
  cancelled: number;
};

export type ReportPriorityStudent = {
  studentId: string;
  studentName: string;
  workingGrade: GradeLabel | null;
  targetGrade: GradeLabel | null;
  gradeGap: number | null;
  completionRate: number;
  confidence: string;
  priority: "high" | "medium" | "monitor" | "none";
  weakestTopic: string;
  weakestTopicPercentage: number | null;
};

export type ReportGradeDistributionItem = {
  grade: GradeLabel;
  count: number;
};

export type ReportExamSummary = {
  assignmentId: string;
  title: string;
  markedCount: number;
  studentCount: number;
  classAverage: number | null;
  classAverageGrade: GradeLabel | null;
  classMarksToNextGrade: number | null;
  analysisConfidence: ExamAnalysisConfidence;
  weakestTopic: string | null;
  weakestTopicSuccess: number | null;
  strongestTopic: string | null;
  strongestTopicSuccess: number | null;
  hardestQuestionNumber: number | null;
  hardestQuestionSuccess: number | null;
  weakestAssessmentObjective: "AO1" | "AO2" | "AO3" | null;
  weakestAssessmentObjectiveSuccess: number | null;
  marksLost: number;
  nearBoundaryCount: number;
  gradeDistribution: ExamGradeDistributionItem[];
  warnings: string[];
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
  targetNotSetCount: number;

  gradeDistribution: ReportGradeDistributionItem[];
  strongestTopics: ReportTopicRow[];
  priorityTopics: ReportTopicRow[];
  priorityStudents: ReportPriorityStudent[];

  evidenceSourceCounts: AnalyticsEvidenceSourceCounts;
  evidenceWarnings: string[];

  writtenExamCount: number;
  examSummaries: ReportExamSummary[];

  teacherInterpretation: string[];
  recommendedActions: string[];
};

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
  confidence: EvidenceConfidence | string;

  strengths: ReportTopicRow[];
  priorities: ReportTopicRow[];
  recentEvidence: ReportEvidenceRow[];

  evidenceSourceCounts: AnalyticsEvidenceSourceCounts;
  evidenceWarnings: string[];

  interventionSummary: ReportInterventionSummary;

  teacherCommentary: string[];
  studentNextSteps: string[];
};
