import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import {
  authenticatedUserError,
  requireAuthenticatedUser,
} from "@/lib/auth/requireUser";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  DEFAULT_NEA_MILESTONES,
  EMPTY_NEA_STAGE_PROGRESS,
} from "@/lib/nea/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clean(
  value: unknown,
  max = 500,
): string {
  return typeof value === "string"
    ? value.trim().slice(0, max)
    : "";
}

function serialiseTimestamp(
  value: unknown,
): string | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (
      value as {
        toDate?: unknown;
      }
    ).toDate === "function"
  ) {
    return (
      value as {
        toDate: () => Date;
      }
    )
      .toDate()
      .toISOString();
  }

  return null;
}

function serialiseProject(
  id: string,
  data: Record<string, unknown>,
) {
  return {
    ...data,
    id,
    createdAt:
      serialiseTimestamp(
        data.createdAt,
      ),
    updatedAt:
      serialiseTimestamp(
        data.updatedAt,
      ),
  };
}

export async function GET(
  request: Request,
) {
  try {
    const actor =
      await requireAuthenticatedUser(
        request,
      );

    let snapshot;

    if (
      actor.role === "teacher"
    ) {
      if (!actor.schoolId) {
        return NextResponse.json({
          projects: [],
        });
      }

      snapshot =
        await adminDb
          .collection("neaProjects")
          .where(
            "schoolId",
            "==",
            actor.schoolId,
          )
          .limit(150)
          .get();
    } else if (
      actor.role === "admin"
    ) {
      snapshot =
        await adminDb
          .collection("neaProjects")
          .limit(150)
          .get();
    } else {
      snapshot =
        await adminDb
          .collection("neaProjects")
          .where(
            "studentId",
            "==",
            actor.uid,
          )
          .limit(20)
          .get();
    }

    const projects =
      snapshot.docs
        .map((doc) =>
          serialiseProject(
            doc.id,
            doc.data(),
          ),
        )
        .sort(
          (
            a,
            b,
          ) =>
            String(
              b.updatedAt || "",
            ).localeCompare(
              String(
                a.updatedAt || "",
              ),
            ),
        );

    return NextResponse.json({
      projects,
    });
  } catch (error) {
    const failure =
      authenticatedUserError(
        error,
      );

    return NextResponse.json(
      {
        error:
          failure.message,
      },
      {
        status:
          failure.status,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const actor =
      await requireAuthenticatedUser(
        request,
      );

    if (
      actor.role !== "student"
    ) {
      return NextResponse.json(
        {
          error:
            "Only student accounts can create an NEA project.",
        },
        {
          status: 403,
        },
      );
    }

    const userSnapshot =
      await adminDb
        .collection("users")
        .doc(actor.uid)
        .get();

    if (!userSnapshot.exists) {
      return NextResponse.json(
        {
          error:
            "Your student profile could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const profile =
      userSnapshot.data() || {};

    if (
      profile.qualification !==
      "A_LEVEL"
    ) {
      return NextResponse.json(
        {
          error:
            "NEA project support is currently available to A-level Computer Science students.",
        },
        {
          status: 409,
        },
      );
    }

    const existing =
      await adminDb
        .collection("neaProjects")
        .where(
          "studentId",
          "==",
          actor.uid,
        )
        .limit(20)
        .get();

    const activeProject =
      existing.docs.find(
        (doc) =>
          doc.data().status ===
          "active",
      );

    if (activeProject) {
      return NextResponse.json(
        {
          error:
            "You already have an active NEA project.",
          projectId:
            activeProject.id,
        },
        {
          status: 409,
        },
      );
    }

    const body: unknown =
      await request.json();

    const record =
      body &&
      typeof body === "object"
        ? (
            body as Record<
              string,
              unknown
            >
          )
        : {};

    const title =
      clean(
        record.title,
        160,
      );

    const projectBrief =
      clean(
        record.projectBrief,
        1500,
      );

    if (
      title.length < 3
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a clear project title.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      projectBrief.length < 20
    ) {
      return NextResponse.json(
        {
          error:
            "Add a short project brief explaining the problem you intend to investigate or solve.",
        },
        {
          status: 400,
        },
      );
    }

    const project =
      await adminDb
        .collection("neaProjects")
        .add({
          studentId:
            actor.uid,
          studentName:
            clean(
              profile.name,
              200,
            ) ||
            actor.name ||
            "Student",
          studentEmail:
            clean(
              profile.email,
              320,
            ) ||
            actor.email ||
            "",
          schoolId:
            clean(
              profile.schoolId,
              200,
            ) ||
            actor.schoolId ||
            null,
          classId:
            null,
          teacherId:
            null,
          title,
          projectBrief,
          qualification:
            "A_LEVEL",
          examBoard:
            clean(
              profile.examBoard,
              40,
            ) ||
            "AQA",
          status:
            "active",
          currentStage:
            "analysis",
          stageProgress: {
            ...EMPTY_NEA_STAGE_PROGRESS,
          },
          overallProgress:
            0,
          milestones:
            DEFAULT_NEA_MILESTONES.map(
              (item) => ({
                ...item,
              }),
            ),
          evidenceCount:
            0,
          teacherFeedbackCount:
            0,
          latestReflection:
            "",
          createdAt:
            FieldValue.serverTimestamp(),
          updatedAt:
            FieldValue.serverTimestamp(),
        });

    return NextResponse.json({
      success: true,
      projectId:
        project.id,
    });
  } catch (error) {
    const failure =
      authenticatedUserError(
        error,
      );

    return NextResponse.json(
      {
        error:
          failure.message,
      },
      {
        status:
          failure.status,
      },
    );
  }
}
