import "server-only";

import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import {
  authenticatedUserError,
  requireAuthenticatedUser,
} from "@/lib/auth/requireUser";
import { adminDb } from "@/lib/firebaseAdmin";

import {
  billingEnforcementEnabled,
} from "@/lib/billing/stripe";
import {
  countStudentSeats,
  getSchoolSubscriptionSummary,
} from "@/lib/billing/subscription";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
        .slice(0, 10)
    : "";
}

function normaliseString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normaliseStringArray(
  value: unknown,
): string[] {
  return Array.isArray(value)
    ? value.filter(
        (
          item,
        ): item is string =>
          typeof item === "string" &&
          item.trim().length > 0,
      )
    : [];
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
            "Only student accounts can join a class with a class code.",
        },
        {
          status: 403,
        },
      );
    }

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

    if (
      code.length < 6
    ) {
      return NextResponse.json(
        {
          error:
            "Enter a valid class join code.",
        },
        {
          status: 400,
        },
      );
    }

    const matchingClasses =
      await adminDb
        .collection("classes")
        .where(
          "joinCode",
          "==",
          code,
        )
        .limit(2)
        .get();

    if (
      matchingClasses.empty
    ) {
      return NextResponse.json(
        {
          error:
            "That class join code could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      matchingClasses.size > 1
    ) {
      return NextResponse.json(
        {
          error:
            "This class code is not unique. Ask your teacher to regenerate it.",
        },
        {
          status: 409,
        },
      );
    }

    const classSnapshot =
      matchingClasses.docs[0];

    const classData =
      classSnapshot.data();

    const classId =
      classSnapshot.id;

    const className =
      normaliseString(
        classData.name,
      ) ||
      "your class";

    const classSchoolId =
      normaliseString(
        classData.schoolId,
      );

    if (!classSchoolId) {
      return NextResponse.json(
        {
          error:
            "This class is not linked to a school yet.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      classData.status ===
        "archived"
    ) {
      return NextResponse.json(
        {
          error:
            "This class is archived and is not accepting new students.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      classData.joinCodeEnabled ===
        false
    ) {
      return NextResponse.json(
        {
          error:
            "This class join code is currently disabled.",
        },
        {
          status: 409,
        },
      );
    }

    const actorSchoolId =
      normaliseString(
        actor.schoolId,
      );

    if (
      actorSchoolId &&
      actorSchoolId !==
        classSchoolId
    ) {
      return NextResponse.json(
        {
          error:
            "Your account already belongs to a different school.",
        },
        {
          status: 409,
        },
      );
    }

    const schoolRef =
      adminDb
        .collection("schools")
        .doc(classSchoolId);

    const schoolSnapshot =
      await schoolRef.get();

    if (!schoolSnapshot.exists) {
      return NextResponse.json(
        {
          error:
            "The school linked to this class could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const schoolStatus =
      normaliseString(
        schoolSnapshot.data()
          ?.status,
      ) ||
      "active";

    if (
      schoolStatus !== "active"
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

    /*
     * A student who is not yet attached to any school can use the
     * permanent class code as the school + class invitation in one step.
     * When billing enforcement is enabled, that first school attachment
     * consumes a student seat and therefore respects the school limit.
     */
    if (
      !actorSchoolId &&
      billingEnforcementEnabled()
    ) {
      const subscription =
        await getSchoolSubscriptionSummary(
          classSchoolId,
        );

      if (
        !subscription.active
      ) {
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
          classSchoolId,
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

    const classRef =
      classSnapshot.ref;

    const userRef =
      adminDb
        .collection("users")
        .doc(actor.uid);

    const memberRef =
      schoolRef
        .collection("members")
        .doc(actor.uid);

    const transactionResult =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          const [
            freshClass,
            freshUser,
            freshSchool,
          ] =
            await Promise.all([
              transaction.get(
                classRef,
              ),
              transaction.get(
                userRef,
              ),
              transaction.get(
                schoolRef,
              ),
            ]);

          if (
            !freshClass.exists
          ) {
            throw new Error(
              "CLASS_NOT_FOUND",
            );
          }

          if (
            !freshUser.exists
          ) {
            throw new Error(
              "USER_NOT_FOUND",
            );
          }

          if (
            !freshSchool.exists ||
            (
              normaliseString(
                freshSchool.data()
                  ?.status,
              ) ||
              "active"
            ) !== "active"
          ) {
            throw new Error(
              "SCHOOL_NOT_ACTIVE",
            );
          }

          const freshClassData =
            freshClass.data() || {};

          const freshUserData =
            freshUser.data() || {};

          if (
            normaliseCode(
              freshClassData.joinCode,
            ) !== code
          ) {
            throw new Error(
              "CLASS_CODE_CHANGED",
            );
          }

          if (
            freshClassData.joinCodeEnabled ===
              false
          ) {
            throw new Error(
              "CLASS_CODE_DISABLED",
            );
          }

          if (
            freshClassData.status ===
              "archived"
          ) {
            throw new Error(
              "CLASS_ARCHIVED",
            );
          }

          const freshClassSchoolId =
            normaliseString(
              freshClassData.schoolId,
            );

          if (
            freshClassSchoolId !==
              classSchoolId
          ) {
            throw new Error(
              "CLASS_SCHOOL_CHANGED",
            );
          }

          if (
            freshUserData.role !==
              "student"
          ) {
            throw new Error(
              "STUDENT_REQUIRED",
            );
          }

          const freshUserSchoolId =
            normaliseString(
              freshUserData.schoolId,
            );

          if (
            freshUserSchoolId &&
            freshUserSchoolId !==
              classSchoolId
          ) {
            throw new Error(
              "DIFFERENT_SCHOOL",
            );
          }

          const existingStudentIds =
            normaliseStringArray(
              freshClassData.studentIds,
            );

          const existingStudents =
            Array.isArray(
              freshClassData.students,
            )
              ? freshClassData.students
              : [];

          const alreadyJoined =
            existingStudentIds.includes(
              actor.uid,
            );

          const displayName =
            normaliseString(
              freshUserData.name,
            ) ||
            normaliseString(
              actor.name,
            ) ||
            "Student";

          const email =
            normaliseString(
              freshUserData.email,
            ) ||
            normaliseString(
              actor.email,
            );

          const updatedStudents =
            [
              ...existingStudents.filter(
                (
                  student,
                ) =>
                  !(
                    student &&
                    typeof student ===
                      "object" &&
                    "studentId" in
                      student &&
                    (
                      student as {
                        studentId?: unknown;
                      }
                    ).studentId ===
                      actor.uid
                  ),
              ),
              {
                studentId:
                  actor.uid,
                displayName,
                email,
              },
            ];

          if (
            !alreadyJoined
          ) {
            transaction.update(
              classRef,
              {
                studentIds: [
                  ...existingStudentIds,
                  actor.uid,
                ],
                students:
                  updatedStudents,
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );
          }

          transaction.set(
            memberRef,
            {
              schoolId:
                classSchoolId,
              userId:
                actor.uid,
              role:
                "student",
              status:
                "active",
              joinedAt:
                FieldValue.serverTimestamp(),
              leftAt:
                null,
              updatedAt:
                FieldValue.serverTimestamp(),
            },
            {
              merge: true,
            },
          );

          transaction.update(
            userRef,
            {
              schoolId:
                classSchoolId,
              accountType:
                "school",
              plan:
                "school",
              classIds:
                FieldValue.arrayUnion(
                  classId,
                ),
              updatedAt:
                FieldValue.serverTimestamp(),
            },
          );

          return {
            alreadyJoined,
          };
        },
      );

    return NextResponse.json({
      success: true,
      alreadyJoined:
        transactionResult
          .alreadyJoined,
      classId,
      className,
      schoolId:
        classSchoolId,
    });
  } catch (error) {
    if (
      error instanceof Error
    ) {
      const knownErrors:
        Record<
          string,
          {
            status: number;
            message: string;
          }
        > = {
          CLASS_NOT_FOUND: {
            status: 404,
            message:
              "This class could not be found.",
          },
          USER_NOT_FOUND: {
            status: 404,
            message:
              "Your student account could not be found.",
          },
          SCHOOL_NOT_ACTIVE: {
            status: 409,
            message:
              "This school is not currently accepting new members.",
          },
          CLASS_CODE_CHANGED: {
            status: 409,
            message:
              "This class code has changed. Ask your teacher for the current code.",
          },
          CLASS_CODE_DISABLED: {
            status: 409,
            message:
              "This class join code is currently disabled.",
          },
          CLASS_ARCHIVED: {
            status: 409,
            message:
              "This class is archived and is not accepting new students.",
          },
          CLASS_SCHOOL_CHANGED: {
            status: 409,
            message:
              "The class school membership changed. Ask your teacher for help.",
          },
          STUDENT_REQUIRED: {
            status: 403,
            message:
              "Only student accounts can join a class.",
          },
          DIFFERENT_SCHOOL: {
            status: 409,
            message:
              "Your account belongs to a different school.",
          },
        };

      const known =
        knownErrors[
          error.message
        ];

      if (known) {
        return NextResponse.json(
          {
            error:
              known.message,
          },
          {
            status:
              known.status,
          },
        );
      }
    }

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
