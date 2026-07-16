export type AssignmentResourceType =
  | "lesson"
  | "quiz"
  | "ai-quiz"
  | "exam-paper";

export type AssignmentWizardResource = {
  id: string;
  title: string;
  description: string;
  resourceType: AssignmentResourceType;
  resourceId: string;
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