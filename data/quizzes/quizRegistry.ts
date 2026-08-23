import { getCurriculumDefinition } from "@/data/curriculum/curriculumMap";
import { quizLibrary as gcseQuizLibrary } from "@/data/quizzes";
import { aLevelQuizLibrary } from "@/data/quizzes/a-level";

import type { Quiz } from "@/types/quiz";
import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

export type CurriculumQuiz = {
  quiz: Quiz;
  topicId: string;
  unitId: string;
  unitTitle: string;
  qualification: Qualification;
  examBoard: ExamBoard;
};

/*
 * ------------------------------------------------------------
 * QUALIFICATION-AWARE QUIZ LIBRARY
 * ------------------------------------------------------------
 *
 * GCSE and A-Level may use the same canonical curriculum topic
 * IDs, but their assessment demand is different.
 *
 * Therefore:
 *
 * GCSE    -> GCSE quiz library
 * A_LEVEL -> A-Level quiz library
 */
export function getQuizLibraryForQualification(
  qualification: Qualification,
): Record<string, Quiz> {
  if (qualification === "A_LEVEL") {
    return aLevelQuizLibrary;
  }

  return gcseQuizLibrary;
}

/*
 * Return curriculum topic IDs in specification order.
 */
export function getCurriculumTopicIds(
  qualification: Qualification,
  examBoard: ExamBoard,
): string[] {
  const curriculum =
    getCurriculumDefinition(
      qualification,
      examBoard,
    );

  if (!curriculum) {
    return [];
  }

  return Array.from(
    new Set(
      curriculum.units.flatMap(
        (unit) =>
          unit.topicIds,
      ),
    ),
  );
}

/*
 * Return all currently published quizzes belonging to the
 * selected qualification + exam board.
 */
export function getCurriculumQuizzes(
  qualification: Qualification,
  examBoard: ExamBoard,
): CurriculumQuiz[] {
  const curriculum =
    getCurriculumDefinition(
      qualification,
      examBoard,
    );

  if (!curriculum) {
    return [];
  }

  const quizLibrary =
    getQuizLibraryForQualification(
      qualification,
    );

  const results:
    CurriculumQuiz[] = [];

  const addedQuizIds =
    new Set<string>();

  for (
    const unit of
    curriculum.units
  ) {
    for (
      const topicId of
      unit.topicIds
    ) {
      const quiz =
        quizLibrary[
          topicId
        ];

      if (!quiz) {
        continue;
      }

      if (
        addedQuizIds.has(
          quiz.id,
        )
      ) {
        continue;
      }

      addedQuizIds.add(
        quiz.id,
      );

      results.push({
        quiz,
        topicId,
        unitId:
          unit.id,
        unitTitle:
          unit.title,
        qualification,
        examBoard,
      });
    }
  }

  return results;
}

/*
 * Check whether a canonical topic belongs to the student's
 * selected curriculum.
 */
export function isTopicInCurriculum(
  topicId: string,
  qualification: Qualification,
  examBoard: ExamBoard,
): boolean {
  return getCurriculumTopicIds(
    qualification,
    examBoard,
  ).includes(topicId);
}

/*
 * Return a quiz only when:
 *
 * 1. the topic belongs to this student's curriculum, AND
 * 2. a quiz exists for this qualification.
 *
 * This is what prevents an A-Level student from silently
 * receiving the GCSE Algorithms/Binary/etc quiz.
 */
export function getCurriculumQuizByTopic(
  topicId: string,
  qualification: Qualification,
  examBoard: ExamBoard,
): Quiz | null {
  if (
    !isTopicInCurriculum(
      topicId,
      qualification,
      examBoard,
    )
  ) {
    return null;
  }

  const quizLibrary =
    getQuizLibraryForQualification(
      qualification,
    );

  return (
    quizLibrary[
      topicId
    ] ??
    null
  );
}

/*
 * Return curriculum topics for which an appropriate quiz has
 * not yet been authored for the selected qualification.
 */
export function getCurriculumTopicsWithoutQuizzes(
  qualification: Qualification,
  examBoard: ExamBoard,
): string[] {
  const quizLibrary =
    getQuizLibraryForQualification(
      qualification,
    );

  return getCurriculumTopicIds(
    qualification,
    examBoard,
  ).filter(
    (topicId) =>
      !quizLibrary[
        topicId
      ],
  );
}