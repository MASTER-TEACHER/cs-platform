import "server-only";

import { requireAuthenticatedUser } from "@/lib/auth/requireUser";

export async function requireStudent(request: Request) {
  const actor = await requireAuthenticatedUser(request);

  if (actor.role.toLowerCase() !== "student") {
    throw new Error("STUDENT_ONLY");
  }

  return actor;
}

export function studentError(error: unknown) {
  const code = error instanceof Error ? error.message : "";

  if (code === "STUDENT_ONLY") {
    return { status: 403, message: "Student account required." };
  }

  if (code === "AUTH_REQUIRED" || code === "AUTH_INVALID") {
    return { status: 401, message: "Please sign in again." };
  }

  if (code === "ACCOUNT_DISABLED" || code === "PROFILE_NOT_FOUND") {
    return { status: 403, message: "Account access unavailable." };
  }

  console.error("[Student Question Bank]", error);
  return { status: 500, message: "Request could not be completed." };
}