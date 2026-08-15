export type AnalyticsQualification = "GCSE" | "A_LEVEL";

export type AnalyticsEvidenceType =
  | "written_exam"
  | "quiz"
  | "ai_quiz"
  | "programming"
  | "lesson";

export type AnalyticsBoundarySource =
  | "official"
  | "teacher"
  | "indicative";

export type EvidenceConfidence =
  | "insufficient"
  | "low"
  | "medium"
  | "high";

export type PerformanceTrend =
  | "strong_improvement"
  | "improving"
  | "stable"
  | "declining"
  | "insufficient_evidence";

export type GradeLabel =
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2"
  | "1"
  | "U"
  | "A*"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E";

export type GradeBoundary = {
  grade: GradeLabel;
  minimumPercentage: number;
};

export type GradeBoundarySet = {
  id: string;
  title: string;
  qualification: AnalyticsQualification;
  examBoard?: string;
  academicYear?: string;
  assessmentTitle?: string;
  source: AnalyticsBoundarySource;
  boundaries: GradeBoundary[];
};

export type AnalyticsEvidence = {
  id: string;
  type: AnalyticsEvidenceType;
  title: string;
  topic: string;
  percentage: number | null;
  rawScore: number | null;
  totalMarks: number | null;
  completedAt: Date | null;
  dueDate: Date | null;
  weight: number;
  graded: boolean;
  sourceAssignmentId?: string | null;
  sourceAssessmentId?: string | null;
  sourceQuestionId?: string | null;
  sourceQuestionNumber?: number | null;
  sourceLabel?: string | null;
};

export type TopicMastery = {
  topic: string;
  evidenceCount: number;
  weightedPercentage: number;
  recentPercentage: number;
  status: "secure" | "developing" | "priority";
};

export type TrendPoint = {
  id: string;
  title: string;
  percentage: number;
  completedAt: Date | null;
};

export type GradeProgressAnalytics = {
  workingGrade: GradeLabel | null;
  workingPercentage: number | null;
  targetGrade: GradeLabel | null;
  gradeGap: number | null;
  nextGrade: GradeLabel | null;
  percentagePointsToNextGrade: number | null;
  marksToNextGrade: number | null;
  marksToNextGradeAssessmentTitle: string | null;
  marksAboveCurrentBoundary: number | null;
  boundarySet: GradeBoundarySet;
};

export type EvidenceConfidenceAnalytics = {
  level: EvidenceConfidence;
  score: number;
  gradedEvidenceCount: number;
  writtenExamCount: number;
  quizCount: number;
  curriculumCoverage: number;
  explanation: string;
};

export type StudentAnalyticsInterpretation = {
  headline: string;
  summary: string;
  strengths: string[];
  priorities: string[];
  nextActions: string[];
};

export type AnalyticsEvidenceSourceCounts = Record<
  AnalyticsEvidenceType,
  number
>;

export type RichStudentAnalytics = {
  studentId: string;
  qualification: AnalyticsQualification;
  examBoard: string | null;
  targetGrade: GradeLabel | null;
  grade: GradeProgressAnalytics;
  confidence: EvidenceConfidenceAnalytics;
  trend: PerformanceTrend;
  trendChange: number | null;
  trendPoints: TrendPoint[];
  topics: TopicMastery[];
  strongestTopics: TopicMastery[];
  weakestTopics: TopicMastery[];
  evidence: AnalyticsEvidence[];
  masteryEvidence: AnalyticsEvidence[];
  evidenceSourceCounts: AnalyticsEvidenceSourceCounts;
  completedActivityCount: number;
  totalActivityCount: number;
  completionRate: number;
  interpretation: StudentAnalyticsInterpretation;
};
