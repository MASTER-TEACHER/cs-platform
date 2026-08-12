export type AIMarkingConfidence = "high" | "medium" | "low";

export type AIQuestionMarkingSuggestion = {
  questionId: string;
  questionNumber: number;
  suggestedMarks: number;
  maximumMarks: number;
  confidence: AIMarkingConfidence;
  matchedMarkPoints: string[];
  missedMarkPoints: string[];
  evidenceFromResponse: string[];
  feedback: string;
  teacherReviewRequired: boolean;
};

export type AIExamMarkingResult = {
  mode: "live" | "demo";
  suggestions: AIQuestionMarkingSuggestion[];
  overallFeedback: string;
  strengths: string[];
  priorities: string[];
};
