import { NextRequest, NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

type RouteContext = {
  params: Promise<{
    requestedId: string;
  }>;
};

type TeacherRequestAction = {
  action: "approve" | "reject";
  adminIdToken: string;
};

function isValidBody(value: unknown): value is TeacherRequestAction {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Partial<TeacherRequestAction>;

  return (
    (body.action === "approve" || body.action === "reject") &&
    typeof body.adminIdToken === "string" &&
    body.adminIdToken.length > 0
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { requestedId } = await context.params;
    const body: unknown = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 400 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(
      body.adminIdToken
    );

    const adminUserSnapshot = await adminDb
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!adminUserSnapshot.exists) {
      return NextResponse.json(
        { error: "Admin profile not found." },
        { status: 403 }
      );
    }

    const adminUser = adminUserSnapshot.data();

    if (adminUser?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const teacherRequestReference = adminDb
      .collection("teacherRequests")
      .doc(requestedId);

    const teacherRequestSnapshot =
      await teacherRequestReference.get();

    if (!teacherRequestSnapshot.exists) {
      return NextResponse.json(
        { error: "Teacher request not found." },
        { status: 404 }
      );
    }

    const teacherRequest = teacherRequestSnapshot.data();

    if (!teacherRequest?.userId) {
      return NextResponse.json(
        { error: "Teacher request is missing a user ID." },
        { status: 400 }
      );
    }

    if (teacherRequest.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been reviewed." },
        { status: 409 }
      );
    }

    const requestedUserId = teacherRequest.userId as string;

    if (body.action === "approve") {
      await adminAuth.setCustomUserClaims(requestedUserId, {
        role: "teacher",
      });

      await adminDb.runTransaction(async (transaction) => {
        const userReference = adminDb
          .collection("users")
          .doc(requestedUserId);

        transaction.update(userReference, {
          role: "teacher",
          teacherApprovedAt: new Date(),
          teacherApprovedBy: decodedToken.uid,
          updatedAt: new Date(),
        });

        transaction.update(teacherRequestReference, {
          status: "approved",
          reviewedBy: decodedToken.uid,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        });
      });

      return NextResponse.json({
        success: true,
        status: "approved",
      });
    }

    await teacherRequestReference.update({
      status: "rejected",
      reviewedBy: decodedToken.uid,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      status: "rejected",
    });
  } catch (error) {
    console.error("Teacher request review error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The request could not be reviewed.",
      },
      { status: 500 }
    );
  }
}