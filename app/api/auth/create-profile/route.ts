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

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type RegistrationAccountType =
  | "student"
  | "teacher";

type CreateProfileBody = {
  name?: string;

  accountType?:
    RegistrationAccountType;

  schoolName?: string;

  schoolAdminEmail?: string;
};

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

function isValidEmail(
  value: string,
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value,
  );
}

function readBearerToken(
  request: Request,
): string {
  const authorization =
    request.headers.get(
      "authorization",
    ) ?? "";

  if (
    !authorization.startsWith(
      "Bearer ",
    )
  ) {
    return "";
  }

  return authorization
    .slice(
      "Bearer ".length,
    )
    .trim();
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
            "Authentication is required to create an account profile.",
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
      (await request.json()) as
        CreateProfileBody;

    const name =
      cleanString(
        body.name,
      );

    const accountType =
      body.accountType;

    const authenticatedEmail =
      cleanEmail(
        decoded.email,
      );

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Please enter your full name.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      accountType !==
        "student" &&
      accountType !==
        "teacher"
    ) {
      return NextResponse.json(
        {
          error:
            "The account type is invalid.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !authenticatedEmail ||
      !isValidEmail(
        authenticatedEmail,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The authenticated account does not contain a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    const schoolName =
      accountType ===
      "teacher"
        ? cleanString(
            body.schoolName,
          )
        : "";

    const schoolAdminEmail =
      accountType ===
      "teacher"
        ? cleanEmail(
            body.schoolAdminEmail,
          )
        : "";

    if (
      accountType ===
      "teacher"
    ) {
      if (!schoolName) {
        return NextResponse.json(
          {
            error:
              "Please enter your school name.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !schoolAdminEmail ||
        !isValidEmail(
          schoolAdminEmail,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Please enter a valid school administrator email address.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        schoolAdminEmail ===
        authenticatedEmail
      ) {
        return NextResponse.json(
          {
            error:
              "The school administrator email must be different from your own email address.",
          },
          {
            status: 400,
          },
        );
      }
    }

    const userReference =
      adminDb
        .collection(
          "users",
        )
        .doc(
          decoded.uid,
        );

    const now =
      Timestamp.now();

    const result =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          const snapshot =
            await transaction.get(
              userReference,
            );

          /*
           * Registration should never overwrite an existing
           * CS Master profile.
           */
          if (
            snapshot.exists
          ) {
            const existing =
              snapshot.data() ??
              {};

            const existingEmail =
              cleanEmail(
                existing.email,
              );

            if (
              existingEmail &&
              existingEmail !==
                authenticatedEmail
            ) {
              throw new Error(
                "PROFILE_EMAIL_MISMATCH",
              );
            }

            return {
              alreadyExists:
                true,
            };
          }

          /*
           * SECURITY:
           *
           * Public registration ALWAYS begins with the
           * low-privilege student role.
           *
           * A teacher applicant cannot request role="teacher".
           * Teacher promotion occurs only after the school
           * verification server flow approves them.
           */
          transaction.set(
            userReference,
            {
              uid:
                decoded.uid,

              name,

              email:
                authenticatedEmail,

              role:
                "student",

              accountIntent:
                accountType,

              teacherAccessStatus:
                accountType ===
                "teacher"
                  ? "not_submitted"
                  : null,

              schoolName:
                accountType ===
                "teacher"
                  ? schoolName
                  : null,

              schoolAdminEmail:
                accountType ===
                "teacher"
                  ? schoolAdminEmail
                  : null,

              teacherVerificationRequestedAt:
                null,

              teacherVerificationApprovedAt:
                null,

              teacherVerificationRejectedAt:
                null,

              accountType:
                "individual",

              plan:
                "free",

              personalPlan:
                "free",

              schoolId:
                null,

              classIds:
                [],

              qualification:
                null,

              examBoard:
                null,

              currentCourse:
                "",

              onboardingComplete:
                false,

              xp:
                0,

              streak:
                0,

              completedLessons:
                [],

              completedTopics:
                [],

              completedUnits:
                [],

              completedPapers:
                [],

              badges:
                [],

              createdAt:
                now,

              updatedAt:
                now,
            },
          );

          return {
            alreadyExists:
              false,
          };
        },
      );

    return NextResponse.json(
      {
        success: true,

        alreadyExists:
          result.alreadyExists,

        uid:
          decoded.uid,

        accountIntent:
          accountType,
      },
      {
        status:
          result.alreadyExists
            ? 200
            : 201,
      },
    );
  } catch (error) {
    console.error(
      "Account profile creation error:",
      error,
    );

    const code =
      error instanceof Error
        ? error.message
        : "";

    if (
      code ===
      "PROFILE_EMAIL_MISMATCH"
    ) {
      return NextResponse.json(
        {
          error:
            "The existing CS Master profile does not match the authenticated account.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The CS Master account profile could not be created.",
      },
      {
        status: 500,
      },
    );
  }
}