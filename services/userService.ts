import type { User } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { UserProfile, UserRole } from "@/types/database";
import type { ExamBoard, Qualification } from "@/types/user";

type FirestoreUserProfile = Omit<
  UserProfile,
  "createdAt" | "updatedAt" | "qualification" | "examBoard"
> & {
  qualification?: string | null;
  examBoard?: string | null;
  onboardingComplete?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type CreateUserProfileInput = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
};

export type UserCourseSelection = {
  qualification: string;
  examBoard: string;
  currentCourse?: string;
};

function normaliseString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normaliseEmail(value: unknown): string {
  return normaliseString(value).toLowerCase();
}

function normaliseQualification(value: unknown): Qualification | "" {
  if (value === "GCSE" || value === "A_LEVEL") {
    return value;
  }

  return "";
}

function normaliseExamBoard(value: unknown): ExamBoard | "" {
  if (value === "AQA" || value === "OCR" || value === "EDEXCEL") {
    return value;
  }

  return "";
}

function normaliseStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function timestampToDate(value: unknown): Date {
  return value instanceof Timestamp ? value.toDate() : new Date();
}

function inferNameFromEmail(email: string): string {
  const localPart = email.split("@")[0] || "";

  const inferred = localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();

  return inferred || "Student";
}

function isUserRole(value: unknown): value is UserRole {
  return value === "student" || value === "teacher" || value === "admin";
}

function convertUserProfile(
  documentId: string,
  data: Partial<FirestoreUserProfile>,
): UserProfile {
  const email = normaliseEmail(data.email);

  const qualification = normaliseQualification(data.qualification);

  const examBoard = normaliseExamBoard(data.examBoard);

  return {
    uid: normaliseString(data.uid) || documentId,

    name: normaliseString(data.name) || inferNameFromEmail(email),

    email,

    role: isUserRole(data.role) ? data.role : "student",

    classIds: normaliseStringArray(data.classIds),

    qualification,

    examBoard,

    currentCourse: normaliseString(data.currentCourse),

    onboardingComplete:
      typeof data.onboardingComplete === "boolean"
        ? data.onboardingComplete
        : Boolean(qualification && examBoard),

    xp: typeof data.xp === "number" ? data.xp : 0,

    streak: typeof data.streak === "number" ? data.streak : 0,

    completedLessons: normaliseStringArray(data.completedLessons),

    completedTopics: normaliseStringArray(data.completedTopics),

    completedUnits: normaliseStringArray(data.completedUnits),

    completedPapers: normaliseStringArray(data.completedPapers),

    badges: normaliseStringArray(data.badges),

    createdAt: timestampToDate(data.createdAt),

    updatedAt: timestampToDate(data.updatedAt),
  };
}

export async function createUserProfile({
  uid,
  name,
  email,
  role,
}: CreateUserProfileInput): Promise<void> {
  const cleanedUid = uid.trim();
  const cleanedName = name.trim();
  const cleanedEmail = email.trim().toLowerCase();

  if (!cleanedUid) {
    throw new Error("A valid user ID is required.");
  }

  if (!cleanedName) {
    throw new Error("A full name is required.");
  }

  if (!cleanedEmail) {
    throw new Error("A valid email address is required.");
  }

  await setDoc(doc(db, "users", cleanedUid), {
    uid: cleanedUid,
    name: cleanedName,
    email: cleanedEmail,
    role,

    classIds: [],

    qualification: null,
    examBoard: null,
    currentCourse: "",
    onboardingComplete: role !== "student",

    xp: 0,
    streak: 0,

    completedLessons: [],
    completedTopics: [],
    completedUnits: [],
    completedPapers: [],

    badges: [],

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserCourseSelection(
  uid: string,
  selection: UserCourseSelection,
): Promise<void>;

export async function updateUserCourseSelection(
  uid: string,
  qualification: string,
  examBoard: string,
): Promise<void>;

export async function updateUserCourseSelection(
  uid: string,
  qualification: string,
  examBoard: string,
  currentCourse: string,
): Promise<void>;

export async function updateUserCourseSelection(
  uid: string,
  selectionOrQualification: UserCourseSelection | string,
  examBoard?: string,
  currentCourse?: string,
): Promise<void> {
  const cleanedUid = uid.trim();

  if (!cleanedUid) {
    throw new Error("A valid user ID is required.");
  }

  const selection =
    typeof selectionOrQualification === "string"
      ? {
          qualification: selectionOrQualification,
          examBoard: examBoard || "",
          currentCourse: currentCourse || "",
        }
      : selectionOrQualification;

  const cleanedQualification = selection.qualification.trim();

  const cleanedExamBoard = selection.examBoard.trim();

  const cleanedCurrentCourse = selection.currentCourse?.trim() || "";

  if (cleanedQualification !== "GCSE" && cleanedQualification !== "A_LEVEL") {
    throw new Error("Select either GCSE or A-level.");
  }

  if (
    cleanedExamBoard !== "AQA" &&
    cleanedExamBoard !== "OCR" &&
    cleanedExamBoard !== "EDEXCEL"
  ) {
    throw new Error("Select AQA, OCR or Pearson Edexcel.");
  }

  const updateData: Record<string, unknown> = {
    qualification: cleanedQualification,
    examBoard: cleanedExamBoard,
    onboardingComplete: true,
    updatedAt: serverTimestamp(),
  };

  if (cleanedCurrentCourse) {
    updateData.currentCourse = cleanedCurrentCourse;
  }

  await updateDoc(doc(db, "users", cleanedUid), updateData);
}

export async function ensureUserProfile(
  firebaseUser: User,
): Promise<UserProfile> {
  const reference = doc(db, "users", firebaseUser.uid);

  const snapshot = await getDoc(reference);

  const authenticationEmail = normaliseEmail(firebaseUser.email);

  const authenticationName = normaliseString(firebaseUser.displayName);

  if (!snapshot.exists()) {
    const fallbackName =
      authenticationName || inferNameFromEmail(authenticationEmail);

    await createUserProfile({
      uid: firebaseUser.uid,
      name: fallbackName,
      email: authenticationEmail,
      role: "student",
    });

    const createdSnapshot = await getDoc(reference);

    if (!createdSnapshot.exists()) {
      throw new Error("The user profile could not be created.");
    }

    return convertUserProfile(
      createdSnapshot.id,
      createdSnapshot.data() as Partial<FirestoreUserProfile>,
    );
  }

  const existing = snapshot.data() as Partial<FirestoreUserProfile>;
  const existingRole = isUserRole(existing.role) ? existing.role : "student";

  if (existingRole === "teacher" || existingRole === "admin") {
    return convertUserProfile(snapshot.id, existing);
  }
  const existingEmail = normaliseEmail(existing.email);

  const existingName = normaliseString(existing.name);

  const repairedEmail = existingEmail || authenticationEmail;

  const repairedName =
    existingName || authenticationName || inferNameFromEmail(repairedEmail);

  const repairData: Record<string, unknown> = {};

  if (normaliseString(existing.uid) !== firebaseUser.uid) {
    repairData.uid = firebaseUser.uid;
  }

  if (!existingName) {
    repairData.name = repairedName;
  }

  if (!existingEmail) {
    repairData.email = repairedEmail;
  }

  if (!isUserRole(existing.role)) {
    repairData.role = "student";
  }

  if (!Array.isArray(existing.classIds)) {
    repairData.classIds = [];
  }

  if (existing.qualification === undefined) {
    repairData.qualification = null;
  }

  if (existing.examBoard === undefined) {
    repairData.examBoard = null;
  }

  if (typeof existing.currentCourse !== "string") {
    repairData.currentCourse = "";
  }

  if (typeof existing.onboardingComplete !== "boolean") {
    const hasCourse =
      Boolean(normaliseString(existing.qualification)) &&
      Boolean(normaliseString(existing.examBoard));

    repairData.onboardingComplete =
      existing.role === "teacher" || existing.role === "admin" || hasCourse;
  }

  if (typeof existing.xp !== "number") {
    repairData.xp = 0;
  }

  if (typeof existing.streak !== "number") {
    repairData.streak = 0;
  }

  if (!Array.isArray(existing.completedLessons)) {
    repairData.completedLessons = [];
  }

  if (!Array.isArray(existing.completedTopics)) {
    repairData.completedTopics = [];
  }

  if (!Array.isArray(existing.completedUnits)) {
    repairData.completedUnits = [];
  }

  if (!Array.isArray(existing.completedPapers)) {
    repairData.completedPapers = [];
  }

  if (!Array.isArray(existing.badges)) {
    repairData.badges = [];
  }

  if (Object.keys(repairData).length > 0) {
    console.log(
  "PROFILE REPAIR DIAGNOSTIC:",
  Object.keys(repairData),
);
    await setDoc(
      reference,
      {
        ...repairData,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );
  }

  return convertUserProfile(snapshot.id, {
    ...existing,
    ...repairData,
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const cleanedUid = uid.trim();

  if (!cleanedUid) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "users", cleanedUid));

  if (!snapshot.exists()) {
    return null;
  }

  return convertUserProfile(
    snapshot.id,
    snapshot.data() as Partial<FirestoreUserProfile>,
  );
}
