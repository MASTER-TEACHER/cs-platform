import "server-only";

import { NextResponse } from "next/server";
import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RequestBody = {
  action?: unknown;
  assignmentId?: unknown;
  studentName?: unknown;
  studentEmail?: unknown;
  answers?: unknown;
  type?: unknown;
  questionNumber?: unknown;
  detail?: unknown;
  reason?: unknown;
};

function bearer(request: Request): string {
  const value =
    request.headers.get("authorization") || "";

  return value.startsWith("Bearer ")
    ? value.slice(7).trim()
    : "";
}

function errorJson(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    },
  );
}

function text(
  value: unknown,
  maxLength = 12000,
): string {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

function questionNumber(
  value: unknown,
): number | null {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0
    ? value
    : null;
}

function cleanAnswers(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, 100)
    .map((item) => {
      if (
        !item ||
        typeof item !== "object"
      ) {
        return null;
      }

      const row =
        item as Record<
          string,
          unknown
        >;

      const id =
        text(
          row.questionId,
          240,
        );

      const number =
        questionNumber(
          row.questionNumber,
        );

      if (
        !id ||
        number === null
      ) {
        return null;
      }

      return {
        questionId:
          id,
        questionNumber:
          number,
        response:
          text(
            row.response,
            12000,
          ),
        awardedMarks:
          null,
        teacherFeedback:
          "",
      };
    })
    .filter(
      (item) =>
        item !== null,
    );
}

function blankAnswers(
  assignment: Record<
    string,
    unknown
  >,
) {
  const snapshot =
    assignment.questionSetSnapshot &&
    typeof assignment.questionSetSnapshot ===
      "object"
      ? (assignment.questionSetSnapshot as Record<
          string,
          unknown
        >)
      : {};

  const questions =
    Array.isArray(
      snapshot.questions,
    )
      ? snapshot.questions
      : [];

  return questions
    .slice(0, 100)
    .map(
      (
        item,
        index,
      ) => {
        const row =
          item &&
          typeof item ===
            "object"
            ? (item as Record<
                string,
                unknown
              >)
            : {};

        return {
          questionId:
            text(
              row.id,
              240,
            ) ||
            `question-${
              index + 1
            }`,
          questionNumber:
            questionNumber(
              row.questionNumber,
            ) ||
            index + 1,
          response:
            "",
          awardedMarks:
            null,
          teacherFeedback:
            "",
        };
      },
    );
}

function iso(
  value: unknown,
): string | null {
  return value instanceof
    Timestamp
    ? value
        .toDate()
        .toISOString()
    : null;
}

function serialiseSubmission(
  id: string,
  data: Record<
    string,
    unknown
  >,
) {
  return {
    id,
    assignmentId:
      text(
        data.assignmentId,
        240,
      ),
    studentId:
      text(
        data.studentId,
        240,
      ),
    studentName:
      text(
        data.studentName,
        240,
      ) ||
      "Student",
    studentEmail:
      text(
        data.studentEmail,
        320,
      ),
    teacherId:
      text(
        data.teacherId,
        240,
      ),
    classId:
      text(
        data.classId,
        240,
      ),
    status:
      text(
        data.status,
        80,
      ) ||
      "not_started",
    answers:
      Array.isArray(
        data.answers,
      )
        ? data.answers
        : [],
    totalAwardedMarks:
      typeof data.totalAwardedMarks ===
      "number"
        ? data.totalAwardedMarks
        : 0,
    totalAvailableMarks:
      typeof data.totalAvailableMarks ===
      "number"
        ? data.totalAvailableMarks
        : 0,
    percentage:
      typeof data.percentage ===
      "number"
        ? data.percentage
        : 0,
    overallFeedback:
      text(
        data.overallFeedback,
        8000,
      ),
    integrityPolicySnapshot:
      data.integrityPolicySnapshot ??
      null,
    integrityIncidents:
      Array.isArray(
        data.integrityIncidents,
      )
        ? data.integrityIncidents.map(
            (incident) => {
              const row =
                incident &&
                typeof incident ===
                  "object"
                  ? (incident as Record<
                      string,
                      unknown
                    >)
                  : {};

              return {
                id:
                  text(
                    row.id,
                    240,
                  ),
                type:
                  text(
                    row.type,
                    80,
                  ),
                occurredAt:
                  iso(
                    row.occurredAt,
                  ),
                questionNumber:
                  questionNumber(
                    row.questionNumber,
                  ),
                detail:
                  text(
                    row.detail,
                    1000,
                  ),
              };
            },
          )
        : [],
    integrityTerminated:
      data.integrityTerminated ===
      true,
    integrityTerminationReason:
      text(
        data.integrityTerminationReason,
        1000,
      ),
    integritySessionStartedAt:
      iso(
        data.integritySessionStartedAt,
      ),
    integrityLastQuestionNumber:
      questionNumber(
        data.integrityLastQuestionNumber,
      ),
    startedAt:
      iso(
        data.startedAt,
      ),
    submittedAt:
      iso(
        data.submittedAt,
      ),
    markedAt:
      iso(
        data.markedAt,
      ),
    updatedAt:
      iso(
        data.updatedAt,
      ),
  };
}

function incidentId(
  type: string,
): string {
  return `${type}-${crypto.randomUUID()}`;
}

function safeStudentCount(
  assignment: Record<
    string,
    unknown
  >,
): number {
  return Array.isArray(
    assignment.studentIds,
  )
    ? assignment
        .studentIds
        .filter(
          (value): value is string =>
            typeof value ===
            "string",
        ).length
    : 0;
}

function nextSubmittedCount(
  assignment: Record<
    string,
    unknown
  >,
): number {
  const current =
    typeof assignment.submittedCount ===
    "number"
      ? assignment.submittedCount
      : 0;

  const maximum =
    safeStudentCount(
      assignment,
    );

  return Math.min(
    maximum,
    current + 1,
  );
}

export async function POST(
  request: Request,
) {
  try {
    const token =
      bearer(request);

    if (!token) {
      return errorJson(
        "Authentication is required.",
        401,
      );
    }

    const decoded =
      await adminAuth.verifyIdToken(
        token,
      );

    const body =
      (await request.json()) as
        RequestBody;

    const action =
      text(
        body.action,
        80,
      );

    const assignmentId =
      text(
        body.assignmentId,
        240,
      );

    const allowedActions =
      new Set([
        "get_or_create",
        "autosave",
        "submit",
        "record_incident",
        "update_question",
        "terminate",
      ]);

    if (
      !allowedActions.has(
        action,
      )
    ) {
      return errorJson(
        "Unsupported exam action.",
        400,
      );
    }

    if (
      !assignmentId
    ) {
      return errorJson(
        "Assignment ID is required.",
        400,
      );
    }

    const assignmentRef =
      adminDb
        .collection(
          "examAssignments",
        )
        .doc(
          assignmentId,
        );

    const submissionId =
      `${assignmentId}_${decoded.uid}`;

    const submissionRef =
      adminDb
        .collection(
          "examSubmissions",
        )
        .doc(
          submissionId,
        );

    const result =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          const [
            assignmentSnapshot,
            submissionSnapshot,
          ] =
            await Promise.all([
              transaction.get(
                assignmentRef,
              ),
              transaction.get(
                submissionRef,
              ),
            ]);

          if (
            !assignmentSnapshot.exists
          ) {
            throw new Error(
              "ASSIGNMENT_NOT_FOUND",
            );
          }

          const assignment =
            assignmentSnapshot.data() ||
            {};

          const studentIds =
            Array.isArray(
              assignment.studentIds,
            )
              ? assignment.studentIds.filter(
                  (
                    value: unknown,
                  ): value is string =>
                    typeof value ===
                    "string",
                )
              : [];

          if (
            !studentIds.includes(
              decoded.uid,
            )
          ) {
            throw new Error(
              "NOT_ASSIGNED",
            );
          }

          if (
            assignment.status !==
            "active"
          ) {
            throw new Error(
              "ASSIGNMENT_INACTIVE",
            );
          }

          const submission =
            submissionSnapshot.exists
              ? submissionSnapshot.data() ||
                {}
              : null;

          if (
            submission &&
            (
              submission.assignmentId !==
                assignmentId ||
              submission.studentId !==
                decoded.uid
            )
          ) {
            throw new Error(
              "SUBMISSION_OWNERSHIP_MISMATCH",
            );
          }

          if (
            action ===
            "get_or_create"
          ) {
            if (
              submissionSnapshot.exists
            ) {
              return {
                submission:
                  serialiseSubmission(
                    submissionSnapshot.id,
                    submission ||
                      {},
                  ),
              };
            }

            const created = {
              assignmentId,
              studentId:
                decoded.uid,
              studentName:
                text(
                  body.studentName,
                  240,
                ) ||
                "Student",
              studentEmail:
                text(
                  body.studentEmail,
                  320,
                ),
              teacherId:
                text(
                  assignment.teacherId,
                  240,
                ),
              classId:
                text(
                  assignment.classId,
                  240,
                ),
              status:
                "not_started",
              answers:
                blankAnswers(
                  assignment,
                ),
              totalAwardedMarks:
                0,
              totalAvailableMarks:
                typeof assignment.totalMarks ===
                "number"
                  ? assignment.totalMarks
                  : 0,
              percentage:
                0,
              overallFeedback:
                "",
              integrityPolicySnapshot:
                null,
              integrityIncidents:
                [],
              integrityTerminated:
                false,
              integrityTerminationReason:
                "",
              integritySessionStartedAt:
                null,
              integrityLastQuestionNumber:
                null,
              startedAt:
                null,
              submittedAt:
                null,
              markedAt:
                null,
              updatedAt:
                FieldValue.serverTimestamp(),
            };

            transaction.set(
              submissionRef,
              created,
            );

            return {
              submission: {
                id:
                  submissionId,
                ...created,
                updatedAt:
                  new Date().toISOString(),
              },
            };
          }

          if (
            !submissionSnapshot.exists ||
            !submission
          ) {
            throw new Error(
              "SUBMISSION_NOT_FOUND",
            );
          }

          const status =
            text(
              submission.status,
              80,
            );

          const locked =
            [
              "submitted",
              "marking",
              "marked",
            ].includes(
              status,
            );

          /*
           * Browser visibility/fullscreen transitions can leave an
           * autosave, current-question update or incident request in
           * flight while a submit/termination transaction locks the
           * attempt. Once locked, those stale side requests must become
           * harmless no-ops rather than surfacing a 409 to the learner.
           *
           * Final submit/terminate actions are already idempotent below.
           */
          if (
            locked &&
            action !==
              "submit" &&
            action !==
              "terminate"
          ) {
            return {};
          }

          if (
            action ===
            "autosave"
          ) {
            if (
              status !==
              "in_progress"
            ) {
              throw new Error(
                "SUBMISSION_NOT_IN_PROGRESS",
              );
            }

            transaction.update(
              submissionRef,
              {
                answers:
                  cleanAnswers(
                    body.answers,
                  ),
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );

            return {};
          }

          if (
            action ===
            "record_incident"
          ) {
            if (
              status !==
              "in_progress"
            ) {
              throw new Error(
                "SUBMISSION_NOT_IN_PROGRESS",
              );
            }

            const type =
              text(
                body.type,
                80,
              );

            const allowedTypes =
              new Set([
                "fullscreen_exit",
                "fullscreen_restored",
                "page_hidden",
                "page_visible",
                "integrity_termination",
              ]);

            if (
              !allowedTypes.has(
                type,
              )
            ) {
              throw new Error(
                "INVALID_INCIDENT_TYPE",
              );
            }

            const incident = {
              id:
                incidentId(
                  type,
                ),
              type,
              occurredAt:
                Timestamp.now(),
              questionNumber:
                questionNumber(
                  body.questionNumber,
                ),
              detail:
                text(
                  body.detail,
                  1000,
                ),
            };

            const currentIncidents =
              Array.isArray(
                submission.integrityIncidents,
              )
                ? submission.integrityIncidents
                : [];

            transaction.update(
              submissionRef,
              {
                integrityIncidents:
                  [
                    ...currentIncidents,
                    incident,
                  ],
                integrityLastQuestionNumber:
                  questionNumber(
                    body.questionNumber,
                  ),
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );

            return {};
          }

          if (
            action ===
            "update_question"
          ) {
            if (
              status !==
              "in_progress"
            ) {
              throw new Error(
                "SUBMISSION_NOT_IN_PROGRESS",
              );
            }

            const number =
              questionNumber(
                body.questionNumber,
              );

            if (
              number === null
            ) {
              throw new Error(
                "INVALID_QUESTION_NUMBER",
              );
            }

            transaction.update(
              submissionRef,
              {
                integrityLastQuestionNumber:
                  number,
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );

            return {};
          }

          if (
            action ===
            "terminate"
          ) {
            if (
              locked
            ) {
              return {};
            }

            if (
              status !==
              "in_progress"
            ) {
              throw new Error(
                "SUBMISSION_NOT_IN_PROGRESS",
              );
            }

            const reason =
              text(
                body.reason,
                1000,
              ) ||
              "Integrity policy triggered automatic submission.";

            const number =
              questionNumber(
                body.questionNumber,
              );

            const currentIncidents =
              Array.isArray(
                submission.integrityIncidents,
              )
                ? submission.integrityIncidents
                : [];

            transaction.update(
              submissionRef,
              {
                answers:
                  cleanAnswers(
                    body.answers,
                  ),
                status:
                  "submitted",
                submittedAt:
                  FieldValue.serverTimestamp(),
                integrityTerminated:
                  true,
                integrityTerminationReason:
                  reason,
                integrityLastQuestionNumber:
                  number,
                integrityIncidents:
                  [
                    ...currentIncidents,
                    {
                      id:
                        incidentId(
                          "integrity_termination",
                        ),
                      type:
                        "integrity_termination",
                      occurredAt:
                        Timestamp.now(),
                      questionNumber:
                        number,
                      detail:
                        reason,
                    },
                  ],
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );

            transaction.update(
              assignmentRef,
              {
                submittedCount:
                  nextSubmittedCount(
                    assignment,
                  ),
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );

            return {};
          }

          if (
            action ===
            "submit"
          ) {
            if (
              locked
            ) {
              return {};
            }

            if (
              status !==
              "in_progress"
            ) {
              throw new Error(
                "SUBMISSION_NOT_IN_PROGRESS",
              );
            }

            transaction.update(
              submissionRef,
              {
                status:
                  "submitted",
                submittedAt:
                  FieldValue.serverTimestamp(),
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );

            transaction.update(
              assignmentRef,
              {
                submittedCount:
                  nextSubmittedCount(
                    assignment,
                  ),
                updatedAt:
                  FieldValue.serverTimestamp(),
              },
            );

            return {};
          }

          return {};
        },
      );

    return NextResponse.json(
      {
        ok: true,
        ...result,
      },
      {
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    const code =
      error instanceof
      Error
        ? error.message
        : "";

    const errors: Record<
      string,
      [
        string,
        number,
      ]
    > = {
      ASSIGNMENT_NOT_FOUND:
        [
          "This exam assignment could not be found.",
          404,
        ],
      NOT_ASSIGNED:
        [
          "This exam is not assigned to your account.",
          403,
        ],
      ASSIGNMENT_INACTIVE:
        [
          "This exam assignment is no longer active.",
          409,
        ],
      SUBMISSION_OWNERSHIP_MISMATCH:
        [
          "The exam submission does not belong to this account.",
          403,
        ],
      SUBMISSION_NOT_FOUND:
        [
          "Your exam attempt could not be found.",
          404,
        ],
      SUBMISSION_LOCKED:
        [
          "This exam attempt has already been submitted.",
          409,
        ],
      SUBMISSION_NOT_IN_PROGRESS:
        [
          "This exam attempt is not currently in progress.",
          409,
        ],
      INVALID_INCIDENT_TYPE:
        [
          "The integrity event type is invalid.",
          400,
        ],
      INVALID_QUESTION_NUMBER:
        [
          "The question number is invalid.",
          400,
        ],
    };

    const known =
      errors[
        code
      ];

    if (
      known
    ) {
      return errorJson(
        known[0],
        known[1],
      );
    }

    console.error(
      "Student written-exam API error:",
      error,
    );

    return errorJson(
      "The written assessment request could not be completed.",
      500,
    );
  }
}
