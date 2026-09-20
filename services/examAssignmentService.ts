import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (input.dueDate.getTime() < today.getTime()) {
    throw new Error("The due date cannot be in the past.");
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

function normaliseIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(
    value.filter((item: unknown): item is string => typeof item === "string")
      .map((item: string) => item.trim()).filter(Boolean),
  ));
}

function canTeacherManageClass(
  classData: Record<string, unknown>,
  teacherId: string,
): boolean {
  const cleanedTeacherId = teacherId.trim();
  if (!cleanedTeacherId) return false;
  const ownerTeacherId =
    typeof classData.teacherId === "string" ? classData.teacherId.trim() : "";
  const coTeacherIds = normaliseIds(classData.coTeacherIds);
  return ownerTeacherId === cleanedTeacherId ||
    coTeacherIds.includes(cleanedTeacherId);
}

async function findExistingExamAssignment(
  input: CreateExamAssignmentInput,
): Promise<ExamAssignment | null> {
  const classId = input.classId.trim();
  if (!classId) return null;

  const snapshot = await getDocs(
    query(
      collection(db, "examAssignments"),
      where("classId", "==", classId),
    ),
  );

  const assignments = snapshot.docs.map((document) =>
    convertAssignment(
      document.id,
      document.data() as FirestoreExamAssignment,
    ),
  );

  return assignments.find(
    (assignment) =>
      assignment.status === "active" &&
      assignment.classId === classId &&
      assignment.questionSetId === input.questionSetId.trim() &&
      sameCalendarDay(assignment.dueDate, input.dueDate),
  ) || null;
}

export async function createExamAssignment(
  input: CreateExamAssignmentInput,
): Promise<string> {
  validateInput(input);

  const teacherId = input.teacherId.trim();
  const classId = input.classId.trim();
  const studentIds = Array.from(
    new Set(
      input.studentIds
        .map((id) => id.trim())
        .filter(Boolean),
    ),
  );

  if (studentIds.length === 0) {
    throw new Error("Select at least one enrolled student.");
  }

  const classSnapshot = await getDoc(
    doc(db, "classes", classId),
  );

  if (!classSnapshot.exists()) {
    throw new Error("The selected class could not be found.");
  }

  const classData = classSnapshot.data();

  if (!canTeacherManageClass(classData, teacherId)) {
    throw new Error("You cannot assign an exam to a class you do not manage.");
  }

  const enrolledStudentIds = Array.from(
    new Set(
      (Array.isArray(classData.studentIds) ? classData.studentIds : [])
        .filter(
          (value: unknown): value is string => typeof value === "string",
        )
        .map((value: string) => value.trim())
        .filter(Boolean),
    ),
  );

  const invalidRecipient = studentIds.find(
    (studentId) => !enrolledStudentIds.includes(studentId),
  );

  if (invalidRecipient) {
    throw new Error(
      "One or more selected students are no longer enrolled in this class. Refresh the recipients and try again.",
    );
  }

  const existing =
    await findExistingExamAssignment(input);

  if (existing) {
    throw new Error(
      "This paper is already assigned to that class with the same due date.",
    );
  }

  const reference = await addDoc(
    collection(db, "examAssignments"),
    {
      teacherId,
      teacherName:
        input.teacherName?.trim() || "Teacher",
      classId,
      className:
        typeof classData.name === "string" && classData.name.trim()
          ? classData.name.trim()
          : input.className.trim(),
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

export async function getClassExamAssignments(
  classId: string,
): Promise<ExamAssignment[]> {
  const cleanedClassId = classId.trim();
  if (!cleanedClassId) return [];

  const snapshot = await getDocs(
    query(
      collection(db, "examAssignments"),
      where("classId", "==", cleanedClassId),
    ),
  );

  return snapshot.docs
    .map((document) =>
      convertAssignment(
        document.id,
        document.data() as FirestoreExamAssignment,
      ),
    )
    .sort(
      (first, second) =>
        (second.createdAt?.getTime() ?? 0) -
        (first.createdAt?.getTime() ?? 0),
    );
}

export async function getTeacherExamAssignments(
  teacherId: string,
): Promise<ExamAssignment[]> {
  const cleanedTeacherId = teacherId.trim();
  if (!cleanedTeacherId) return [];

  const [ownedClassesSnapshot, coTaughtClassesSnapshot] = await Promise.all([
    getDocs(
      query(
        collection(db, "classes"),
        where("teacherId", "==", cleanedTeacherId),
      ),
    ),
    getDocs(
      query(
        collection(db, "classes"),
        where("coTeacherIds", "array-contains", cleanedTeacherId),
      ),
    ),
  ]);

  const managedClassIds = Array.from(new Set([
    ...ownedClassesSnapshot.docs.map((classDocument) => classDocument.id),
    ...coTaughtClassesSnapshot.docs.map((classDocument) => classDocument.id),
  ]));

  const assignmentGroups = await Promise.all(
    managedClassIds.map((classId) => getClassExamAssignments(classId)),
  );

  return assignmentGroups.flat().sort(
    (first, second) =>
      (second.createdAt?.getTime() ?? 0) -
      (first.createdAt?.getTime() ?? 0),
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
    ),
  );

  return snapshot.docs
    .map((document) =>
      convertAssignment(
        document.id,
        document.data() as FirestoreExamAssignment,
      ),
    )
    .sort(
      (first, second) =>
        (first.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER) -
        (second.dueDate?.getTime() ?? Number.MAX_SAFE_INTEGER),
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

  const assignmentData =
    snapshot.data() as FirestoreExamAssignment;

  const classId =
    typeof assignmentData.classId === "string"
      ? assignmentData.classId.trim()
      : "";

  if (!classId) {
    throw new Error(
      "This exam assignment is not linked to a valid class.",
    );
  }

  const classSnapshot = await getDoc(
    doc(db, "classes", classId),
  );

  if (
    !classSnapshot.exists() ||
    !canTeacherManageClass(
      classSnapshot.data(),
      teacherId,
    )
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
