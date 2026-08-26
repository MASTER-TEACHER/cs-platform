import { indicativeGradeFromPercentage } from "@/services/qualificationGradeService";
import type { Qualification } from "@/types/user";

import type {
  ExamTrainerAnswer,
  ExamTrainerDifficulty,
  ExamTrainerMarkedAnswer,
  ExamTrainerQuestion,
  ExamTrainerReport,
} from "@/types/examTrainer";

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function automaticMark(
  question: ExamTrainerQuestion,
  response: string,
): ExamTrainerMarkedAnswer | null {
  const accepted = [
    question.correctAnswer,
    ...(question.acceptedAnswers ?? []),
  ].filter((value): value is string => Boolean(value));

  if (question.type !== "multiple-choice" && accepted.length === 0) {
    return null;
  }

  const correct = accepted.some(
    (answer) => normalise(answer) === normalise(response),
  );

  return {
    questionId: question.id,
    awardedMarks: correct ? question.marks : 0,
    maximumMarks: question.marks,
    percentage: correct ? 100 : 0,
    feedback: correct
      ? "Correct. You have matched the expected answer."
      : "This answer does not match the expected response.",
    matchedPoints: correct ? question.markScheme : [],
    missingPoints: correct ? [] : question.markScheme,
    improvedAnswer: question.modelAnswer,
    mode: "automatic",
  };
}

async function markWrittenAnswer(
  question: ExamTrainerQuestion,
  response: string,
): Promise<ExamTrainerMarkedAnswer> {
  const apiResponse = await fetch("/api/ai/mark-lesson-question", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: question.topic,
      lessonTitle: "Exam Question Trainer",
      question: question.question,
      maximumMarks: question.marks,
      modelAnswer: question.modelAnswer,
      markScheme: question.markScheme,
      guidance: question.examinerGuidance ?? [],
      studentResponse: response,
    }),
  });

  const result = (await apiResponse.json()) as {
    awardedMarks?: number;
    maximumMarks?: number;
    percentage?: number;
    feedback?: string;
    matchedPoints?: string[];
    missingPoints?: string[];
    improvedAnswer?: string;
    mode?: "ai" | "demo";
    error?: string;
  };

  if (!apiResponse.ok || typeof result.awardedMarks !== "number") {
    throw new Error(result.error || "The written answer could not be marked.");
  }

  return {
    questionId: question.id,
    awardedMarks: result.awardedMarks,
    maximumMarks: result.maximumMarks ?? question.marks,
    percentage:
      result.percentage ??
      Math.round((result.awardedMarks / question.marks) * 100),
    feedback: result.feedback ?? "Your answer has been marked.",
    matchedPoints: result.matchedPoints ?? [],
    missingPoints: result.missingPoints ?? [],
    improvedAnswer: result.improvedAnswer ?? question.modelAnswer,
    mode: result.mode ?? "demo",
  };
}

export function buildExamQuestions({
  topic,
  difficulty,
  count,
  questionBank,
}: {
  topic: string;
  difficulty: ExamTrainerDifficulty | "all";
  count: number;
  questionBank: ExamTrainerQuestion[];
}): ExamTrainerQuestion[] {
  const filtered = questionBank.filter((question) => {
    const topicMatches = topic === "all" || question.topic === topic;
    const difficultyMatches =
      difficulty === "all" || question.difficulty === difficulty;

    return topicMatches && difficultyMatches;
  });

  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.max(1, Math.min(count, shuffled.length)));
}

export async function markExamTrainerAttempt({
  questions,
  answers,
  qualification,
}: {
  questions: ExamTrainerQuestion[];
  answers: ExamTrainerAnswer[];
  qualification?: Qualification | "";
}): Promise<ExamTrainerReport> {
  const markedAnswers = await Promise.all(
    questions.map(async (question) => {
      const response =
        answers.find((answer) => answer.questionId === question.id)?.response ??
        "";

      if (!response.trim()) {
        return {
          questionId: question.id,
          awardedMarks: 0,
          maximumMarks: question.marks,
          percentage: 0,
          feedback: "No answer was provided.",
          matchedPoints: [],
          missingPoints: question.markScheme,
          improvedAnswer: question.modelAnswer,
          mode: "automatic" as const,
        };
      }

      const automatic = automaticMark(question, response);

      if (automatic) {
        return automatic;
      }

      try {
        return await markWrittenAnswer(question, response);
      } catch {
        return {
          questionId: question.id,
          awardedMarks: 0,
          maximumMarks: question.marks,
          percentage: 0,
          feedback:
            "Automatic marking was unavailable. Review the model answer and mark scheme.",
          matchedPoints: [],
          missingPoints: question.markScheme,
          improvedAnswer: question.modelAnswer,
          mode: "demo" as const,
        };
      }
    }),
  );

  const totalAwardedMarks = markedAnswers.reduce(
    (total, answer) => total + answer.awardedMarks,
    0,
  );

  const totalAvailableMarks = questions.reduce(
    (total, question) => total + question.marks,
    0,
  );

  const percentage =
    totalAvailableMarks > 0
      ? Math.round((totalAwardedMarks / totalAvailableMarks) * 100)
      : 0;

  const topicMap = new Map<
    string,
    { awardedMarks: number; availableMarks: number }
  >();

  questions.forEach((question) => {
    const marked = markedAnswers.find(
      (answer) => answer.questionId === question.id,
    );

    const existing = topicMap.get(question.topic) ?? {
      awardedMarks: 0,
      availableMarks: 0,
    };

    topicMap.set(question.topic, {
      awardedMarks: existing.awardedMarks + (marked?.awardedMarks ?? 0),
      availableMarks: existing.availableMarks + question.marks,
    });
  });

  const topicScores = Array.from(topicMap.entries())
    .map(([topic, values]) => ({
      topic,
      awardedMarks: values.awardedMarks,
      availableMarks: values.availableMarks,
      percentage:
        values.availableMarks > 0
          ? Math.round((values.awardedMarks / values.availableMarks) * 100)
          : 0,
    }))
    .sort((first, second) => second.percentage - first.percentage);


  return {
    totalAwardedMarks,
    totalAvailableMarks,
    percentage,
    grade: indicativeGradeFromPercentage(percentage, qualification),
    topicScores,
    strongestTopics: topicScores
      .filter((topic) => topic.percentage >= 70)
      .map((topic) => topic.topic),
    priorityTopics: topicScores
      .filter((topic) => topic.percentage < 60)
      .map((topic) => topic.topic),
    markedAnswers,
  };
}
