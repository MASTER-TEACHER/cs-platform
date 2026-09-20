import { getCurriculumDefinition } from "@/data/curriculum/curriculumMap";
import { quizLibrary as gcseQuizLibrary } from "@/data/quizzes";
import { aLevelQuizLibrary } from "@/data/quizzes/a-level";

import type { Quiz } from "@/types/quiz";
import type {
  ExamBoard,
  Qualification,
  Subject,
} from "@/types/user";

export type CurriculumQuiz = {
  quiz: Quiz;
  topicId: string;
  unitId: string;
  unitTitle: string;
  qualification: Qualification;
  examBoard: ExamBoard;
};

function resolveCurriculumArgs(
  subjectOrQualification: Subject | Qualification,
  qualificationOrExamBoard: Qualification | ExamBoard,
  maybeExamBoard?: ExamBoard,
): {
  subject: Subject;
  qualification: Qualification;
  examBoard: ExamBoard;
} {
  if (maybeExamBoard === undefined) {
    return {
      subject: "COMPUTER_SCIENCE",
      qualification: subjectOrQualification as Qualification,
      examBoard: qualificationOrExamBoard as ExamBoard,
    };
  }

  return {
    subject: subjectOrQualification as Subject,
    qualification: qualificationOrExamBoard as Qualification,
    examBoard: maybeExamBoard,
  };
}

export function getQuizLibraryForQualification(
  qualification: Qualification,
): Record<string, Quiz> {
  if (qualification === "A_LEVEL") {
    return aLevelQuizLibrary;
  }

  return gcseQuizLibrary;
}

export function getCurriculumTopicIds(
  subject: Subject,
  qualification: Qualification,
  examBoard: ExamBoard,
): string[];
export function getCurriculumTopicIds(
  qualification: Qualification,
  examBoard: ExamBoard,
): string[];
export function getCurriculumTopicIds(
  subjectOrQualification: Subject | Qualification,
  qualificationOrExamBoard: Qualification | ExamBoard,
  maybeExamBoard?: ExamBoard,
): string[] {
  const {
    subject,
    qualification,
    examBoard,
  } = resolveCurriculumArgs(
    subjectOrQualification,
    qualificationOrExamBoard,
    maybeExamBoard,
  );

  const curriculum =
    getCurriculumDefinition(
      subject,
      qualification,
      examBoard,
    );

  if (!curriculum) {
    return [];
  }

  return Array.from(
    new Set(
      curriculum.units.flatMap(
        (unit) => unit.topicIds,
      ),
    ),
  );
}

export function getCurriculumQuizzes(
  subject: Subject,
  qualification: Qualification,
  examBoard: ExamBoard,
): CurriculumQuiz[];
export function getCurriculumQuizzes(
  qualification: Qualification,
  examBoard: ExamBoard,
): CurriculumQuiz[];
export function getCurriculumQuizzes(
  subjectOrQualification: Subject | Qualification,
  qualificationOrExamBoard: Qualification | ExamBoard,
  maybeExamBoard?: ExamBoard,
): CurriculumQuiz[] {
  const {
    subject,
    qualification,
    examBoard,
  } = resolveCurriculumArgs(
    subjectOrQualification,
    qualificationOrExamBoard,
    maybeExamBoard,
  );

  const curriculum =
    getCurriculumDefinition(
      subject,
      qualification,
      examBoard,
    );

  if (!curriculum) {
    return [];
  }

  /*
   * Creative iMedia currently has interactive lessons but no dedicated
   * built-in quiz library. Returning an empty collection is intentional:
   * it prevents GCSE Computer Science quizzes being exposed simply because
   * both courses use OCR + GCSE.
   */
  if (subject === "CREATIVE_IMEDIA") {
    return [];
  }

  const quizLibrary =
    getQuizLibraryForQualification(
      qualification,
    );

  const results: CurriculumQuiz[] = [];
  const addedQuizIds = new Set<string>();

  for (const unit of curriculum.units) {
    for (const topicId of unit.topicIds) {
      const quiz = quizLibrary[topicId];

      if (!quiz || addedQuizIds.has(quiz.id)) {
        continue;
      }

      addedQuizIds.add(quiz.id);

      results.push({
        quiz,
        topicId,
        unitId: unit.id,
        unitTitle: unit.title,
        qualification,
        examBoard,
      });
    }
  }

  return results;
}

export function isTopicInCurriculum(
  topicId: string,
  subject: Subject,
  qualification: Qualification,
  examBoard: ExamBoard,
): boolean;

export function isTopicInCurriculum(
  topicId: string,
  qualification: Qualification,
  examBoard: ExamBoard,
): boolean;

export function isTopicInCurriculum(
  topicId: string,
  subjectOrQualification:
    | Subject
    | Qualification,
  qualificationOrExamBoard:
    | Qualification
    | ExamBoard,
  maybeExamBoard?: ExamBoard,
): boolean {
  if (maybeExamBoard === undefined) {
    return getCurriculumTopicIds(
      subjectOrQualification as Qualification,
      qualificationOrExamBoard as ExamBoard,
    ).includes(topicId);
  }

  return getCurriculumTopicIds(
    subjectOrQualification as Subject,
    qualificationOrExamBoard as Qualification,
    maybeExamBoard,
  ).includes(topicId);
}
export function getCurriculumQuizByTopic(
  topicId: string,
  subject: Subject,
  qualification: Qualification,
  examBoard: ExamBoard,
): Quiz | null;
export function getCurriculumQuizByTopic(
  topicId: string,
  qualification: Qualification,
  examBoard: ExamBoard,
): Quiz | null;
export function getCurriculumQuizByTopic(
  topicId: string,
  subjectOrQualification: Subject | Qualification,
  qualificationOrExamBoard: Qualification | ExamBoard,
  maybeExamBoard?: ExamBoard,
): Quiz | null {
  const {
    subject,
    qualification,
    examBoard,
  } = resolveCurriculumArgs(
    subjectOrQualification,
    qualificationOrExamBoard,
    maybeExamBoard,
  );

  if (subject === "CREATIVE_IMEDIA") {
    return null;
  }

  if (
    !isTopicInCurriculum(
      topicId,
      subject,
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

  return quizLibrary[topicId] ?? null;
}

export function getCurriculumTopicsWithoutQuizzes(
  subject: Subject,
  qualification: Qualification,
  examBoard: ExamBoard,
): string[];
export function getCurriculumTopicsWithoutQuizzes(
  qualification: Qualification,
  examBoard: ExamBoard,
): string[];
export function getCurriculumTopicsWithoutQuizzes(
  subjectOrQualification: Subject | Qualification,
  qualificationOrExamBoard: Qualification | ExamBoard,
  maybeExamBoard?: ExamBoard,
): string[] {
  const {
    subject,
    qualification,
    examBoard,
  } = resolveCurriculumArgs(
    subjectOrQualification,
    qualificationOrExamBoard,
    maybeExamBoard,
  );

  if (subject === "CREATIVE_IMEDIA") {
    return getCurriculumTopicIds(
      subject,
      qualification,
      examBoard,
    );
  }

  const quizLibrary =
    getQuizLibraryForQualification(
      qualification,
    );

  return getCurriculumTopicIds(
    subject,
    qualification,
    examBoard,
  ).filter(
    (topicId) => !quizLibrary[topicId],
  );
}
