import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  DEFAULT_EXAM_INTEGRITY_POLICY,
  type CreateExamAssignmentInput,
  type ExamAssignment,
  type ExamAssignmentStatus,
  type ExamIntegrityPolicy,
  type ExamVisibilityAction,
} from "@/types/examAssignment";

type FirestoreExamAssignment = Omit<
  ExamAssignment,
  "id" | "dueDate" | "createdAt" | "updatedAt"
> & {
  dueDate?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function toDate(value?: Timestamp | null): Date | null {
  return value?.toDate ? value.toDate() : null;
}

function visibilityAction(value: unknown): ExamVisibilityAction {
  return value === "pause" || value === "auto_submit"
    ? value
    : "warn";
}

function normaliseIntegrityPolicy(
  value?: Partial<ExamIntegrityPolicy> | null,
): ExamIntegrityPolicy {
  return {
    enabled:
      typeof value?.enabled === "boolean"
        ? value.enabled
        : DEFAULT_EXAM_INTEGRITY_POLICY.enabled,

    fullscreenRequired:
      typeof value?.fullscreenRequired === "boolean"
        ? value.fullscreenRequired
        : DEFAULT_EXAM_INTEGRITY_POLICY.fullscreenRequired,

    /*
     * The five-second fullscreen rule is deliberately fixed.
     */
    fullscreenExitCountdownSeconds: 5,

    visibilityAction: visibilityAction(
      value?.visibilityAction,
    ),

    monitorPageVisibility:
      typeof value?.monitorPageVisibility === "boolean"
        ? value.monitorPageVisibility
        : DEFAULT_EXAM_INTEGRITY_POLICY.monitorPageVisibility,
  };
}

function convertAssignment(
  id: string,
  data: FirestoreExamAssignment,
): ExamAssignment {
  return {
    id,
    teacherId: data.teacherId,
    teacherName: data.teacherName || "Teacher",
    classId: data.classId,
    className: data.className,
    studentIds: data.studentIds || [],
    questionSetId: data.questionSetId,
    questionSetTitle: data.questionSetTitle,
    questionSetSnapshot: data.questionSetSnapshot,
    title: data.title,
    instructions: data.instructions || "",
    dueDate: toDate(data.dueDate),
    status: data.status || "active",
    totalMarks: data.totalMarks || 0,
    questionCount: data.questionCount || 0,
    submittedCount: data.submittedCount || 0,
    markedCount: data.markedCount || 0,
    integrityPolicy: normaliseIntegrityPolicy(
      data.integrityPolicy,
    ),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function validateInput(input: CreateExamAssignmentInput) {
  if (!input.teacherId.trim()) {
    throw new Error("A teacher account is required.");
  }

  if (!input.classId.trim()) {
    throw new Error("Select a class.");
  }

  if (!input.questionSetId.trim()) {
    throw new Error("A question set is required.");
  }

  if (!input.title.trim()) {
    throw new Error("Enter an assignment title.");
  }

  if (
    !(input.dueDate instanceof Date) ||
    Number.isNaN(input.dueDate.getTime())
  ) {
    throw new Error("Select a valid due date.");
  }

  if (input.studentIds.length === 0) {
    throw new Error(
      "The selected class has no enrolled students.",
    );
  }
}

function sameCalendarDay(
  first: Date | null,
  second: Date,
): boolean {
  if (!first) {
    return false;
  }

  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

async function findExistingExamAssignment(
  input: CreateExamAssignmentInput,
): Promise<ExamAssignment | null> {
  const snapshot = await getDocs(
    query(
      collection(db, "examAssignments"),
      where(
        "teacherId",
        "==",
        input.teacherId.trim(),
      ),
    ),
  );

  const assignments = snapshot.docs.map(
    (document) =>
      convertAssignment(
        document.id,
        document.data() as FirestoreExamAssignment,
      ),
  );

  return (
    assignments.find(
      (assignment) =>
        assignment.status === "active" &&
        assignment.classId === input.classId.trim() &&
        assignment.questionSetId ===
          input.questionSetId.trim() &&
        sameCalendarDay(
          assignment.dueDate,
          input.dueDate,
        ),
    ) || null
  );
}

export async function createExamAssignment(
  input: CreateExamAssignmentInput,
): Promise<string> {
  validateInput(input);

  const existing =
    await findExistingExamAssignment(input);

  if (existing) {
    throw new Error(
      "This paper is already assigned to that class with the same due date.",
    );
  }

  const studentIds = Array.from(
    new Set(
      input.studentIds
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  );

  const reference = await addDoc(
    collection(db, "examAssignments"),
    {
      teacherId: input.teacherId.trim(),
      teacherName:
        input.teacherName?.trim() || "Teacher",
      classId: input.classId.trim(),
      className: input.className.trim(),
      studentIds,
      questionSetId: input.questionSetId.trim(),
      questionSetTitle:
        input.questionSetTitle.trim(),
      questionSetSnapshot:
        input.questionSetSnapshot,
      title: input.title.trim(),
      instructions:
        input.instructions?.trim() || "",
      dueDate: Timestamp.fromDate(input.dueDate),
      status: "active",
      totalMarks:
        input.questionSetSnapshot.totalMarks,
      questionCount:
        input.questionSetSnapshot.questionCount,
      submittedCount: 0,
      markedCount: 0,
      integrityPolicy:
        normaliseIntegrityPolicy(
          input.integrityPolicy,
        ),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return reference.id;
}

export async function getExamAssignmentById(
  assignmentId: string,
): Promise<ExamAssignment | null> {
  if (!assignmentId.trim()) {
    return null;
  }

  const snapshot = await getDoc(
    doc(
      db,
      "examAssignments",
      assignmentId,
    ),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return convertAssignment(
    snapshot.id,
    snapshot.data() as FirestoreExamAssignment,
  );
}

export async function getTeacherExamAssignments(
  teacherId: string,
): Promise<ExamAssignment[]> {
  if (!teacherId.trim()) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(db, "examAssignments"),
      where("teacherId", "==", teacherId),
      orderBy("createdAt", "desc"),
    ),
  );

  return snapshot.docs.map(
    (document) =>
      convertAssignment(
        document.id,
        document.data() as FirestoreExamAssignment,
      ),
  );
}

export async function getStudentExamAssignments(
  studentId: string,
): Promise<ExamAssignment[]> {
  if (!studentId.trim()) {
    return [];
  }

  const snapshot = await getDocs(
    query(
      collection(db, "examAssignments"),
      where(
        "studentIds",
        "array-contains",
        studentId,
      ),
      orderBy("dueDate", "asc"),
    ),
  );

  return snapshot.docs.map(
    (document) =>
      convertAssignment(
        document.id,
        document.data() as FirestoreExamAssignment,
      ),
  );
}

export async function updateExamAssignmentStatus(
  assignmentId: string,
  status: ExamAssignmentStatus,
): Promise<void> {
  await updateDoc(
    doc(
      db,
      "examAssignments",
      assignmentId,
    ),
    {
      status,
      updatedAt: serverTimestamp(),
    },
  );
}

export async function updateExamIntegrityPolicy({
  assignmentId,
  teacherId,
  policy,
}: {
  assignmentId: string;
  teacherId: string;
  policy: ExamIntegrityPolicy;
}): Promise<ExamIntegrityPolicy> {
  const reference = doc(
    db,
    "examAssignments",
    assignmentId,
  );

  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    throw new Error(
      "Exam assignment not found.",
    );
  }

  if (
    snapshot.data().teacherId !==
    teacherId.trim()
  ) {
    throw new Error(
      "You do not have permission to change this exam.",
    );
  }

  const cleaned =
    normaliseIntegrityPolicy(policy);

  await updateDoc(reference, {
    integrityPolicy: cleaned,
    updatedAt: serverTimestamp(),
  });

  return cleaned;
}

export async function deleteExamAssignment(
  assignmentId: string,
): Promise<void> {
  await deleteDoc(
    doc(
      db,
      "examAssignments",
      assignmentId,
    ),
  );
}
