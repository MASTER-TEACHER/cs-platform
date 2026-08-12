import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type AssignmentStatus = "active" | "closed" | "cancelled";

export type StudentAssignmentStatus =
  "not_started" | "in_progress" | "completed";

export type ResourceAssignment = {
  id: string;

  resourceId: string;
  resourceTitle: string;
  resourceTopic: string;
  resourceType: string;

  teacherId: string;
  teacherName: string;

  classId: string;
  className: string;

  instructions: string;
  dueDate: Date | null;

  status: AssignmentStatus;

  studentIds: string[];
  studentCount: number;
  completedCount: number;

  createdAt: Date | null;
  updatedAt: Date | null;
};

export type StudentAssignmentProgress = {
  id: string;

  assignmentId: string;
  studentId: string;

  status: StudentAssignmentStatus;

  startedAt: Date | null;
  completedAt: Date | null;
  updatedAt: Date | null;
};

export type StudentAssignmentWithProgress = ResourceAssignment & {
  studentProgress: StudentAssignmentProgress;
};

export type CreateResourceAssignmentInput = {
  resourceId: string;
  resourceTitle: string;
  resourceTopic: string;
  resourceType: string;

  teacherId: string;
  teacherName?: string;

  classId: string;
  className: string;

  instructions?: string;
  dueDate: Date;

  studentIds: string[];
};

type FirestoreResourceAssignment = Omit<
  ResourceAssignment,
  "id" | "dueDate" | "createdAt" | "updatedAt"
> & {
  dueDate?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

type FirestoreStudentAssignmentProgress = Omit<
  StudentAssignmentProgress,
  "id" | "startedAt" | "completedAt" | "updatedAt"
> & {
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  updatedAt?: Timestamp;
};

function convertTimestamp(value?: Timestamp | null): Date | null {
  return value?.toDate ? value.toDate() : null;
}

function convertAssignmentDocument(
  assignmentId: string,
  data: FirestoreResourceAssignment,
): ResourceAssignment {
  return {
    id: assignmentId,

    resourceId: data.resourceId,
    resourceTitle: data.resourceTitle,
    resourceTopic: data.resourceTopic,
    resourceType: data.resourceType,

    teacherId: data.teacherId,
    teacherName: data.teacherName,

    classId: data.classId,
    className: data.className,

    instructions: data.instructions ?? "",

    dueDate: convertTimestamp(data.dueDate),

    status: data.status ?? "active",

    studentIds: data.studentIds ?? [],
    studentCount: data.studentCount ?? 0,
    completedCount: data.completedCount ?? 0,

    createdAt: convertTimestamp(data.createdAt),
    updatedAt: convertTimestamp(data.updatedAt),
  };
}

function createProgressDocumentId(
  assignmentId: string,
  studentId: string,
): string {
  return `${assignmentId}_${studentId}`;
}

function createDefaultStudentProgress(
  assignmentId: string,
  studentId: string,
): StudentAssignmentProgress {
  return {
    id: createProgressDocumentId(assignmentId, studentId),

    assignmentId,
    studentId,

    status: "not_started",

    startedAt: null,
    completedAt: null,
    updatedAt: null,
  };
}

function validateAssignmentInput(input: CreateResourceAssignmentInput): void {
  if (!input.resourceId.trim()) {
    throw new Error("A valid teaching resource is required.");
  }

  if (!input.teacherId.trim()) {
    throw new Error("A valid teacher account is required.");
  }

  if (!input.classId.trim()) {
    throw new Error("Select a class before assigning the resource.");
  }

  if (!input.className.trim()) {
    throw new Error("The selected class does not have a valid name.");
  }

  if (
    !(input.dueDate instanceof Date) ||
    Number.isNaN(input.dueDate.getTime())
  ) {
    throw new Error("Select a valid due date.");
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (input.dueDate < today) {
    throw new Error("The due date cannot be in the past.");
  }
}

export async function createResourceAssignment(
  input: CreateResourceAssignmentInput,
): Promise<string> {
  validateAssignmentInput(input);

  const uniqueStudentIds = Array.from(
    new Set(
      input.studentIds.map((studentId) => studentId.trim()).filter(Boolean),
    ),
  );

  const assignmentReference = await addDoc(collection(db, "classAssignments"), {
    resourceId: input.resourceId.trim(),
    resourceTitle: input.resourceTitle.trim(),
    resourceTopic: input.resourceTopic.trim(),
    resourceType: input.resourceType.trim(),

    teacherId: input.teacherId.trim(),
    teacherName: input.teacherName?.trim() || "Teacher",

    classId: input.classId.trim(),
    className: input.className.trim(),

    instructions: input.instructions?.trim() || "",

    dueDate: Timestamp.fromDate(input.dueDate),

    status: "active",

    studentIds: uniqueStudentIds,
    studentCount: uniqueStudentIds.length,
    completedCount: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return assignmentReference.id;
}

export async function getTeacherAssignments(
  teacherId: string,
): Promise<ResourceAssignment[]> {
  if (!teacherId.trim()) {
    return [];
  }

  const assignmentsQuery = query(
    collection(db, "classAssignments"),
    where("teacherId", "==", teacherId),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(assignmentsQuery);

  return snapshot.docs.map((assignmentDocument) =>
    convertAssignmentDocument(
      assignmentDocument.id,
      assignmentDocument.data() as FirestoreResourceAssignment,
    ),
  );
}

export async function getStudentAssignments(
  studentId: string,
): Promise<StudentAssignmentWithProgress[]> {
  if (!studentId.trim()) {
    return [];
  }

  const assignmentsQuery = query(
    collection(db, "classAssignments"),
    where("studentIds", "array-contains", studentId),
    orderBy("dueDate", "asc"),
  );

  const snapshot = await getDocs(assignmentsQuery);

  const assignments = snapshot.docs.map((assignmentDocument) =>
    convertAssignmentDocument(
      assignmentDocument.id,
      assignmentDocument.data() as FirestoreResourceAssignment,
    ),
  );

  return Promise.all(
    assignments.map(async (assignment) => {
      const studentProgress = await getStudentAssignmentProgress(
        assignment.id,
        studentId,
      );

      return {
        ...assignment,
        studentProgress,
      };
    }),
  );
}

export async function getAssignmentById(
  assignmentId: string,
): Promise<ResourceAssignment | null> {
  if (!assignmentId.trim()) {
    return null;
  }

  const assignmentReference = doc(db, "classAssignments", assignmentId);

  const snapshot = await getDoc(assignmentReference);

  if (!snapshot.exists()) {
    return null;
  }

  return convertAssignmentDocument(
    snapshot.id,
    snapshot.data() as FirestoreResourceAssignment,
  );
}

export async function getStudentAssignmentProgress(
  assignmentId: string,
  studentId: string,
): Promise<StudentAssignmentProgress> {
  if (!assignmentId.trim() || !studentId.trim()) {
    return createDefaultStudentProgress(assignmentId, studentId);
  }

  const progressId = createProgressDocumentId(assignmentId, studentId);

  const progressReference = doc(db, "assignmentProgress", progressId);

  const snapshot = await getDoc(progressReference);

  if (!snapshot.exists()) {
    return createDefaultStudentProgress(assignmentId, studentId);
  }

  const data = snapshot.data() as FirestoreStudentAssignmentProgress;

  return {
    id: snapshot.id,

    assignmentId: data.assignmentId ?? assignmentId,

    studentId: data.studentId ?? studentId,

    status: data.status ?? "not_started",

    startedAt: convertTimestamp(data.startedAt),

    completedAt: convertTimestamp(data.completedAt),

    updatedAt: convertTimestamp(data.updatedAt),
  };
}

export async function startStudentAssignment(
  assignmentId: string,
  studentId: string,
): Promise<void> {
  if (!assignmentId.trim() || !studentId.trim()) {
    throw new Error("A valid assignment and student are required.");
  }

  const progressId = createProgressDocumentId(assignmentId, studentId);

  const progressReference = doc(db, "assignmentProgress", progressId);

  const existingProgress = await getDoc(progressReference);

  if (
    existingProgress.exists() &&
    existingProgress.data().status === "completed"
  ) {
    return;
  }

  await setDoc(
    progressReference,
    {
      assignmentId,
      studentId,

      status: "in_progress",

      startedAt: serverTimestamp(),
      completedAt: null,
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}

export async function completeStudentAssignment(
  assignmentId: string,
  studentId: string,
): Promise<void> {
  if (!assignmentId.trim() || !studentId.trim()) {
    throw new Error("A valid assignment and student are required.");
  }

  const assignmentReference = doc(db, "classAssignments", assignmentId);

  const progressId = createProgressDocumentId(assignmentId, studentId);

  const progressReference = doc(db, "assignmentProgress", progressId);

  await runTransaction(db, async (transaction) => {
    const assignmentSnapshot = await transaction.get(assignmentReference);

    if (!assignmentSnapshot.exists()) {
      throw new Error("This assignment could not be found.");
    }

    const assignmentData =
      assignmentSnapshot.data() as FirestoreResourceAssignment;

    if (!assignmentData.studentIds?.includes(studentId)) {
      throw new Error("You are not enrolled in this assignment.");
    }

    const progressSnapshot = await transaction.get(progressReference);

    const alreadyCompleted =
      progressSnapshot.exists() &&
      progressSnapshot.data().status === "completed";

    if (alreadyCompleted) {
      return;
    }

    transaction.set(
      progressReference,
      {
        assignmentId,
        studentId,

        status: "completed",

        startedAt: progressSnapshot.exists()
          ? (progressSnapshot.data().startedAt ?? serverTimestamp())
          : serverTimestamp(),

        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    const currentCompletedCount = assignmentData.completedCount ?? 0;

    const maximumCompletedCount =
      assignmentData.studentCount ?? assignmentData.studentIds.length;

    transaction.update(assignmentReference, {
      completedCount: Math.min(
        currentCompletedCount + 1,
        maximumCompletedCount,
      ),

      updatedAt: serverTimestamp(),
    });
  });
}

export async function updateAssignmentStatus(
  assignmentId: string,
  status: AssignmentStatus,
): Promise<void> {
  await updateDoc(doc(db, "classAssignments", assignmentId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateAssignmentDetails(
  assignmentId: string,
  updates: {
    instructions?: string;
    dueDate?: Date;
  },
): Promise<void> {
  const cleanedUpdates: {
    instructions?: string;
    dueDate?: Timestamp;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    updatedAt: serverTimestamp(),
  };

  if (updates.instructions !== undefined) {
    cleanedUpdates.instructions = updates.instructions.trim();
  }

  if (updates.dueDate !== undefined) {
    if (Number.isNaN(updates.dueDate.getTime())) {
      throw new Error("Select a valid due date.");
    }

    cleanedUpdates.dueDate = Timestamp.fromDate(updates.dueDate);
  }

  await updateDoc(doc(db, "classAssignments", assignmentId), cleanedUpdates);
}
export async function getAssignmentProgressForTeacher(
  assignmentId: string,
): Promise<StudentAssignmentProgress[]> {
  if (!assignmentId.trim()) {
    return [];
  }

  const assignment = await getAssignmentById(assignmentId);

  if (!assignment) {
    return [];
  }

  return Promise.all(
    assignment.studentIds.map((studentId) =>
      getStudentAssignmentProgress(assignmentId, studentId),
    ),
  );
}
