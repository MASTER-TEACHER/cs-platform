import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  InteractiveLessonProgress,
  LessonExamMarkingResult,
  PracticeResponse,
} from "@/types/interactiveLesson";

type FirestoreExamMarking = Omit<LessonExamMarkingResult, "markedAt"> & {
  markedAt?: Timestamp | null;
};

type FirestoreLessonProgress = Omit<
  InteractiveLessonProgress,
  "id" | "startedAt" | "updatedAt" | "completedAt" | "reviewAt" | "examMarking"
> & {
  startedAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  completedAt?: Timestamp | null;
  reviewAt?: Timestamp | null;
  examMarking?: FirestoreExamMarking | null;
};

function toDate(value?: Timestamp | null): Date | null {
  return value?.toDate ? value.toDate() : null;
}

function convertExamMarking(
  value?: FirestoreExamMarking | null,
): LessonExamMarkingResult | null {
  if (!value) return null;

  return {
    mode: value.mode,
    awardedMarks: value.awardedMarks ?? 0,
    maximumMarks: value.maximumMarks ?? 0,
    percentage: value.percentage ?? 0,
    confidence: value.confidence ?? "low",
    matchedPoints: value.matchedPoints ?? [],
    missingPoints: value.missingPoints ?? [],
    feedback: value.feedback ?? "",
    improvedAnswer: value.improvedAnswer ?? "",
    teacherReviewRequired: value.teacherReviewRequired ?? true,
    markedAt: toDate(value.markedAt),
  };
}

export function calculateResponseAccuracy(
  responses: PracticeResponse[],
): number {
  const checked = responses.filter((response) => response.checked);
  if (checked.length === 0) return 0;

  const correct = checked.filter((response) => response.correct).length;
  return Math.round((correct / checked.length) * 100);
}

export function calculateOverallLessonAccuracy(
  practiceResponses: PracticeResponse[],
  checkpointResponses: PracticeResponse[],
  examAccuracy = 0,
  examMarked = false,
): number {
  const checked = [...practiceResponses, ...checkpointResponses].filter(
    (response) => response.checked,
  );

  const objectiveScores = checked.map((response) =>
    response.correct ? 100 : 0,
  );

  const allScores = examMarked
    ? [...objectiveScores, examAccuracy]
    : objectiveScores;

  if (allScores.length === 0) return 0;

  return Math.round(
    allScores.reduce((sum, score) => sum + score, 0) / allScores.length,
  );
}

export function calculateLessonMasteryImpact(overallAccuracy: number): number {
  if (overallAccuracy >= 90) return 8;
  if (overallAccuracy >= 75) return 6;
  if (overallAccuracy >= 60) return 4;
  if (overallAccuracy >= 40) return 2;
  return 1;
}

export function calculateLessonReviewDate(
  overallAccuracy: number,
  fromDate = new Date(),
): Date {
  const reviewDays =
    overallAccuracy >= 90
      ? 7
      : overallAccuracy >= 75
        ? 5
        : overallAccuracy >= 60
          ? 3
          : 1;

  const reviewAt = new Date(fromDate);
  reviewAt.setDate(reviewAt.getDate() + reviewDays);
  return reviewAt;
}

export function createLessonProgressId(
  studentId: string,
  lessonId: string,
): string {
  return `${studentId}_${lessonId}`;
}

export async function getLessonProgress(
  studentId: string,
  lessonId: string,
): Promise<InteractiveLessonProgress | null> {
  const cleanedStudentId = studentId.trim();
  const cleanedLessonId = lessonId.trim();

  if (!cleanedStudentId || !cleanedLessonId) return null;

  const progressId = createLessonProgressId(cleanedStudentId, cleanedLessonId);
  const snapshot = await getDoc(doc(db, "lessonProgress", progressId));

  if (!snapshot.exists()) return null;

  const data = snapshot.data() as FirestoreLessonProgress;

  return {
    id: snapshot.id,
    studentId: data.studentId,
    lessonId: data.lessonId,
    topicId: data.topicId,
    currentStepIndex: data.currentStepIndex ?? 0,
    completedStepIds: data.completedStepIds ?? [],
    practiceResponses: data.practiceResponses ?? [],
    checkpointResponses: data.checkpointResponses ?? [],
    examResponse: data.examResponse ?? "",
    examMarking: convertExamMarking(data.examMarking),
    reflection: data.reflection ?? "",
    audioEnabled: data.audioEnabled ?? false,
    audioRate: data.audioRate ?? 1,
    selectedVoiceName: data.selectedVoiceName ?? "",
    practiceAccuracy: data.practiceAccuracy ?? 0,
    checkpointAccuracy: data.checkpointAccuracy ?? 0,
    examAccuracy: data.examAccuracy ?? 0,
    overallAccuracy: data.overallAccuracy ?? 0,
    masteryImpact: data.masteryImpact ?? 0,
    reviewAt: toDate(data.reviewAt),
    status: data.status ?? "in_progress",
    startedAt: toDate(data.startedAt),
    updatedAt: toDate(data.updatedAt),
    completedAt: toDate(data.completedAt),
  };
}

export async function saveLessonProgress(
  progress: InteractiveLessonProgress,
): Promise<void> {
  await setDoc(
    doc(db, "lessonProgress", progress.id),
    {
      studentId: progress.studentId,
      lessonId: progress.lessonId,
      topicId: progress.topicId,
      currentStepIndex: progress.currentStepIndex,
      completedStepIds: progress.completedStepIds,
      practiceResponses: progress.practiceResponses,
      checkpointResponses: progress.checkpointResponses,
      examResponse: progress.examResponse,
      examMarking: progress.examMarking
        ? {
            ...progress.examMarking,
            markedAt: progress.examMarking.markedAt
              ? Timestamp.fromDate(progress.examMarking.markedAt)
              : serverTimestamp(),
          }
        : null,
      reflection: progress.reflection,
      audioEnabled: progress.audioEnabled,
      audioRate: progress.audioRate,
      selectedVoiceName: progress.selectedVoiceName,
      practiceAccuracy: progress.practiceAccuracy,
      checkpointAccuracy: progress.checkpointAccuracy,
      examAccuracy: progress.examAccuracy,
      overallAccuracy: progress.overallAccuracy,
      masteryImpact: progress.masteryImpact,
      reviewAt: progress.reviewAt
        ? Timestamp.fromDate(progress.reviewAt)
        : null,
      status: progress.status,
      startedAt: progress.startedAt
        ? Timestamp.fromDate(progress.startedAt)
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
      completedAt: progress.completedAt
        ? Timestamp.fromDate(progress.completedAt)
        : null,
    },
    { merge: true },
  );
}
