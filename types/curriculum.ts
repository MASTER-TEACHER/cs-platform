export interface PracticeQuestion {
  question: string;
  answer: string;
}

export interface ExamQuestion {
  question: string;
  marks: number;
  answer: string;
}

export type SimulatorType = "binary" | "hexadecimal";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  xpReward: number;
  simulator?: SimulatorType;
  objectives: string[];
  explanation: string;
  workedExample: string;
  practiceQuestions: PracticeQuestion[];
  examQuestion: ExamQuestion;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: "⭐☆☆" | "⭐⭐☆" | "⭐⭐⭐";
  estimatedTime: string;
  simulator?: SimulatorType;
  lessons: Lesson[];
}