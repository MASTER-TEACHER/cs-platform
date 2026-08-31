import { auth } from "@/lib/firebase";

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

type CompletionAchievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type CompleteLessonApiResponse =
  LessonCompletionSummary & {
    unlockedAchievements:
      CompletionAchievement[];

    reviewAt:
      Date | string;
  };

export async function completeLesson({
  uid,
  lessonId,
  topicId,
  progress,
}: CompleteLessonInput): Promise<
  LessonCompletionSummary & {
    unlockedAchievements:
      CompletionAchievement[];
  }
> {
  if (
    !progress.examMarking
  ) {
    throw new Error(
      "Mark the exam-style response before completing the lesson.",
    );
  }

  const currentUser =
    auth.currentUser;

  if (!currentUser) {
    throw new Error(
      "Please login first.",
    );
  }

  if (
    currentUser.uid !== uid
  ) {
    throw new Error(
      "The signed-in account does not match the lesson student.",
    );
  }

  const idToken =
    await currentUser.getIdToken();

  const response =
    await fetch(
      "/api/lessons/complete",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${idToken}`,
        },

        body:
          JSON.stringify({
            lessonId,
            topicId,
            progress,
          }),
      },
    );

  const result =
    (await response.json()) as
      | CompleteLessonApiResponse
      | {
          error?: string;
        };

  if (
    !response.ok ||
    !(
      "xpAwarded" in result
    )
  ) {
    throw new Error(
      "error" in result &&
      result.error
        ? result.error
        : "Could not complete lesson.",
    );
  }

  return {
    ...result,

    reviewAt:
      result.reviewAt instanceof
      Date
        ? result.reviewAt
        : new Date(
            result.reviewAt,
          ),
  };
}