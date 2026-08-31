import type {
  DecodedIdToken,
} from "firebase-admin/auth";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export type BillingTeacherAccessStatus =
  | ""
  | "not_submitted"
  | "pending"
  | "approved"
  | "rejected";

export type BillingActor = {
  token: DecodedIdToken;

  uid: string;

  role: string;

  schoolId: string;

  accountIntent:
    | ""
    | "student"
    | "teacher";

  teacherAccessStatus:
    BillingTeacherAccessStatus;
};

function normaliseString(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function normaliseAccountIntent(
  value: unknown,
  role: string,
):
  | ""
  | "student"
  | "teacher" {
  if (
    value === "student" ||
    value === "teacher"
  ) {
    return value;
  }

  /*
   * Migration support for older teacher/admin profiles.
   */
  if (
    role === "teacher" ||
    role === "admin"
  ) {
    return "teacher";
  }

  return "";
}

function normaliseTeacherAccessStatus(
  value: unknown,
  role: string,
  accountIntent:
    | ""
    | "student"
    | "teacher",
): BillingTeacherAccessStatus {
  if (
    value ===
      "not_submitted" ||
    value === "pending" ||
    value === "approved" ||
    value === "rejected"
  ) {
    return value;
  }

  /*
   * IMPORTANT MIGRATION RULE
   * -----------------------------------------------------
   *
   * Existing teacher/admin accounts may pre-date the
   * verification system. They remain approved so the new
   * commercial gate does not suddenly lock current users out.
   */
  if (
    role === "teacher" ||
    role === "admin"
  ) {
    return "approved";
  }

  if (
    accountIntent ===
    "teacher"
  ) {
    return "not_submitted";
  }

  return "";
}

export function readBearerToken(
  request: Request,
): string {
  const authorization =
    request.headers.get(
      "authorization",
    ) || "";

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return "";
  }

  return authorization
    .slice(
      "Bearer ".length,
    )
    .trim();
}

export async function requireBillingActor(
  request: Request,
): Promise<BillingActor> {
  const idToken =
    readBearerToken(
      request,
    );

  if (!idToken) {
    throw new Error(
      "AUTH_REQUIRED",
    );
  }

  const token =
    await adminAuth.verifyIdToken(
      idToken,
    );

  const profileSnapshot =
    await adminDb
      .collection(
        "users",
      )
      .doc(
        token.uid,
      )
      .get();

  if (
    !profileSnapshot.exists
  ) {
    throw new Error(
      "PROFILE_NOT_FOUND",
    );
  }

  const profile =
    profileSnapshot.data() ||
    {};

  const role =
    normaliseString(
      profile.role,
    );

  const accountIntent =
    normaliseAccountIntent(
      profile.accountIntent,
      role,
    );

  const teacherAccessStatus =
    normaliseTeacherAccessStatus(
      profile.teacherAccessStatus,
      role,
      accountIntent,
    );

  return {
    token,

    uid:
      token.uid,

    role,

    schoolId:
      normaliseString(
        profile.schoolId,
      ),

    accountIntent,

    teacherAccessStatus,
  };
}

export async function requireApprovedTeacher(
  request: Request,
): Promise<BillingActor> {
  const actor =
    await requireBillingActor(
      request,
    );

  if (
    actor.role !==
    "teacher"
  ) {
    throw new Error(
      "TEACHER_REQUIRED",
    );
  }

  if (
    actor.teacherAccessStatus !==
    "approved"
  ) {
    throw new Error(
      "TEACHER_APPROVAL_REQUIRED",
    );
  }

  return actor;
}

export async function requireSchoolBillingManager(
  request: Request,
): Promise<
  BillingActor & {
    schoolId: string;
    schoolName: string;
  }
> {
  const actor =
    await requireBillingActor(
      request,
    );

  if (
    actor.role !==
      "teacher" &&
    actor.role !==
      "admin"
  ) {
    throw new Error(
      "BILLING_MANAGER_REQUIRED",
    );
  }

  /*
   * Teachers must be verified before they can manage a
   * commercial school relationship.
   *
   * Platform admins remain exempt.
   */
  if (
    actor.role ===
      "teacher" &&
    actor.teacherAccessStatus !==
      "approved"
  ) {
    throw new Error(
      "TEACHER_APPROVAL_REQUIRED",
    );
  }

  if (!actor.schoolId) {
    throw new Error(
      "SCHOOL_REQUIRED",
    );
  }

  const schoolSnapshot =
    await adminDb
      .collection(
        "schools",
      )
      .doc(
        actor.schoolId,
      )
      .get();

  if (
    !schoolSnapshot.exists
  ) {
    throw new Error(
      "SCHOOL_NOT_FOUND",
    );
  }

  const school =
    schoolSnapshot.data() ||
    {};

  if (
    actor.role !==
      "admin" &&
    school.ownerUserId !==
      actor.uid
  ) {
    const memberSnapshot =
      await adminDb
        .collection(
          "schools",
        )
        .doc(
          actor.schoolId,
        )
        .collection(
          "members",
        )
        .doc(
          actor.uid,
        )
        .get();

    const membership =
      memberSnapshot.exists
        ? memberSnapshot.data()
        : null;

    if (
      membership?.role !==
        "school_admin" ||
      membership?.status !==
        "active"
    ) {
      throw new Error(
        "SCHOOL_ADMIN_REQUIRED",
      );
    }
  }

  return {
    ...actor,

    schoolId:
      actor.schoolId,

    schoolName:
      typeof school.name ===
      "string"
        ? school.name
        : "CS Master School",
  };
}

export function billingAuthError(
  error: unknown,
): {
  status: number;
  message: string;
} {
  const code =
    error instanceof Error
      ? error.message
      : "";

  switch (code) {
    case "AUTH_REQUIRED":
      return {
        status: 401,

        message:
          "Sign in to manage billing.",
      };

    case "PROFILE_NOT_FOUND":
      return {
        status: 403,

        message:
          "Your CS Master profile could not be found.",
      };

    case "TEACHER_REQUIRED":
      return {
        status: 403,

        message:
          "An approved teacher account is required.",
      };

    case "TEACHER_APPROVAL_REQUIRED":
      return {
        status: 403,

        message:
          "Your school must verify your teacher account before teacher trials or school billing become available.",
      };

    case "BILLING_MANAGER_REQUIRED":
      return {
        status: 403,

        message:
          "Teacher or administrator access is required.",
      };

    case "SCHOOL_REQUIRED":
      return {
        status: 409,

        message:
          "Create or join a school before managing a school subscription.",
      };

    case "SCHOOL_NOT_FOUND":
      return {
        status: 404,

        message:
          "The school could not be found.",
      };

    case "SCHOOL_ADMIN_REQUIRED":
      return {
        status: 403,

        message:
          "Only the school owner or a school administrator can manage billing.",
      };

    default:
      return {
        status: 500,

        message:
          error instanceof Error
            ? error.message
            : "Billing request failed.",
      };
  }
}