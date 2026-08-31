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
  requirePlatformAdmin,
  platformAdminError,
} from "@/lib/admin/requirePlatformAdmin";

import {
  sendEmail,
} from "@/lib/email/sendEmail";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type ReviewDecision =
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

function timestampToIso(
  value: unknown,
): string | null {
  return value instanceof
    Timestamp
    ? value
        .toDate()
        .toISOString()
    : null;
}

export async function GET(
  request: Request,
) {
  try {
    await requirePlatformAdmin(
      request,
    );

    const snapshot =
      await adminDb
        .collection(
          "teacherVerificationRequests",
        )
        .where(
          "status",
          "==",
          "platform_review_required",
        )
        .get();

    const reviews =
      snapshot.docs
        .map(
          (
            documentSnapshot,
          ) => {
            const data =
              documentSnapshot.data();

            return {
              id:
                documentSnapshot.id,

              userId:
                cleanString(
                  data.userId,
                ),

              teacherName:
                cleanString(
                  data.teacherName,
                ),

              teacherEmail:
                cleanString(
                  data.teacherEmail,
                ),

              schoolName:
                cleanString(
                  data.schoolName,
                ),

              schoolAdminEmail:
                cleanString(
                  data.schoolAdminEmail,
                ),

              jobTitle:
                cleanString(
                  data.jobTitle,
                ),

              message:
                cleanString(
                  data.message,
                ),

              teacherDomain:
                cleanString(
                  data.teacherDomain,
                ),

              administratorDomain:
                cleanString(
                  data.administratorDomain,
                ),

              verificationRisk:
                cleanString(
                  data.verificationRisk,
                ),

              platformReviewReason:
                cleanString(
                  data.platformReviewReason,
                ),

              requestedAt:
                timestampToIso(
                  data.requestedAt,
                ),

              schoolVerifiedAt:
                timestampToIso(
                  data.schoolVerifiedAt,
                ),
            };
          },
        )
        .sort(
          (
            first,
            second,
          ) =>
            (
              second.schoolVerifiedAt ??
              second.requestedAt ??
              ""
            ).localeCompare(
              first.schoolVerifiedAt ??
                first.requestedAt ??
                "",
            ),
        );

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error(
      "Teacher verification review list error:",
      error,
    );

    const failure =
      platformAdminError(
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
      await requirePlatformAdmin(
        request,
      );

    const body =
      (await request.json()) as {
        requestId?: string;

        decision?:
          ReviewDecision;

        note?: string;
      };

    const requestId =
      cleanString(
        body.requestId,
      );

    const decision =
      body.decision;

    const note =
      cleanString(
        body.note,
      );

    if (
      !requestId ||
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
            "A valid teacher request and review decision are required.",
        },
        {
          status: 400,
        },
      );
    }

    const verificationRef =
      adminDb
        .collection(
          "teacherVerificationRequests",
        )
        .doc(requestId);

    const now =
      new Date();

    const result =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          const verificationSnapshot =
            await transaction.get(
              verificationRef,
            );

          if (
            !verificationSnapshot.exists
          ) {
            throw new Error(
              "REQUEST_NOT_FOUND",
            );
          }

          const verification =
            verificationSnapshot.data() ??
            {};

          const status =
            cleanString(
              verification.status,
            );

          if (
            status !==
            "platform_review_required"
          ) {
            throw new Error(
              "REQUEST_NOT_REVIEWABLE",
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

          const teacherName =
            cleanString(
              verification.teacherName,
            );

          const teacherEmail =
            cleanString(
              verification.teacherEmail,
            );

          const schoolName =
            cleanString(
              verification.schoolName,
            );

          if (
            decision ===
            "approve"
          ) {
            transaction.set(
              verificationRef,
              {
                status:
                  "approved",

                platformReviewDecision:
                  "approved",

                platformReviewNote:
                  note,

                platformReviewedAt:
                  Timestamp.fromDate(
                    now,
                  ),

                platformReviewedByUserId:
                  actor.uid,

                platformReviewedByEmail:
                  actor.email,

                approvedAt:
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
              teacherEmail,
              schoolName,
            };
          }

          transaction.set(
            verificationRef,
            {
              status:
                "rejected",

              platformReviewDecision:
                "rejected",

              platformReviewNote:
                note,

              platformReviewedAt:
                Timestamp.fromDate(
                  now,
                ),

              platformReviewedByUserId:
                actor.uid,

              platformReviewedByEmail:
                actor.email,

              rejectedAt:
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
            teacherEmail,
            schoolName,
          };
        },
      );

    /*
     * Email is intentionally outside the Firestore transaction.
     * A delivery failure must not roll back the security decision.
     */
    if (
      result.teacherEmail
    ) {
      try {
        if (
          result.decision ===
          "approved"
        ) {
          await sendEmail({
            to:
              result.teacherEmail,

            subject:
              "Your CS Master teacher account has been approved",

            text:
              `Hello ${result.teacherName || "Teacher"},\n\nYour CS Master teacher account for ${result.schoolName || "your school"} has completed verification and has been approved.\n\nYou can now sign in to CS Master and access the teacher portal.`,

            html: `
              <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:28px;color:#0f172a;">
                <div style="background:#0f172a;color:#fff;border-radius:18px;padding:26px;">
                  <div style="font-size:12px;font-weight:800;letter-spacing:1.2px;color:#93c5fd;">
                    CS MASTER
                  </div>

                  <h1 style="margin:10px 0 0;font-size:28px;">
                    Teacher account approved
                  </h1>
                </div>

                <div style="padding:28px 4px;">
                  <p style="font-size:16px;line-height:1.7;">
                    Hello <strong>${result.teacherName || "Teacher"}</strong>,
                  </p>

                  <p style="font-size:16px;line-height:1.7;">
                    Your CS Master teacher account for
                    <strong>${result.schoolName || "your school"}</strong>
                    has completed verification and has been approved.
                  </p>

                  <p style="font-size:16px;line-height:1.7;">
                    You can now sign in to CS Master and access the teacher portal.
                  </p>
                </div>
              </div>
            `,
          });
        } else {
          await sendEmail({
            to:
              result.teacherEmail,

            subject:
              "Update on your CS Master teacher verification",

            text:
              `Hello ${result.teacherName || "Teacher"},\n\nYour CS Master teacher verification request was not approved following review.\n\nTeacher features will remain locked. If you believe this decision is incorrect, please contact CS Master support.`,

            html: `
              <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:28px;color:#0f172a;">
                <div style="background:#0f172a;color:#fff;border-radius:18px;padding:26px;">
                  <div style="font-size:12px;font-weight:800;letter-spacing:1.2px;color:#93c5fd;">
                    CS MASTER
                  </div>

                  <h1 style="margin:10px 0 0;font-size:28px;">
                    Teacher verification update
                  </h1>
                </div>

                <div style="padding:28px 4px;">
                  <p style="font-size:16px;line-height:1.7;">
                    Hello <strong>${result.teacherName || "Teacher"}</strong>,
                  </p>

                  <p style="font-size:16px;line-height:1.7;">
                    Your CS Master teacher verification request was not approved following review.
                  </p>

                  <p style="font-size:16px;line-height:1.7;">
                    Teacher features will remain locked. If you believe this decision is incorrect, please contact CS Master support.
                  </p>
                </div>
              </div>
            `,
          });
        }
      } catch (
        emailError
      ) {
        console.error(
          "Unable to send teacher review outcome email:",
          emailError,
        );
      }
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Teacher verification admin review error:",
      error,
    );

    const code =
      error instanceof Error
        ? error.message
        : "";

    if (
      code ===
      "REQUEST_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error:
            "The teacher verification request could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      code ===
      "REQUEST_NOT_REVIEWABLE"
    ) {
      return NextResponse.json(
        {
          error:
            "This teacher request is no longer awaiting CS Master review.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      code ===
      "USER_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          error:
            "The teacher account could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const failure =
      platformAdminError(
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