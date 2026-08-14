import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  AnalyticsQualification,
  GradeLabel,
} from "@/types/analytics";
import type { TargetGradeRecord } from "@/types/teacherAnalytics";

type FirestoreTargetGrade = {
  studentId?: string;
  targetGrade?: string | null;
  qualification?: string;
  teacherId?: string;
  classId?: string;
  updatedAt?: Timestamp | null;
};

function allowedGrades(
  qualification: AnalyticsQualification,
): GradeLabel[] {
  return qualification === "A_LEVEL"
    ? ["A*", "A", "B", "C", "D", "E"]
    : ["9", "8", "7", "6", "5", "4", "3", "2", "1"];
}

function normaliseGrade(
  value: unknown,
  qualification: AnalyticsQualification,
): GradeLabel | null {
  if (typeof value !== "string") return null;

  const cleaned = value.trim().toUpperCase();

  return allowedGrades(qualification).includes(cleaned as GradeLabel)
    ? (cleaned as GradeLabel)
    : null;
}

function normaliseQualification(value: unknown): AnalyticsQualification {
  return value === "A_LEVEL" ? "A_LEVEL" : "GCSE";
}

export function targetGradeDocumentId(studentId: string): string {
  return studentId.trim();
}

export async function getStudentTargetGrade(
  studentId: string,
): Promise<TargetGradeRecord | null> {
  const cleanedStudentId = studentId.trim();

  if (!cleanedStudentId) return null;

  const snapshot = await getDoc(
    doc(db, "studentTargets", targetGradeDocumentId(cleanedStudentId)),
  );

  if (!snapshot.exists()) return null;

  const data = snapshot.data() as FirestoreTargetGrade;
  const qualification = normaliseQualification(data.qualification);

  return {
    studentId: cleanedStudentId,
    targetGrade: normaliseGrade(data.targetGrade, qualification),
    qualification,
    teacherId:
      typeof data.teacherId === "string" ? data.teacherId : "",
    classId:
      typeof data.classId === "string" ? data.classId : "",
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : null,
  };
}

export async function saveStudentTargetGrade({
  studentId,
  targetGrade,
  qualification,
  teacherId,
  classId,
}: {
  studentId: string;
  targetGrade: GradeLabel | null;
  qualification: AnalyticsQualification;
  teacherId: string;
  classId: string;
}): Promise<void> {
  const cleanedStudentId = studentId.trim();
  const cleanedTeacherId = teacherId.trim();
  const cleanedClassId = classId.trim();

  if (!cleanedStudentId) {
    throw new Error("Select a valid student.");
  }

  if (!cleanedTeacherId) {
    throw new Error("A teacher account is required.");
  }

  if (!cleanedClassId) {
    throw new Error("A class is required.");
  }

  if (
    targetGrade !== null &&
    !allowedGrades(qualification).includes(targetGrade)
  ) {
    throw new Error("The target grade is not valid for this qualification.");
  }

  await setDoc(
    doc(db, "studentTargets", targetGradeDocumentId(cleanedStudentId)),
    {
      studentId: cleanedStudentId,
      targetGrade,
      qualification,
      teacherId: cleanedTeacherId,
      classId: cleanedClassId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export function getTargetGradeOptions(
  qualification: AnalyticsQualification,
): GradeLabel[] {
  return allowedGrades(qualification);
}
