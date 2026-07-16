export type QuizDifficulty =
  | "foundation"
  | "standard"
  | "higher";

export type GeneratedQuizQuestion = {
  id: string;
  type: "multipleChoice";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  xpReward: number;
};

export type GeneratedQuiz = {
  title: string;
  description: string;
  topicId: string;
  estimatedTime: string;
  questions: GeneratedQuizQuestion[];
};

export type QuizGeneratorSettings = {
  topic: string;
  qualification: string;
  examBoard: string;
  difficulty: QuizDifficulty;
  questionCount: number;
};

export type GenerateQuizResponse = {
  quiz?: GeneratedQuiz;
  error?: string;
};