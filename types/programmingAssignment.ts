import type {
  ProgrammingDifficulty,
  ProgrammingExamBoard,
  ProgrammingMode,
  ProgrammingQualification,
  ProgrammingSkill,
} from "@/types/programming";

export type ProgrammingAssignmentStatus = "active" | "archived";
export type ProgrammingStudentStatus = "not_started" | "in_progress" | "completed";

export type ProgrammingChallengeSnapshot = {
  challengeId: string;
  title: string;
  topicId: string;
  skills: ProgrammingSkill[];
  mode: Exclude<ProgrammingMode, "explore">;
  difficulty: ProgrammingDifficulty;
  qualifications: ProgrammingQualification[];
  examBoards: ProgrammingExamBoard[];
  xpReward: number;
  estimatedMinutes: number;
};

export type ProgrammingAssignment = {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  studentIds: string[];
  studentCount: number;
  completedCount: number;
  challengeId: string;
  title: string;
  topic: string;
  instructions: string;
  dueDate: Date | null;
  createdAt: Date | null;
  status: ProgrammingAssignmentStatus;
  challengeSnapshot: ProgrammingChallengeSnapshot;
};

export type ProgrammingSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  status: ProgrammingStudentStatus;
  attempts: number;
  code: string;
  passedCount: number;
  totalTests: number;
  percentage: number;
  lastPassed: boolean;
  lastError: string;
  startedAt: Date | null;
  completedAt: Date | null;
  updatedAt: Date | null;
};

export type ProgrammingAssignmentResult = {
  studentId: string;
  studentName: string;
  status: ProgrammingStudentStatus;
  attempts: number;
  passedCount: number;
  totalTests: number;
  percentage: number;
  completedAt: Date | null;
};

export type ProgrammingAssignmentResultsSummary = {
  assignment: ProgrammingAssignment;
  results: ProgrammingAssignmentResult[];
  completed: number;
  inProgress: number;
  notStarted: number;
  completionPercentage: number;
  averagePercentage: number;
};
