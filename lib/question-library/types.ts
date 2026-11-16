export type QuestionReviewStatus =
  | "draft"
  | "needs_review"
  | "approved";

export type QuestionDifficulty =
  | "foundation"
  | "standard"
  | "higher";

export type QuestionLibraryItem = {
  id: string;
  teacherId: string;
  qualification: string;
  examBoard: string;
  topic: string;
  subtopic: string;
  questionType: string;
  difficulty: QuestionDifficulty;
  question: string;
  context: string;
  marks: number;
  modelAnswer: string;
  markScheme: string[];
  reviewStatus: QuestionReviewStatus;
  source: "ai" | "teacher" | "import";
  createdAt: string;
  updatedAt: string;
};