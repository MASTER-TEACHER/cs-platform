import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export type AuthenticatedActor = {
  uid: string;
  token: DecodedIdToken;
  email: string;
  name: string;
  role: string;
  schoolId: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function bearer(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

export async function requireAuthenticatedUser(
  request: Request,
): Promise<AuthenticatedActor> {
  const idToken = bearer(request);

  if (!idToken) {
    throw new Error("AUTH_REQUIRED");
  }

  let token: DecodedIdToken;

  try {
    token = await adminAuth.verifyIdToken(idToken);
  } catch {
    throw new Error("AUTH_INVALID");
  }

  const snapshot = await adminDb.collection("users").doc(token.uid).get();

  if (!snapshot.exists) {
    throw new Error("PROFILE_NOT_FOUND");
  }

  const profile = snapshot.data() ?? {};

  return {
    uid: token.uid,
    token,
    email: clean(profile.email) || clean(token.email),
    name: clean(profile.name) || clean(token.name) || "CS Master user",
    role: clean(profile.role),
    schoolId: clean(profile.schoolId),
  };
}

export function authenticatedUserError(error: unknown): {
  status: number;
  message: string;
} {
  const code = error instanceof Error ? error.message : "";

  switch (code) {
    case "AUTH_REQUIRED":
      return { status: 401, message: "Sign in to continue." };

    case "AUTH_INVALID":
      return {
        status: 401,
        message: "Your sign-in session is invalid or has expired. Please sign in again.",
      };

    case "PROFILE_NOT_FOUND":
      return {
        status: 403,
        message: "Your CS Master profile could not be found.",
      };

    default:
      console.error("[Authenticated route] Internal request failure:", error);
      return {
        status: 500,
        message: "The request could not be completed.",
      };
  }
}
