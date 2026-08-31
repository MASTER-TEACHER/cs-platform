import {
  NextResponse,
} from "next/server";

import {
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  verificationTokenMatches,
} from "@/lib/teacherVerification/tokens";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type Decision =
  | "approve"
  | "reject";

function cleanString(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function strictVerificationEnabled(): boolean {
  /*
   * SECURITY:
   *
   * Strict mode is ON unless explicitly disabled.
   *
   * Production should leave this unset or set:
   *
   * TEACHER_VERIFICATION_STRICT=true
   */
  return (
    process.env
      .TEACHER_VERIFICATION_STRICT
      ?.trim()
      .toLowerCase() !==
    "false"
  );
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as {
        requestId?: string;
        token?: string;
        decision?: Decision;
      };

    const requestId =
      cleanString(
        body.requestId,
      );

    const token =
      cleanString(
        body.token,
      );

    const decision =
      body.decision;

    if (
      !requestId ||
      !token ||
      (
        decision !==
          "approve" &&
        decision !==
          "reject"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The verification request is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    const requestRef =
      adminDb
        .collection(
          "teacherVerificationRequests",
        )
        .doc(requestId);

    const result =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          const requestSnapshot =
            await transaction.get(
              requestRef,
            );

          if (
            !requestSnapshot.exists
          ) {
            throw new Error(
              "REQUEST_NOT_FOUND",
            );
          }

          const verification =
            requestSnapshot.data() ??
            {};

          const status =
            cleanString(
              verification.status,
            );

          if (
            status ===
            "approved"
          ) {
            throw new Error(
              "ALREADY_APPROVED",
            );
          }

          if (
            status ===
            "rejected"
          ) {
            throw new Error(
              "ALREADY_REJECTED",
            );
          }

          if (
            status ===
            "platform_review_required"
          ) {
            throw new Error(
              "PLATFORM_REVIEW_PENDING",
            );
          }

          if (
            status !==
            "pending"
          ) {
            throw new Error(
              "REQUEST_NOT_PENDING",
            );
          }

          const tokenHash =
            cleanString(
              verification.tokenHash,
            );

          if (
            !verificationTokenMatches(
              token,
              tokenHash,
            )
          ) {
            throw new Error(
              "INVALID_TOKEN",
            );
          }

          const expiresAt =
            verification.expiresAt instanceof
              Timestamp
              ? verification.expiresAt.toDate()
              : null;

          const now =
            new Date();

          if (
            !expiresAt ||
            expiresAt.getTime() <=
              now.getTime()
          ) {
            transaction.set(
              requestRef,
              {
                status:
                  "expired",

                tokenHash:
                  null,

                updatedAt:
                  Timestamp.fromDate(
                    now,
                  ),
              },
              {
                merge: true,
              },
            );

            throw new Error(
              "TOKEN_EXPIRED",
            );
          }

          const userId =
            cleanString(
              verification.userId,
            );

          if (!userId) {
            throw new Error(
              "USER_NOT_FOUND",
            );
          }

          const userRef =
            adminDb
              .collection(
                "users",
              )
              .doc(userId);

          const userSnapshot =
            await transaction.get(
              userRef,
            );

          if (
            !userSnapshot.exists
          ) {
            throw new Error(
              "USER_NOT_FOUND",
            );
          }

          const schoolAdminEmail =
            cleanString(
              verification.schoolAdminEmail,
            );

          const teacherName =
            cleanString(
              verification.teacherName,
            );

          const schoolName =
            cleanString(
              verification.schoolName,
            );

          if (
            decision ===
            "reject"
          ) {
            transaction.set(
              requestRef,
              {
                status:
                  "rejected",

                tokenHash:
                  null,

                respondedAt:
                  Timestamp.fromDate(
                    now,
                  ),

                rejectedAt:
                  Timestamp.fromDate(
                    now,
                  ),

                verifiedByEmail:
                  schoolAdminEmail,

                updatedAt:
                  Timestamp.fromDate(
                    now,
                  ),
              },
              {
                merge: true,
              },
            );

            transaction.set(
              userRef,
              {
                role:
                  "student",

                accountIntent:
                  "teacher",

                teacherAccessStatus:
                  "rejected",

                teacherVerificationReviewStatus:
                  "rejected",

                teacherVerificationRejectedAt:
                  Timestamp.fromDate(
                    now,
                  ),

                updatedAt:
                  Timestamp.fromDate(
                    now,
                  ),
              },
              {
                merge: true,
              },
            );

            return {
              decision:
                "rejected" as const,

              teacherName,

              schoolName,
            };
          }

          /*
           * School administrator has now confirmed the
           * teacher.
           *
           * That proves control of the nominated verifier
           * inbox, but does not by itself prove that the
           * verifier is genuinely authorised by the school.
           */
          const autoApproveEligible =
            verification.autoApproveEligible ===
            true;

          const strict =
            strictVerificationEnabled();

          if (
            strict &&
            !autoApproveEligible
          ) {
            transaction.set(
              requestRef,
              {
                status:
                  "platform_review_required",

                tokenHash:
                  null,

                respondedAt:
                  Timestamp.fromDate(
                    now,
                  ),

                schoolVerifiedAt:
                  Timestamp.fromDate(
                    now,
                  ),

                verifiedByEmail:
                  schoolAdminEmail,

                platformReviewReason:
                  cleanString(
                    verification.verificationRisk,
                  ) ||
                  "manual_review_required",

                updatedAt:
                  Timestamp.fromDate(
                    now,
                  ),
              },
              {
                merge: true,
              },
            );

            transaction.set(
              userRef,
              {
                role:
                  "student",

                accountIntent:
                  "teacher",

                teacherAccessStatus:
                  "pending",

                teacherVerificationReviewStatus:
                  "platform_review_required",

                teacherSchoolVerifiedAt:
                  Timestamp.fromDate(
                    now,
                  ),

                updatedAt:
                  Timestamp.fromDate(
                    now,
                  ),
              },
              {
                merge: true,
              },
            );

            return {
              decision:
                "review_required" as const,

              teacherName,

              schoolName,
            };
          }

          /*
           * Trusted same-organisation-domain verification,
           * or local development with strict verification
           * explicitly disabled.
           */
          transaction.set(
            requestRef,
            {
              status:
                "approved",

              tokenHash:
                null,

              respondedAt:
                Timestamp.fromDate(
                  now,
                ),

              schoolVerifiedAt:
                Timestamp.fromDate(
                  now,
                ),

              approvedAt:
                Timestamp.fromDate(
                  now,
                ),

              verifiedByEmail:
                schoolAdminEmail,

              updatedAt:
                Timestamp.fromDate(
                  now,
                ),
            },
            {
              merge: true,
            },
          );

          transaction.set(
            userRef,
            {
              role:
                "teacher",

              accountIntent:
                "teacher",

              teacherAccessStatus:
                "approved",

              teacherVerificationReviewStatus:
                "approved",

              teacherVerificationApprovedAt:
                Timestamp.fromDate(
                  now,
                ),

              teacherVerificationRejectedAt:
                null,

              updatedAt:
                Timestamp.fromDate(
                  now,
                ),
            },
            {
              merge: true,
            },
          );

          return {
            decision:
              "approved" as const,

            teacherName,

            schoolName,
          };
        },
      );

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Teacher verification response error:",
      error,
    );

    const code =
      error instanceof Error
        ? error.message
        : "";

    const known =
      {
        REQUEST_NOT_FOUND: [
          404,
          "This teacher verification request could not be found.",
        ],

        ALREADY_APPROVED: [
          409,
          "This teacher has already been approved.",
        ],

        ALREADY_REJECTED: [
          409,
          "This teacher request has already been rejected.",
        ],

        PLATFORM_REVIEW_PENDING: [
          409,
          "This school verification has already been completed and is awaiting CS Master review.",
        ],

        REQUEST_NOT_PENDING: [
          409,
          "This teacher verification request is no longer pending.",
        ],

        INVALID_TOKEN: [
          403,
          "This verification link is invalid or has been replaced by a newer link.",
        ],

        TOKEN_EXPIRED: [
          410,
          "This verification link has expired.",
        ],

        USER_NOT_FOUND: [
          404,
          "The teacher account could not be found.",
        ],
      }[
        code
      ] as
        | [
            number,
            string,
          ]
        | undefined;

    if (known) {
      return NextResponse.json(
        {
          error:
            known[1],
        },
        {
          status:
            known[0],
        },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The verification decision could not be saved.",
      },
      {
        status: 500,
      },
    );
  }
}