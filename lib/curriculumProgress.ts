import { topicLibrary } from "@/data/curriculum/topics/index";

export function getTotalLessonCount() {
  const topics = Object.values(topicLibrary);

  return topics.reduce((total, topic) => {
    return total + topic.lessons.length;
  }, 0);
}