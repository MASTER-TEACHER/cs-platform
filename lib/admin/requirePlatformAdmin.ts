import "server-only";

import type {
  DecodedIdToken,
} from "firebase-admin/auth";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export type PlatformAdminActor = {
  uid: string;
  token: DecodedIdToken;
  email: string;
};

function readBearerToken(
  request: Request,
): string {
  const authorization =
    request.headers.get(
      "authorization",
    ) ?? "";

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

export async function requirePlatformAdmin(
  request: Request,
): Promise<PlatformAdminActor> {
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
      .collection("users")
      .doc(token.uid)
      .get();

  if (!profileSnapshot.exists) {
    throw new Error(
      "PROFILE_NOT_FOUND",
    );
  }

  const profile =
    profileSnapshot.data() ??
    {};

  if (
    profile.role !==
    "admin"
  ) {
    throw new Error(
      "ADMIN_REQUIRED",
    );
  }

  return {
    uid:
      token.uid,

    token,

    email:
      typeof token.email ===
      "string"
        ? token.email
        : "",
  };
}

export function platformAdminError(
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
          "Sign in as a CS Master administrator.",
      };

    case "PROFILE_NOT_FOUND":
      return {
        status: 403,
        message:
          "Your CS Master administrator profile could not be found.",
      };

    case "ADMIN_REQUIRED":
      return {
        status: 403,
        message:
          "CS Master administrator access is required.",
      };

    default:
      return {
        status: 500,
        message:
          error instanceof Error
            ? error.message
            : "Administrator request failed.",
      };
  }
}