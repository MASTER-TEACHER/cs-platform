import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export type QuizIntegrityIncidentType =
  | "fullscreen_exit"
  | "fullscreen_restored"
  | "page_hidden"
  | "page_visible"
  | "auto_submit";

export type QuizIntegrityIncident = {
  id: string;
  type: QuizIntegrityIncidentType;
  occurredAt: string;
  questionNumber: number | null;
  detail: string;
};

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

  /*
   * Quiz delivery / integrity evidence.
   *
   * Practice assignments keep the default "practice" value.
   * Assessment quizzes may additionally save an integrity timeline.
   */
  deliveryMode?: "practice" | "assessment";
  integritySessionStartedAt?: string | null;
  integrityIncidents?: QuizIntegrityIncident[];
  integrityTerminated?: boolean;
  integrityTerminationReason?: string;
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
  deliveryMode = "practice",
  integritySessionStartedAt = null,
  integrityIncidents = [],
  integrityTerminated = false,
  integrityTerminationReason = "",
}: SaveAssignmentResultInput) {
  const resultId = `${assignmentId}_${studentId}`;

  const resultRef = doc(
    db,
    "assignmentResults",
    resultId,
  );

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

      deliveryMode,

      ...(deliveryMode === "assessment"
        ? {
            integritySessionStartedAt,
            integrityIncidents,
            integrityTerminated,
            integrityTerminationReason,
          }
        : {}),

      completedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );

  return resultId;
}