import type {
  ExamTrainerDifficulty,
  ExamTrainerQuestion,
  ExamTrainerQuestionType,
} from "@/types/examTrainer";

import { gcsePracticeQuestions } from "./index";
import type {
  GCSEPracticeQuestion,
  GCSEQuestionType,
} from "./types";

const difficultyMap: Record<
  GCSEPracticeQuestion["difficulty"],
  ExamTrainerDifficulty
> = {
  foundation: "foundation",
  standard: "standard",
  advanced: "higher",
};

const questionTypeMap: Record<
  GCSEQuestionType,
  ExamTrainerQuestionType
> = {
  "short-answer": "short-response",
  explain: "short-response",
  compare: "extended-response",
  scenario: "extended-response",
  trace: "code-tracing",
  calculation: "calculation",
  algorithm: "extended-response",
  programming: "extended-response",
  debugging: "extended-response",
  evaluate: "extended-response",
};

const commandWordMap: Record<GCSEQuestionType, string> = {
  "short-answer": "state",
  explain: "explain",
  compare: "compare",
  scenario: "explain",
  trace: "trace",
  calculation: "calculate",
  algorithm: "design",
  programming: "write",
  debugging: "debug",
  evaluate: "evaluate",
};

export function toExamTrainerQuestion(
  question: GCSEPracticeQuestion,
): ExamTrainerQuestion {
  return {
    id: question.id,
    topic: question.topicTitle,
    difficulty: difficultyMap[question.difficulty],
    type: questionTypeMap[question.questionType],
    commandWord: commandWordMap[question.questionType],
    question: question.question,
    marks: question.marks,
    modelAnswer: question.modelAnswer,
    markScheme: question.markPoints,
    examinerGuidance: question.examinerGuidance,
  };
}

export const gcseExamTrainerQuestionBank: ExamTrainerQuestion[] =
  gcsePracticeQuestions.map(toExamTrainerQuestion);

export const gcseExamTrainerTopics = Array.from(
  new Set(gcseExamTrainerQuestionBank.map((question) => question.topic)),
).sort();
