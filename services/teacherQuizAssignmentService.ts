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
export type QuizDeliveryMode = "practice" | "assessment";

export type QuizIntegrityIncidentType =
  | "fullscreen_exit"
  | "fullscreen_restored"
  | "page_hidden"
  | "page_visible"
  | "auto_submit";

export type TeacherQuizIntegrityIncident = {
  id: string;
  type: QuizIntegrityIncidentType;
  occurredAt: Date | null;
  questionNumber: number | null;
  detail: string;
};

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
  deliveryMode: QuizDeliveryMode;
  studentCount: number;
  completedCount: number;
  completionPercentage: number;
  averagePercentage: number;
  integrityTerminatedCount: number;
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
  deliveryMode: QuizDeliveryMode;
  integritySessionStartedAt: Date | null;
  integrityIncidents: TeacherQuizIntegrityIncident[];
  integrityTerminated: boolean;
  integrityTerminationReason: string;
};

export type TeacherQuizAssignmentDetail = {
  assignment: TeacherQuizAssignmentSummary;
  students: TeacherQuizStudentResult[];
};

type FirestoreDate = Timestamp | Date | string | null | undefined;

type FirestoreAssignment = {
  teacherId?: string;
  classId?: string;
  studentIds?: string[];
  title?: string;
  description?: string;
  type?: string;
  resourceId?: string;
  dueDate?: FirestoreDate;
  createdAt?: FirestoreDate;
  status?: string;
  deliveryMode?: string;
};

type FirestoreIntegrityIncident = {
  id?: unknown;
  type?: unknown;
  occurredAt?: unknown;
  questionNumber?: unknown;
  detail?: unknown;
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
  deliveryMode?: string;
  integritySessionStartedAt?: FirestoreDate;
  integrityIncidents?: FirestoreIntegrityIncident[];
  integrityTerminated?: boolean;
  integrityTerminationReason?: string;
};

function convertDate(value: FirestoreDate): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function normaliseStatus(value: unknown): QuizAssignmentStatus {
  return value === "closed" || value === "cancelled" ? value : "active";
}

function normaliseDeliveryMode(value: unknown): QuizDeliveryMode {
  return value === "assessment" ? "assessment" : "practice";
}

function safeNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function uniqueIds(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function assignmentStudentIds(
  assignment: FirestoreAssignment,
  classStudentIds: string[],
): string[] {
  if (!Array.isArray(assignment.studentIds)) {
    return classStudentIds;
  }

  const targeted = uniqueIds(
    assignment.studentIds.filter(
      (value: unknown): value is string => typeof value === "string",
    ),
  );

  if (targeted.length === 0) return classStudentIds;

  return targeted.filter((studentId) => classStudentIds.includes(studentId));
}

function normaliseIncident(
  value: FirestoreIntegrityIncident,
): TeacherQuizIntegrityIncident {
  const allowedTypes = new Set<QuizIntegrityIncidentType>([
    "fullscreen_exit",
    "fullscreen_restored",
    "page_hidden",
    "page_visible",
    "auto_submit",
  ]);

  const type =
    typeof value.type === "string" &&
    allowedTypes.has(value.type as QuizIntegrityIncidentType)
      ? (value.type as QuizIntegrityIncidentType)
      : "page_hidden";

  return {
    id: typeof value.id === "string" ? value.id : "incident",
    type,
    occurredAt: convertDate(value.occurredAt as FirestoreDate),
    questionNumber:
      typeof value.questionNumber === "number" &&
      Number.isFinite(value.questionNumber)
        ? value.questionNumber
        : null,
    detail:
      typeof value.detail === "string"
        ? value.detail
        : "Integrity event recorded.",
  };
}

function calculateCompletionPercentage(
  completedCount: number,
  studentCount: number,
) {
  return studentCount <= 0
    ? 0
    : Math.round((completedCount / studentCount) * 100);
}

function calculateAveragePercentage(results: FirestoreResult[]) {
  if (results.length === 0) return 0;
  return Math.round(
    results.reduce((sum, result) => sum + safeNumber(result.percentage), 0) /
      results.length,
  );
}

async function getQuizAssignmentResults(
  assignmentId: string,
  teacherId: string,
): Promise<FirestoreResult[]> {
  const cleanedAssignmentId = assignmentId.trim();
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedAssignmentId || !cleanedTeacherId) return [];

  const snapshot = await getDocs(
    query(
      collection(db, "assignmentResults"),
      where("assignmentId", "==", cleanedAssignmentId),
      where("teacherId", "==", cleanedTeacherId),
    ),
  );

  return snapshot.docs
    .map((document) => document.data() as FirestoreResult)
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
    return { className: "Unknown class", studentIds: [] };
  }

  const snapshot = await getDoc(doc(db, "classes", cleanedClassId));

  if (!snapshot.exists()) {
    return { className: "Unknown class", studentIds: [] };
  }

  const data = snapshot.data();
  const studentIds = Array.isArray(data.studentIds)
    ? data.studentIds.filter(
        (value: unknown): value is string =>
          typeof value === "string" && Boolean(value.trim()),
      )
    : [];

  return {
    className:
      typeof data.name === "string" && data.name.trim()
        ? data.name
        : "Untitled class",
    studentIds: uniqueIds(studentIds),
  };
}

export async function getTeacherQuizAssignments(
  teacherId: string,
): Promise<TeacherQuizAssignmentSummary[]> {
  const cleanedTeacherId = teacherId.trim();
  if (!cleanedTeacherId) return [];

  const assignmentsSnapshot = await getDocs(
    query(
      collection(db, "assignments"),
      where("teacherId", "==", cleanedTeacherId),
    ),
  );

  const quizDocuments = assignmentsSnapshot.docs.filter((document) => {
    const data = document.data();
    return data.type === "quiz" && data.teacherId === cleanedTeacherId;
  });

  const summaries = await Promise.all(
    quizDocuments.map(async (assignmentDocument) => {
      const assignment = assignmentDocument.data() as FirestoreAssignment;
      const classId = assignment.classId || "";
      const [classInformation, results] = await Promise.all([
        getClassInformation(classId),
        getQuizAssignmentResults(assignmentDocument.id, cleanedTeacherId),
      ]);

      const recipients = assignmentStudentIds(
        assignment,
        classInformation.studentIds,
      );
      const recipientSet = new Set(recipients);
      const recipientResults = results.filter(
        (result) => result.studentId && recipientSet.has(result.studentId),
      );
      const completedCount = new Set(
        recipientResults
          .map((result) => result.studentId || "")
          .filter(Boolean),
      ).size;

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
        deliveryMode: normaliseDeliveryMode(assignment.deliveryMode),
        studentCount: recipients.length,
        completedCount,
        completionPercentage: calculateCompletionPercentage(
          completedCount,
          recipients.length,
        ),
        averagePercentage: calculateAveragePercentage(recipientResults),
        integrityTerminatedCount: recipientResults.filter(
          (result) => result.integrityTerminated === true,
        ).length,
      } satisfies TeacherQuizAssignmentSummary;
    }),
  );

  return summaries.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
}

export async function getTeacherQuizAssignmentDetail(
  assignmentId: string,
  teacherId: string,
): Promise<TeacherQuizAssignmentDetail | null> {
  const cleanedAssignmentId = assignmentId.trim();
  const cleanedTeacherId = teacherId.trim();

  if (!cleanedAssignmentId || !cleanedTeacherId) return null;

  const assignmentSnapshot = await getDoc(
    doc(db, "assignments", cleanedAssignmentId),
  );

  if (!assignmentSnapshot.exists()) return null;

  const assignment = assignmentSnapshot.data() as FirestoreAssignment;

  if (assignment.type !== "quiz" || assignment.teacherId !== cleanedTeacherId) {
    return null;
  }

  const classId = assignment.classId || "";
  const [classInformation, results] = await Promise.all([
    getClassInformation(classId),
    getQuizAssignmentResults(cleanedAssignmentId, cleanedTeacherId),
  ]);

  const recipients = assignmentStudentIds(
    assignment,
    classInformation.studentIds,
  );
  const recipientSet = new Set(recipients);
  const recipientResults = results.filter(
    (result) => result.studentId && recipientSet.has(result.studentId),
  );

  const resultByStudentId = new Map<string, FirestoreResult>();
  recipientResults.forEach((result) => {
    if (result.studentId) resultByStudentId.set(result.studentId, result);
  });

  const students = await Promise.all(
    recipients.map(async (studentId) => {
      const profileSnapshot = await getDoc(doc(db, "users", studentId));
      const profile = profileSnapshot.exists() ? profileSnapshot.data() : null;
      const result = resultByStudentId.get(studentId);

      return {
        studentId,
        studentName:
          typeof profile?.name === "string" && profile.name.trim()
            ? profile.name
            : typeof profile?.displayName === "string" &&
                profile.displayName.trim()
              ? profile.displayName
              : "Student",
        studentEmail:
          typeof profile?.email === "string" && profile.email.trim()
            ? profile.email
            : "No email available",
        status: result ? "completed" : "not_started",
        score: safeNumber(result?.score),
        totalQuestions: safeNumber(result?.totalQuestions),
        percentage: safeNumber(result?.percentage),
        earnedXP:
          result?.integrityTerminated === true
            ? 0
            : safeNumber(result?.earnedXP),
        timeTakenSeconds: safeNumber(result?.timeTakenSeconds),
        completedAt: convertDate(result?.completedAt),
        deliveryMode: normaliseDeliveryMode(
          result?.deliveryMode ?? assignment.deliveryMode,
        ),
        integritySessionStartedAt: convertDate(
          result?.integritySessionStartedAt,
        ),
        integrityIncidents: Array.isArray(result?.integrityIncidents)
          ? result.integrityIncidents.map(normaliseIncident)
          : [],
        integrityTerminated: result?.integrityTerminated === true,
        integrityTerminationReason:
          typeof result?.integrityTerminationReason === "string"
            ? result.integrityTerminationReason
            : "",
      } satisfies TeacherQuizStudentResult;
    }),
  );

  students.sort((a, b) => a.studentName.localeCompare(b.studentName));

  const completedCount = students.filter(
    (student) => student.status === "completed",
  ).length;
  const studentCount = students.length;

  return {
    assignment: {
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
      deliveryMode: normaliseDeliveryMode(assignment.deliveryMode),
      studentCount,
      completedCount,
      completionPercentage: calculateCompletionPercentage(
        completedCount,
        studentCount,
      ),
      averagePercentage: calculateAveragePercentage(recipientResults),
      integrityTerminatedCount: students.filter(
        (student) => student.integrityTerminated,
      ).length,
    },
    students,
  };
}
