import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type SaveAssignmentResultInput = {
  assignmentId: string;
  studentId: string;
  classId: string;
  teacherId: string;
  assignmentType: "lesson" | "quiz";
  resourceId: string;
  score?: number;
  totalQuestions?: number;
  percentage?: number;
  earnedXP?: number;
  timeTakenSeconds?: number;
};

export async function saveAssignmentResult({
  assignmentId,
  studentId,
  classId,
  teacherId,
  assignmentType,
  resourceId,
  score = 0,
  totalQuestions = 0,
  percentage = 0,
  earnedXP = 0,
  timeTakenSeconds = 0,
}: SaveAssignmentResultInput) {
  const resultId = `${assignmentId}_${studentId}`;

  const resultRef = doc(db, "assignmentResults", resultId);

  await setDoc(
    resultRef,
    {
      assignmentId,
      studentId,
      classId,
      teacherId,
      assignmentType,
      resourceId,
      score,
      totalQuestions,
      percentage,
      earnedXP,
      timeTakenSeconds,
      status: "completed",
      completedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return resultId;
}