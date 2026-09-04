import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { getProgrammingChallengeById } from "@/data/programming/challenges";
import { db } from "@/lib/firebase";
import {
  completeStudentAssignment,
  startStudentAssignment,
} from "@/services/resourceAssignmentService";
import type {
  ProgrammingAssignment,
  ProgrammingAssignmentResult,
  ProgrammingAssignmentResultsSummary,
  ProgrammingChallengeSnapshot,
  ProgrammingSubmission,
} from "@/types/programmingAssignment";

const PROGRAMMING_RESOURCE_TYPE = "programming-challenge";

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  return null;
}

function progressId(assignmentId: string, studentId: string): string {
  return `${assignmentId}_${studentId}`;
}

function toChallengeSnapshot(
  challengeId: string,
): ProgrammingChallengeSnapshot {
  const challenge = getProgrammingChallengeById(challengeId);

  if (!challenge) {
    throw new Error(
      "The selected programming challenge could not be found.",
    );
  }

  return {
    challengeId: challenge.id,
    title: challenge.title,
    topicId: challenge.topicId,
    skills: challenge.skills,
    mode: challenge.mode,
    difficulty: challenge.difficulty,
    qualifications: challenge.qualifications,
    examBoards: challenge.examBoards ?? [],
    xpReward: challenge.xpReward,
    estimatedMinutes: challenge.estimatedMinutes,
  };
}

function convertAssignment(
  id: string,
  data: Record<string, unknown>,
): ProgrammingAssignment {
  const storedSnapshot =
    (data.programmingChallenge as
      | ProgrammingChallengeSnapshot
      | undefined) ?? null;

  const challengeId = String(
    data.resourceId ?? storedSnapshot?.challengeId ?? "",
  );

  const challengeSnapshot =
    storedSnapshot ?? toChallengeSnapshot(challengeId);

  return {
    id,
    teacherId: String(data.teacherId ?? ""),
    teacherName: String(data.teacherName ?? "Teacher"),
    classId: String(data.classId ?? ""),
    className: String(data.className ?? "Class"),
    studentIds: Array.isArray(data.studentIds)
      ? data.studentIds.filter(
          (value: unknown): value is string => typeof value === "string",
        )
      : [],
    studentCount:
      typeof data.studentCount === "number" ? data.studentCount : 0,
    completedCount:
      typeof data.completedCount === "number" ? data.completedCount : 0,
    challengeId,
    title: String(data.resourceTitle ?? challengeSnapshot.title),
    topic: String(data.resourceTopic ?? challengeSnapshot.topicId),
    instructions: String(data.instructions ?? ""),
    dueDate: toDate(data.dueDate),
    createdAt: toDate(data.createdAt),
    status: data.status === "archived" ? "archived" : "active",
    challengeSnapshot,
  };
}

export type CreateProgrammingAssignmentInput = {
  teacherId: string;
  classId: string;
  challengeId: string;
  instructions: string;
  dueDate: string;
  studentIds?: string[];
};

export async function createProgrammingAssignment({
  teacherId,
  classId,
  challengeId,
  instructions,
  dueDate,
  studentIds: requestedStudentIds,
}: CreateProgrammingAssignmentInput): Promise<string> {
  const cleanedTeacherId = teacherId.trim();
  const cleanedClassId = classId.trim();
  const cleanedChallengeId = challengeId.trim();

  if (!cleanedTeacherId || !cleanedClassId || !cleanedChallengeId) {
    throw new Error(
      "Teacher, class and programming challenge are required.",
    );
  }

  const parsedDueDate = new Date(`${dueDate}T23:59:59`);

  if (Number.isNaN(parsedDueDate.getTime())) {
    throw new Error("Select a valid due date.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsedDueDate.getTime() < today.getTime()) {
    throw new Error("The due date cannot be in the past.");
  }

  const challenge = getProgrammingChallengeById(cleanedChallengeId);

  if (!challenge) {
    throw new Error(
      "The selected programming challenge could not be found.",
    );
  }

  const [classSnapshot, teacherSnapshot] = await Promise.all([
    getDoc(doc(db, "classes", cleanedClassId)),
    getDoc(doc(db, "users", cleanedTeacherId)),
  ]);

  if (!classSnapshot.exists()) {
    throw new Error("The selected class could not be found.");
  }

  const classData = classSnapshot.data();
  const teacherData = teacherSnapshot.exists()
    ? teacherSnapshot.data()
    : {};

  if (
    classData.teacherId &&
    classData.teacherId !== cleanedTeacherId
  ) {
    throw new Error(
      "You cannot assign work to another teacher's class.",
    );
  }

  const enrolledStudentIds = Array.isArray(classData.studentIds)
    ? Array.from(
        new Set(
          classData.studentIds
            .filter(
              (value: unknown): value is string =>
                typeof value === "string" && Boolean(value.trim()),
            )
            .map((value: string) => value.trim()),
        ),
      )
    : [];

  const requestedIds = Array.from(
    new Set((requestedStudentIds ?? []).map((id) => id.trim()).filter(Boolean)),
  );

  const studentIds =
    requestedIds.length > 0
      ? requestedIds.filter((id) => enrolledStudentIds.includes(id))
      : enrolledStudentIds;

  if (studentIds.length === 0) {
    throw new Error(
      requestedIds.length > 0
        ? "None of the selected students are enrolled in this class."
        : "The selected class has no enrolled students.",
    );
  }

  const teacherName = String(
    teacherData.name ??
      teacherData.displayName ??
      teacherData.fullName ??
      teacherData.email ??
      "Teacher",
  );

  const challengeSnapshot =
    toChallengeSnapshot(challenge.id);

  const assignmentReference = await addDoc(
    collection(db, "classAssignments"),
    {
      resourceId: challenge.id,
      resourceTitle: challenge.title,
      resourceTopic: challenge.topicId,
      resourceType: PROGRAMMING_RESOURCE_TYPE,

      teacherId: cleanedTeacherId,
      teacherName,

      classId: cleanedClassId,
      className: String(classData.name ?? "Untitled Class"),

      instructions:
        instructions.trim() ||
        `Complete the ${challenge.title} programming challenge.`,

      dueDate: Timestamp.fromDate(parsedDueDate),
      status: "active",

      studentIds,
      studentCount: studentIds.length,
      completedCount: 0,

      programmingChallenge: challengeSnapshot,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  await updateDoc(doc(db, "classes", cleanedClassId), {
    assignmentIds: arrayUnion(assignmentReference.id),
    updatedAt: serverTimestamp(),
  });

  return assignmentReference.id;
}

export async function getProgrammingAssignmentById(
  assignmentId: string,
): Promise<ProgrammingAssignment | null> {
  const cleanedId = assignmentId.trim();
  if (!cleanedId) return null;

  const snapshot = await getDoc(
    doc(db, "classAssignments", cleanedId),
  );

  if (!snapshot.exists()) return null;

  const data = snapshot.data() as Record<string, unknown>;

  if (data.resourceType !== PROGRAMMING_RESOURCE_TYPE) {
    return null;
  }

  return convertAssignment(snapshot.id, data);
}

export async function getTeacherProgrammingAssignments(
  teacherId: string,
): Promise<ProgrammingAssignment[]> {
  if (!teacherId.trim()) return [];

  const snapshot = await getDocs(
    query(
      collection(db, "classAssignments"),
      where("teacherId", "==", teacherId),
    ),
  );

  return snapshot.docs
    .filter(
      (item) =>
        item.data().resourceType === PROGRAMMING_RESOURCE_TYPE,
    )
    .map((item) =>
      convertAssignment(
        item.id,
        item.data() as Record<string, unknown>,
      ),
    )
    .sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) -
        (a.createdAt?.getTime() ?? 0),
    );
}

export async function getProgrammingSubmission(
  assignmentId: string,
  studentId: string,
): Promise<ProgrammingSubmission | null> {
  if (!assignmentId.trim() || !studentId.trim()) {
    return null;
  }

  const snapshot = await getDoc(
    doc(
      db,
      "assignmentProgress",
      progressId(assignmentId, studentId),
    ),
  );

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    id: snapshot.id,
    assignmentId,
    studentId,
    studentName: String(data.studentName ?? "Student"),
    status:
      data.status === "completed"
        ? "completed"
        : data.status === "in_progress"
          ? "in_progress"
          : "not_started",
    attempts:
      typeof data.programmingAttempts === "number"
        ? data.programmingAttempts
        : 0,
    code: String(data.programmingCode ?? ""),
    passedCount:
      typeof data.programmingPassedCount === "number"
        ? data.programmingPassedCount
        : 0,
    totalTests:
      typeof data.programmingTotalTests === "number"
        ? data.programmingTotalTests
        : 0,
    percentage:
      typeof data.programmingPercentage === "number"
        ? data.programmingPercentage
        : 0,
    lastPassed: data.programmingLastPassed === true,
    lastError: String(data.programmingLastError ?? ""),
    startedAt: toDate(data.startedAt),
    completedAt: toDate(data.completedAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export type RecordProgrammingAttemptInput = {
  assignmentId: string;
  studentId: string;
  code: string;
  passed: boolean;
  passedCount: number;
  totalTests: number;
  error?: string;
};

export async function recordProgrammingAssignmentAttempt({
  assignmentId,
  studentId,
  code,
  passed,
  passedCount,
  totalTests,
  error = "",
}: RecordProgrammingAttemptInput): Promise<void> {
  const assignment =
    await getProgrammingAssignmentById(assignmentId);

  if (!assignment) {
    throw new Error(
      "The programming assignment could not be found.",
    );
  }

  if (!assignment.studentIds.includes(studentId)) {
    throw new Error(
      "You are not enrolled in this programming assignment.",
    );
  }

  if (assignment.status !== "active") {
    throw new Error(
      "This programming assignment is no longer accepting attempts.",
    );
  }

  const existingSubmission = await getProgrammingSubmission(
    assignmentId,
    studentId,
  );

  if (existingSubmission?.status === "completed") {
    throw new Error(
      "This programming assignment has already been completed.",
    );
  }

  if (!code.trim()) {
    throw new Error(
      "Enter some Python code before checking the assignment.",
    );
  }

  if (
    !Number.isFinite(passedCount) ||
    !Number.isFinite(totalTests) ||
    passedCount < 0 ||
    totalTests <= 0 ||
    passedCount > totalTests
  ) {
    throw new Error(
      "The programming test result is invalid.",
    );
  }

  if (passed && passedCount !== totalTests) {
    throw new Error(
      "A programming assignment can only complete when every test passes.",
    );
  }

  /*
   * Create/validate the base progress record before saving programming
   * evidence. This keeps the Firestore write tied to a real active
   * assignment and an enrolled student.
   */
  await startStudentAssignment(assignmentId, studentId);

  const id = progressId(assignmentId, studentId);
  const progressReference = doc(
    db,
    "assignmentProgress",
    id,
  );
  const existing = await getDoc(progressReference);

  const previousAttempts =
    existing.exists() &&
    typeof existing.data().programmingAttempts === "number"
      ? existing.data().programmingAttempts
      : 0;

  const studentSnapshot = await getDoc(
    doc(db, "users", studentId),
  );
  const studentData = studentSnapshot.exists()
    ? studentSnapshot.data()
    : {};

  const percentage =
    totalTests > 0
      ? Math.round(
          (Math.max(0, passedCount) / totalTests) * 100,
        )
      : 0;

  await setDoc(
    progressReference,
    {
      assignmentId,
      studentId,
      studentName: String(
        studentData.name ??
          studentData.displayName ??
          studentData.fullName ??
          studentData.email ??
          "Student",
      ),
      programmingChallengeId: assignment.challengeId,
      programmingCode: code,
      programmingAttempts: previousAttempts + 1,
      programmingPassedCount: passedCount,
      programmingTotalTests: totalTests,
      programmingPercentage: percentage,
      programmingLastPassed: passed,
      programmingLastError: error,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (passed) {
    await completeStudentAssignment(
      assignmentId,
      studentId,
    );
  }
}

export async function getProgrammingAssignmentResults(
  assignmentId: string,
): Promise<ProgrammingAssignmentResultsSummary | null> {
  const assignment =
    await getProgrammingAssignmentById(assignmentId);

  if (!assignment) return null;

  const progressSnapshot = await getDocs(
    query(
      collection(db, "assignmentProgress"),
      where("assignmentId", "==", assignmentId),
    ),
  );

  const progressByStudent = new Map(
    progressSnapshot.docs.map((item) => [
      item.data().studentId,
      item.data(),
    ]),
  );

  const results: ProgrammingAssignmentResult[] =
    await Promise.all(
      assignment.studentIds.map(async (studentId) => {
        const studentSnapshot = await getDoc(
          doc(db, "users", studentId),
        );
        const studentData = studentSnapshot.exists()
          ? studentSnapshot.data()
          : {};
        const progress = progressByStudent.get(studentId);

        const status =
          progress?.status === "completed"
            ? "completed"
            : progress?.status === "in_progress"
              ? "in_progress"
              : "not_started";

        return {
          studentId,
          studentName: String(
            progress?.studentName ??
              studentData.name ??
              studentData.displayName ??
              studentData.fullName ??
              studentData.email ??
              "Student",
          ),
          status,
          attempts:
            typeof progress?.programmingAttempts === "number"
              ? progress.programmingAttempts
              : 0,
          passedCount:
            typeof progress?.programmingPassedCount === "number"
              ? progress.programmingPassedCount
              : 0,
          totalTests:
            typeof progress?.programmingTotalTests === "number"
              ? progress.programmingTotalTests
              : 0,
          percentage:
            typeof progress?.programmingPercentage === "number"
              ? progress.programmingPercentage
              : 0,
          completedAt: toDate(progress?.completedAt),
        };
      }),
    );

  const completed = results.filter(
    (result) => result.status === "completed",
  ).length;

  const inProgress = results.filter(
    (result) => result.status === "in_progress",
  ).length;

  const notStarted =
    results.length - completed - inProgress;

  const attempted = results.filter(
    (result) => result.attempts > 0,
  );

  const averagePercentage =
    attempted.length > 0
      ? Math.round(
          attempted.reduce(
            (total, result) =>
              total + result.percentage,
            0,
          ) / attempted.length,
        )
      : 0;

  return {
    assignment,
    results,
    completed,
    inProgress,
    notStarted,
    completionPercentage:
      results.length > 0
        ? Math.round(
            (completed / results.length) * 100,
          )
        : 0,
    averagePercentage,
  };
}

export const PROGRAMMING_ASSIGNMENT_RESOURCE_TYPE =
  PROGRAMMING_RESOURCE_TYPE;
