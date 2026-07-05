import { topicLibrary } from "@/data/curriculum/topics/index";
import { Topic } from "@/types/curriculum";

export function getDailyMission(completedLessons: string[]) {
  const topics = Object.values(topicLibrary) as Topic[];

  for (const topic of topics) {
    const nextLesson = topic.lessons.find(
      (lesson) => !completedLessons.includes(lesson.id)
    );

    if (nextLesson) {
      return {
        topic: topic.title,
        lesson: nextLesson.title,
        lessonId: nextLesson.id,
        xp: nextLesson.xpReward,
        difficulty: topic.difficulty,
        estimatedTime: nextLesson.estimatedTime,
      };
    }
  }

  return null;
}