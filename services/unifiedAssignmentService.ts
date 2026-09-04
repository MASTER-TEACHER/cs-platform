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
    assignment.resourceType === "programming-challenge";

  return {
    kind: isProgramming ? "programming" : "resource",
    id: assignment.id,
    title: assignment.resourceTitle,
    topic: assignment.resourceTopic,
    description: assignment.instructions || "",
    resourceType: assignment.resourceType,
    resourceId: assignment.resourceId,
    className: assignment.className,
    teacherName: assignment.teacherName,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status: assignment.studentProgress.status,
    completedAt: assignment.studentProgress.completedAt,
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
  const isAIQuiz = assignment.quizSource === "ai-generated";

  return {
    kind: "quiz",
    id: assignment.id,
    title: assignment.title,
    topic: isAIQuiz ? "Assigned AI quiz" : "Assigned quiz",
    description: assignment.description,
    resourceType: isAIQuiz ? "AI Quiz" : "Quiz",
    resourceId: assignment.resourceId,
    className: assignment.className,
    teacherName: assignment.teacherName,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status: assignment.resultStatus,
    completedAt: assignment.completedAt,
    percentage: assignment.percentage,
    score: assignment.score,
    totalQuestions: assignment.totalQuestions,
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
      assignment.questionSetSnapshot.topic ||
      assignment.questionSetTitle,
    description: assignment.instructions || "",
    resourceType: "Written Exam",
    resourceId: assignment.questionSetId,
    className: assignment.className,
    teacherName: assignment.teacherName,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status: submission?.status || "not_started",
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
    questionCount: assignment.questionCount,
    totalMarks: assignment.totalMarks,
    submittedAt: submission?.submittedAt || null,
    markedAt: submission?.markedAt || null,
    overallFeedback: submission?.overallFeedback || "",
  };
}

export function isUnifiedAssignmentComplete(
  assignment: UnifiedAssignment,
): boolean {
  return assignment.kind === "exam"
    ? assignment.status === "marked"
    : assignment.status === "completed";
}

export function isUnifiedAssignmentOverdue(
  assignment: UnifiedAssignment,
): boolean {
  if (!assignment.dueDate || isUnifiedAssignmentComplete(assignment)) {
    return false;
  }

  const dueDate = new Date(assignment.dueDate);
  dueDate.setHours(23, 59, 59, 999);

  return dueDate.getTime() < Date.now();
}

export async function getUnifiedStudentAssignments(
  studentId: string,
): Promise<UnifiedAssignment[]> {
  const [resourceResult, quizResult, examResult] = await Promise.allSettled([
    getStudentAssignments(studentId),
    getStudentQuizAssignments(studentId),
    getStudentExamAssignments(studentId),
  ]);

  if (resourceResult.status === "rejected") {
    console.error(
      "[Assignments] RESOURCE LOADER FAILED:",
      resourceResult.reason,
    );
  }

  if (quizResult.status === "rejected") {
    console.error(
      "[Assignments] QUIZ LOADER FAILED:",
      quizResult.reason,
    );
  }

  if (examResult.status === "rejected") {
    console.error(
      "[Assignments] EXAM LOADER FAILED:",
      examResult.reason,
    );
  }

  const resources =
    resourceResult.status === "fulfilled" ? resourceResult.value : [];
  const quizzes =
    quizResult.status === "fulfilled" ? quizResult.value : [];
  const exams =
    examResult.status === "fulfilled" ? examResult.value : [];

  const examItems = await Promise.all(
    exams.map(async (assignment) => {
      let submission: ExamSubmission | null = null;

      try {
        submission = await getExamSubmission(
          assignment.id,
          studentId,
        );
      } catch (error) {
        /*
         * A missing/legacy exam submission must never prevent the student
         * from seeing unrelated lesson, quiz or resource assignments.
         * The exam remains visible as not started and can create its
         * submission when the student actually opens Exam Mode.
         */
        console.warn(
          "Unable to load exam submission while building assignment list:",
          { assignmentId: assignment.id, error },
        );
      }

      return convertExam(
        assignment,
        submission,
      );
    }),
  );

  return [
    ...resources.map(convertResource),
    ...quizzes.map(convertQuiz),
    ...examItems,
  ].sort((a, b) => {
    const aComplete = isUnifiedAssignmentComplete(a);
    const bComplete = isUnifiedAssignmentComplete(b);

    if (aComplete !== bComplete) return aComplete ? 1 : -1;

    const aDue = a.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bDue = b.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER;

    if (aDue !== bDue) return aDue - bDue;

    return (
      (b.createdAt?.getTime() ?? 0) -
      (a.createdAt?.getTime() ?? 0)
    );
  });
}
