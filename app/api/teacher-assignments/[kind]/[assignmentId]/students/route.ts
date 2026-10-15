import "server-only";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { requireAuthenticatedUser, authenticatedUserError } from "@/lib/auth/requireUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ kind: string; assignmentId: string }> };
const collections: Record<string, string> = {
  general: "assignments", quiz: "assignments", programming: "classAssignments", exam: "examAssignments",
};
const clean = (value: unknown): string => typeof value === "string" ? value.trim() : "";

export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    const { kind, assignmentId } = await context.params;
    const collection = collections[kind];
    if (!collection || !assignmentId || assignmentId.includes("/")) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }
    if (!["teacher", "admin", "school_admin"].includes(actor.role.toLowerCase())) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    const assignment = await adminDb.collection(collection).doc(assignmentId).get();
    if (!assignment.exists) return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    const data = assignment.data() ?? {};
    if ((kind === "quiz" && clean(data.type) !== "quiz") ||
        (kind === "general" && clean(data.type) === "quiz")) {
      return NextResponse.json({ error: "Assignment not found." }, { status: 404 });
    }
    const classId = clean(data.classId);
    if (!classId) return NextResponse.json({ error: "Access denied." }, { status: 403 });
    const classroom = await adminDb.collection("classes").doc(classId).get();
    const classData = classroom.data() ?? {};
    if (!classroom.exists || clean(data.teacherId) !== actor.uid ||
        clean(classData.teacherId) !== actor.uid || !actor.schoolId ||
        clean(classData.schoolId) !== actor.schoolId) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    const studentIds = [...new Set(
      (Array.isArray(data.studentIds) ? data.studentIds : [])
        .filter((id: unknown): id is string => typeof id === "string" && !!id.trim()),
    )];
    const students = await Promise.all(studentIds.map(async (id) => {
      const profile = await adminDb.collection("users").doc(id).get();
      const value = profile.data() ?? {};
      // Do not disclose profile names for absent or cross-school records.
      if (!profile.exists || clean(value.schoolId) !== actor.schoolId) {
        return { id, name: null };
      }
      const firstLast = [clean(value.firstName), clean(value.lastName)].filter(Boolean).join(" ");
      const name = clean(value.name) || clean(value.displayName) ||
        clean(value.fullName) || firstLast;
      return { id, name: name || null };
    }));
    return NextResponse.json({ students }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    if (["AUTH_REQUIRED", "AUTH_INVALID", "PROFILE_NOT_FOUND"].includes(code)) {
      const auth = authenticatedUserError(error);
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }
    console.error("[Assignment student names]", error);
    return NextResponse.json({ error: "Unable to load student names." }, { status: 500 });
  }
}
