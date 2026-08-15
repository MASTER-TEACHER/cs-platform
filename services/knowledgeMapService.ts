import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";
import { getAdaptiveLearningPlan } from "@/services/adaptiveLearningService";
import { getRichStudentAnalytics } from "@/services/analytics/richStudentAnalyticsService";
import { normaliseTopic } from "@/services/topicNormalisationService";
import type {
  KnowledgeMap,
  KnowledgeMapTopic,
  KnowledgeMapUnit,
} from "@/types/knowledgeMap";
import type {
  AnalyticsEvidence,
  AnalyticsEvidenceType,
  TopicMastery,
} from "@/types/analytics";

function evidenceSources(
  evidence: AnalyticsEvidence[],
): AnalyticsEvidenceType[] {
  return Array.from(new Set(evidence.map((item) => item.type)));
}

export async function getKnowledgeMap(
  studentId: string,
): Promise<KnowledgeMap> {
  const id = studentId.trim();

  if (!id) {
    throw new Error("A valid student account is required.");
  }

  const [plan, analytics] = await Promise.all([
    getAdaptiveLearningPlan(id),
    getRichStudentAnalytics(id),
  ]);

  const masteryByTopicId = new Map(
    plan.topics.map((mastery) => [
      normaliseTopic(mastery.topic).topicId,
      mastery,
    ]),
  );

  const analyticsMasteryByTopicId = new Map<string, TopicMastery>(
    analytics.topics.map((mastery) => [
      normaliseTopic(mastery.topic).topicId,
      mastery,
    ]),
  );

  const analyticsEvidenceByTopicId =
    new Map<string, AnalyticsEvidence[]>();

  for (const evidence of analytics.masteryEvidence) {
    const topicId = normaliseTopic(evidence.topic).topicId;
    const current = analyticsEvidenceByTopicId.get(topicId) || [];
    current.push(evidence);
    analyticsEvidenceByTopicId.set(topicId, current);
  }

  const unitsById = new Map<string, KnowledgeMapUnit>();

  curriculumRegistry.forEach((definition) => {
    const mastery = masteryByTopicId.get(definition.id) || null;

    const nextAction =
      plan.actions.find(
        (action) =>
          normaliseTopic(action.topic).topicId === definition.id,
      ) || null;

    const analyticsMastery =
      analyticsMasteryByTopicId.get(definition.id) || null;

    const analyticsEvidence =
      analyticsEvidenceByTopicId.get(definition.id) || [];

    const mapTopic: KnowledgeMapTopic = {
      definition,
      mastery,
      nextAction,
      analyticsMastery,
      analyticsEvidence,
      evidenceSources: evidenceSources(analyticsEvidence),
      writtenExamEvidenceCount: analyticsEvidence.filter(
        (item) => item.type === "written_exam",
      ).length,
    };

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

  const knownTopicIds = new Set(
    curriculumRegistry.map((topic) => topic.id),
  );

  const unclassifiedTopics = plan.topics.filter(
    (mastery) =>
      !knownTopicIds.has(normaliseTopic(mastery.topic).topicId),
  );

  const units = Array.from(unitsById.values()).map((unit) => ({
    ...unit,
    topics: [...unit.topics].sort(
      (a, b) =>
        a.definition.displayOrder - b.definition.displayOrder,
    ),
  }));

  return {
    studentId: id,
    generatedAt: new Date(),
    units,
    unclassifiedTopics,
  };
}
