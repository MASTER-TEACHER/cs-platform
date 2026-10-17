import {
  NextResponse,
} from "next/server";

import {
  adminDb,
} from "@/lib/firebaseAdmin";
import { checkTransactionalStudentSeat, serializeSchoolMembershipChange } from "@/lib/billing/transactionalSeats";

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

    const schoolRef =
      adminDb
        .collection("schools")
        .doc(schoolId);

    const schoolSnapshot =
      await schoolRef.get();

    if (!schoolSnapshot.exists) {
      return NextResponse.json(
        {
          error:
            "The school linked to this invitation could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const schoolStatus =
      typeof schoolSnapshot.data()?.status === "string"
        ? schoolSnapshot.data()?.status
        : "active";

    if (schoolStatus !== "active") {
      return NextResponse.json(
        {
          error:
            "This school is not currently accepting new members.",
        },
        {
          status: 409,
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

        const freshSchool =
          await transaction.get(
            schoolRef,
          );

        const freshUser = await transaction.get(userRef);

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

        if (
          !freshSchool.exists ||
          freshSchool.data()
            ?.status !==
            "active"
        ) {
          throw new Error(
            "SCHOOL_NOT_ACTIVE",
          );
        }

        if (!freshUser.exists) throw new Error("PROFILE_NOT_FOUND");
        const currentSchoolId = typeof freshUser.data()?.schoolId === "string"
          ? freshUser.data()!.schoolId.trim() : "";
        if (currentSchoolId && currentSchoolId !== schoolId) throw new Error("DIFFERENT_SCHOOL");
        if (freshInvite.data()?.schoolId !== schoolId ||
            (freshInvite.data()?.role === "teacher" ? "teacher" : "student") !== role) {
          throw new Error("INVITE_CHANGED");
        }
        const currentExpiry = freshInvite.data()?.expiresAt;
        if (currentExpiry && typeof currentExpiry.toDate === "function" &&
            currentExpiry.toDate().getTime() < Date.now()) throw new Error("INVITE_EXPIRED");
        if (role === "student" && !currentSchoolId && billingEnforcementEnabled()) {
          const subscription = await getSchoolSubscriptionSummary(schoolId);
          if (!subscription.active) throw new Error("SUBSCRIPTION_INACTIVE");
          await checkTransactionalStudentSeat(transaction, schoolId, subscription.seatLimit);
        }
        serializeSchoolMembershipChange(transaction, schoolRef);

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

    if (
      error instanceof Error &&
      error.message ===
        "SCHOOL_NOT_ACTIVE"
    ) {
      return NextResponse.json(
        {
          error:
            "This school is not currently accepting new members.",
        },
        {
          status: 409,
        },
      );
    }

    if (error instanceof Error) {
      const statuses: Record<string, [number, string]> = {
        SEAT_LIMIT_REACHED: [409, "This school has reached its CS Master student-seat limit."],
        SUBSCRIPTION_INACTIVE: [402, "This school's CS Master subscription is not active."],
        DIFFERENT_SCHOOL: [409, "Your account already belongs to another school."],
        INVITE_CHANGED: [409, "The school invitation changed. Please request another code."],
        INVITE_EXPIRED: [409, "This school join code has expired."],
      };
      const known = statuses[error.message];
      if (known) return NextResponse.json({ error: known[1] }, { status: known[0] });
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
