import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";
import { getTeacherAnalyticsPortfolio } from "@/services/analytics/teacherAnalyticsService";
import { normaliseTopic } from "@/services/topicNormalisationService";

import type {
  ClassKnowledgeMap,
  ClassKnowledgeMapTopic,
} from "@/types/knowledgeMap";

type TopicAccumulator = {
  percentages: number[];
  evidenceCount: number;
  studentCount: number;
};

function average(values: number[]): number {
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;
}

/*
 * IMPORTANT:
 *
 * The old Class Knowledge Map service loaded every student profile and then
 * called getAdaptiveLearningPlan(studentId) while a TEACHER was signed in.
 *
 * That adaptive-learning pipeline contains student-context Firestore reads,
 * which is why /teacher/knowledge-map could fail with:
 *
 * FirebaseError: Missing or insufficient permissions.
 *
 * The Teacher Analytics pipeline is already tested and working with the
 * teacher's existing Firestore permissions. This service therefore consumes
 * the same teacher analytics portfolio rather than opening a second,
 * permission-sensitive student analytics path.
 */
export async function getClassKnowledgeMap(
  teacherId: string,
): Promise<ClassKnowledgeMap> {
  const id = teacherId.trim();

  if (!id) {
    return {
      teacherId: "",
      generatedAt: new Date(),
      studentCount: 0,
      topics: [],
    };
  }

  const portfolio = await getTeacherAnalyticsPortfolio(id);

  if (portfolio.classes.length === 0) {
    return {
      teacherId: id,
      generatedAt: new Date(),
      studentCount: 0,
      topics: curriculumRegistry.map((definition) => ({
        topicId: definition.id,
        topicTitle: definition.title,
        unitId: definition.unitId,
        unitTitle: definition.unitTitle,
        classAverage: 0,
        averageConfidence: 0,
        assessedStudents: 0,
        priorityStudents: 0,
        secureStudents: 0,
      })),
    };
  }

  const accumulators = new Map<string, TopicAccumulator>();

  for (const classItem of portfolio.classes) {
    for (const student of classItem.students) {
      for (const topic of student.analytics.topics) {
        const normalised = normaliseTopic(topic.topic);
        const topicId = normalised.topicId;

        if (!topicId) {
          continue;
        }

        const current = accumulators.get(topicId) || {
          percentages: [],
          evidenceCount: 0,
          studentCount: 0,
        };

        current.percentages.push(topic.weightedPercentage);
        current.evidenceCount += topic.evidenceCount;
        current.studentCount += 1;

        accumulators.set(topicId, current);
      }
    }
  }

  const topics: ClassKnowledgeMapTopic[] = curriculumRegistry.map(
    (definition) => {
      const evidence = accumulators.get(definition.id);

      const classAverage = evidence
        ? average(evidence.percentages)
        : 0;

      const assessedStudents = evidence?.studentCount ?? 0;

      /*
       * Confidence here is intentionally derived from the quantity of
       * assessment evidence backing the topic rather than from the old
       * adaptive-learning confidence service.
       *
       * 1 evidence item  -> 40
       * 2 evidence items -> 55
       * 3 evidence items -> 70
       * 4+               -> 85-100
       */
      const evidenceCount = evidence?.evidenceCount ?? 0;

      const averageConfidence =
        evidenceCount === 0
          ? 0
          : Math.min(100, 25 + evidenceCount * 15);

      /*
       * The current ClassKnowledgeMap type stores class-level counts.
       * We derive the counts consistently from the same thresholds used
       * throughout CS Master's teacher analytics:
       *
       * priority   < 50%
       * developing 50-69%
       * secure     >= 70%
       *
       * With multiple students, each student's topic mastery is counted.
       */
      let priorityStudents = 0;
      let secureStudents = 0;

      for (const classItem of portfolio.classes) {
        for (const student of classItem.students) {
          const studentTopic = student.analytics.topics.find(
            (topic) =>
              normaliseTopic(topic.topic).topicId === definition.id,
          );

          if (!studentTopic) {
            continue;
          }

          if (studentTopic.weightedPercentage < 50) {
            priorityStudents += 1;
          }

          if (studentTopic.weightedPercentage >= 70) {
            secureStudents += 1;
          }
        }
      }

      return {
        topicId: definition.id,
        topicTitle: definition.title,
        unitId: definition.unitId,
        unitTitle: definition.unitTitle,
        classAverage,
        averageConfidence,
        assessedStudents,
        priorityStudents,
        secureStudents,
      };
    },
  );

  return {
    teacherId: id,
    generatedAt: new Date(),
    studentCount: portfolio.uniqueStudentCount,
    topics,
  };
}
