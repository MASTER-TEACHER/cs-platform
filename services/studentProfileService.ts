import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { UserProfile } from "@/types/database";

export type StudentDirectoryRecord = {
  uid: string;
  name: string;
  email: string;
  role: "student";

  schoolId: string;
  accountType: "individual" | "school";
  plan: "free" | "premium" | "school";

  qualification: string;
  examBoard: string;
  currentCourse: string;

  xp: number;
  streak: number;

  classIds: string[];

  completedLessons: string[];
  completedTopics: string[];
  completedUnits: string[];
};

function normaliseString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === "string",
  );
}

function convertToStudentRecord(
  profile: Partial<UserProfile>,
  fallbackUid: string,
): StudentDirectoryRecord {
  const schoolId = normaliseString(profile.schoolId);

  return {
    uid: normaliseString(profile.uid) || fallbackUid,
    name: normaliseString(profile.name) || "Unnamed Student",
    email: normaliseString(profile.email).toLowerCase(),
    role: "student",

    schoolId,

    accountType: schoolId ? "school" : "individual",

    plan: schoolId
      ? "school"
      : profile.plan === "premium"
        ? "premium"
        : "free",

    qualification: normaliseString(profile.qualification),
    examBoard: normaliseString(profile.examBoard),
    currentCourse: normaliseString(profile.currentCourse),

    xp: typeof profile.xp === "number" ? profile.xp : 0,
    streak: typeof profile.streak === "number" ? profile.streak : 0,

    classIds: normaliseStringArray(profile.classIds),

    completedLessons: normaliseStringArray(profile.completedLessons),
    completedTopics: normaliseStringArray(profile.completedTopics),
    completedUnits: normaliseStringArray(profile.completedUnits),
  };
}

/**
 * Returns only students belonging to one school.
 *
 * A missing schoolId deliberately returns [].
 * There is no global student-directory fallback.
 */
export async function getAllStudents(
  schoolId?: string,
): Promise<StudentDirectoryRecord[]> {
  const cleanedSchoolId = schoolId?.trim() || "";

  if (!cleanedSchoolId) {
    return [];
  }

  const studentsQuery = query(
    collection(db, "users"),
    where("role", "==", "student"),
    where("schoolId", "==", cleanedSchoolId),
  );

  const snapshot = await getDocs(studentsQuery);

  return snapshot.docs
    .map((studentDocument) =>
      convertToStudentRecord(
        studentDocument.data() as Partial<UserProfile>,
        studentDocument.id,
      ),
    )
    .sort((studentA, studentB) =>
      studentA.name.localeCompare(studentB.name, "en-GB", {
        sensitivity: "base",
      }),
    );
}

export async function getStudentsForSchool(
  schoolId: string,
): Promise<StudentDirectoryRecord[]> {
  return getAllStudents(schoolId);
}

export async function getStudentById(
  studentId: string,
  expectedSchoolId?: string,
): Promise<StudentDirectoryRecord | null> {
  const cleanedStudentId = studentId.trim();

  if (!cleanedStudentId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(db, "users", cleanedStudentId),
  );

  if (!snapshot.exists()) {
    return null;
  }

  const profile = snapshot.data() as Partial<UserProfile>;

  if (profile.role !== "student") {
    return null;
  }

  const student = convertToStudentRecord(
    profile,
    snapshot.id,
  );

  const cleanedExpectedSchoolId =
    expectedSchoolId?.trim() || "";

  if (
    cleanedExpectedSchoolId &&
    student.schoolId !== cleanedExpectedSchoolId
  ) {
    return null;
  }

  return student;
}

export async function getStudentsForClass(
  classId: string,
): Promise<StudentDirectoryRecord[]> {
  const cleanedClassId = classId.trim();

  if (!cleanedClassId) {
    return [];
  }

  const studentsQuery = query(
    collection(db, "users"),
    where("role", "==", "student"),
    where("classIds", "array-contains", cleanedClassId),
  );

  const snapshot = await getDocs(studentsQuery);

  return snapshot.docs
    .map((studentDocument) =>
      convertToStudentRecord(
        studentDocument.data() as Partial<UserProfile>,
        studentDocument.id,
      ),
    )
    .sort((studentA, studentB) =>
      studentA.name.localeCompare(studentB.name, "en-GB", {
        sensitivity: "base",
      }),
    );
}

export function searchStudents(
  students: StudentDirectoryRecord[],
  searchTerm: string,
): StudentDirectoryRecord[] {
  const cleanedSearchTerm = searchTerm.trim().toLowerCase();

  if (!cleanedSearchTerm) {
    return students;
  }

  return students.filter((student) => {
    const values = [
      student.name,
      student.email,
      student.qualification,
      student.examBoard,
      student.currentCourse,
    ].map((value) => value.toLowerCase());

    return values.some((value) =>
      value.includes(cleanedSearchTerm),
    );
  });
}

export async function addClassToStudent(
  studentId: string,
  classId: string,
): Promise<void> {
  const cleanedStudentId = studentId.trim();
  const cleanedClassId = classId.trim();

  if (!cleanedStudentId) {
    throw new Error("A valid student account is required.");
  }

  if (!cleanedClassId) {
    throw new Error("A valid class is required.");
  }

  const studentReference = doc(db, "users", cleanedStudentId);
  const snapshot = await getDoc(studentReference);

  if (!snapshot.exists()) {
    throw new Error(
      "The selected student account could not be found.",
    );
  }

  const profile = snapshot.data() as Partial<UserProfile>;

  if (profile.role !== "student") {
    throw new Error(
      "Only student accounts can be enrolled in a class.",
    );
  }

  await updateDoc(studentReference, {
    classIds: arrayUnion(cleanedClassId),
    updatedAt: serverTimestamp(),
  });
}

export async function removeClassFromStudent(
  studentId: string,
  classId: string,
): Promise<void> {
  const cleanedStudentId = studentId.trim();
  const cleanedClassId = classId.trim();

  if (!cleanedStudentId || !cleanedClassId) {
    throw new Error(
      "A valid student and class are required.",
    );
  }

  await updateDoc(
    doc(db, "users", cleanedStudentId),
    {
      classIds: arrayRemove(cleanedClassId),
      updatedAt: serverTimestamp(),
    },
  );
}

export function isStudentInClass(
  student: StudentDirectoryRecord,
  classId: string,
): boolean {
  return student.classIds.includes(classId);
}
