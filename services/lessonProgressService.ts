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

type FirestoreExamMarking = Omit<
  LessonExamMarkingResult,
  "markedAt"
> & {
  markedAt?: Timestamp | null;
};

type FirestoreLessonProgress = Omit<
  InteractiveLessonProgress,
  | "id"
  | "startedAt"
  | "updatedAt"
  | "completedAt"
  | "reviewAt"
  | "examMarking"
> & {
  startedAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
  completedAt?: Timestamp | null;
  reviewAt?: Timestamp | null;
  examMarking?: FirestoreExamMarking | null;
};

function toDate(
  value?: Timestamp | null,
): Date | null {
  return value?.toDate
    ? value.toDate()
    : null;
}

function convertExamMarking(
  value?: FirestoreExamMarking | null,
): LessonExamMarkingResult | null {
  if (!value) {
    return null;
  }

  return {
    mode: value.mode,
    awardedMarks:
      value.awardedMarks ?? 0,
    maximumMarks:
      value.maximumMarks ?? 0,
    percentage:
      value.percentage ?? 0,
    confidence:
      value.confidence ?? "low",
    matchedPoints:
      value.matchedPoints ?? [],
    missingPoints:
      value.missingPoints ?? [],
    feedback:
      value.feedback ?? "",
    improvedAnswer:
      value.improvedAnswer ?? "",
    teacherReviewRequired:
      value.teacherReviewRequired ??
      true,
    markedAt:
      toDate(value.markedAt),
  };
}

function mergeCompletedStepIds(
  existing: string[],
  incoming: string[],
): string[] {
  return Array.from(
    new Set([
      ...existing,
      ...incoming,
    ]),
  );
}

export function calculateResponseAccuracy(
  responses: PracticeResponse[],
): number {
  const checked =
    responses.filter(
      (response) =>
        response.checked,
    );

  if (checked.length === 0) {
    return 0;
  }

  const correct =
    checked.filter(
      (response) =>
        response.correct,
    ).length;

  return Math.round(
    (correct / checked.length) *
      100,
  );
}

export function calculateOverallLessonAccuracy(
  practiceResponses: PracticeResponse[],
  checkpointResponses: PracticeResponse[],
  examAccuracy = 0,
  examMarked = false,
): number {
  const checked = [
    ...practiceResponses,
    ...checkpointResponses,
  ].filter(
    (response) =>
      response.checked,
  );

  const objectiveScores =
    checked.map(
      (response) =>
        response.correct
          ? 100
          : 0,
    );

  const allScores =
    examMarked
      ? [
          ...objectiveScores,
          examAccuracy,
        ]
      : objectiveScores;

  if (allScores.length === 0) {
    return 0;
  }

  return Math.round(
    allScores.reduce(
      (sum, score) =>
        sum + score,
      0,
    ) / allScores.length,
  );
}

export function calculateLessonMasteryImpact(
  overallAccuracy: number,
): number {
  if (overallAccuracy >= 90) {
    return 8;
  }

  if (overallAccuracy >= 75) {
    return 6;
  }

  if (overallAccuracy >= 60) {
    return 4;
  }

  if (overallAccuracy >= 40) {
    return 2;
  }

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

  const reviewAt =
    new Date(fromDate);

  reviewAt.setDate(
    reviewAt.getDate() +
      reviewDays,
  );

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
  const cleanedStudentId =
    studentId.trim();

  const cleanedLessonId =
    lessonId.trim();

  if (
    !cleanedStudentId ||
    !cleanedLessonId
  ) {
    return null;
  }

  const progressId =
    createLessonProgressId(
      cleanedStudentId,
      cleanedLessonId,
    );

  const snapshot =
    await getDoc(
      doc(
        db,
        "lessonProgress",
        progressId,
      ),
    );

  if (!snapshot.exists()) {
    return null;
  }

  const data =
    snapshot.data() as FirestoreLessonProgress;

  return {
    id: snapshot.id,
    studentId:
      data.studentId,
    lessonId:
      data.lessonId,
    topicId:
      data.topicId,
    currentStepIndex:
      data.currentStepIndex ?? 0,
    completedStepIds:
      data.completedStepIds ?? [],
    practiceResponses:
      data.practiceResponses ?? [],
    checkpointResponses:
      data.checkpointResponses ?? [],
    examResponse:
      data.examResponse ?? "",
    examMarking:
      convertExamMarking(
        data.examMarking,
      ),
    reflection:
      data.reflection ?? "",
    audioEnabled:
      data.audioEnabled ?? false,
    audioRate:
      data.audioRate ?? 1,
    selectedVoiceName:
      data.selectedVoiceName ?? "",
    practiceAccuracy:
      data.practiceAccuracy ?? 0,
    checkpointAccuracy:
      data.checkpointAccuracy ?? 0,
    examAccuracy:
      data.examAccuracy ?? 0,
    overallAccuracy:
      data.overallAccuracy ?? 0,
    masteryImpact:
      data.masteryImpact ?? 0,
    reviewAt:
      toDate(data.reviewAt),
    status:
      data.status ??
      "in_progress",
    startedAt:
      toDate(data.startedAt),
    updatedAt:
      toDate(data.updatedAt),
    completedAt:
      toDate(data.completedAt),
  };
}

export async function saveLessonProgress(
  progress: InteractiveLessonProgress,
): Promise<void> {
  const progressRef =
    doc(
      db,
      "lessonProgress",
      progress.id,
    );

  /*
   * Read the latest persisted document first.
   *
   * We intentionally avoid a Firestore transaction here.
   * Lesson progress is autosaved frequently and rapid sequential
   * transactional saves can produce failed-precondition errors.
   *
   * This document is owned by one student's lesson session, so a
   * read + merge write gives us the monotonic behaviour we need
   * without the additional transaction precondition.
   */
  const snapshot =
    await getDoc(
      progressRef,
    );

  const existing =
    snapshot.exists()
      ? (snapshot.data() as FirestoreLessonProgress)
      : null;

  /*
   * The stored step is monotonic.
   *
   * Students may navigate backwards for revision, but doing so
   * must never reduce their persisted furthest step.
   */
  const existingStepIndex =
    existing?.currentStepIndex ??
    0;

  const persistedStepIndex =
    Math.max(
      existingStepIndex,
      progress.currentStepIndex,
    );

  /*
   * Completed steps are monotonic as well.
   */
  const completedStepIds =
    mergeCompletedStepIds(
      existing?.completedStepIds ??
        [],
      progress.completedStepIds,
    );

  /*
   * Once completed, a lesson cannot accidentally return to
   * in_progress simply because an earlier step is revisited.
   */
  const persistedStatus =
    existing?.status ===
      "completed" ||
    progress.status ===
      "completed"
      ? "completed"
      : progress.status;

  /*
   * Preserve the original completion timestamp once set.
   */
  const completedAt =
    existing?.completedAt ??
    (
      progress.completedAt
        ? Timestamp.fromDate(
            progress.completedAt,
          )
        : null
    );

  /*
   * Preserve the original lesson-start timestamp.
   */
  const startedAt =
    existing?.startedAt ??
    (
      progress.startedAt
        ? Timestamp.fromDate(
            progress.startedAt,
          )
        : serverTimestamp()
    );

  /*
   * Preserve the strongest available exam marking if the current
   * save does not contain one.
   */
  const examMarking =
    progress.examMarking
      ? {
          ...progress.examMarking,

          markedAt:
            progress.examMarking
              .markedAt
              ? Timestamp.fromDate(
                  progress
                    .examMarking
                    .markedAt,
                )
              : serverTimestamp(),
        }
      : existing?.examMarking ??
        null;

  /*
   * Persist review scheduling without erasing an existing review
   * date when the current UI state does not provide one.
   */
  const reviewAt =
    progress.reviewAt
      ? Timestamp.fromDate(
          progress.reviewAt,
        )
      : existing?.reviewAt ??
        null;

  await setDoc(
    progressRef,
    {
      studentId:
        progress.studentId,

      lessonId:
        progress.lessonId,

      topicId:
        progress.topicId,

      currentStepIndex:
        persistedStepIndex,

      completedStepIds,

      practiceResponses:
        progress.practiceResponses,

      checkpointResponses:
        progress.checkpointResponses,

      examResponse:
        progress.examResponse,

      examMarking,

      reflection:
        progress.reflection,

      audioEnabled:
        progress.audioEnabled,

      audioRate:
        progress.audioRate,

      selectedVoiceName:
        progress.selectedVoiceName,

      /*
       * Keep the strongest achievement evidence already recorded.
       */
      practiceAccuracy:
        Math.max(
          existing
            ?.practiceAccuracy ??
            0,
          progress.practiceAccuracy,
        ),

      checkpointAccuracy:
        Math.max(
          existing
            ?.checkpointAccuracy ??
            0,
          progress.checkpointAccuracy,
        ),

      examAccuracy:
        Math.max(
          existing
            ?.examAccuracy ??
            0,
          progress.examAccuracy,
        ),

      overallAccuracy:
        Math.max(
          existing
            ?.overallAccuracy ??
            0,
          progress.overallAccuracy,
        ),

      masteryImpact:
        Math.max(
          existing
            ?.masteryImpact ??
            0,
          progress.masteryImpact,
        ),

      reviewAt,

      status:
        persistedStatus,

      startedAt,

      updatedAt:
        serverTimestamp(),

      completedAt,
    },
    {
      merge: true,
    },
  );
}