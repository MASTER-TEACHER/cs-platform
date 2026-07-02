import { topicLibrary } from "@/data/curriculum/topics/index";

export function getNextLesson() {
  const topics = Object.values(topicLibrary);

  for (const topic of topics) {
    const lesson = topic.lessons.find(
      (lesson) => !lesson.completed
    );

    if (lesson) {
      return {
        topic: topic.title,
        lesson: lesson.title,
      };
    }
  }

  return null;
}