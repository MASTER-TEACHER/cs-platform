import type {
  ExamIntegrityIncidentType,
  ExamSubmissionStatus,
} from "@/types/examAssignment";

export type ExamQuestionDifficulty =
  | "secure"
  | "developing"
  | "priority"
  | "insufficient";

export type ExamQuestionIntelligence = {
  questionId: string;
  questionNumber: number;
  questionText: string;
  topic: string;
  availableMarks: number;
  markedStudents: number;
  attemptedStudents: number;
  zeroMarkStudents: number;
  averageAwardedMarks: number | null;
  successPercentage: number | null;
  difficulty: ExamQuestionDifficulty;
};

export type ExamTopicIntelligence = {
  topic: string;
  questionCount: number;
  availableMarks: number;
  averageSuccessPercentage: number | null;
  priority: "high" | "medium" | "low";
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

  /*
   * Exam-specific learning handoff.
   * These fields allow the teacher to move directly from a marked written
   * paper into targeted intervention / analytics without guessing the focus.
   */
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

  questionIntelligence: ExamQuestionIntelligence[];
  topicIntelligence: ExamTopicIntelligence[];
  studentPriorities: ExamStudentPriority[];
  integrity: ExamIntegritySummary;

  hardestQuestion: ExamQuestionIntelligence | null;
  easiestQuestion: ExamQuestionIntelligence | null;
  weakestTopic: ExamTopicIntelligence | null;
  strongestTopic: ExamTopicIntelligence | null;
};
