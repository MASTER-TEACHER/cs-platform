import {
  NextResponse,
} from "next/server";

import {
  Timestamp,
} from "firebase-admin/firestore";

import {
  billingAuthError,
  requireApprovedTeacher,
} from "@/lib/billing/auth";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  SCHOOL_TRIAL_PLAN,
} from "@/data/billingPlans";

import {
  getSchoolTrialSummary,
} from "@/lib/billing/subscription";

import {
  createTrialDemoClass,
} from "@/lib/billing/trialDemo";


export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

function subscriptionIsActive(
  status: unknown,
): boolean {
  return (
    status === "active" ||
    status === "trialing"
  );
}

export async function POST(
  request: Request,
) {
  try {
    const actor =
      await requireApprovedTeacher(
        request,
      );

    /*
     * -----------------------------------------------------
     * TEACHER ACCOUNTS ONLY
     * -----------------------------------------------------
     *
     * Administrators do not need a commercial trial.
     * Students use Free / Student Premium instead.
     */
    
    const userRef =
      adminDb
        .collection("users")
        .doc(actor.uid);

    const trialRef =
      adminDb
        .collection(
          "schoolTrials",
        )
        .doc(actor.uid);

    const transactionResult =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          /*
           * -------------------------------------------------
           * ALL READS FIRST
           * -------------------------------------------------
           */

          const [
            userSnapshot,
            trialSnapshot,
          ] =
            await Promise.all([
              transaction.get(
                userRef,
              ),

              transaction.get(
                trialRef,
              ),
            ]);

          if (
            !userSnapshot.exists
          ) {
            throw new Error(
              "Teacher profile not found.",
            );
          }

          const user =
            userSnapshot.data() ??
            {};

          const schoolId =
            typeof user.schoolId ===
              "string"
              ? user.schoolId.trim()
              : "";

          /*
           * If the teacher is already attached to a school,
           * check whether that school already has active paid
           * access.
           */
          let schoolSubscriptionSnapshot:
            FirebaseFirestore.DocumentSnapshot |
            null =
            null;

          if (schoolId) {
            const schoolSubscriptionRef =
              adminDb
                .collection(
                  "schoolSubscriptions",
                )
                .doc(
                  schoolId,
                );

            schoolSubscriptionSnapshot =
              await transaction.get(
                schoolSubscriptionRef,
              );
          }

          /*
           * -------------------------------------------------
           * ACTIVE PAID SCHOOL ACCESS TAKES PRIORITY
           * -------------------------------------------------
           */

          if (
            schoolSubscriptionSnapshot
              ?.exists
          ) {
            const subscription =
              schoolSubscriptionSnapshot.data() ??
              {};

            if (
              subscriptionIsActive(
                subscription.status,
              )
            ) {
              return {
                outcome:
                  "school_subscription" as const,
              };
            }
          }

          /*
           * -------------------------------------------------
           * ONE TRIAL PER TEACHER
           * -------------------------------------------------
           */

          if (
            trialSnapshot.exists
          ) {
            const existingTrial =
              trialSnapshot.data() ??
              {};

            const status =
              typeof existingTrial.status ===
                "string"
                ? existingTrial.status
                : "none";

            const endsAt =
              existingTrial.endsAt instanceof
                Timestamp
                ? existingTrial.endsAt
                : null;

            const now =
              Timestamp.now();

            /*
             * Repeated clicks during the SAME active trial are
             * harmless and return the existing entitlement.
             */
            if (
              status ===
                "active" &&
              endsAt &&
              endsAt.toMillis() >
                now.toMillis()
            ) {
              return {
                outcome:
                  "existing_trial" as const,
              };
            }

            /*
             * An active trial whose end time has passed is
             * permanently normalised to expired.
             */
            if (
              status ===
                "active" &&
              (
                !endsAt ||
                endsAt.toMillis() <=
                  now.toMillis()
              )
            ) {
              transaction.set(
                trialRef,
                {
                  status:
                    "expired",

                  expiredAt:
                    now,

                  updatedAt:
                    now,
                },
                {
                  merge: true,
                },
              );

              return {
                outcome:
                  "expired" as const,
              };
            }

            if (
              status ===
              "converted"
            ) {
              return {
                outcome:
                  "converted" as const,
              };
            }

            /*
             * Any previously expired trial cannot simply be
             * restarted from another browser/session.
             */
            return {
              outcome:
                "expired" as const,
            };
          }

          /*
           * -------------------------------------------------
           * CREATE FIRST AND ONLY TRIAL
           * -------------------------------------------------
           */

          const startedAt =
            Timestamp.now();

          const endsAtDate =
            new Date(
              startedAt
                .toDate()
                .getTime() +
                SCHOOL_TRIAL_PLAN
                  .durationDays *
                  24 *
                  60 *
                  60 *
                  1000,
            );

          const endsAt =
            Timestamp.fromDate(
              endsAtDate,
            );

          transaction.create(
            trialRef,
            {
              userId:
                actor.uid,

              schoolId:
                schoolId ||
                null,

              status:
                "active",

              startedAt,

              endsAt,

              convertedAt:
                null,

              expiredAt:
                null,

              durationDays:
                SCHOOL_TRIAL_PLAN
                  .durationDays,

              cardRequired:
                SCHOOL_TRIAL_PLAN
                  .cardRequired,

              /*
               * We will use this in the following batch when
               * creating the synthetic demonstration class.
               */
              demoDataStatus:
                "pending",

              createdAt:
                startedAt,

              updatedAt:
                startedAt,
            },
          );

          return {
            outcome:
              "created" as const,
          };
        },
      );

    /*
     * -----------------------------------------------------
     * RESPONSE HANDLING
     * -----------------------------------------------------
     */

    if (
      transactionResult.outcome ===
      "school_subscription"
    ) {
      return NextResponse.json(
        {
          error:
            "Your school already has active CS Master access, so a trial is not required.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      transactionResult.outcome ===
      "expired"
    ) {
      return NextResponse.json(
        {
          error:
            "This teacher account has already used its 14-day School Trial.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      transactionResult.outcome ===
      "converted"
    ) {
      return NextResponse.json(
        {
          error:
            "This School Trial has already been converted.",
        },
        {
          status: 409,
        },
      );
    }

   let demoClassId:
  string | null =
  null;

if (
  transactionResult.outcome ===
  "created"
) {
  demoClassId =
    await createTrialDemoClass(
      actor.uid,
    );
}

const trial =
  await getSchoolTrialSummary(
    actor.uid,
  );

    return NextResponse.json(
      {
        ...trial,
        

        created:
          transactionResult.outcome ===
          "created",

        existing:
          transactionResult.outcome ===
          "existing_trial",

        durationDays:
          SCHOOL_TRIAL_PLAN
            .durationDays,

        cardRequired:
          SCHOOL_TRIAL_PLAN
            .cardRequired,

            demoClassId,
      },
      {
        status:
          transactionResult.outcome ===
          "created"
            ? 201
            : 200,
      },
    );
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