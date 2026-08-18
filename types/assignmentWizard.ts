export type AssignmentResourceType =
  | "lesson"
  | "quiz"
  | "ai-quiz"
  | "exam-paper"
  | "programming-challenge";

export type QuizDeliveryMode =
  | "practice"
  | "assessment";

export type AssignmentWizardResource = {
  id: string;
  title: string;
  description: string;
  resourceType: AssignmentResourceType;
  resourceId: string;

  // Lesson metadata
  topicId?: string;
  lessonId?: string;
  topicTitle?: string;

  // General curriculum metadata
  qualification?: "GCSE" | "A_LEVEL";
  examBoard?: string;

  // Quiz metadata
  quizTopicId?: string;
  questionCount?: number;
  estimatedTime?: string;

  // Written exam metadata
  examTopic?: string;
  examQualification?: string;
  totalMarks?: number;
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

  /*
   * Used for quiz / AI-quiz assignments.
   * Non-quiz resources retain the default value.
   */
  deliveryMode: QuizDeliveryMode;
};

export type AssignmentWizardStep =
  | "resource"
  | "classes"
  | "details"
  | "review";