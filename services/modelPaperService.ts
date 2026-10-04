import { modelPaperDefinitions } from "@/data/modelPapers";
import { gcsePracticeQuestions } from "@/data/questions/gcse";
import { aLevelPracticeQuestions } from "@/data/a-level/questionBank";

export type ResolvedModelPaperQuestion = {
  id: string;
  topicId: string;
  topicTitle: string;
  subtopic: string;
  questionType: string;
  difficulty: string;
  marks: number;
  question: string;
  markPoints: string[];
  modelAnswer: string;
  examinerGuidance?: string[];
};

export type ResolvedModelPaper = {
  id: string;
  qualification: "GCSE" | "A_LEVEL";
  examBoard: "AQA" | "OCR" | "EDEXCEL";
  title: string;
  durationMinutes: number;
  totalMarks: number;
  notes: string;
  questions: ResolvedModelPaperQuestion[];
};

export function getResolvedModelPaper(
  paperId: string,
): ResolvedModelPaper | null {
  const definition = modelPaperDefinitions.find(
    (paper) => paper.id === paperId,
  );

  if (!definition) {
    return null;
  }

  const source =
    definition.qualification === "GCSE"
      ? gcsePracticeQuestions
      : aLevelPracticeQuestions;

  const byId = new Map(source.map((question) => [question.id, question]));

  const questions = definition.questionIds.map((questionId) => {
    const question = byId.get(questionId);

    if (!question) {
      throw new Error(
        `Model paper ${definition.id} references missing question ${questionId}.`,
      );
    }

    return question as ResolvedModelPaperQuestion;
  });

  const calculatedMarks = questions.reduce(
    (total, question) => total + question.marks,
    0,
  );

  if (calculatedMarks !== definition.totalMarks) {
    throw new Error(
      `Model paper ${definition.id} totals ${calculatedMarks} marks, expected ${definition.totalMarks}.`,
    );
  }

  return {
    ...definition,
    questions,
  };
}

export function getModelPaperMarkScheme(paperId: string) {
  const paper = getResolvedModelPaper(paperId);

  if (!paper) {
    return null;
  }

  return {
    paperId: paper.id,
    title: `${paper.title} — Mark scheme`,
    totalMarks: paper.totalMarks,
    questions: paper.questions.map((question, index) => ({
      number: index + 1,
      questionId: question.id,
      marks: question.marks,
      markPoints: question.markPoints,
      modelAnswer: question.modelAnswer,
      examinerGuidance: question.examinerGuidance ?? [],
    })),
  };
}
