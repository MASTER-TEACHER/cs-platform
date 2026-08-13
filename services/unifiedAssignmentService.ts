import {
  getStudentAssignments,
  type StudentAssignmentWithProgress,
} from "@/services/resourceAssignmentService";
import {
  getStudentQuizAssignments,
  type StudentQuizAssignment,
} from "@/services/quizAssignmentService";
import { getStudentExamAssignments } from "@/services/examAssignmentService";
import { getExamSubmission } from "@/services/examSubmissionService";

import type {
  ExamAssignment,
  ExamSubmission,
  ExamSubmissionStatus,
} from "@/types/examAssignment";

export type UnifiedAssignmentKind =
  | "resource"
  | "quiz"
  | "exam"
  | "programming";

export type UnifiedAssignmentStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | ExamSubmissionStatus;

export type UnifiedAssignment = {
  kind: UnifiedAssignmentKind;
  id: string;
  title: string;
  topic: string;
  description: string;
  resourceType: string;
  resourceId: string;
  className: string;
  teacherName: string;
  dueDate: Date | null;
  createdAt: Date | null;
  status: UnifiedAssignmentStatus;
  completedAt: Date | null;
  percentage: number | null;
  score: number | null;
  totalQuestions: number | null;
  earnedXP: number | null;
  questionCount: number | null;
  totalMarks: number | null;
  submittedAt: Date | null;
  markedAt: Date | null;
  overallFeedback: string;
};

function convertResource(
  assignment: StudentAssignmentWithProgress,
): UnifiedAssignment {
  const isProgramming =
    assignment.resourceType ===
    "programming-challenge";

  return {
    kind: isProgramming
      ? "programming"
      : "resource",
    id: assignment.id,
    title: assignment.resourceTitle,
    topic: assignment.resourceTopic,
    description:
      assignment.instructions || "",
    resourceType:
      assignment.resourceType,
    resourceId: assignment.resourceId,
    className: assignment.className,
    teacherName: assignment.teacherName,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status:
      assignment.studentProgress.status,
    completedAt:
      assignment.studentProgress
        .completedAt,
    percentage: null,
    score: null,
    totalQuestions: null,
    earnedXP: null,
    questionCount: null,
    totalMarks: null,
    submittedAt: null,
    markedAt: null,
    overallFeedback: "",
  };
}

function convertQuiz(
  assignment: StudentQuizAssignment,
): UnifiedAssignment {
  return {
    kind: "quiz",
    id: assignment.id,
    title: assignment.title,
    topic: "Assigned quiz",
    description: assignment.description,
    resourceType: "Quiz",
    resourceId: assignment.resourceId,
    className: assignment.className,
    teacherName:
      assignment.teacherName,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status: assignment.resultStatus,
    completedAt: assignment.completedAt,
    percentage: assignment.percentage,
    score: assignment.score,
    totalQuestions:
      assignment.totalQuestions,
    earnedXP: assignment.earnedXP,
    questionCount: null,
    totalMarks: null,
    submittedAt: null,
    markedAt: null,
    overallFeedback: "",
  };
}

function convertExam(
  assignment: ExamAssignment,
  submission: ExamSubmission | null,
): UnifiedAssignment {
  return {
    kind: "exam",
    id: assignment.id,
    title: assignment.title,
    topic:
      assignment.questionSetSnapshot
        .topic ||
      assignment.questionSetTitle,
    description:
      assignment.instructions || "",
    resourceType: "Written Exam",
    resourceId:
      assignment.questionSetId,
    className: assignment.className,
    teacherName:
      assignment.teacherName,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status:
      submission?.status ||
      "not_started",
    completedAt:
      submission?.markedAt ||
      submission?.submittedAt ||
      null,
    percentage:
      submission?.status === "marked"
        ? submission.percentage
        : null,
    score:
      submission?.status === "marked"
        ? submission.totalAwardedMarks
        : null,
    totalQuestions: null,
    earnedXP: null,
    questionCount:
      assignment.questionCount,
    totalMarks: assignment.totalMarks,
    submittedAt:
      submission?.submittedAt || null,
    markedAt:
      submission?.markedAt || null,
    overallFeedback:
      submission?.overallFeedback || "",
  };
}

export function isUnifiedAssignmentComplete(
  assignment: UnifiedAssignment,
): boolean {
  return assignment.kind === "exam"
    ? assignment.status === "marked"
    : assignment.status ===
        "completed";
}

export function isUnifiedAssignmentOverdue(
  assignment: UnifiedAssignment,
): boolean {
  if (
    !assignment.dueDate ||
    isUnifiedAssignmentComplete(
      assignment,
    )
  ) {
    return false;
  }

  const dueDate = new Date(
    assignment.dueDate,
  );

  dueDate.setHours(
    23,
    59,
    59,
    999,
  );

  return (
    dueDate.getTime() < Date.now()
  );
}

export async function getUnifiedStudentAssignments(
  studentId: string,
): Promise<UnifiedAssignment[]> {
  const [
    resources,
    quizzes,
    exams,
  ] = await Promise.all([
    getStudentAssignments(studentId),
    getStudentQuizAssignments(studentId),
    getStudentExamAssignments(studentId),
  ]);

  const examItems =
    await Promise.all(
      exams.map(
        async (assignment) =>
          convertExam(
            assignment,
            await getExamSubmission(
              assignment.id,
              studentId,
            ),
          ),
      ),
    );

  return [
    ...resources.map(
      convertResource,
    ),
    ...quizzes.map(convertQuiz),
    ...examItems,
  ].sort((a, b) => {
    const aComplete =
      isUnifiedAssignmentComplete(a);
    const bComplete =
      isUnifiedAssignmentComplete(b);

    if (aComplete !== bComplete) {
      return aComplete ? 1 : -1;
    }

    const aDue =
      a.dueDate?.getTime() ??
      Number.MAX_SAFE_INTEGER;

    const bDue =
      b.dueDate?.getTime() ??
      Number.MAX_SAFE_INTEGER;

    if (aDue !== bDue) {
      return aDue - bDue;
    }

    return (
      (b.createdAt?.getTime() ??
        0) -
      (a.createdAt?.getTime() ??
        0)
    );
  });
}
