"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import LessonCompleteModal from "@/components/lesson/LessonCompleteModal";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
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
    practiceAccuracy: progress.practiceAccuracy ?? 0,
    checkpointAccuracy: progress.checkpointAccuracy ?? 0,
    examAccuracy:
      progress.examMarking?.percentage ?? progress.examAccuracy ?? 0,
    overallAccuracy: progress.overallAccuracy ?? 0,
    masteryImpact: progress.masteryImpact ?? 0,
    reviewAt: progress.reviewAt ?? progress.completedAt ?? new Date(),
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

  const lessonAlreadyCompleted = progress.status === "completed";

  const storedSummary = useMemo(
    () => createStoredSummary(progress),
    [progress],
  );

  const [completed, setCompleted] = useState(lessonAlreadyCompleted);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [summary, setSummary] = useState<LessonCompletionSummary | null>(
    lessonAlreadyCompleted ? storedSummary : null,
  );

  const [unlockedAchievements, setUnlockedAchievements] = useState<
    Achievement[]
  >([]);

  async function handleComplete() {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (loading) {
      return;
    }

    /*
     * A completed lesson should open its stored summary.
     *
     * Do not call completeLesson() again because older completion
     * records may not contain an examMarking result.
     */
    if (completed || progress.status === "completed") {
      setSummary(createStoredSummary(progress));

      setUnlockedAchievements([]);
      setShowModal(true);

      return;
    }

    /*
     * New lessons must have their exam-style response marked
     * before completion.
     */
    if (!progress.examMarking) {
      toast.error("Mark the exam-style response before completing the lesson.");

      return;
    }

    try {
      setLoading(true);

      const result = await completeLesson({
        uid: user.uid,
        lessonId,
        topicId,
        xpReward,
        progress,
      });

      setCompleted(true);
      setSummary(result);

      setUnlockedAchievements(result.unlockedAchievements);

      setShowModal(true);

      if (result.alreadyCompleted) {
        toast("Lesson already completed ✅");
      } else {
        toast.success(`Lesson completed! +${result.xpAwarded} XP`);
      }
    } catch (error) {
      console.error("Lesson completion error:", error);

      toast.error(
        error instanceof Error ? error.message : "Could not complete lesson.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={handleComplete} disabled={loading}>
        {completed || progress.status === "completed"
          ? "✅ View Completion Summary"
          : loading
            ? "Completing..."
            : `Complete Lesson +${xpReward} XP`}
      </Button>

      {showModal && summary && (
        <LessonCompleteModal
          topicId={topicId}
          nextLessonId={nextLessonId}
          summary={summary}
          achievements={unlockedAchievements}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
