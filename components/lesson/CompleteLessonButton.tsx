"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import LessonCompleteModal from "@/components/lesson/LessonCompleteModal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import {
  completeStudentAssignment,
  getAssignmentById,
} from "@/services/resourceAssignmentService";
import { createLessonAssignmentResourceId } from "@/services/lessonAssignmentService";
import { completeLesson } from "@/services/progressService";
import type {
  InteractiveLessonProgress,
  LessonCompletionSummary,
} from "@/types/interactiveLesson";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  lessonId: string;
  topicId: string;
  nextLessonId?: string;
  progress: InteractiveLessonProgress;
  xpReward?: number;
};

function createStoredSummary(
  progress: InteractiveLessonProgress,
): LessonCompletionSummary {
  return {
    alreadyCompleted: true,
    xpAwarded: 0,
    practiceAccuracy:
      progress.practiceAccuracy ?? 0,
    checkpointAccuracy:
      progress.checkpointAccuracy ?? 0,
    examAccuracy:
      progress.examMarking?.percentage ??
      progress.examAccuracy ??
      0,
    overallAccuracy:
      progress.overallAccuracy ?? 0,
    masteryImpact:
      progress.masteryImpact ?? 0,
    reviewAt:
      progress.reviewAt ??
      progress.completedAt ??
      new Date(),
  };
}

export default function CompleteLessonButton({
  lessonId,
  topicId,
  nextLessonId,
  progress,
  xpReward = 50,
}: Props) {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const assignmentId =
    searchParams.get("assignment");

  const lessonAlreadyCompleted =
    progress.status === "completed";

  const storedSummary = useMemo(
    () => createStoredSummary(progress),
    [progress],
  );

  const [completed, setCompleted] = useState(
    lessonAlreadyCompleted,
  );
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] =
    useState(false);
  const [summary, setSummary] =
    useState<LessonCompletionSummary | null>(
      lessonAlreadyCompleted
        ? storedSummary
        : null,
    );

  const [
    unlockedAchievements,
    setUnlockedAchievements,
  ] = useState<Achievement[]>([]);

  async function completeLinkedAssignment(
    studentId: string,
  ) {
    if (!assignmentId) {
      return;
    }

    const assignment =
      await getAssignmentById(
        assignmentId,
      );

    if (!assignment) {
      throw new Error(
        "The linked lesson assignment could not be found.",
      );
    }

    if (
      !assignment.studentIds.includes(
        studentId,
      )
    ) {
      throw new Error(
        "You are not enrolled in this lesson assignment.",
      );
    }

    if (
      assignment.resourceType !==
      "lesson"
    ) {
      throw new Error(
        "The linked assignment is not a lesson assignment.",
      );
    }

    const expectedResourceId =
      createLessonAssignmentResourceId(
        topicId,
        lessonId,
      );

    if (
      assignment.resourceId !==
      expectedResourceId
    ) {
      throw new Error(
        "This lesson does not match the teacher-assigned lesson.",
      );
    }

    await completeStudentAssignment(
      assignment.id,
      studentId,
    );
  }

  async function handleComplete() {
    if (!user) {
      toast.error(
        "Please login first.",
      );
      return;
    }

    if (loading) {
      return;
    }

    if (
      completed ||
      progress.status ===
        "completed"
    ) {
      try {
        setLoading(true);

        await completeLinkedAssignment(
          user.uid,
        );

        setSummary(
          createStoredSummary(
            progress,
          ),
        );

        setUnlockedAchievements([]);
        setShowModal(true);

        if (assignmentId) {
          toast.success(
            "Lesson assignment completed ✅",
          );
        } else {
          toast(
            "Lesson already completed ✅",
          );
        }
      } catch (error) {
        console.error(
          "Lesson assignment completion error:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Could not complete the lesson assignment.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!progress.examMarking) {
      toast.error(
        "Mark the exam-style response before completing the lesson.",
      );
      return;
    }

    try {
      setLoading(true);

      const result =
        await completeLesson({
          uid: user.uid,
          lessonId,
          topicId,
          xpReward,
          progress,
        });

      await completeLinkedAssignment(
        user.uid,
      );

      setCompleted(true);
      setSummary(result);

      setUnlockedAchievements(
        result.unlockedAchievements,
      );

      setShowModal(true);

      if (assignmentId) {
        toast.success(
          `Lesson and assignment completed! +${result.xpAwarded} XP`,
        );
      } else if (
        result.alreadyCompleted
      ) {
        toast(
          "Lesson already completed ✅",
        );
      } else {
        toast.success(
          `Lesson completed! +${result.xpAwarded} XP`,
        );
      }
    } catch (error) {
      console.error(
        "Lesson completion error:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not complete lesson.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={handleComplete}
        disabled={loading}
      >
        {loading
          ? "Completing..."
          : completed ||
              progress.status ===
                "completed"
            ? assignmentId
              ? "✅ Complete Assignment / View Summary"
              : "✅ View Completion Summary"
            : assignmentId
              ? `Complete Lesson & Assignment +${xpReward} XP`
              : `Complete Lesson +${xpReward} XP`}
      </Button>

      {showModal && summary && (
        <LessonCompleteModal
          topicId={topicId}
          nextLessonId={
            nextLessonId
          }
          summary={summary}
          achievements={
            unlockedAchievements
          }
          onClose={() =>
            setShowModal(false)
          }
        />
      )}
    </>
  );
}
