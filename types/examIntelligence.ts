import type {
  ExamIntegrityIncidentType,
  ExamSubmissionStatus,
} from "@/types/examAssignment";
import type {
  AnalyticsBoundarySource,
  AnalyticsQualification,
  GradeLabel,
} from "@/types/analytics";

export type ExamQuestionDifficulty =
  | "secure"
  | "developing"
  | "priority"
  | "insufficient";

export type ExamDiscriminationLabel =
  | "strong"
  | "moderate"
  | "weak"
  | "negative"
  | "insufficient";

export type ExamAnalysisConfidence =
  | "insufficient"
  | "limited"
  | "developing"
  | "robust";

export type ExamQuestionIntelligence = {
  questionId: string;
  questionNumber: number;
  questionText: string;
  topic: string;
  assessmentObjective: "AO1" | "AO2" | "AO3" | null;
  commandWord: string | null;

  availableMarks: number;
  markedStudents: number;
  attemptedStudents: number;
  omittedStudents: number;
  zeroMarkStudents: number;
  fullMarkStudents: number;

  totalAwardedMarks: number;
  totalPossibleClassMarks: number;
  marksLost: number;

  averageAwardedMarks: number | null;
  successPercentage: number | null;
  attemptPercentage: number | null;
  omissionPercentage: number | null;
  zeroMarkPercentage: number | null;
  fullMarkPercentage: number | null;
  marksLostPercentage: number | null;

  discriminationIndex: number | null;
  discriminationLabel: ExamDiscriminationLabel;

  difficulty: ExamQuestionDifficulty;
};

export type ExamTopicIntelligence = {
  topic: string;
  questionCount: number;
  availableMarks: number;
  averageSuccessPercentage: number | null;
  awardedMarks: number;
  possibleMarks: number;
  marksLost: number;
  marksLostPercentage: number | null;
  priority: "high" | "medium" | "low";
};

export type ExamAssessmentObjectiveIntelligence = {
  assessmentObjective: "AO1" | "AO2" | "AO3";
  questionCount: number;
  availableMarks: number;
  awardedMarks: number;
  possibleMarks: number;
  averageSuccessPercentage: number | null;
  marksLost: number;
  marksLostPercentage: number | null;
  priority: "high" | "medium" | "low";
};

export type ExamGradeBoundaryRow = {
  grade: GradeLabel;
  minimumPercentage: number;
  minimumMark: number;
};

export type ExamStudentGradeOutcome = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  awardedMarks: number;
  availableMarks: number;
  percentage: number;
  grade: GradeLabel;
  nextGrade: GradeLabel | null;
  nextGradeMinimumMark: number | null;
  marksToNextGrade: number | null;
  percentagePointsToNextGrade: number | null;
  differenceFromClassAverage: number | null;
  nearNextGradeBoundary: boolean;
};

export type ExamGradeDistributionItem = {
  grade: GradeLabel;
  count: number;
  percentage: number;
};

export type ExamGradeIntelligence = {
  qualification: AnalyticsQualification;
  examBoard: string | null;

  boundarySetId: string;
  boundarySetTitle: string;
  boundarySource: AnalyticsBoundarySource;
  boundarySourceNote: string | null;
  boundaryVerifiedAt: string | null;
  boundaryAcademicYear: string | null;
  boundaryAssessmentTitle: string | null;
  isOfficialBoundarySet: boolean;

  totalMarks: number;
  boundaries: ExamGradeBoundaryRow[];

  classAverageMark: number | null;
  classAveragePercentage: number | null;
  classAverageGrade: GradeLabel | null;
  classNextGrade: GradeLabel | null;
  classNextGradeMinimumMark: number | null;
  classMarksToNextGrade: number | null;
  classPercentagePointsToNextGrade: number | null;

  studentOutcomes: ExamStudentGradeOutcome[];
  nearBoundaryStudents: ExamStudentGradeOutcome[];
  gradeDistribution: ExamGradeDistributionItem[];
};

export type ExamStudentPriority = {
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: ExamSubmissionStatus;
  percentage: number | null;
  integrityIncidentCount: number;
  integrityTerminated: boolean;
  priority: "high" | "medium" | "monitor" | "none";
  reasons: string[];

  weakestExamTopic: string | null;
  weakestQuestionNumber: number | null;
  weakestQuestionSuccessPercentage: number | null;
};

export type ExamIntegritySummary = {
  cleanSubmissionCount: number;
  submissionsWithIncidents: number;
  integrityTerminatedCount: number;
  totalIncidents: number;
  incidentsByType: Record<ExamIntegrityIncidentType, number>;
};

export type ExamClassIntelligence = {
  studentCount: number;
  startedCount: number;
  submittedCount: number;
  markedCount: number;
  submissionPercentage: number;
  markingPercentage: number;

  classAverage: number | null;
  highestPercentage: number | null;
  lowestPercentage: number | null;
  medianPercentage: number | null;

  analysisConfidence: ExamAnalysisConfidence;
  analysisWarnings: string[];

  questionIntelligence: ExamQuestionIntelligence[];
  topicIntelligence: ExamTopicIntelligence[];
  assessmentObjectiveIntelligence: ExamAssessmentObjectiveIntelligence[];

  studentPriorities: ExamStudentPriority[];
  integrity: ExamIntegritySummary;
  gradeIntelligence: ExamGradeIntelligence;

  hardestQuestion: ExamQuestionIntelligence | null;
  easiestQuestion: ExamQuestionIntelligence | null;
  weakestTopic: ExamTopicIntelligence | null;
  strongestTopic: ExamTopicIntelligence | null;
  weakestAssessmentObjective: ExamAssessmentObjectiveIntelligence | null;
  strongestAssessmentObjective: ExamAssessmentObjectiveIntelligence | null;
};
