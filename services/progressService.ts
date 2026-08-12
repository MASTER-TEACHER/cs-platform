import {
  arrayUnion,
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { getUnlockedAchievements } from "@/lib/achievementEngine";
import {
  calculateLessonMasteryImpact,
  calculateLessonReviewDate,
  calculateOverallLessonAccuracy,
  calculateResponseAccuracy,
} from "@/services/lessonProgressService";
import type {
  InteractiveLessonProgress,
  LessonCompletionSummary,
} from "@/types/interactiveLesson";

type CompleteLessonInput = {
  uid: string;
  lessonId: string;
  topicId: string;
  xpReward?: number;
  progress: InteractiveLessonProgress;
};

export async function completeLesson({
  uid,
  lessonId,
  topicId,
  xpReward = 50,
  progress,
}: CompleteLessonInput): Promise<
  LessonCompletionSummary & {
    unlockedAchievements: ReturnType<typeof getUnlockedAchievements>;
  }
> {
  if (!progress.examMarking) {
    throw new Error(
      "Mark the exam-style response before completing the lesson.",
    );
  }

  const userReference = doc(db, "users", uid);

  const progressReference = doc(db, "lessonProgress", progress.id);

  const practiceAccuracy = calculateResponseAccuracy(
    progress.practiceResponses,
  );

  const checkpointAccuracy = calculateResponseAccuracy(
    progress.checkpointResponses,
  );

  const examAccuracy = progress.examMarking.percentage;

  const overallAccuracy = calculateOverallLessonAccuracy(
    progress.practiceResponses,
    progress.checkpointResponses,
    examAccuracy,
    true,
  );

  const masteryImpact = calculateLessonMasteryImpact(overallAccuracy);

  const reviewAt = calculateLessonReviewDate(overallAccuracy);

  const completedAt = new Date();

  const examMarking = progress.examMarking;

  const firestoreExamMarking = {
    ...examMarking,

    markedAt: examMarking.markedAt
      ? Timestamp.fromDate(examMarking.markedAt)
      : serverTimestamp(),
  };

  return runTransaction(db, async (transaction) => {
    /*
     * All reads must happen before any writes.
     */
    const [userSnapshot, progressSnapshot] = await Promise.all([
      transaction.get(userReference),

      transaction.get(progressReference),
    ]);

    if (!userSnapshot.exists()) {
      throw new Error("User profile not found.");
    }

    const profile = userSnapshot.data();

    const completedLessons: string[] = Array.isArray(profile.completedLessons)
      ? profile.completedLessons.filter(
          (lessonValue): lessonValue is string =>
            typeof lessonValue === "string",
        )
      : [];

    const progressAlreadyCompleted =
      progressSnapshot.exists() &&
      progressSnapshot.data().status === "completed";

    const alreadyCompleted =
      completedLessons.includes(lessonId) || progressAlreadyCompleted;

    const currentXP =
      typeof profile.xp === "number" && Number.isFinite(profile.xp)
        ? profile.xp
        : 0;

    const badges: string[] = Array.isArray(profile.badges)
      ? profile.badges.filter(
          (badgeValue): badgeValue is string => typeof badgeValue === "string",
        )
      : [];

    const updatedProfile = {
      ...profile,

      xp: alreadyCompleted ? currentXP : currentXP + xpReward,

      completedLessons: alreadyCompleted
        ? completedLessons
        : [...completedLessons, lessonId],

      badges,
    };

    const unlockedAchievements = alreadyCompleted
      ? []
      : getUnlockedAchievements(updatedProfile);

    /*
     * Writes begin after all reads.
     */
    transaction.set(
      progressReference,
      {
        studentId: uid,
        lessonId,
        topicId,

        currentStepIndex: progress.currentStepIndex,

        completedStepIds: progress.completedStepIds,

        practiceResponses: progress.practiceResponses,

        checkpointResponses: progress.checkpointResponses,

        examResponse: progress.examResponse,

        examMarking: firestoreExamMarking,

        reflection: progress.reflection,

        audioEnabled: progress.audioEnabled,

        audioRate: progress.audioRate,

        selectedVoiceName: progress.selectedVoiceName,

        practiceAccuracy,
        checkpointAccuracy,
        examAccuracy,
        overallAccuracy,
        masteryImpact,

        reviewAt: Timestamp.fromDate(reviewAt),

        status: "completed",

        startedAt: progress.startedAt
          ? Timestamp.fromDate(progress.startedAt)
          : serverTimestamp(),

        completedAt: Timestamp.fromDate(completedAt),

        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      },
    );

    if (!alreadyCompleted) {
      const achievementIds = unlockedAchievements.map(
        (achievement) => achievement.id,
      );

      const userUpdate: {
        completedLessons: ReturnType<typeof arrayUnion>;
        xp: number;
        updatedAt: ReturnType<typeof serverTimestamp>;
        badges?: ReturnType<typeof arrayUnion>;
      } = {
        completedLessons: arrayUnion(lessonId),

        xp: currentXP + xpReward,

        updatedAt: serverTimestamp(),
      };

      /*
       * Avoid calling arrayUnion()
       * with no values.
       */
      if (achievementIds.length > 0) {
        userUpdate.badges = arrayUnion(...achievementIds);
      }

      transaction.update(userReference, userUpdate);
    }

    return {
      alreadyCompleted,

      xpAwarded: alreadyCompleted ? 0 : xpReward,

      practiceAccuracy,
      checkpointAccuracy,
      examAccuracy,
      overallAccuracy,
      masteryImpact,
      reviewAt,
      unlockedAchievements,
    };
  });
}
