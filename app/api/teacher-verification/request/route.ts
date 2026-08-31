import {
  NextResponse,
} from "next/server";

import {
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  sendEmail,
} from "@/lib/email/sendEmail";

import {
  createTeacherVerificationEmail,
} from "@/lib/email/templates/teacherVerificationEmail";

import {
  createVerificationToken,
  hashVerificationToken,
} from "@/lib/teacherVerification/tokens";

import {
  analyseTeacherVerificationDomains,
} from "@/lib/teacherVerification/domainTrust";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const TOKEN_LIFETIME_DAYS =
  7;

const MINIMUM_RESEND_MINUTES =
  5;

const MAX_DAILY_SENDS =
  5;

function readBearerToken(
  request: Request,
): string {
  const value =
    request.headers.get(
      "authorization",
    ) ?? "";

  if (
    !value.startsWith(
      "Bearer ",
    )
  ) {
    return "";
  }

  return value
    .slice(
      "Bearer ".length,
    )
    .trim();
}

function cleanString(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function cleanEmail(
  value: unknown,
): string {
  return cleanString(
    value,
  ).toLowerCase();
}

function dateKey(
  date: Date,
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

function getApplicationOrigin(
  request: Request,
): string {
  const configured =
    process.env.APP_URL
      ?.trim()
      .replace(
        /\/+$/,
        "",
      );

  if (configured) {
    return configured;
  }

  return new URL(
    request.url,
  ).origin;
}

export async function POST(
  request: Request,
) {
  try {
    const idToken =
      readBearerToken(
        request,
      );

    if (!idToken) {
      return NextResponse.json(
        {
          error:
            "Sign in before requesting teacher verification.",
        },
        {
          status: 401,
        },
      );
    }

    const decoded =
      await adminAuth.verifyIdToken(
        idToken,
      );

    const body =
      (await request.json()) as {
        jobTitle?: string;
        message?: string;
      };

    const jobTitle =
      cleanString(
        body.jobTitle,
      );

    const message =
      cleanString(
        body.message,
      );

    if (!jobTitle) {
      return NextResponse.json(
        {
          error:
            "Please enter your job title.",
        },
        {
          status: 400,
        },
      );
    }

    const userRef =
      adminDb
        .collection("users")
        .doc(decoded.uid);

    const verificationRef =
      adminDb
        .collection(
          "teacherVerificationRequests",
        )
        .doc(decoded.uid);

    const token =
      createVerificationToken();

    const tokenHash =
      hashVerificationToken(
        token,
      );

    const now =
      new Date();

    const expiresAt =
      new Date(
        now.getTime() +
          TOKEN_LIFETIME_DAYS *
            24 *
            60 *
            60 *
            1000,
      );

    const today =
      dateKey(now);

    const transactionResult =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          const [
            userSnapshot,
            requestSnapshot,
          ] =
            await Promise.all([
              transaction.get(
                userRef,
              ),

              transaction.get(
                verificationRef,
              ),
            ]);

          if (
            !userSnapshot.exists
          ) {
            throw new Error(
              "PROFILE_NOT_FOUND",
            );
          }

          const profile =
            userSnapshot.data() ??
            {};

          const accountIntent =
            cleanString(
              profile.accountIntent,
            );

          const role =
            cleanString(
              profile.role,
            );

          const accessStatus =
            cleanString(
              profile.teacherAccessStatus,
            );

          if (
            role === "teacher" &&
            accessStatus ===
              "approved"
          ) {
            throw new Error(
              "ALREADY_APPROVED",
            );
          }

          if (
            accountIntent !==
            "teacher"
          ) {
            throw new Error(
              "NOT_TEACHER_APPLICANT",
            );
          }

          const teacherName =
            cleanString(
              profile.name,
            );

          const teacherEmail =
            cleanEmail(
              profile.email,
            );

          const schoolName =
            cleanString(
              profile.schoolName,
            );

          const schoolAdminEmail =
            cleanEmail(
              profile.schoolAdminEmail,
            );

          if (
            !teacherName ||
            !teacherEmail ||
            !schoolName ||
            !schoolAdminEmail
          ) {
            throw new Error(
              "MISSING_SCHOOL_DETAILS",
            );
          }

          if (
            teacherEmail ===
            schoolAdminEmail
          ) {
            throw new Error(
              "SELF_VERIFICATION_NOT_ALLOWED",
            );
          }

          const domainAnalysis =
            analyseTeacherVerificationDomains(
              teacherEmail,
              schoolAdminEmail,
            );

          let dailySendCount =
            0;

          if (
            requestSnapshot.exists
          ) {
            const existing =
              requestSnapshot.data() ??
              {};

            const existingStatus =
              cleanString(
                existing.status,
              );

            if (
              existingStatus ===
              "approved"
            ) {
              throw new Error(
                "ALREADY_APPROVED",
              );
            }

            /*
             * A rejected request cannot immediately be spammed
             * back to the verifier. It remains rejected until
             * CS Master adds a deliberate resubmission/review
             * action.
             */
            if (
              existingStatus ===
              "rejected"
            ) {
              throw new Error(
                "REQUEST_REJECTED",
              );
            }

            if (
              existingStatus ===
              "platform_review_required"
            ) {
              throw new Error(
                "PLATFORM_REVIEW_PENDING",
              );
            }

            const lastSentAt =
              existing.lastSentAt instanceof
                Timestamp
                ? existing.lastSentAt.toDate()
                : null;

            if (lastSentAt) {
              const elapsedMinutes =
                (
                  now.getTime() -
                  lastSentAt.getTime()
                ) /
                (
                  1000 *
                  60
                );

              if (
                elapsedMinutes <
                MINIMUM_RESEND_MINUTES
              ) {
                throw new Error(
                  "RESEND_TOO_SOON",
                );
              }
            }

            const storedDate =
              cleanString(
                existing.dailySendDate,
              );

            const storedCount =
              typeof existing.dailySendCount ===
                "number"
                ? existing.dailySendCount
                : 0;

            dailySendCount =
              storedDate ===
              today
                ? storedCount
                : 0;

            if (
              dailySendCount >=
              MAX_DAILY_SENDS
            ) {
              throw new Error(
                "DAILY_LIMIT_REACHED",
              );
            }
          }

          const nextDailyCount =
            dailySendCount +
            1;

          transaction.set(
            verificationRef,
            {
              userId:
                decoded.uid,

              teacherName,

              teacherEmail,

              schoolName,

              schoolAdminEmail,

              jobTitle,

              message,

              status:
                "pending",

              tokenHash,

              teacherDomain:
                domainAnalysis.teacherDomain,

              administratorDomain:
                domainAnalysis.administratorDomain,

              verificationRisk:
                domainAnalysis.risk,

              autoApproveEligible:
                domainAnalysis.autoApproveEligible,

              requestedAt:
                Timestamp.fromDate(
                  now,
                ),

              lastSentAt:
                Timestamp.fromDate(
                  now,
                ),

              expiresAt:
                Timestamp.fromDate(
                  expiresAt,
                ),

              respondedAt:
                null,

              schoolVerifiedAt:
                null,

              approvedAt:
                null,

              rejectedAt:
                null,

              platformReviewedAt:
                null,

              dailySendDate:
                today,

              dailySendCount:
                nextDailyCount,

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
              accountIntent:
                "teacher",

              teacherAccessStatus:
                "pending",

              teacherVerificationReviewStatus:
                "school_verification_pending",

              teacherVerificationRisk:
                domainAnalysis.risk,

              teacherVerificationRequestedAt:
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
            teacherName,
            teacherEmail,
            schoolName,
            schoolAdminEmail,
            domainAnalysis,
          };
        },
      );

    const origin =
      getApplicationOrigin(
        request,
      );

    const verificationUrl =
      `${origin}/teacher-verification` +
      `?request=${encodeURIComponent(decoded.uid)}` +
      `&token=${encodeURIComponent(token)}`;

    const email =
      createTeacherVerificationEmail({
        teacherName:
          transactionResult.teacherName,

        teacherEmail:
          transactionResult.teacherEmail,

        schoolName:
          transactionResult.schoolName,

        jobTitle,

        verificationUrl,

        expiresAt,
      });

    try {
      const sent =
        await sendEmail({
          to:
            transactionResult.schoolAdminEmail,

          subject:
            email.subject,

          text:
            email.text,

          html:
            email.html,

          replyTo:
            transactionResult.teacherEmail,
        });

      await verificationRef.set(
        {
          deliveryStatus:
            "sent",

          emailId:
            sent?.id ??
            null,

          emailSentAt:
            Timestamp.now(),

          updatedAt:
            Timestamp.now(),
        },
        {
          merge: true,
        },
      );
    } catch (
      emailError
    ) {
      await verificationRef.set(
        {
          deliveryStatus:
            "failed",

          deliveryError:
            emailError instanceof
              Error
              ? emailError.message
              : "Email delivery failed.",

          updatedAt:
            Timestamp.now(),
        },
        {
          merge: true,
        },
      );

      throw emailError;
    }

    return NextResponse.json({
      success: true,

      status:
        "pending",

      schoolName:
        transactionResult.schoolName,

      schoolAdminEmail:
        transactionResult.schoolAdminEmail,

      expiresAt:
        expiresAt.toISOString(),

      verificationRisk:
        transactionResult
          .domainAnalysis
          .risk,
    });
  } catch (error) {
    console.error(
      "Teacher verification request error:",
      error,
    );

    const code =
      error instanceof Error
        ? error.message
        : "";

    switch (code) {
      case "PROFILE_NOT_FOUND":
        return NextResponse.json(
          {
            error:
              "Your CS Master profile could not be found.",
          },
          {
            status: 404,
          },
        );

      case "ALREADY_APPROVED":
        return NextResponse.json(
          {
            error:
              "Teacher access has already been approved for this account.",
          },
          {
            status: 409,
          },
        );

      case "NOT_TEACHER_APPLICANT":
        return NextResponse.json(
          {
            error:
              "This account is not registered as a teacher applicant.",
          },
          {
            status: 403,
          },
        );

      case "MISSING_SCHOOL_DETAILS":
        return NextResponse.json(
          {
            error:
              "Your teacher application is missing the school details supplied during registration.",
          },
          {
            status: 409,
          },
        );

      case "SELF_VERIFICATION_NOT_ALLOWED":
        return NextResponse.json(
          {
            error:
              "You cannot use your own email address to verify your teacher account.",
          },
          {
            status: 400,
          },
        );

      case "RESEND_TOO_SOON":
        return NextResponse.json(
          {
            error:
              "A verification email was sent recently. Please wait at least 5 minutes before resending it.",
          },
          {
            status: 429,
          },
        );

      case "DAILY_LIMIT_REACHED":
        return NextResponse.json(
          {
            error:
              "The daily verification-email limit has been reached. Please try again tomorrow.",
          },
          {
            status: 429,
          },
        );

      case "REQUEST_REJECTED":
        return NextResponse.json(
          {
            error:
              "This teacher verification request was rejected. Contact CS Master support if you believe the decision should be reviewed.",
          },
          {
            status: 409,
          },
        );

      case "PLATFORM_REVIEW_PENDING":
        return NextResponse.json(
          {
            error:
              "Your school verification has already been received and is awaiting CS Master review.",
          },
          {
            status: 409,
          },
        );

      default:
        return NextResponse.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "Teacher verification could not be requested.",
          },
          {
            status: 500,
          },
        );
    }
  }
}