"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { completeLesson } from "@/services/progressService";
import LessonCompleteModal from "@/components/lesson/LessonCompleteModal";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  lessonId: string;
  xpReward?: number;
};

export default function CompleteLessonButton({
  lessonId,
  xpReward = 50,
}: Props) {
  const { user } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    Achievement[]
  >([]);

  async function handleComplete() {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const result = await completeLesson(user.uid, lessonId, xpReward);

      setCompleted(true);
      setAlreadyCompleted(result.alreadyCompleted);
      setUnlockedAchievements(result.unlockedAchievements);
      setShowModal(true);

      if (result.alreadyCompleted) {
        toast("Lesson already completed ✅");
      } else {
        toast.success(`Lesson completed! +${xpReward} XP`);
      }
    } catch (error) {
      console.error("Lesson completion error:", error);
      toast.error("Could not complete lesson.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={handleComplete} disabled={loading}>
        {completed
          ? "✅ Lesson Completed"
          : loading
          ? "Completing..."
          : `Complete Lesson +${xpReward} XP`}
      </Button>

      {showModal && (
        <LessonCompleteModal
          xpReward={xpReward}
          achievements={unlockedAchievements}
          alreadyCompleted={alreadyCompleted}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}