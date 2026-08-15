import {
  getCurriculumDefinition,
  type CurriculumDefinition,
  type CurriculumUnitDefinition,
} from "@/data/curriculum/curriculumMap";
import { topicLibrary } from "@/data/curriculum/topics";
import type { Topic } from "@/types/curriculum";
import type { ExamBoard, Qualification } from "@/types/user";

export type CurriculumUnitCoverage = {
  unit: CurriculumUnitDefinition;
  topics: Topic[];
  missingTopicIds: string[];
  lessonCount: number;
};

export type CurriculumCoverage = {
  curriculum: CurriculumDefinition;
  units: CurriculumUnitCoverage[];
  mappedTopicCount: number;
  availableTopicCount: number;
  lessonCount: number;
  missingTopicIds: string[];
  complete: boolean;
};

export function getCurriculumCoverage(
  qualification: Qualification,
  examBoard: ExamBoard,
): CurriculumCoverage | null {
  const curriculum =
    getCurriculumDefinition(
      qualification,
      examBoard,
    );

  if (!curriculum) {
    return null;
  }

  const units: CurriculumUnitCoverage[] =
    curriculum.units.map((unit) => {
      const topics = unit.topicIds
        .map((topicId) =>
          topicLibrary[topicId],
        )
        .filter(
          (topic): topic is Topic =>
            Boolean(topic) &&
            topic.status !== "coming-soon",
        );

      const missingTopicIds =
        unit.topicIds.filter(
          (topicId) =>
            !topicLibrary[topicId] ||
            topicLibrary[topicId].status ===
              "coming-soon",
        );

      return {
        unit,
        topics,
        missingTopicIds,
        lessonCount: topics.reduce(
          (total, topic) =>
            total + topic.lessons.length,
          0,
        ),
      };
    });

  const mappedTopicIds = Array.from(
    new Set(
      curriculum.units.flatMap(
        (unit) => unit.topicIds,
      ),
    ),
  );

  const availableTopicIds = Array.from(
    new Set(
      units.flatMap((unit) =>
        unit.topics.map(
          (topic) => topic.id,
        ),
      ),
    ),
  );

  const missingTopicIds = Array.from(
    new Set(
      units.flatMap(
        (unit) =>
          unit.missingTopicIds,
      ),
    ),
  );

  return {
    curriculum,
    units,
    mappedTopicCount:
      mappedTopicIds.length,
    availableTopicCount:
      availableTopicIds.length,
    lessonCount: units.reduce(
      (total, unit) =>
        total + unit.lessonCount,
      0,
    ),
    missingTopicIds,
    complete:
      missingTopicIds.length === 0,
  };
}
