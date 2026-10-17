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
    teacherId: string;
  }>;
};

type TeacherStatusBody = {
  action: "suspend" | "restore";
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
): value is TeacherStatusBody {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const body =
    value as Partial<TeacherStatusBody>;

  return (
    body.action === "suspend" ||
    body.action === "restore"
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { teacherId } =
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
            "Invalid action.",
        },
        { status: 400 },
      );
    }

    const decoded =
      await adminAuth.verifyIdToken(
        adminIdToken, true,
      );

    const adminDoc =
      await adminDb
        .collection("users")
        .doc(decoded.uid)
        .get();

    if (!adminDoc.exists) {
      return NextResponse.json(
        {
          error:
            "Admin not found.",
        },
        { status: 403 },
      );
    }

    if (
      adminDoc.data()?.role !==
      "admin" || ["suspended", "disabled", "deleted"].includes(String(adminDoc.data()?.status ?? "").toLowerCase())
    ) {
      return NextResponse.json(
        {
          error:
            "Admin access required.",
        },
        { status: 403 },
      );
    }

    if (
      teacherId ===
      decoded.uid
    ) {
      return NextResponse.json(
        {
          error:
            "Administrators cannot suspend their own account through teacher management.",
        },
        { status: 409 },
      );
    }

    const teacherRef =
      adminDb
        .collection("users")
        .doc(teacherId);

    const teacherDoc =
      await teacherRef.get();

    if (!teacherDoc.exists) {
      return NextResponse.json(
        {
          error:
            "Teacher not found.",
        },
        { status: 404 },
      );
    }

    const teacherData =
      teacherDoc.data();

    if (
      teacherData?.role !==
      "teacher"
    ) {
      return NextResponse.json(
        {
          error:
            "This account is not a teacher account.",
        },
        { status: 409 },
      );
    }

    const suspended =
      body.action ===
      "suspend";

    try {
    await adminAuth.updateUser(
      teacherId,
      {
        disabled: suspended,
      },
    );

    if (suspended) {
      await adminAuth.revokeRefreshTokens(teacherId);
    }
    } catch (authError) {
      if ((authError as { code?: string }).code === "auth/user-not-found") {
        return NextResponse.json({ error: "Firebase Authentication account is missing. This is an orphaned teacher profile; suspension/restoration is unavailable." }, { status: 409 });
      }
      throw authError;
    }

    await teacherRef.update({
      status:
        suspended
          ? "suspended"
          : "active",
      updatedAt:
        new Date(),
      statusUpdatedBy:
        decoded.uid,
    });

    await adminDb.collection("adminUserAudit").add({
      action: suspended ? "suspend_teacher" : "restore_teacher",
      actorId: decoded.uid,
      targetId: teacherId,
      at: new Date(),
    });

    return NextResponse.json({
      success: true,
      status:
        suspended
          ? "suspended"
          : "active",
    });
  } catch (error) {
    console.error(
      "Teacher status update error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to update the teacher account.",
      },
      { status: 500 },
    );
  }
}