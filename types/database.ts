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

export type TeacherVerificationReviewStatus =
  | "school_verification_pending"
  | "platform_review_required"
  | "approved"
  | "rejected"
  | "";

export type TeacherVerificationRisk =
  | "same_organisation_domain"
  | "domain_mismatch"
  | "personal_email_domain"
  | "invalid_email_domain"
  | "";

export interface UserProfile {
  uid: string;

  name: string;
  email: string;

  role: UserRole;

  accountIntent:
    AccountIntent;

  teacherAccessStatus:
    TeacherAccessStatus;

  /*
   * Teacher registration / verification
   */
  schoolName: string;

  schoolAdminEmail: string;

  teacherVerificationReviewStatus:
    TeacherVerificationReviewStatus;

  teacherVerificationRisk:
    TeacherVerificationRisk;

  teacherVerificationRequestedAt:
    Date | null;

  teacherSchoolVerifiedAt:
    Date | null;

  teacherVerificationApprovedAt:
    Date | null;

  teacherVerificationRejectedAt:
    Date | null;

  /*
   * Billing / tenancy
   */
  accountType:
    AccountType;

  plan:
    AccountPlan;

  personalPlan:
    PersonalPlan;

  schoolId: string;

  classIds: string[];

  /*
   * Student curriculum
   */
  onboardingComplete:
    boolean;

  qualification:
    Qualification | "";

  examBoard:
    ExamBoard | "";

  currentCourse:
    string;

  /*
   * Progress
   */
  xp: number;
  streak: number;

  completedLessons:
    string[];

  completedTopics:
    string[];

  completedUnits:
    string[];

  completedPapers:
    string[];

  badges:
    string[];

  createdAt: Date;
  updatedAt: Date;
}