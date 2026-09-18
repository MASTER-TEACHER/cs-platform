import {
  getCurriculumDefinition,
  type CurriculumDefinition,
  type CurriculumUnitDefinition,
} from "@/data/curriculum/curriculumMap";
import { topicLibrary } from "@/data/curriculum/topics";
import type { Topic } from "@/types/curriculum";
import type {
  ExamBoard,
  Qualification,
  Subject,
} from "@/types/user";

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

/*
 * Subject-aware overload used by the current curriculum system.
 */
export function getCurriculumCoverage(
  subject: Subject,
  qualification: Qualification,
  examBoard: ExamBoard,
): CurriculumCoverage | null;

/*
 * Legacy overload retained so existing Computer Science callers
 * continue to work until they are migrated to the subject-aware API.
 */
export function getCurriculumCoverage(
  qualification: Qualification,
  examBoard: ExamBoard,
): CurriculumCoverage | null;

export function getCurriculumCoverage(
  subjectOrQualification:
    | Subject
    | Qualification,
  qualificationOrExamBoard:
    | Qualification
    | ExamBoard,
  maybeExamBoard?: ExamBoard,
): CurriculumCoverage | null {
  const subject: Subject =
    maybeExamBoard === undefined
      ? "COMPUTER_SCIENCE"
      : (subjectOrQualification as Subject);

  const qualification: Qualification =
    maybeExamBoard === undefined
      ? (subjectOrQualification as Qualification)
      : (qualificationOrExamBoard as Qualification);

  const examBoard: ExamBoard =
    maybeExamBoard === undefined
      ? (qualificationOrExamBoard as ExamBoard)
      : maybeExamBoard;

  const curriculum =
    getCurriculumDefinition(
      subject,
      qualification,
      examBoard,
    );

  if (!curriculum) {
    return null;
  }

  const units: CurriculumUnitCoverage[] =
    curriculum.units.map((unit) => {
      const topics = unit.topicIds
        .map(
          (topicId) =>
            topicLibrary[topicId],
        )
        .filter(
          (topic): topic is Topic =>
            Boolean(topic) &&
            topic.status !==
              "coming-soon" &&
            topic.lessons.length > 0,
        );

      const missingTopicIds =
        unit.topicIds.filter(
          (topicId) =>
            !topicLibrary[topicId] ||
            topicLibrary[topicId]
              .status ===
              "coming-soon" ||
            topicLibrary[topicId]
              .lessons.length === 0,
        );

      return {
        unit,
        topics,
        missingTopicIds,
        lessonCount: topics.reduce(
          (total, topic) =>
            total +
            topic.lessons.length,
          0,
        ),
      };
    });

  const mappedTopicIds =
    Array.from(
      new Set(
        curriculum.units.flatMap(
          (unit) => unit.topicIds,
        ),
      ),
    );

  const availableTopicIds =
    Array.from(
      new Set(
        units.flatMap((unit) =>
          unit.topics.map(
            (topic) => topic.id,
          ),
        ),
      ),
    );

  const missingTopicIds =
    Array.from(
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