import {
  NextResponse,
} from "next/server";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

import {
  billingEnforcementEnabled,
} from "@/lib/billing/stripe";

import {
  countStudentSeats,
  getSchoolSubscriptionSummary,
} from "@/lib/billing/subscription";

export const runtime = "nodejs";

function normaliseCode(
  value: unknown,
): string {
  return typeof value === "string"
    ? value
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          "",
        )
    : "";
}

export async function POST(
  request: Request,
) {
  try {
    const actor =
      await requireBillingActor(
        request,
      );

    const body: unknown =
      await request.json();

    const code =
      normaliseCode(
        body &&
        typeof body === "object"
          ? (
              body as {
                code?: unknown;
              }
            ).code
          : "",
      );

    if (!code) {
      return NextResponse.json(
        {
          error:
            "Enter a valid school join code.",
        },
        {
          status: 400,
        },
      );
    }

    const inviteRef =
      adminDb
        .collection(
          "schoolInvites",
        )
        .doc(code);

    const inviteSnapshot =
      await inviteRef.get();

    if (!inviteSnapshot.exists) {
      return NextResponse.json(
        {
          error:
            "That school join code could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const invite =
      inviteSnapshot.data() || {};

    if (
      invite.status !== "active"
    ) {
      return NextResponse.json(
        {
          error:
            "This school join code is no longer active.",
        },
        {
          status: 409,
        },
      );
    }

    const expiresAt =
      invite.expiresAt &&
      typeof invite.expiresAt.toDate ===
        "function"
        ? invite.expiresAt.toDate()
        : null;

    if (
      expiresAt &&
      expiresAt.getTime() <
        Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "This school join code has expired.",
        },
        {
          status: 409,
        },
      );
    }

    const schoolId =
      typeof invite.schoolId ===
      "string"
        ? invite.schoolId.trim()
        : "";

    const role =
      invite.role === "teacher"
        ? "teacher"
        : "student";

    if (!schoolId) {
      return NextResponse.json(
        {
          error:
            "This school invitation is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      actor.schoolId &&
      actor.schoolId !==
        schoolId
    ) {
      return NextResponse.json(
        {
          error:
            "Your account already belongs to another school.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      role === "teacher" &&
      actor.role !== "teacher" &&
      actor.role !== "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "This join code is for an approved teacher account.",
        },
        {
          status: 403,
        },
      );
    }

    if (
      role === "student" &&
      billingEnforcementEnabled()
    ) {
      const subscription =
        await getSchoolSubscriptionSummary(
          schoolId,
        );

      if (!subscription.active) {
        return NextResponse.json(
          {
            error:
              "This school's CS Master subscription is not active.",
          },
          {
            status: 402,
          },
        );
      }

      const existingSeatCount =
        await countStudentSeats(
          schoolId,
        );

      if (
        existingSeatCount >=
        subscription.seatLimit
      ) {
        return NextResponse.json(
          {
            error:
              "This school has reached its CS Master student-seat limit.",
          },
          {
            status: 409,
          },
        );
      }
    }

    const memberRef =
      adminDb
        .collection("schools")
        .doc(schoolId)
        .collection("members")
        .doc(actor.uid);

    const userRef =
      adminDb
        .collection("users")
        .doc(actor.uid);

    await adminDb.runTransaction(
      async (transaction) => {
        const freshInvite =
          await transaction.get(
            inviteRef,
          );

        if (
          !freshInvite.exists ||
          freshInvite.data()
            ?.status !==
            "active"
        ) {
          throw new Error(
            "INVITE_ALREADY_USED",
          );
        }

        transaction.set(
          memberRef,
          {
            schoolId,
            userId:
              actor.uid,
            role,
            status:
              "active",
            joinedAt:
              new Date(),
            leftAt:
              null,
            updatedAt:
              new Date(),
          },
          {
            merge: true,
          },
        );

        transaction.update(
          userRef,
          {
            schoolId,
            accountType:
              "school",
            plan:
              "school",
            updatedAt:
              new Date(),
          },
        );

        transaction.update(
          inviteRef,
          {
            status:
              "used",
            usedBy:
              actor.uid,
            usedAt:
              new Date(),
            updatedAt:
              new Date(),
          },
        );
      },
    );

    return NextResponse.json({
      schoolId,
      role,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "INVITE_ALREADY_USED"
    ) {
      return NextResponse.json(
        {
          error:
            "This school join code has already been used.",
        },
        {
          status: 409,
        },
      );
    }

    const failure =
      billingAuthError(error);

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