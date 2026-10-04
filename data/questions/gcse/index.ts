import { gcseAlgorithmQuestions } from "./algorithms";
import { gcseProgrammingQuestions } from "./programming";
import { gcseDataRepresentationQuestions } from "./data-representation";
import { gcseComputerSystemsQuestions } from "./computer-systems";
import { gcseNetworkQuestions } from "./networks";
import { gcseCyberSecurityQuestions } from "./cyber-security";
import { gcseDatabaseQuestions } from "./databases";
import { gcseBooleanLogicQuestions } from "./boolean-logic";
import { gcseSoftwareQuestions } from "./software";
import { gcseImpactsQuestions } from "./impacts";
import { gcseRobustProgrammingQuestions } from "./robust-programming";

import type {
  GCSEExamBoard,
  GCSEPracticeQuestion,
  GCSEQuestionDifficulty,
  GCSEQuestionType,
} from "./types";

export type {
  GCSEExamBoard,
  GCSEPracticeQuestion,
  GCSEQuestionDifficulty,
  GCSEQuestionType,
} from "./types";

export const gcsePracticeQuestions: GCSEPracticeQuestion[] = [
  ...gcseAlgorithmQuestions,
  ...gcseProgrammingQuestions,
  ...gcseDataRepresentationQuestions,
  ...gcseComputerSystemsQuestions,
  ...gcseNetworkQuestions,
  ...gcseCyberSecurityQuestions,
  ...gcseDatabaseQuestions,
  ...gcseBooleanLogicQuestions,
  ...gcseSoftwareQuestions,
  ...gcseImpactsQuestions,
  ...gcseRobustProgrammingQuestions,
];

export function getGCSEPracticeQuestionsForBoard(
  board: GCSEExamBoard,
): GCSEPracticeQuestion[] {
  return gcsePracticeQuestions.filter((question) =>
    question.boards.includes(board),
  );
}

export function getGCSEPracticeQuestionsForTopic(
  topicId: string,
  board?: GCSEExamBoard,
): GCSEPracticeQuestion[] {
  return gcsePracticeQuestions.filter(
    (question) =>
      question.topicId === topicId &&
      (!board || question.boards.includes(board)),
  );
}

export function getGCSEPracticeQuestionById(
  questionId: string,
): GCSEPracticeQuestion | undefined {
  return gcsePracticeQuestions.find(
    (question) => question.id === questionId,
  );
}

export function getGCSEPracticeQuestionsByDifficulty(
  difficulty: GCSEQuestionDifficulty,
  board?: GCSEExamBoard,
): GCSEPracticeQuestion[] {
  return gcsePracticeQuestions.filter(
    (question) =>
      question.difficulty === difficulty &&
      (!board || question.boards.includes(board)),
  );
}

export function getGCSEPracticeQuestionsByType(
  questionType: GCSEQuestionType,
  board?: GCSEExamBoard,
): GCSEPracticeQuestion[] {
  return gcsePracticeQuestions.filter(
    (question) =>
      question.questionType === questionType &&
      (!board || question.boards.includes(board)),
  );
}
