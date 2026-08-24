import type { Lesson } from "@/types/curriculum";
import type {
  InteractiveLessonDefinition,
  InteractiveLessonStep,
} from "@/types/interactiveLesson";

export function buildInteractiveLesson(
  topicId: string,
  lesson: Lesson,
): InteractiveLessonDefinition {
  const steps: InteractiveLessonStep[] = [
    {
      id: "introduction",
      type: "introduction",
      title: "Introduction",
      description: "Understand the purpose and context of the lesson.",
    },
  ];

  if (lesson.objectives.length > 0) {
    steps.push({
      id: "objectives",
      type: "objectives",
      title: "Learning objectives",
      description: "Review what you should understand by the end.",
    });
  }

  if (lesson.explanation.trim()) {
    steps.push({
      id: "explanation",
      type: "explanation",
      title: "Explanation",
      description: "Learn the key knowledge and terminology.",
    });
  }

  if (lesson.workedExample.trim()) {
    steps.push({
      id: "worked-example",
      type: "worked-example",
      title: "Worked example",
      description: "Follow a complete example step by step.",
    });
  }

  if (lesson.simulator) {
    steps.push({
      id: "simulator",
      type: "simulator",
      title: "Interactive simulator",
      description: "Explore the lesson concept interactively.",
    });
  }

  if (lesson.practiceQuestions.length > 0) {
    steps.push({
      id: "practice",
      type: "practice",
      title: "Guided practice",
      description: "Apply the knowledge and receive instant feedback.",
    });

    steps.push({
      id: "checkpoint",
      type: "checkpoint",
      title: "Checkpoint",
      description: "Check your understanding before continuing.",
    });
  }

  if (
    lesson.examQuestion.question.trim() &&
    lesson.examQuestion.marks > 0
  ) {
    steps.push({
      id: "exam-question",
      type: "exam-question",
      title: "Exam-style question",
      description: "Apply your knowledge to an assessed response.",
    });
  }

  steps.push({
    id: "reflection",
    type: "reflection",
    title: "Reflection",
    description: "Summarise your learning and identify your next step.",
  });

  steps.push({
    id: "completion",
    type: "completion",
    title: "Complete lesson",
    description: "Save the lesson as completed and collect XP.",
  });

  return {
    topicId,
    lesson,
    steps,
  };
}
