export type ALevelExamBoard =
  | "AQA"
  | "OCR";

export type ALevelQuestionType =
  | "short-answer"
  | "explain"
  | "calculate"
  | "trace"
  | "programming"
  | "compare"
  | "scenario"
  | "evaluate"
  | "extended-response";

export type ALevelQuestionDifficulty =
  | "foundation"
  | "standard"
  | "advanced";

export type ALevelPracticeQuestion = {
  id: string;
  boards: ALevelExamBoard[];
  topicId: string;
  topicTitle: string;
  subtopic: string;
  specificationReferences: string[];
  questionType: ALevelQuestionType;
  difficulty: ALevelQuestionDifficulty;
  marks: number;
  question: string;
  context?: string;
  markPoints: string[];
  modelAnswer: string;
  lessonKeywords?: string[];
  curriculumAreaIds: string[];
};
