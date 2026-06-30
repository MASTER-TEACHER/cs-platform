export type UserRole = "student" | "teacher" | "admin";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  classIds?: string[];
  createdAt: Date;
};

export type School = {
  id: string;
  name: string;
  plan: "trial" | "basic" | "premium";
  createdAt: Date;
};

export type ClassGroup = {
  id: string;
  schoolId: string;
  teacherId: string;
  name: string;
  yearGroup: string;
  joinCode: string;
  studentIds: string[];
  createdAt: Date;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  examLevel: "GCSE" | "A-Level";
  examBoard: "AQA" | "OCR" | "Edexcel" | "General";
  order: number;
};

export type Question = {
  id: string;
  topicId: string;
  type: "multiple-choice" | "short-answer" | "coding";
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  marks: number;
};

export type QuizAttempt = {
  id: string;
  studentId: string;
  topicId: string;
  score: number;
  total: number;
  percentage: number;
  completedAt: Date;
};

export type Progress = {
  id: string;
  studentId: string;
  topicId: string;
  completedQuestions: number;
  correctAnswers: number;
  mastery: number;
  lastUpdated: Date;
};

export type Assignment = {
  id: string;
  classId: string;
  teacherId: string;
  title: string;
  topicId: string;
  dueDate: Date;
  createdAt: Date;
};