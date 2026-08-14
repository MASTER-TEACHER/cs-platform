import type {
  AnalyticsQualification,
  EvidenceConfidence,
  GradeLabel,
  PerformanceTrend,
  RichStudentAnalytics,
  TopicMastery,
} from "@/types/analytics";

export type TargetGradeRecord = {
  studentId: string;
  targetGrade: GradeLabel | null;
  qualification: AnalyticsQualification;
  teacherId: string;
  classId: string;
  updatedAt: Date | null;
};

export type TeacherStudentAnalyticsRow = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  classId: string;
  className: string;
  qualification: AnalyticsQualification;
  workingGrade: GradeLabel | null;
  targetGrade: GradeLabel | null;
  workingPercentage: number | null;
  gradeGap: number | null;
  nextGrade: GradeLabel | null;
  marksToNextGrade: number | null;
  trend: PerformanceTrend;
  trendChange: number | null;
  confidence: EvidenceConfidence;
  completionRate: number;
  interventionPriority: "high" | "medium" | "monitor" | "none";
  interventionReasons: string[];
  analytics: RichStudentAnalytics;
};

export type GradeDistributionItem = {
  grade: GradeLabel;
  count: number;
};

export type ClassTopicAnalytics = TopicMastery & {
  studentCount: number;
};

export type TeacherClassAnalytics = {
  classId: string;
  className: string;
  yearGroup: string;
  qualification: AnalyticsQualification;
  studentCount: number;
  studentsWithEvidence: number;
  averageWeightedPercentage: number | null;
  averageWorkingGrade: GradeLabel | null;
  averageTargetGrade: GradeLabel | null;
  onOrAboveTargetCount: number;
  belowTargetCount: number;
  targetNotSetCount: number;
  onOrAboveTargetPercentage: number;
  averageCompletionRate: number;
  highPriorityCount: number;
  decliningCount: number;
  lowEvidenceCount: number;
  gradeDistribution: GradeDistributionItem[];
  topicAnalytics: ClassTopicAnalytics[];
  students: TeacherStudentAnalyticsRow[];
};

export type TeacherAnalyticsPortfolio = {
  teacherId: string;
  classCount: number;
  uniqueStudentCount: number;
  classes: TeacherClassAnalytics[];
};
