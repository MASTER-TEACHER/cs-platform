export type ModelPaperQualification = "GCSE" | "A_LEVEL";
export type ModelPaperExamBoard = "AQA" | "OCR" | "EDEXCEL";

export interface ModelPaperDefinition {
  id: string;
  qualification: ModelPaperQualification;
  examBoard: ModelPaperExamBoard;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  questionIds: string[];
  notes: string;
}
