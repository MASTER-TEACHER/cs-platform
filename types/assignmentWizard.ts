export type AssignmentResourceType =
  | "lesson"
  | "quiz"
  | "ai-quiz"
  | "exam-paper"
  | "programming-challenge"
  | "teaching-resource";

export type QuizDeliveryMode =
  | "practice"
  | "assessment";

export type AssignmentRecipientMode =
  | "classes"
  | "students";

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

export type AssignmentWizardStudent = {
  id: string;
  name: string;
  email: string;
};

export type AssignmentWizardClass = {
  id: string;
  name: string;
  yearGroup: string;
  studentIds: string[];
  students: AssignmentWizardStudent[];
};

export type AssignmentWizardData = {
  resource: AssignmentWizardResource | null;
  recipientMode: AssignmentRecipientMode;
  selectedClassIds: string[];
  selectedStudentIds: string[];
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
