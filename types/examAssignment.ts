import type { GeneratedExamQuestionSet } from "@/types/examQuestion";

export type ExamAssignmentStatus = "active" | "closed" | "cancelled";

export type ExamSubmissionStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "marking"
  | "marked";

export type ExamVisibilityAction =
  | "warn"
  | "pause"
  | "auto_submit";

export type ExamIntegrityIncidentType =
  | "fullscreen_exit"
  | "fullscreen_restored"
  | "page_hidden"
  | "page_visible"
  | "integrity_termination";

export type ExamIntegrityPolicy = {
  enabled: boolean;

  /*
   * CS Master integrity monitoring is not a secure lockdown browser.
   * Fullscreen is used as a visible exam-state control only.
   */
  fullscreenRequired: boolean;

  /*
   * Product rule: leaving fullscreen starts a visible five-second
   * countdown. If fullscreen is not restored, the exam is terminated
   * and submitted automatically.
   */
  fullscreenExitCountdownSeconds: 5;

  /*
   * Teacher-configurable response to document visibility changes.
   */
  visibilityAction: ExamVisibilityAction;
  monitorPageVisibility: boolean;
};

export const DEFAULT_EXAM_INTEGRITY_POLICY: ExamIntegrityPolicy = {
  enabled: true,
  fullscreenRequired: true,
  fullscreenExitCountdownSeconds: 5,
  visibilityAction: "warn",
  monitorPageVisibility: true,
};

export type ExamIntegrityIncident = {
  id: string;
  type: ExamIntegrityIncidentType;
  occurredAt: Date | null;
  questionNumber: number | null;
  detail: string;
};

export type ExamAssignment = {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  studentIds: string[];

  questionSetId: string;
  questionSetTitle: string;
  questionSetSnapshot: GeneratedExamQuestionSet;

  title: string;
  instructions: string;
  dueDate: Date | null;
  status: ExamAssignmentStatus;

  totalMarks: number;
  questionCount: number;

  submittedCount: number;
  markedCount: number;

  integrityPolicy: ExamIntegrityPolicy;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type CreateExamAssignmentInput = {
  teacherId: string;
  teacherName?: string;
  classId: string;
  className: string;
  studentIds: string[];

  questionSetId: string;
  questionSetTitle: string;
  questionSetSnapshot: GeneratedExamQuestionSet;

  title: string;
  instructions?: string;
  dueDate: Date;

  integrityPolicy?: Partial<ExamIntegrityPolicy>;
};

export type StudentExamAnswer = {
  questionId: string;
  questionNumber: number;
  response: string;
  awardedMarks: number | null;
  teacherFeedback: string;
};

export type ExamSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;

  teacherId: string;
  classId: string;

  status: ExamSubmissionStatus;
  answers: StudentExamAnswer[];

  totalAwardedMarks: number;
  totalAvailableMarks: number;
  percentage: number;

  overallFeedback: string;

  integrityPolicySnapshot: ExamIntegrityPolicy | null;
  integrityIncidents: ExamIntegrityIncident[];
  integrityTerminated: boolean;
  integrityTerminationReason: string;
  integritySessionStartedAt: Date | null;
  integrityLastQuestionNumber: number | null;

  startedAt: Date | null;
  submittedAt: Date | null;
  markedAt: Date | null;
  updatedAt: Date | null;
};
