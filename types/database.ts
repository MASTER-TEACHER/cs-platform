import type {
  AccountPlan,
  AccountType,
  ExamBoard,
  PersonalPlan,
  Qualification,
} from "@/types/user";

export type UserRole =
  | "student"
  | "teacher"
  | "admin";

export type AccountIntent =
  | "student"
  | "teacher";

export type TeacherAccessStatus =
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected"
  | "";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;

  role: UserRole;
  accountIntent: AccountIntent;
  teacherAccessStatus: TeacherAccessStatus;

  accountType: AccountType;
  plan: AccountPlan;
  personalPlan: PersonalPlan;
  schoolId: string;

  onboardingComplete: boolean;

  classIds: string[];

  qualification: Qualification | "";
  examBoard: ExamBoard | "";
  currentCourse: string;

  xp: number;
  streak: number;

  completedLessons: string[];
  completedTopics: string[];
  completedUnits: string[];
  completedPapers: string[];

  badges: string[];

  createdAt: Date;
  updatedAt: Date;
}
