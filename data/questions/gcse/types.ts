export type GCSEExamBoard = "AQA" | "OCR" | "EDEXCEL";

export type GCSEQuestionDifficulty =
  | "foundation"
  | "standard"
  | "advanced";

export type GCSEQuestionType =
  | "short-answer"
  | "explain"
  | "compare"
  | "scenario"
  | "trace"
  | "calculation"
  | "algorithm"
  | "programming"
  | "debugging"
  | "evaluate";

export interface GCSEPracticeQuestion {
  id: string;
  boards: GCSEExamBoard[];
  topicId: string;
  topicTitle: string;
  subtopic: string;
  specificationReferences: string[];
  questionType: GCSEQuestionType;
  difficulty: GCSEQuestionDifficulty;
  marks: number;
  question: string;
  markPoints: string[];
  modelAnswer: string;
  examinerGuidance?: string[];
  lessonKeywords: string[];
  curriculumAreaIds: string[];
}
