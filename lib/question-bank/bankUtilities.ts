
import type {
  GeneratedExamQuestion,
  GeneratedExamQuestionSet,
} from "@/types/examQuestion";

export type BankQuestion = {
  key: string;
  sourceId: string;
  sourceTitle: string;
  qualification: string;
  examBoard: string;
  question: GeneratedExamQuestion;
};

export function normaliseQuestionText(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim();
}

export function flattenQuestionSets(
  sets: Array<{
    id: string;
    title: string;
    qualification: string;
    examBoard: string;
    content: GeneratedExamQuestionSet;
  }>,
): BankQuestion[] {
  return sets.flatMap((set) =>
    (set.content.questions ?? []).map((question, index) => ({
      key: `${set.id}:${index}`,
      sourceId: set.id,
      sourceTitle: set.title,
      qualification: set.qualification,
      examBoard: set.examBoard,
      question,
    })),
  );
}

export function deduplicateQuestions(
  questions: BankQuestion[],
): BankQuestion[] {
  const seen = new Set<string>();

  return questions.filter((item) => {
    const fingerprint = [
      item.qualification.toLowerCase(),
      item.examBoard.toLowerCase(),
      normaliseQuestionText(item.question.question),
    ].join("|");

    if (seen.has(fingerprint)) return false;

    seen.add(fingerprint);
    return true;
  });
}

export function composeQuestionSet(
  title: string,
  selected: BankQuestion[],
): GeneratedExamQuestionSet {
  if (!selected.length) {
    throw new Error("Select at least one question.");
  }

  const qualification = selected[0].qualification;
  const examBoard = selected[0].examBoard;

  if (
    selected.some(
      (item) =>
        item.qualification !== qualification ||
        item.examBoard !== examBoard,
    )
  ) {
    throw new Error(
      "A paper must use one qualification and exam board.",
    );
  }

  const questions = selected.map((item, index) => ({
    ...item.question,
    id: `question-${index + 1}`,
    questionNumber: index + 1,
  }));

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0,
  );

  const difficulties = [...new Set(questions.map((q) => q.difficulty))];

  return {
    id: crypto.randomUUID(),
    title: title.trim() || "Custom examination paper",
    description: "Teacher-composed CS Master examination paper.",
    qualification,
    examBoard,
    topic: [...new Set(questions.map((q) => q.topic))].join(", "),
    difficulty:
      difficulties.length === 1 ? difficulties[0] : "standard",
    generationMode: "manual",
    questionCount: questions.length,
    totalMarks,
    estimatedTime: `${Math.max(10, Math.ceil(totalMarks * 1.5))} minutes`,
    copyrightNotice:
      "Review question provenance and permissions before distribution.",
    blueprint: questions.map((question) => ({
      id: question.id,
      questionNumber: question.questionNumber,
      assessmentObjective: question.assessmentObjective,
      questionType: question.questionType,
      commandWord: question.commandWord,
      marks: question.marks,
      difficulty: question.difficulty,
      topicFocus: question.topic,
    })),
    questions,
    createdAt: new Date().toISOString(),
  };
}
