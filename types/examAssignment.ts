import type { GeneratedExamQuestionSet } from "@/types/examQuestion";

export type ExamAssignmentStatus = "active" | "closed" | "cancelled";

export type ExamSubmissionStatus =
  "not_started" | "in_progress" | "submitted" | "marking" | "marked";

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

  startedAt: Date | null;
  submittedAt: Date | null;
  markedAt: Date | null;
  updatedAt: Date | null;
};
