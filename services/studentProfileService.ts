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
import { UserProfile } from "@/types/database";

export type StudentDirectoryRecord = {
  uid: string;
  name: string;
  email: string;
  role: "student";

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

  return value.filter((item): item is string => typeof item === "string");
}

function convertToStudentRecord(
  profile: Partial<UserProfile>,
  fallbackUid: string,
): StudentDirectoryRecord {
  return {
    uid: normaliseString(profile.uid) || fallbackUid,

    name: normaliseString(profile.name) || "Unnamed Student",

    email: normaliseString(profile.email).toLowerCase(),

    role: "student",

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
 * Returns every registered student account.
 *
 * Search and filtering can be performed in the UI so that
 * no additional Firestore search service is required.
 */
export async function getAllStudents(): Promise<StudentDirectoryRecord[]> {
  const studentsQuery = query(
    collection(db, "users"),
    where("role", "==", "student"),
  );

  const snapshot = await getDocs(studentsQuery);

  const students = snapshot.docs.map((studentDocument) =>
    convertToStudentRecord(
      studentDocument.data() as Partial<UserProfile>,
      studentDocument.id,
    ),
  );

  return students.sort((studentA, studentB) =>
    studentA.name.localeCompare(studentB.name, "en-GB", {
      sensitivity: "base",
    }),
  );
}

/**
 * Returns a single registered student.
 */
export async function getStudentById(
  studentId: string,
): Promise<StudentDirectoryRecord | null> {
  const cleanedStudentId = studentId.trim();

  if (!cleanedStudentId) {
    return null;
  }

  const studentReference = doc(db, "users", cleanedStudentId);

  const snapshot = await getDoc(studentReference);

  if (!snapshot.exists()) {
    return null;
  }

  const profile = snapshot.data() as Partial<UserProfile>;

  if (profile.role !== "student") {
    return null;
  }

  return convertToStudentRecord(profile, snapshot.id);
}

/**
 * Returns the student accounts linked to a specific class.
 */
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

  const students = snapshot.docs.map((studentDocument) =>
    convertToStudentRecord(
      studentDocument.data() as Partial<UserProfile>,
      studentDocument.id,
    ),
  );

  return students.sort((studentA, studentB) =>
    studentA.name.localeCompare(studentB.name, "en-GB", {
      sensitivity: "base",
    }),
  );
}

/**
 * Filters a loaded student list by name or email.
 *
 * This is intentionally performed locally because Firestore does not
 * provide native case-insensitive contains searches.
 */
export function searchStudents(
  students: StudentDirectoryRecord[],
  searchTerm: string,
): StudentDirectoryRecord[] {
  const cleanedSearchTerm = searchTerm.trim().toLowerCase();

  if (!cleanedSearchTerm) {
    return students;
  }

  return students.filter((student) => {
    const name = student.name.toLowerCase();

    const email = student.email.toLowerCase();

    return (
      name.includes(cleanedSearchTerm) || email.includes(cleanedSearchTerm)
    );
  });
}

/**
 * Adds a class ID to a student's profile.
 */
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
    throw new Error("The selected student account could not be found.");
  }

  const profile = snapshot.data() as Partial<UserProfile>;

  if (profile.role !== "student") {
    throw new Error("Only student accounts can be enrolled in a class.");
  }

  await updateDoc(studentReference, {
    classIds: arrayUnion(cleanedClassId),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Removes a class ID from a student's profile.
 */
export async function removeClassFromStudent(
  studentId: string,
  classId: string,
): Promise<void> {
  const cleanedStudentId = studentId.trim();

  const cleanedClassId = classId.trim();

  if (!cleanedStudentId || !cleanedClassId) {
    throw new Error("A valid student and class are required.");
  }

  await updateDoc(doc(db, "users", cleanedStudentId), {
    classIds: arrayRemove(cleanedClassId),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Returns true when the student already belongs to the class.
 */
export function isStudentInClass(
  student: StudentDirectoryRecord,
  classId: string,
): boolean {
  return student.classIds.includes(classId);
}
