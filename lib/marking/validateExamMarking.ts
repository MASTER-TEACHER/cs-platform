import type { StudentExamAnswer } from "@/types/examAssignment";

type Question = { id: string; marks: number };

export function validateExamMarking(
  questions: unknown,
  answers: StudentExamAnswer[],
  requireComplete: boolean,
): void {
  if (!Array.isArray(questions) || questions.length === 0 ||
      !Array.isArray(answers) || answers.length !== questions.length) {
    throw new Error("The marking does not match the assigned examination.");
  }
  const marks = new Map<string, number>();
  for (const question of questions as Question[]) {
    if (typeof question.id !== "string" || !question.id ||
        !Number.isInteger(question.marks) || question.marks <= 0 ||
        marks.has(question.id)) {
      throw new Error("The assigned examination contains invalid question marks.");
    }
    marks.set(question.id, question.marks);
  }
  const seen = new Set<string>();
  for (const answer of answers) {
    if (!answer || typeof answer.questionId !== "string" ||
        seen.has(answer.questionId) || !marks.has(answer.questionId)) {
      throw new Error("Duplicate or unrecognised question in marking.");
    }
    seen.add(answer.questionId);
    const value = answer.awardedMarks;
    if (value === null && !requireComplete) continue;
    const maximum = marks.get(answer.questionId)!;
    if (typeof value !== "number" || !Number.isInteger(value) ||
        value < 0 || value > maximum) {
      throw new Error(`Awarded marks must be a whole number from 0 to ${maximum}.`);
    }
  }
}
