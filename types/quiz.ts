export type QuizQuestionType =
  | "multipleChoice"
  | "trueFalse"
  | "shortAnswer";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
}

export interface Quiz {
  id: string;
  topicId: string;
  title: string;
  description: string;
  estimatedTime: string;
  questions: QuizQuestion[];
}