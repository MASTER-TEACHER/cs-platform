import {
  NextResponse,
} from "next/server";

import {
  billingAuthError,
  requireBillingActor,
} from "@/lib/billing/auth";

import {
  getSchoolTrialSummary,
  getUserEntitlementSummary,
} from "@/lib/billing/subscription";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export async function GET(
  request: Request,
) {
  try {
    const actor =
      await requireBillingActor(
        request,
      );

    /*
     * -----------------------------------------------------
     * STUDENT ACCESS
     * -----------------------------------------------------
     *
     * Students are allowed to retrieve only their resolved
     * entitlement.
     *
     * They must not receive the teacher-owned School Trial
     * record or synthetic demo-class metadata.
     *
     * getUserEntitlementSummary() resolves an active school
     * trial through the student's school membership, so this
     * enables the Student Premium experience during a valid
     * School Trial without weakening strict billing.
     */

    if (
      actor.role ===
      "student"
    ) {
      const entitlement =
        await getUserEntitlementSummary(
          actor.uid,
        );

      return NextResponse.json({
        entitlement,
      });
    }

    /*
     * -----------------------------------------------------
     * TEACHER / ADMIN ACCESS
     * -----------------------------------------------------
     */

    if (
      actor.role !==
        "teacher" &&
      actor.role !==
        "admin"
    ) {
      return NextResponse.json(
        {
          error:
            "School Trial information is not available to this account.",
        },
        {
          status: 403,
        },
      );
    }

    const [
      trial,
      entitlement,
      trialSnapshot,
    ] =
      await Promise.all([
        getSchoolTrialSummary(
          actor.uid,
        ),

        getUserEntitlementSummary(
          actor.uid,
        ),

        adminDb
          .collection(
            "schoolTrials",
          )
          .doc(actor.uid)
          .get(),
      ]);

    const storedTrial =
      trialSnapshot.exists
        ? trialSnapshot.data() ??
          {}
        : {};

    const demoDataStatus =
      typeof storedTrial
        .demoDataStatus ===
      "string"
        ? storedTrial
            .demoDataStatus
        : "none";

    const demoClassId =
      typeof storedTrial
        .demoClassId ===
      "string"
        ? storedTrial
            .demoClassId
        : null;

    return NextResponse.json({
      trial,

      entitlement,

      demo: {
        status:
          demoDataStatus,

        ready:
          demoDataStatus ===
          "ready",

        classId:
          demoClassId,
      },
    });
  } catch (error) {
    const failure =
      billingAuthError(
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