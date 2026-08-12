import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";
import { getAdaptiveLearningPlan } from "@/services/adaptiveLearningService";
import { normaliseTopic } from "@/services/topicNormalisationService";
import type {
  ClassKnowledgeMap,
  ClassKnowledgeMapTopic,
} from "@/types/knowledgeMap";

function average(values: number[]): number {
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;
}

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

  const classesSnapshot = await getDocs(
    query(collection(db, "classes"), where("teacherId", "==", id)),
  );

  const classIds = classesSnapshot.docs.map((document) => document.id);

  if (!classIds.length) {
    return {
      teacherId: id,
      generatedAt: new Date(),
      studentCount: 0,
      topics: [],
    };
  }

  const studentsSnapshot = await getDocs(
    query(collection(db, "users"), where("role", "==", "student")),
  );

  const studentIds = studentsSnapshot.docs
    .filter((document) => {
      const value = document.data().classIds;

      return (
        Array.isArray(value) &&
        value.some(
          (classId) =>
            typeof classId === "string" && classIds.includes(classId),
        )
      );
    })
    .map((document) => document.id);

  const plans = await Promise.all(
    studentIds.map((studentId) => getAdaptiveLearningPlan(studentId)),
  );

  const topics: ClassKnowledgeMapTopic[] = curriculumRegistry.map(
    (definition) => {
      const evidence = plans
        .map((plan) =>
          plan.topics.find(
            (topic) => normaliseTopic(topic.topic).topicId === definition.id,
          ),
        )
        .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

      return {
        topicId: definition.id,
        topicTitle: definition.title,
        unitId: definition.unitId,
        unitTitle: definition.unitTitle,
        classAverage: average(evidence.map((topic) => topic.masteryScore)),
        averageConfidence: average(
          evidence.map((topic) => topic.confidenceScore),
        ),
        assessedStudents: evidence.length,
        priorityStudents: evidence.filter(
          (topic) =>
            topic.state === "priority" || topic.state === "forgetting-risk",
        ).length,
        secureStudents: evidence.filter(
          (topic) => topic.state === "secure" || topic.state === "mastered",
        ).length,
      };
    },
  );

  return {
    teacherId: id,
    generatedAt: new Date(),
    studentCount: studentIds.length,
    topics,
  };
}
