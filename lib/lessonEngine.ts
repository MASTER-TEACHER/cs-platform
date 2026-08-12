import { topicLibrary } from "@/data/curriculum/topics/index";
import type { Topic } from "@/types/curriculum";

export function getNextLesson(completedLessons: string[] = []) {
  const topics = Object.values(topicLibrary) as Topic[];

  for (const topic of topics) {
    const lesson = topic.lessons.find(
      (lesson) => !completedLessons.includes(lesson.id),
    );

    if (lesson) {
      return {
        topicId: topic.id,
        topic: topic.title,
        lessonId: lesson.id,
        lesson: lesson.title,
        xp: lesson.xpReward,
        estimatedTime: lesson.estimatedTime,
        difficulty: topic.difficulty,
      };
    }
  }

  return null;
}
