import {
  curriculumDefinitions,
  getCurriculumDefinition,
} from "@/data/curriculum/curriculumMap";

import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

export function getSupportedExamBoards(
  qualification: Qualification,
): ExamBoard[] {
  return Array.from(
    new Set(
      curriculumDefinitions
        .filter(
          (curriculum) =>
            curriculum.qualification ===
            qualification,
        )
        .map(
          (curriculum) =>
            curriculum.examBoard,
        ),
    ),
  );
}

export function isSupportedCurriculumSelection(
  qualification: Qualification,
  examBoard: ExamBoard,
): boolean {
  return Boolean(
    getCurriculumDefinition(
      qualification,
      examBoard,
    ),
  );
}