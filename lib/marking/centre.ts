import "server-only";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";

export type CentreActor = Awaited<ReturnType<typeof requireAuthenticatedUser>>;
export function requireCentreTeacher(actor: CentreActor): void {
  if (!(["teacher", "admin"].includes(actor.role.toLowerCase()))) throw new Error("CENTRE_FORBIDDEN");
}
export const centreCollection = adminDb.collection("markingCentreExams");
export function centreError(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (code === "CENTRE_FORBIDDEN") return { status: 403, error: "Approved teacher access is required." };
  if (code === "CENTRE_NOT_FOUND") return { status: 404, error: "Examination not found." };
  if (code === "CENTRE_INVALID") return { status: 400, error: "Invalid examination details." };
  if (code === "CENTRE_LIMIT") return { status: 400, error: "Candidate limit exceeded (maximum 100 per request, 1,000 per examination)." };
  if (["AUTH_REQUIRED", "AUTH_INVALID"].includes(code)) return { status: 401, error: "Please sign in again." };
  if (["ACCOUNT_DISABLED", "PROFILE_NOT_FOUND"].includes(code)) return { status: 403, error: "Account unavailable." };
  console.error("[Marking Centre]", error);
  return { status: 500, error: "Unable to complete this request." };
}
export function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
