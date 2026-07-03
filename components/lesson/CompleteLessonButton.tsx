"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";
import { completeLesson } from "@/services/progressService";

type Props = {
  lessonId: string;
};

export default function CompleteLessonButton({ lessonId }: Props) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(false);

  async function handleComplete() {
    if (!user) {
      alert("Please login first.");
      return;
    }

    await completeLesson(user.uid, lessonId, 50);
    setCompleted(true);
  }

  return (
    <Button onClick={handleComplete}>
      {completed ? "✅ Lesson Completed" : "Complete Lesson +50 XP"}
    </Button>
  );
}