import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type QuizAssignmentStatus = "active" | "closed" | "cancelled";

export type QuizStudentResultStatus = "not_started" | "completed";

export type TeacherQuizAssignmentSummary = {
  id: string;

  teacherId: string;
  classId: string;
  className: string;

  title: string;
  description: string;
  resourceId: string;

  dueDate: Date | null;
  createdAt: Date | null;

  status: QuizAssignmentStatus;

  studentCount: number;
  completedCount: number;
  completionPercentage: number;
  averagePercentage: number;
};

export type TeacherQuizStudentResult = {
  studentId: string;
  studentName: string;
  studentEmail: string;

  status: QuizStudentResultStatus;

  score: number;
  totalQuestions: number;
  percentage: number;
  earnedXP: number;
  timeTakenSeconds: number;

  completedAt: Date | null;
};

export type TeacherQuizAssignmentDetail = {
  assignment: TeacherQuizAssignmentSummary;
  students: TeacherQuizStudentResult[];
};

type FirestoreDate = Timestamp | Date | string | null | undefined;

type FirestoreAssignment = {
  teacherId?: string;
  classId?: string;

  title?: string;
  description?: string;

  type?: string;
  resourceId?: string;

  dueDate?: FirestoreDate;
  createdAt?: FirestoreDate;

  status?: string;
};

type FirestoreResult = {
  assignmentId?: string;
  studentId?: string;

  teacherId?: string;
  classId?: string;

  assignmentType?: string;
  resourceId?: string;

  score?: number;
  totalQuestions?: number;
  percentage?: number;
  earnedXP?: number;
  timeTakenSeconds?: number;

  status?: string;
  completedAt?: FirestoreDate;
};

function convertDate(value: FirestoreDate): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (value instanceof Timestamp) {
    return value.toDate();
  }

  if (typeof value === "string") {
    const parsedDate = new Date(value);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  return null;
}

function normaliseStatus(value: unknown): QuizAssignmentStatus {
  if (value === "closed" || value === "cancelled") {
    return value;
  }

  return "active";
}

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function calculateCompletionPercentage(
  completedCount: number,
  studentCount: number,
): number {
  if (studentCount <= 0) {
    return 0;
  }

  return Math.round((completedCount / studentCount) * 100);
}

function calculateAveragePercentage(results: FirestoreResult[]): number {
  if (results.length === 0) {
    return 0;
  }

  const total = results.reduce(
    (sum, result) => sum + safeNumber(result.percentage),
    0,
  );

  return Math.round(total / results.length);
}

/*
 * The teacherId condition is essential.
 *
 * Firestore security rules must be able to prove
 * that every result returned by the query belongs
 * to the currently logged-in teacher.
 */
async function getQuizAssignmentResults(
  assignmentId: string,
  teacherId: string,
): Promise<FirestoreResult[]> {
  const cleanedAssignmentId = assignmentId.trim();

  const cleanedTeacherId = teacherId.trim();

  if (!cleanedAssignmentId || !cleanedTeacherId) {
    return [];
  }

  const resultsQuery = query(
    collection(db, "assignmentResults"),
    where("assignmentId", "==", cleanedAssignmentId),
    where("teacherId", "==", cleanedTeacherId),
  );

  const snapshot = await getDocs(resultsQuery);

  return snapshot.docs
    .map((resultDocument) => resultDocument.data() as FirestoreResult)
    .filter(
      (result) =>
        result.assignmentType === "quiz" &&
        result.status === "completed" &&
        result.teacherId === cleanedTeacherId &&
        result.assignmentId === cleanedAssignmentId,
    );
}

async function getClassInformation(classId: string): Promise<{
  className: string;
  studentIds: string[];
}> {
  const cleanedClassId = classId.trim();

  if (!cleanedClassId) {
    return {
      className: "Unknown class",
      studentIds: [],
    };
  }

  const classSnapshot = await getDoc(doc(db, "classes", cleanedClassId));

  if (!classSnapshot.exists()) {
    return {
      className: "Unknown class",
      studentIds: [],
    };
  }

  const classData = classSnapshot.data();

  const studentIds = Array.isArray(classData.studentIds)
    ? classData.studentIds.filter(
        (value): value is string =>
          typeof value === "string" && Boolean(value.trim()),
      )
    : [];

  return {
    className:
      typeof classData.name === "string" && classData.name.trim()
        ? classData.name
        : "Untitled class",

    studentIds: Array.from(
      new Set(studentIds.map((studentId) => studentId.trim())),
    ),
  };
}

export async function getTeacherQuizAssignments(
  teacherId: string,
): Promise<TeacherQuizAssignmentSummary[]> {
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedTeacherId) {
    return [];
  }

  const assignmentsQuery = query(
    collection(db, "assignments"),
    where("teacherId", "==", cleanedTeacherId),
  );

  const assignmentsSnapshot = await getDocs(assignmentsQuery);

  const quizDocuments = assignmentsSnapshot.docs.filter(
    (assignmentDocument) => {
      const data = assignmentDocument.data();

      return data.type === "quiz" && data.teacherId === cleanedTeacherId;
    },
  );

  const summaries = await Promise.all(
    quizDocuments.map(async (assignmentDocument) => {
      const assignment = assignmentDocument.data() as FirestoreAssignment;

      const classId = assignment.classId || "";

      const [classInformation, results] = await Promise.all([
        getClassInformation(classId),

        getQuizAssignmentResults(assignmentDocument.id, cleanedTeacherId),
      ]);

      const completedStudentIds = new Set(
        results.map((result) => result.studentId || "").filter(Boolean),
      );

      const completedCount = completedStudentIds.size;

      const studentCount = classInformation.studentIds.length;

      return {
        id: assignmentDocument.id,

        teacherId: assignment.teacherId || "",

        classId,

        className: classInformation.className,

        title: assignment.title || "Untitled Quiz",

        description: assignment.description || "",

        resourceId: assignment.resourceId || "",

        dueDate: convertDate(assignment.dueDate),

        createdAt: convertDate(assignment.createdAt),

        status: normaliseStatus(assignment.status),

        studentCount,

        completedCount,

        completionPercentage: calculateCompletionPercentage(
          completedCount,
          studentCount,
        ),

        averagePercentage: calculateAveragePercentage(results),
      } satisfies TeacherQuizAssignmentSummary;
    }),
  );

  return summaries.sort((first, second) => {
    const firstCreatedAt = first.createdAt?.getTime() ?? 0;

    const secondCreatedAt = second.createdAt?.getTime() ?? 0;

    return secondCreatedAt - firstCreatedAt;
  });
}

export async function getTeacherQuizAssignmentDetail(
  assignmentId: string,
  teacherId: string,
): Promise<TeacherQuizAssignmentDetail | null> {
  const cleanedAssignmentId = assignmentId.trim();

  const cleanedTeacherId = teacherId.trim();

  if (!cleanedAssignmentId || !cleanedTeacherId) {
    return null;
  }

  const assignmentSnapshot = await getDoc(
    doc(db, "assignments", cleanedAssignmentId),
  );

  if (!assignmentSnapshot.exists()) {
    return null;
  }

  const assignment = assignmentSnapshot.data() as FirestoreAssignment;

  if (assignment.type !== "quiz" || assignment.teacherId !== cleanedTeacherId) {
    return null;
  }

  const classId = assignment.classId || "";

  const [classInformation, results] = await Promise.all([
    getClassInformation(classId),

    getQuizAssignmentResults(cleanedAssignmentId, cleanedTeacherId),
  ]);

  const resultByStudentId = new Map<string, FirestoreResult>();

  results.forEach((result) => {
    if (result.studentId) {
      resultByStudentId.set(result.studentId, result);
    }
  });

  const students = await Promise.all(
    classInformation.studentIds.map(async (studentId) => {
      const profileSnapshot = await getDoc(doc(db, "users", studentId));

      const profile = profileSnapshot.exists() ? profileSnapshot.data() : null;

      const result = resultByStudentId.get(studentId);

      return {
        studentId,

        studentName:
          typeof profile?.name === "string" && profile.name.trim()
            ? profile.name
            : "Student",

        studentEmail:
          typeof profile?.email === "string" && profile.email.trim()
            ? profile.email
            : "No email available",

        status: result ? "completed" : "not_started",

        score: safeNumber(result?.score),

        totalQuestions: safeNumber(result?.totalQuestions),

        percentage: safeNumber(result?.percentage),

        earnedXP: safeNumber(result?.earnedXP),

        timeTakenSeconds: safeNumber(result?.timeTakenSeconds),

        completedAt: convertDate(result?.completedAt),
      } satisfies TeacherQuizStudentResult;
    }),
  );

  students.sort((first, second) =>
    first.studentName.localeCompare(second.studentName),
  );

  const completedCount = students.filter(
    (student) => student.status === "completed",
  ).length;

  const studentCount = students.length;

  const assignmentSummary: TeacherQuizAssignmentSummary = {
    id: assignmentSnapshot.id,

    teacherId: assignment.teacherId || "",

    classId,

    className: classInformation.className,

    title: assignment.title || "Untitled Quiz",

    description: assignment.description || "",

    resourceId: assignment.resourceId || "",

    dueDate: convertDate(assignment.dueDate),

    createdAt: convertDate(assignment.createdAt),

    status: normaliseStatus(assignment.status),

    studentCount,

    completedCount,

    completionPercentage: calculateCompletionPercentage(
      completedCount,
      studentCount,
    ),

    averagePercentage: calculateAveragePercentage(results),
  };

  return {
    assignment: assignmentSummary,
    students,
  };
}
