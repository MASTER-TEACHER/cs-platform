export type SecureQuizQuestionType =
  | "multipleChoice"
  | "trueFalse"
  | "shortAnswer";

export type SecureQuizDeliveryMode =
  | "practice"
  | "assessment";

export type SecureQuizIntegrityIncidentType =
  | "fullscreen_exit"
  | "fullscreen_restore"
  | "visibility_hidden"
  | "auto_submit";

export type SecureQuizIntegrityIncident = {
  type: SecureQuizIntegrityIncidentType;
  occurredAt: string;
  questionNumber: number;
  detail: string;
};

export type SecureQuizQuestion = {
  id: string;
  type: SecureQuizQuestionType;
  question: string;
  options?: string[];
  xpReward: number;
};

export type SecureQuiz = {
  id: string;
  topicId: string;
  title: string;
  description: string;
  estimatedTime: string;
  questions: SecureQuizQuestion[];

  /*
   * Server-created attempt identifier.
   * This is not a secret; it is bound to the authenticated user
   * on the server and prevents replaying a completed submission.
   */
  attemptId: string;

  deliveryMode: SecureQuizDeliveryMode;
};

export type SecureQuizListItem = {
  id: string;
  topicId: string;
  title: string;
  description: string;
  estimatedTime: string;
  questionCount: number;
  unitTitle?: string;
};

export type SecureQuizReviewItem = {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  correct: boolean;
};

export type SecureQuizMarkResult = {
  correctCount: number;
  totalQuestions: number;
  scorePercent: number;
  earnedXP: number;
  xpAwardedThisAttempt: boolean;
  persisted: boolean;
  assignmentResultPersisted: boolean;
  review: SecureQuizReviewItem[];
};
