import "server-only";

import { NextResponse } from "next/server";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { topicLibrary } from "@/data/curriculum/topics";
import { getUnlockedAchievements } from "@/lib/achievementEngine";
import {
  calculateLessonMasteryImpact,
  calculateLessonReviewDate,
  calculateOverallLessonAccuracy,
  calculateResponseAccuracy,
} from "@/services/lessonProgressService";
import type {
  InteractiveLessonProgress,
} from "@/types/interactiveLesson";

type CompleteLessonRequest = {
  lessonId: string;
  topicId: string;
  progress: InteractiveLessonProgress;
};

function getBearerToken(request: Request): string {
  const authorization =
    request.headers.get("authorization") ?? "";

  if (!authorization.startsWith("Bearer ")) {
    return "";
  }

  return authorization
    .slice("Bearer ".length)
    .trim();
}

function findLesson(
  topicId: string,
  lessonId: string,
) {
  const topic =
    topicLibrary[topicId];

  if (!topic) {
    return null;
  }

  const lesson =
    topic.lessons.find(
      (candidate) =>
        candidate.id === lessonId,
    );

  if (!lesson) {
    return null;
  }

  return {
    topic,
    lesson,
  };
}

function serialiseDate(
  value: Date,
): string {
  return value.toISOString();
}

export async function POST(
  request: Request,
) {
  try {
    const token =
      getBearerToken(request);

    if (!token) {
      return NextResponse.json(
        {
          error:
            "Authentication is required.",
        },
        {
          status: 401,
        },
      );
    }

    const decodedToken =
      await adminAuth.verifyIdToken(
        token,
      );

    const uid =
      decodedToken.uid;

    const body =
      (await request.json()) as CompleteLessonRequest;

    if (
      !body ||
      typeof body.lessonId !==
        "string" ||
      typeof body.topicId !==
        "string" ||
      !body.progress
    ) {
      return NextResponse.json(
        {
          error:
            "A valid lesson completion request is required.",
        },
        {
          status: 400,
        },
      );
    }

    const lessonId =
      body.lessonId.trim();

    const topicId =
      body.topicId.trim();

    if (
      !lessonId ||
      !topicId
    ) {
      return NextResponse.json(
        {
          error:
            "Lesson and topic identifiers are required.",
        },
        {
          status: 400,
        },
      );
    }

    const resolved =
      findLesson(
        topicId,
        lessonId,
      );

    if (!resolved) {
      return NextResponse.json(
        {
          error:
            "The requested lesson could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const {
      lesson,
    } = resolved;

    const progress =
      body.progress;

    if (
      progress.studentId &&
      progress.studentId !== uid
    ) {
      return NextResponse.json(
        {
          error:
            "The lesson progress does not belong to the signed-in student.",
        },
        {
          status: 403,
        },
      );
    }

    if (
      progress.lessonId &&
      progress.lessonId !== lessonId
    ) {
      return NextResponse.json(
        {
          error:
            "The lesson progress does not match the requested lesson.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      progress.topicId &&
      progress.topicId !== topicId
    ) {
      return NextResponse.json(
        {
          error:
            "The lesson progress does not match the requested topic.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !progress.examMarking
    ) {
      return NextResponse.json(
        {
          error:
            "Mark the exam-style response before completing the lesson.",
        },
        {
          status: 400,
        },
      );
    }
const examMarking =
  progress.examMarking;

    const xpReward =
      typeof lesson.xpReward ===
        "number" &&
      Number.isFinite(
        lesson.xpReward,
      )
        ? Math.max(
            0,
            Math.round(
              lesson.xpReward,
            ),
          )
        : 50;

    const practiceAccuracy =
      calculateResponseAccuracy(
        progress.practiceResponses ??
          [],
      );

    const checkpointAccuracy =
      calculateResponseAccuracy(
        progress.checkpointResponses ??
          [],
      );

    const examAccuracy =
      progress.examMarking.percentage ??
      0;

    const overallAccuracy =
      calculateOverallLessonAccuracy(
        progress.practiceResponses ??
          [],
        progress.checkpointResponses ??
          [],
        examAccuracy,
        true,
      );

    const masteryImpact =
      calculateLessonMasteryImpact(
        overallAccuracy,
      );

    const reviewAt =
      calculateLessonReviewDate(
        overallAccuracy,
      );

    const completedAt =
      new Date();

    const userReference =
      adminDb
        .collection("users")
        .doc(uid);

    const progressId =
      `${uid}_${lessonId}`;

    const progressReference =
      adminDb
        .collection(
          "lessonProgress",
        )
        .doc(progressId);

    const result =
      await adminDb.runTransaction(
        async (transaction) => {
          const [
            userSnapshot,
            progressSnapshot,
          ] =
            await Promise.all([
              transaction.get(
                userReference,
              ),
              transaction.get(
                progressReference,
              ),
            ]);

          if (
            !userSnapshot.exists
          ) {
            throw new Error(
              "User profile not found.",
            );
          }

          const profile =
            userSnapshot.data() ??
            {};

          const completedLessons =
            Array.isArray(
              profile.completedLessons,
            )
              ? profile.completedLessons.filter(
                  (
                    value,
                  ): value is string =>
                    typeof value ===
                    "string",
                )
              : [];

          const progressData =
            progressSnapshot.exists
              ? progressSnapshot.data()
              : null;

          const alreadyCompleted =
            completedLessons.includes(
              lessonId,
            ) ||
            progressData?.status ===
              "completed";

          const currentXP =
            typeof profile.xp ===
              "number" &&
            Number.isFinite(
              profile.xp,
            )
              ? profile.xp
              : 0;

          const existingBadges =
            Array.isArray(
              profile.badges,
            )
              ? profile.badges.filter(
                  (
                    value,
                  ): value is string =>
                    typeof value ===
                    "string",
                )
              : [];

          const projectedProfile = {
            ...profile,

            xp: alreadyCompleted
              ? currentXP
              : currentXP +
                xpReward,

            completedLessons:
              alreadyCompleted
                ? completedLessons
                : [
                    ...completedLessons,
                    lessonId,
                  ],

            badges:
              existingBadges,
          };

          const unlockedAchievements =
            alreadyCompleted
              ? []
              : getUnlockedAchievements(
                  projectedProfile,
                );

          const existingStartedAt =
            progressData?.startedAt instanceof
            Timestamp
              ? progressData.startedAt
              : null;

          const startedAt =
            existingStartedAt ??
            (
              progress.startedAt
                ? Timestamp.fromDate(
                    new Date(
                      progress.startedAt,
                    ),
                  )
                : Timestamp.fromDate(
                    completedAt,
                  )
            );

          const markedAt =
            examMarking
              .markedAt
              ? Timestamp.fromDate(
                  new Date(
                    examMarking
                      .markedAt,
                  ),
                )
              : Timestamp.fromDate(
                  completedAt,
                );

          transaction.set(
            progressReference,
            {
              studentId: uid,

              lessonId,

              topicId,

              currentStepIndex:
                Math.max(
                  9,
                  progress.currentStepIndex ??
                    9,
                ),

              completedStepIds:
                Array.isArray(
                  progress.completedStepIds,
                )
                  ? progress.completedStepIds
                  : [],

              practiceResponses:
                progress.practiceResponses ??
                [],

              checkpointResponses:
                progress.checkpointResponses ??
                [],

              examResponse:
                progress.examResponse ??
                "",

              examMarking: {
                ...examMarking,

                markedAt,
              },

              reflection:
                progress.reflection ??
                "",

              audioEnabled:
                progress.audioEnabled ??
                false,

              audioRate:
                progress.audioRate ??
                1,

              selectedVoiceName:
                progress.selectedVoiceName ??
                "",

              practiceAccuracy,

              checkpointAccuracy,

              examAccuracy,

              overallAccuracy,

              masteryImpact,

              reviewAt:
                Timestamp.fromDate(
                  reviewAt,
                ),

              status:
                "completed",

              startedAt,

              completedAt:
                progressData?.completedAt instanceof
                Timestamp
                  ? progressData.completedAt
                  : Timestamp.fromDate(
                      completedAt,
                    ),

              updatedAt:
                FieldValue.serverTimestamp(),
            },
            {
              merge: true,
            },
          );

          if (
            !alreadyCompleted
          ) {
            const achievementIds =
              unlockedAchievements.map(
                (achievement) =>
                  achievement.id,
              );

            const userUpdate: Record<
              string,
              unknown
            > = {
              xp:
                currentXP +
                xpReward,

              completedLessons:
                FieldValue.arrayUnion(
                  lessonId,
                ),

              updatedAt:
                FieldValue.serverTimestamp(),
            };

            if (
              achievementIds.length >
              0
            ) {
              userUpdate.badges =
                FieldValue.arrayUnion(
                  ...achievementIds,
                );
            }

            transaction.update(
              userReference,
              userUpdate,
            );
          }

          return {
            alreadyCompleted,

            xpAwarded:
              alreadyCompleted
                ? 0
                : xpReward,

            practiceAccuracy,

            checkpointAccuracy,

            examAccuracy,

            overallAccuracy,

            masteryImpact,

            reviewAt,

            unlockedAchievements,
          };
        },
      );

    return NextResponse.json({
      ...result,

      reviewAt:
        serialiseDate(
          result.reviewAt,
        ),
    });
  } catch (error) {
    console.error(
      "Server lesson completion error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The lesson could not be completed.",
      },
      {
        status: 500,
      },
    );
  }
}