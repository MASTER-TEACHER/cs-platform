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

export async function requireAuthenticatedUser(request: Request): Promise<AuthenticatedActor> {
  const idToken = bearer(request);
  if (!idToken) throw new Error("AUTH_REQUIRED");

  const token = await adminAuth.verifyIdToken(idToken);
  const snapshot = await adminDb.collection("users").doc(token.uid).get();
  if (!snapshot.exists) throw new Error("PROFILE_NOT_FOUND");

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

export function authenticatedUserError(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "AUTH_REQUIRED") return { status: 401, message: "Sign in to continue." };
  if (code === "PROFILE_NOT_FOUND") return { status: 403, message: "Your CS Master profile could not be found." };
  return { status: 500, message: error instanceof Error ? error.message : "The request could not be completed." };
}
