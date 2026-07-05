export type UserRole = "student" | "teacher" | "admin";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;

  classIds: string[];

  qualification?: string;
  examBoard?: string;
  currentCourse?: string;

  xp?: number;
  streak?: number;

  completedLessons?: string[];
  completedTopics?: string[];
  completedUnits?: string[];
  completedPapers?: string[];

  badges?: string[];

  createdAt: Date;
}