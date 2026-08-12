export type ExamTrainerDifficulty = "foundation" | "standard" | "higher";

export type ExamTrainerQuestionType =
  | "multiple-choice"
  | "short-response"
  | "extended-response"
  | "calculation"
  | "code-tracing";

export type ExamTrainerQuestion = {
  id: string;
  topic: string;
  difficulty: ExamTrainerDifficulty;
  type: ExamTrainerQuestionType;
  commandWord: string;
  question: string;
  marks: number;
  options?: string[];
  correctAnswer?: string;
  acceptedAnswers?: string[];
  modelAnswer: string;
  markScheme: string[];
  examinerGuidance?: string[];
};

export type ExamTrainerAnswer = {
  questionId: string;
  response: string;
};

export type ExamTrainerMarkedAnswer = {
  questionId: string;
  awardedMarks: number;
  maximumMarks: number;
  percentage: number;
  feedback: string;
  matchedPoints: string[];
  missingPoints: string[];
  improvedAnswer: string;
  mode: "automatic" | "ai" | "demo";
};

export type ExamTrainerTopicScore = {
  topic: string;
  awardedMarks: number;
  availableMarks: number;
  percentage: number;
};

export type ExamTrainerReport = {
  totalAwardedMarks: number;
  totalAvailableMarks: number;
  percentage: number;
  grade: string;
  topicScores: ExamTrainerTopicScore[];
  strongestTopics: string[];
  priorityTopics: string[];
  markedAnswers: ExamTrainerMarkedAnswer[];
};

export type ExamTrainerAttemptStatus =
  "in_progress" | "submitted" | "abandoned";

export type ExamTrainerAttempt = {
  id: string;
  studentId: string;
  selectedTopic: string;
  selectedDifficulty: ExamTrainerDifficulty | "all";
  requestedQuestionCount: number;
  questions: ExamTrainerQuestion[];
  answers: ExamTrainerAnswer[];
  currentQuestionIndex: number;
  durationSeconds: number;
  secondsRemaining: number;
  status: ExamTrainerAttemptStatus;
  report: ExamTrainerReport | null;
  startedAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
};

export type ExamTrainerHistoryItem = {
  id: string;
  selectedTopic: string;
  selectedDifficulty: ExamTrainerDifficulty | "all";
  questionCount: number;
  percentage: number;
  grade: string;
  totalAwardedMarks: number;
  totalAvailableMarks: number;
  startedAt: Date;
  submittedAt: Date | null;
  priorityTopics: string[];
};

export type ExamTrainerDashboardSummary = {
  completedAttempts: number;
  averagePercentage: number;
  bestPercentage: number;
  bestGrade: string;
  latestPercentage: number;
  weakestTopic: string | null;
  strongestTopic: string | null;
  recentTrend: number;
};
