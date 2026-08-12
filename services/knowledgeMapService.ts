import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";
import { getAdaptiveLearningPlan } from "@/services/adaptiveLearningService";
import { normaliseTopic } from "@/services/topicNormalisationService";
import type {
  KnowledgeMap,
  KnowledgeMapTopic,
  KnowledgeMapUnit,
} from "@/types/knowledgeMap";

export async function getKnowledgeMap(
  studentId: string,
): Promise<KnowledgeMap> {
  const plan = await getAdaptiveLearningPlan(studentId);

  const masteryByTopicId = new Map(
    plan.topics.map((mastery) => [
      normaliseTopic(mastery.topic).topicId,
      mastery,
    ]),
  );

  const unitsById = new Map<string, KnowledgeMapUnit>();

  curriculumRegistry.forEach((definition) => {
    const mastery = masteryByTopicId.get(definition.id) || null;
    const nextAction =
      plan.actions.find(
        (action) => normaliseTopic(action.topic).topicId === definition.id,
      ) || null;

    const mapTopic: KnowledgeMapTopic = { definition, mastery, nextAction };
    const existing = unitsById.get(definition.unitId);

    if (existing) {
      existing.topics.push(mapTopic);
    } else {
      unitsById.set(definition.unitId, {
        id: definition.unitId,
        title: definition.unitTitle,
        topics: [mapTopic],
      });
    }
  });

  const knownTopicIds = new Set(curriculumRegistry.map((topic) => topic.id));
  const unclassifiedTopics = plan.topics.filter(
    (mastery) => !knownTopicIds.has(normaliseTopic(mastery.topic).topicId),
  );

  const units = Array.from(unitsById.values()).map((unit) => ({
    ...unit,
    topics: [...unit.topics].sort(
      (a, b) => a.definition.displayOrder - b.definition.displayOrder,
    ),
  }));

  return {
    studentId,
    generatedAt: new Date(),
    units,
    unclassifiedTopics,
  };
}
