import type {
  AdaptiveLearningAction,
  AdaptiveTopicMastery,
} from "@/types/adaptiveLearning";

const encoded = (topic: string) => encodeURIComponent(topic);

export function buildAdaptiveActions(
  topics: AdaptiveTopicMastery[],
): AdaptiveLearningAction[] {
  const actions: AdaptiveLearningAction[] = [];

  topics
    .filter((topic) => topic.state !== "mastered")
    .slice(0, 3)
    .forEach((topic, index) => {
      const priority: AdaptiveLearningAction["priority"] =
        topic.priorityScore >= 70
          ? "high"
          : topic.priorityScore >= 45
            ? "medium"
            : "low";

      if (topic.state === "new" || topic.masteryScore < 45) {
        actions.push({
          id: `lesson-${topic.id}`,
          type: "lesson",
          title: `Review ${topic.topic}`,
          description: topic.reason,
          topic: topic.topic,
          href: `/learn?search=${encoded(topic.topic)}`,
          estimatedMinutes: 12,
          xpReward: 25,
          priority,
        });
      }

      actions.push({
        id: `quiz-${topic.id}`,
        type: "quiz",
        title: `Retrieval quiz: ${topic.topic}`,
        description: `Use ${topic.recommendedDifficulty} difficulty to check recall and update mastery.`,
        topic: topic.topic,
        href: `/quiz?topic=${encoded(topic.topic)}&difficulty=${topic.recommendedDifficulty}`,
        estimatedMinutes: 8,
        xpReward: 30,
        priority,
      });

      if (index === 0 || topic.masteryScore >= 40) {
        actions.push({
          id: `exam-${topic.id}`,
          type: "exam",
          title: `Exam practice: ${topic.topic}`,
          description:
            "Apply knowledge in a written response and compare it with the mark scheme.",
          topic: topic.topic,
          href: "/assignments?filter=exams",
          estimatedMinutes: 12,
          xpReward: 40,
          priority: priority === "high" ? "high" : "medium",
        });
      }
    });

  return actions.slice(0, 6);
}
