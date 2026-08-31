import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";

import type {
  AdaptiveLearningAction,
  AdaptiveTopicMastery,
} from "@/types/adaptiveLearning";

const encoded = (value: string) =>
  encodeURIComponent(value);

function normaliseLookupValue(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveCurriculumTopicId(
  topic: AdaptiveTopicMastery,
): string | null {
  const candidates = [
    topic.topic,
    topic.id,
  ]
    .map(normaliseLookupValue)
    .filter(Boolean);

  if (candidates.length === 0) {
    return null;
  }

  const match =
    curriculumRegistry.find(
      (curriculumTopic) => {
        const searchableValues = [
          curriculumTopic.id,
          curriculumTopic.title,
          ...(curriculumTopic.aliases || []),
        ].map(normaliseLookupValue);

        return candidates.some(
          (candidate) =>
            searchableValues.includes(
              candidate,
            ),
        );
      },
    );

  return match?.id || null;
}

function learningHref(
  topic: AdaptiveTopicMastery,
): string {
  const curriculumTopicId =
    resolveCurriculumTopicId(topic);

  /*
   * Preferred route:
   * resolve the adaptive topic through the curriculum registry.
   *
   * Example:
   * Character Encoding
   *     ↓
   * curriculumRegistry alias/title match
   *     ↓
   * id: "characters"
   *     ↓
   * /learn/characters
   */
  if (curriculumTopicId) {
    return `/learn/${encoded(
      curriculumTopicId,
    )}`;
  }

  /*
   * Defensive fallback.
   *
   * If a topic has not yet been registered in the curriculum,
   * return to the searchable Learn catalogue rather than creating
   * a broken /learn/[topicId] route.
   */
  return `/learn?search=${encoded(
    topic.topic,
  )}`;
}

export function buildAdaptiveActions(
  topics: AdaptiveTopicMastery[],
): AdaptiveLearningAction[] {
  const actions: AdaptiveLearningAction[] =
    [];

  topics
    .filter(
      (topic) =>
        topic.state !== "mastered",
    )
    .slice(0, 3)
    .forEach((topic, index) => {
      const priority: AdaptiveLearningAction["priority"] =
        topic.priorityScore >= 70
          ? "high"
          : topic.priorityScore >= 45
            ? "medium"
            : "low";

      /*
       * New or weak topics should take the learner directly
       * into the corresponding curriculum topic wherever one
       * exists.
       */
      if (
        topic.state === "new" ||
        topic.masteryScore < 45
      ) {
        actions.push({
          id: `lesson-${topic.id}`,
          type: "lesson",
          title: `Review ${topic.topic}`,
          description: topic.reason,
          topic: topic.topic,
          href: learningHref(topic),
          estimatedMinutes: 12,
          xpReward: 25,
          priority,
        });
      }

      /*
       * Retrieval practice remains topic-specific.
       */
      actions.push({
        id: `quiz-${topic.id}`,
        type: "quiz",
        title:
          `Retrieval quiz: ${topic.topic}`,
        description:
          `Use ${topic.recommendedDifficulty} difficulty to check recall and update mastery.`,
        topic: topic.topic,
        href:
          `/quiz?topic=${encoded(
            topic.topic,
          )}&difficulty=${encoded(
            topic.recommendedDifficulty,
          )}`,
        estimatedMinutes: 8,
        xpReward: 30,
        priority,
      });

      /*
       * Written exam practice remains assignment-driven.
       * The student can only attempt papers that have actually
       * been assigned to them.
       */
      if (
        index === 0 ||
        topic.masteryScore >= 40
      ) {
        actions.push({
          id: `exam-${topic.id}`,
          type: "exam",
          title:
            `Exam practice: ${topic.topic}`,
          description:
            "Apply knowledge in a written response and compare it with the mark scheme.",
          topic: topic.topic,
          href:
            "/assignments?filter=exams",
          estimatedMinutes: 12,
          xpReward: 40,
          priority:
            priority === "high"
              ? "high"
              : "medium",
        });
      }
    });

  return actions.slice(0, 6);
}
