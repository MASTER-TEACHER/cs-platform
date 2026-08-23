export type SchoolStatus =
  | "active"
  | "suspended"
  | "archived";

export type SchoolMemberRole =
  | "student"
  | "teacher"
  | "school_admin";

export type SchoolMembershipStatus =
  | "active"
  | "former";

export interface School {
  id: string;
  name: string;
  slug: string;
  status: SchoolStatus;
  ownerUserId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface SchoolMembership {
  id: string;
  schoolId: string;
  userId: string;
  role: SchoolMemberRole;
  status: SchoolMembershipStatus;
  joinedAt: Date | null;
  leftAt: Date | null;
  updatedAt: Date | null;
}

export type CreateSchoolInput = {
  name: string;
  ownerUserId: string;
};
