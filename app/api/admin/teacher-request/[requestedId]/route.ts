import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    requestedId: string;
  }>;
};

type TeacherRequestAction = {
  action: "approve" | "reject";
};

function readBearerToken(
  request: NextRequest,
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
    .slice("Bearer ".length)
    .trim();
}

function isValidBody(
  value: unknown,
): value is TeacherRequestAction {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const body =
    value as Partial<TeacherRequestAction>;

  return (
    body.action === "approve" ||
    body.action === "reject"
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { requestedId } =
      await context.params;

    const adminIdToken =
      readBearerToken(request);

    if (!adminIdToken) {
      return NextResponse.json(
        {
          error:
            "Administrator authentication is required.",
        },
        { status: 401 },
      );
    }

    const body: unknown =
      await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json(
        {
          error:
            "Invalid request.",
        },
        { status: 400 },
      );
    }

    const decodedToken =
      await adminAuth.verifyIdToken(
        adminIdToken,
      );

    const adminUserSnapshot =
      await adminDb
        .collection("users")
        .doc(decodedToken.uid)
        .get();

    if (!adminUserSnapshot.exists) {
      return NextResponse.json(
        {
          error:
            "Admin profile not found.",
        },
        { status: 403 },
      );
    }

    const adminUser =
      adminUserSnapshot.data();

    if (
      adminUser?.role !==
      "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Admin access required.",
        },
        { status: 403 },
      );
    }

    const teacherRequestReference =
      adminDb
        .collection(
          "teacherRequests",
        )
        .doc(requestedId);

    const teacherRequestSnapshot =
      await teacherRequestReference.get();

    if (
      !teacherRequestSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "Teacher request not found.",
        },
        { status: 404 },
      );
    }

    const teacherRequest =
      teacherRequestSnapshot.data();

    if (
      !teacherRequest?.userId
    ) {
      return NextResponse.json(
        {
          error:
            "Teacher request is missing a user ID.",
        },
        { status: 400 },
      );
    }

    if (
      teacherRequest.status !==
      "pending"
    ) {
      return NextResponse.json(
        {
          error:
            "This request has already been reviewed.",
        },
        { status: 409 },
      );
    }

    const requestedUserId =
      String(
        teacherRequest.userId,
      ).trim();

    if (!requestedUserId) {
      return NextResponse.json(
        {
          error:
            "Teacher request has an invalid user ID.",
        },
        { status: 400 },
      );
    }

    const userReference =
      adminDb
        .collection("users")
        .doc(requestedUserId);

    const requestedUserSnapshot =
      await userReference.get();

    if (
      !requestedUserSnapshot.exists
    ) {
      return NextResponse.json(
        {
          error:
            "Requested user profile not found.",
        },
        { status: 404 },
      );
    }

    const requestedUser =
      requestedUserSnapshot.data();

    if (
      requestedUser?.role ===
      "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "Administrator accounts cannot be converted through teacher access requests.",
        },
        { status: 409 },
      );
    }

    if (
      body.action ===
      "approve"
    ) {
      await adminAuth.setCustomUserClaims(
        requestedUserId,
        {
          role: "teacher",
        },
      );

      await adminDb.runTransaction(
        async (transaction) => {
          transaction.update(
            userReference,
            {
              role: "teacher",
              teacherApprovedAt:
                new Date(),
              teacherApprovedBy:
                decodedToken.uid,
              updatedAt:
                new Date(),
            },
          );

          transaction.update(
            teacherRequestReference,
            {
              status:
                "approved",
              reviewedBy:
                decodedToken.uid,
              reviewedAt:
                new Date(),
              updatedAt:
                new Date(),
            },
          );
        },
      );

      return NextResponse.json({
        success: true,
        status: "approved",
      });
    }

    await teacherRequestReference.update(
      {
        status: "rejected",
        reviewedBy:
          decodedToken.uid,
        reviewedAt:
          new Date(),
        updatedAt:
          new Date(),
      },
    );

    return NextResponse.json({
      success: true,
      status: "rejected",
    });
  } catch (error) {
    console.error(
      "Teacher request review error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The request could not be reviewed.",
      },
      { status: 500 },
    );
  }
}