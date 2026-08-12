export type ProgrammingMode = "practice" | "debug" | "explore";
export type ProgrammingDifficulty = "foundation" | "intermediate" | "higher";
export type ProgrammingQualification = "GCSE" | "A_LEVEL";
export type ProgrammingExamBoard = "AQA" | "OCR" | "EDEXCEL";

export type ProgrammingTestCase = {
  id: string;
  label: string;
  input: string;
  expectedOutput: string;
  hidden?: boolean;
};

export type ProgrammingChallenge = {
  id: string;
  title: string;
  description: string;
  topicId: string;
  mode: Exclude<ProgrammingMode, "explore">;
  difficulty: ProgrammingDifficulty;
  qualifications: ProgrammingQualification[];
  examBoards?: ProgrammingExamBoard[];
  starterCode: string;
  stdin?: string;
  visibleTests: ProgrammingTestCase[];
  hiddenTests: ProgrammingTestCase[];
  hint: string;
  explanation: string;
  examinerTip: string;
  xpReward: number;
};

export type PythonRunRequest = {
  code: string;
  stdin?: string;
  timeoutMs?: number;
};

export type PythonRunResult = {
  stdout: string;
  stderr: string;
  error: string;
  timedOut: boolean;
  durationMs: number;
};

export type ProgrammingTestResult = {
  id: string;
  label: string;
  passed: boolean;
  hidden: boolean;
  expectedOutput: string;
  actualOutput: string;
  error: string;
};

export type ProgrammingEvaluation = {
  passed: boolean;
  passedCount: number;
  totalCount: number;
  results: ProgrammingTestResult[];
};

export type ProgrammingAttemptHistory = {
  id: string;
  challengeId: string;
  challengeTitle: string;
  mode: Exclude<ProgrammingMode, "explore">;
  difficulty: ProgrammingDifficulty;
  passed: boolean;
  xpAwarded: number;
  createdAt: string;
};

export type ProgrammingProgressSnapshot = {
  attempts: number;
  correct: number;
  xp: number;
  streak: number;
  bestStreak: number;
  completedChallengeIds: string[];
  history: ProgrammingAttemptHistory[];
};
