import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
export const runtime = "nodejs";
type RouteContext = {
  params: Promise<{
    teacherId: string;
  }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { teacherId } = await context.params;

    const { action, adminIdToken } = await request.json();

    if (
      action !== "suspend" &&
      action !== "restore"
    ) {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    const decoded = await adminAuth.verifyIdToken(
      adminIdToken
    );

    const adminDoc = await adminDb
      .collection("users")
      .doc(decoded.uid)
      .get();

    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: "Admin not found." },
        { status: 403 }
      );
    }

    if (adminDoc.data()?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const teacherRef = adminDb
      .collection("users")
      .doc(teacherId);

    const teacherDoc = await teacherRef.get();

    if (!teacherDoc.exists) {
      return NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 }
      );
    }

    const suspended = action === "suspend";

    await adminAuth.updateUser(teacherId, {
      disabled: suspended,
    });

    await teacherRef.update({
      status: suspended ? "suspended" : "active",
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      status: suspended
        ? "suspended"
        : "active",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}