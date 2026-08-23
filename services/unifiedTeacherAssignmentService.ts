import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  getTeacherAssignments,
  type AssignmentStatus,
  type ResourceAssignment,
} from "@/services/resourceAssignmentService";

import {
  getTeacherQuizAssignments,
  type QuizAssignmentStatus,
  type TeacherQuizAssignmentSummary,
} from "@/services/teacherQuizAssignmentService";

import { getTeacherExamAssignments } from "@/services/examAssignmentService";
import { getTeacherClasses } from "@/services/classService";
import { getAssignmentSubmissions } from "@/services/examSubmissionService";

import type {
  ExamAssignment,
  ExamAssignmentStatus,
  ExamSubmission,
} from "@/types/examAssignment";

export type UnifiedTeacherAssignmentKind =
  | "resource"
  | "programming"
  | "quiz"
  | "exam";

export type UnifiedTeacherAssignmentStatus =
  | "active"
  | "closed"
  | "cancelled";

export type UnifiedTeacherAssignment = {
  key: string;
  kind: UnifiedTeacherAssignmentKind;
  id: string;
  title: string;
  topic: string;
  description: string;
  classId: string;
  className: string;
  dueDate: Date | null;
  createdAt: Date | null;
  status: UnifiedTeacherAssignmentStatus;
  studentCount: number;
  completedCount: number;
  completionPercentage: number;
  awaitingMarkingCount: number;
  averagePercentage: number | null;
  detailHref: string;
};

export type UnifiedTeacherAssignmentSummary = {
  assignments: UnifiedTeacherAssignment[];
  totalAssignments: number;
  activeAssignments: number;
  overdueAssignments: number;
  completedStudentCount: number;
  totalStudentCount: number;
  awaitingMarkingCount: number;
};

function safePercentage(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

function normaliseStatus(
  value: AssignmentStatus | QuizAssignmentStatus | ExamAssignmentStatus,
): UnifiedTeacherAssignmentStatus {
  if (value === "closed") return "closed";
  if (value === "cancelled") return "cancelled";
  return "active";
}

function isOverdue(
  assignment: Pick<UnifiedTeacherAssignment, "dueDate" | "status">,
): boolean {
  if (assignment.status !== "active" || !assignment.dueDate) return false;

  const due = new Date(assignment.dueDate);
  due.setHours(23, 59, 59, 999);
  return due.getTime() < Date.now();
}

function convertResourceAssignment(
  assignment: ResourceAssignment,
): UnifiedTeacherAssignment {
  const programming = assignment.resourceType === "programming-challenge";

  return {
    key: `${programming ? "programming" : "resource"}-${assignment.id}`,
    kind: programming ? "programming" : "resource",
    id: assignment.id,
    title: assignment.resourceTitle,
    topic: assignment.resourceTopic,
    description: assignment.instructions,
    classId: assignment.classId,
    className: assignment.className,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status: normaliseStatus(assignment.status),
    studentCount: assignment.studentCount,
    completedCount: assignment.completedCount,
    completionPercentage: safePercentage(
      assignment.completedCount,
      assignment.studentCount,
    ),
    awaitingMarkingCount: 0,
    averagePercentage: null,
    detailHref: programming
      ? `/teacher/programming-assignments/${assignment.id}`
      : `/teacher/assignments/${assignment.id}`,
  };
}

function convertQuizAssignment(
  assignment: TeacherQuizAssignmentSummary,
): UnifiedTeacherAssignment {
  return {
    key: `quiz-${assignment.id}`,
    kind: "quiz",
    id: assignment.id,
    title: assignment.title,
    topic:
      assignment.deliveryMode === "assessment"
        ? "Assessment quiz"
        : "Practice quiz",
    description: assignment.description,
    classId: assignment.classId,
    className: assignment.className,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status: normaliseStatus(assignment.status),
    studentCount: assignment.studentCount,
    completedCount: assignment.completedCount,
    completionPercentage: assignment.completionPercentage,
    awaitingMarkingCount: 0,
    averagePercentage:
      assignment.completedCount > 0 ? assignment.averagePercentage : null,
    detailHref: `/teacher/quiz-assignments/${assignment.id}`,
  };
}

function summariseExam(
  assignment: ExamAssignment,
  submissions: ExamSubmission[],
): UnifiedTeacherAssignment {
  const marked = submissions.filter((item) => item.status === "marked");
  const awaitingMarking = submissions.filter(
    (item) => item.status === "submitted" || item.status === "marking",
  );

  const averagePercentage =
    marked.length > 0
      ? Math.round(
          marked.reduce((total, item) => total + item.percentage, 0) /
            marked.length,
        )
      : null;

  const studentCount = assignment.studentIds.length;

  return {
    key: `exam-${assignment.id}`,
    kind: "exam",
    id: assignment.id,
    title: assignment.title,
    topic:
      assignment.questionSetSnapshot.topic || assignment.questionSetTitle,
    description: assignment.instructions,
    classId: assignment.classId,
    className: assignment.className,
    dueDate: assignment.dueDate,
    createdAt: assignment.createdAt,
    status: normaliseStatus(assignment.status),
    studentCount,
    completedCount: marked.length,
    completionPercentage: safePercentage(marked.length, studentCount),
    awaitingMarkingCount: awaitingMarking.length,
    averagePercentage,
    detailHref: `/teacher/exam-assignments/${assignment.id}`,
  };
}

export async function getUnifiedTeacherAssignments(
  teacherId: string,
): Promise<UnifiedTeacherAssignmentSummary> {
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedTeacherId) {
    return {
      assignments: [],
      totalAssignments: 0,
      activeAssignments: 0,
      overdueAssignments: 0,
      completedStudentCount: 0,
      totalStudentCount: 0,
      awaitingMarkingCount: 0,
    };
  }

  const [
    classes,
    resources,
    quizzes,
    exams,
  ] = await Promise.all([
    getTeacherClasses(cleanedTeacherId),
    getTeacherAssignments(cleanedTeacherId),
    getTeacherQuizAssignments(cleanedTeacherId),
    getTeacherExamAssignments(cleanedTeacherId),
  ]);

  /*
   * T1G integrity boundary:
   * even though each assignment query is teacher-scoped, only assignments
   * attached to a class owned by the authenticated teacher are admitted to
   * the unified teacher portfolio. This prevents stale/corrupt class links
   * from leaking into dashboard and reporting totals.
   */
  const ownedClassIds =
    new Set(
      classes.map(
        (item) => item.id,
      ),
    );

  const examAssignments = await Promise.all(
    exams.map(async (assignment) => {
      const submissions = await getAssignmentSubmissions(
        assignment.id,
        cleanedTeacherId,
      );

      return summariseExam(assignment, submissions);
    }),
  );

  const assignments: UnifiedTeacherAssignment[] = [
    ...resources.map(convertResourceAssignment),
    ...quizzes.map(convertQuizAssignment),
    ...examAssignments,
  ]
    .filter(
      (assignment) =>
        ownedClassIds.has(
          assignment.classId,
        ),
    )
    .sort(
    (first, second) =>
      (second.createdAt?.getTime() ?? 0) -
      (first.createdAt?.getTime() ?? 0),
  );

  return {
    assignments,
    totalAssignments: assignments.length,
    activeAssignments: assignments.filter((item) => item.status === "active")
      .length,
    overdueAssignments: assignments.filter(isOverdue).length,
    completedStudentCount: assignments.reduce(
      (total, item) => total + item.completedCount,
      0,
    ),
    totalStudentCount: assignments.reduce(
      (total, item) => total + item.studentCount,
      0,
    ),
    awaitingMarkingCount: assignments.reduce(
      (total, item) => total + item.awaitingMarkingCount,
      0,
    ),
  };
}

export function isUnifiedTeacherAssignmentOverdue(
  assignment: UnifiedTeacherAssignment,
): boolean {
  return isOverdue(assignment);
}

export async function updateUnifiedTeacherAssignmentStatus(
  assignment: Pick<UnifiedTeacherAssignment, "id" | "kind">,
  status: UnifiedTeacherAssignmentStatus,
): Promise<void> {
  const collectionName =
    assignment.kind === "quiz"
      ? "assignments"
      : assignment.kind === "exam"
        ? "examAssignments"
        : "classAssignments";

  await updateDoc(doc(db, collectionName, assignment.id), {
    status,
    updatedAt: serverTimestamp(),
  });
}
