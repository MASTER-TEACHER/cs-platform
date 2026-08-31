import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";

import type {
  AdaptiveLearningAction,
  AdaptiveTopicMastery,
} from "@/types/adaptiveLearning";

const encoded = (value: string) => encodeURIComponent(value);

function normaliseLookupValue(value: string): string {
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
  const candidates = [topic.topic, topic.id]
    .map(normaliseLookupValue)
    .filter(Boolean);

  if (candidates.length === 0) return null;

  const match = curriculumRegistry.find((curriculumTopic) => {
    const searchableValues = [
      curriculumTopic.id,
      curriculumTopic.title,
      ...(curriculumTopic.aliases || []),
    ].map(normaliseLookupValue);

    return candidates.some((candidate) =>
      searchableValues.includes(candidate),
    );
  });

  return match?.id || null;
}

function learningHref(topic: AdaptiveTopicMastery): string {
  const curriculumTopicId = resolveCurriculumTopicId(topic);

  return curriculumTopicId
    ? `/learn/${encoded(curriculumTopicId)}`
    : `/learn?search=${encoded(topic.topic)}`;
}

function isProgrammingTopic(topic: AdaptiveTopicMastery): boolean {
  if (topic.evidenceSources.includes("programming")) return true;

  const value = normaliseLookupValue(topic.topic);

  return [
    "programming",
    "python",
    "algorithm",
    "algorithms",
    "computational thinking",
    "data structures",
    "advanced programming",
    "functional programming",
    "software development",
  ].some((term) => value.includes(term));
}

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

      if (
        topic.state === "new" ||
        topic.masteryScore < 45 ||
        topic.independentEvidenceCount === 0
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

      if (isProgrammingTopic(topic)) {
        actions.push({
          id: `programming-${topic.id}`,
          type: "programming",
          title: `Programming practice: ${topic.topic}`,
          description:
            `Complete an independent ${topic.recommendedDifficulty} programming challenge to produce fresh practical evidence.`,
          topic: topic.topic,
          href:
            `/programming?topic=${encoded(topic.topic)}` +
            `&difficulty=${encoded(topic.recommendedDifficulty)}`,
          estimatedMinutes: 15,
          xpReward: 40,
          priority,
        });
      }

      actions.push({
        id: `quiz-${topic.id}`,
        type: "quiz",
        title: `Retrieval quiz: ${topic.topic}`,
        description:
          `Use ${topic.recommendedDifficulty} difficulty to check recall independently and update mastery.`,
        topic: topic.topic,
        href:
          `/quiz?topic=${encoded(topic.topic)}` +
          `&difficulty=${encoded(topic.recommendedDifficulty)}`,
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
            "Apply knowledge independently in a written response. Teacher-marked exam evidence carries the strongest adaptive weight.",
          topic: topic.topic,
          href: "/assignments?filter=exams",
          estimatedMinutes: 12,
          xpReward: 40,
          priority: priority === "high" ? "high" : "medium",
        });
      }
    });

  const seen = new Set<string>();

  return actions
    .filter((action) => {
      const key = `${action.type}:${action.topic}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}
