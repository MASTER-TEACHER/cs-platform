import type {
  QuestionLibraryItem,
} from "./types";

export type QuestionValidationResult = {
  valid: boolean;
  errors: string[];
};

export function normaliseQuestion(
  value: string,
): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function questionFingerprint(
  item: Pick<
    QuestionLibraryItem,
    "qualification" | "examBoard" | "question"
  >,
): string {
  return [
    normaliseQuestion(item.qualification),
    normaliseQuestion(item.examBoard),
    normaliseQuestion(item.question),
  ].join("|");
}

export function validateLibraryQuestion(
  item: QuestionLibraryItem,
): QuestionValidationResult {
  const errors: string[] = [];

  if (!item.teacherId.trim()) {
    errors.push("Teacher ownership is missing.");
  }

  if (!item.qualification.trim()) {
    errors.push("Qualification is missing.");
  }

  if (!item.examBoard.trim()) {
    errors.push("Exam board is missing.");
  }

  if (!item.topic.trim()) {
    errors.push("Topic is missing.");
  }

  if (item.question.trim().length < 25) {
    errors.push("Question is too short.");
  }

  if (
    !Number.isInteger(item.marks) ||
    item.marks < 1 ||
    item.marks > 30
  ) {
    errors.push("Invalid mark allocation.");
  }

  if (!item.modelAnswer.trim()) {
    errors.push("Model answer is missing.");
  }

  if (
    !Array.isArray(item.markScheme) ||
    item.markScheme.length === 0
  ) {
    errors.push("Mark scheme is missing.");
  }

  const combined = [
    item.question,
    item.context,
    item.modelAnswer,
    ...item.markScheme,
  ].join(" ");

  if (
    /\b(?:TODO|TBD|placeholder|insert question|supply values later)\b/i
      .test(combined)
  ) {
    errors.push("Placeholder content detected.");
  }

  if (
    /\b(?:calculate|convert|work out)\b/i.test(item.question) &&
    /\b(?:given values|provided values)\b/i.test(item.question) &&
    !/\d/.test(item.question + item.context)
  ) {
    errors.push("Calculation may be missing values.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function findDuplicateQuestions(
  items: QuestionLibraryItem[],
): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  for (const item of items) {
    const key = questionFingerprint(item);

    if (seen.has(key)) {
      duplicates.push(item.id);
    }

    seen.add(key);
  }

  return duplicates;
}