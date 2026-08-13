export type AssignmentResourceType =
  | "lesson"
  | "quiz"
  | "ai-quiz"
  | "exam-paper"
  | "programming-challenge";

export type AssignmentWizardResource = {
  id: string;
  title: string;
  description: string;
  resourceType: AssignmentResourceType;
  resourceId: string;

  topicId?: string;
  lessonId?: string;
  topicTitle?: string;
  qualification?: "GCSE" | "A_LEVEL";
  examBoard?: string;

  quizTopicId?: string;
  questionCount?: number;
  estimatedTime?: string;
};

export type AssignmentWizardClass = {
  id: string;
  name: string;
  yearGroup: string;
};

export type AssignmentWizardData = {
  resource: AssignmentWizardResource | null;
  selectedClassIds: string[];
  dueDate: string;
  instructions: string;
};

export type AssignmentWizardStep =
  | "resource"
  | "classes"
  | "details"
  | "review";
