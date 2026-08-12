export type AssistantRole = "user" | "assistant";

export type AssistantMode =
  | "general"
  | "lesson-planner"
  | "resource-creator"
  | "subject-expert"
  | "intervention-coach"
  | "examiner"
  | "parent-report";

export type AssistantResponseSource = "ai" | "demo";

export type AssistantResourceType =
  | "lesson-plan"
  | "starter"
  | "retrieval-quiz"
  | "worksheet"
  | "homework"
  | "exit-ticket";

export type AssistantDifficulty = "foundation" | "standard" | "higher";

export type ResourceBuilderAction = {
  type: "open-resource-builder";

  resourceType: AssistantResourceType;

  topic: string;
  yearGroup: string;
  examBoard: string;
  duration: number;
  difficulty: AssistantDifficulty;

  objectives: string;
  additionalNotes: string;

  buttonLabel: string;
};

export type QuizGeneratorAction = {
  type: "open-quiz-generator";

  topic: string;
  qualification: string;
  examBoard: string;
  difficulty: AssistantDifficulty;
  questionCount: number;

  buttonLabel: string;
};

export type AssistantAction = ResourceBuilderAction | QuizGeneratorAction;

export type AssistantMessage = {
  id: string;
  role: AssistantRole;
  content: string;
  createdAt: string;

  source?: AssistantResponseSource;
  action?: AssistantAction;
};

export type AssistantRequestMessage = {
  role: AssistantRole;
  content: string;
};

export type SendAssistantMessageInput = {
  message: string;
  mode: AssistantMode;
  conversation: AssistantRequestMessage[];
  useDemo?: boolean;
};

export type AssistantApiResponse = {
  message?: string;
  source?: AssistantResponseSource;
  action?: AssistantAction;

  warning?: string;
  error?: string;
  errorCode?: string;
};

export type AssistantQuickAction = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  mode: AssistantMode;
  icon: string;
};
