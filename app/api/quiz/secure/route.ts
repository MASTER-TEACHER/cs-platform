import "server-only";

import {
  NextResponse,
} from "next/server";

import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";

import {
  adminAuth,
  adminDb,
} from "@/lib/firebaseAdmin";

import {
  getCurriculumQuizByTopic,
  getCurriculumQuizzes,
} from "@/data/quizzes/quizRegistry";

import type {
  Quiz,
} from "@/types/quiz";

import type {
  SecureQuiz,
  SecureQuizDeliveryMode,
  SecureQuizIntegrityIncident,
  SecureQuizMarkResult,
} from "@/types/secureQuiz";

import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const ATTEMPT_LIFETIME_MS =
  2 * 60 * 60 * 1000;

type RequestIdentity = {
  uid: string;
  qualification: Qualification;
  examBoard: ExamBoard;
};

type AssignmentContext = {
  id: string;
  classId: string;
  teacherId: string;
  resourceId: string;
  deliveryMode: SecureQuizDeliveryMode;
};

type SubmitBody = {
  topic?: unknown;
  attemptId?: unknown;
  assignmentId?: unknown;
  answers?: unknown;
  integrityIncidents?: unknown;
  integrityTerminated?: unknown;
  integrityTerminationReason?: unknown;
};

function cleanString(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function bearerToken(
  request: Request,
): string {
  const header =
    request.headers.get(
      "authorization",
    ) || "";

  if (
    !header.startsWith(
      "Bearer ",
    )
  ) {
    return "";
  }

  return header
    .slice(7)
    .trim();
}

async function getIdentity(
  request: Request,
): Promise<RequestIdentity> {
  const token =
    bearerToken(
      request,
    );

  if (!token) {
    throw new Error(
      "AUTH_REQUIRED",
    );
  }

  const decoded =
    await adminAuth.verifyIdToken(
      token,
    );

  const profileSnapshot =
    await adminDb
      .collection(
        "users",
      )
      .doc(
        decoded.uid,
      )
      .get();

  if (
    !profileSnapshot.exists
  ) {
    throw new Error(
      "PROFILE_REQUIRED",
    );
  }

  const profile =
    profileSnapshot.data() ||
    {};

  const qualification =
    profile.qualification as
      | Qualification
      | undefined;

  const examBoard =
    profile.examBoard as
      | ExamBoard
      | undefined;

  if (
    !qualification ||
    !examBoard
  ) {
    throw new Error(
      "CURRICULUM_REQUIRED",
    );
  }

  return {
    uid:
      decoded.uid,

    qualification,

    examBoard,
  };
}

function safeIdentifier(
  value: string,
): string {
  return value
    .trim()
    .replace(
      /[^a-zA-Z0-9_-]/g,
      "-",
    );
}

function quizResultId(
  quizId: string,
  uid: string,
): string {
  return `${safeIdentifier(
    quizId,
  )}_${uid}`;
}

function assignmentResultId(
  assignmentId: string,
  uid: string,
): string {
  return `${safeIdentifier(
    assignmentId,
  )}_${uid}`;
}

function publicQuiz(
  quiz: Quiz,
  attemptId: string,
  deliveryMode: SecureQuizDeliveryMode,
): SecureQuiz {
  return {
    id:
      quiz.id,

    topicId:
      quiz.topicId,

    title:
      quiz.title,

    description:
      quiz.description,

    estimatedTime:
      quiz.estimatedTime,

    questions:
      quiz.questions.map(
        (
          question,
        ) => ({
          id:
            question.id,

          type:
            question.type,

          question:
            question.question,

          options:
            question.options,

          xpReward:
            question.xpReward,
        }),
      ),

    attemptId,

    deliveryMode,
  };
}

function normaliseGeneratedQuiz(
  id: string,
  data:
    FirebaseFirestore.DocumentData,
): Quiz {
  const rawQuestions =
    Array.isArray(
      data.questions,
    )
      ? data.questions
      : [];

  const questions =
    rawQuestions
      .filter(
        (
          question,
        ) =>
          question &&
          typeof question.question ===
            "string" &&
          typeof question.correctAnswer ===
            "string",
      )
      .map(
        (
          question,
          index,
        ) => ({
          id:
            typeof question.id ===
              "string" &&
            question.id.trim()
              ? question.id
              : `${id}-question-${
                  index + 1
                }`,

          type:
            question.type ===
              "trueFalse" ||
            question.type ===
              "shortAnswer"
              ? question.type
              : ("multipleChoice" as const),

          question:
            question.question,

          options:
            Array.isArray(
              question.options,
            )
              ? question.options.filter(
                  (
                    value: unknown,
                  ): value is string =>
                    typeof value ===
                    "string",
                )
              : undefined,

          correctAnswer:
            question.correctAnswer,

          explanation:
            typeof question.explanation ===
            "string"
              ? question.explanation
              : "Review this topic with your teacher.",

          xpReward:
            typeof question.xpReward ===
              "number"
              ? Math.max(
                  0,
                  Math.round(
                    question.xpReward,
                  ),
                )
              : 10,
        }),
      );

  return {
    id,

    topicId:
      cleanString(
        data.topicId,
      ) ||
      id,

    title:
      cleanString(
        data.title,
      ) ||
      "Assigned Quiz",

    description:
      cleanString(
        data.description,
      ) ||
      "Complete this assigned quiz.",

    estimatedTime:
      cleanString(
        data.estimatedTime,
      ) ||
      "10 minutes",

    questions,
  };
}

async function getAssignmentContext({
  assignmentId,
  uid,
  resourceIds,
}: {
  assignmentId: string;
  uid: string;
  resourceIds: string[];
}): Promise<AssignmentContext> {
  const assignmentSnapshot =
    await adminDb
      .collection(
        "assignments",
      )
      .doc(
        assignmentId,
      )
      .get();

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

  if (
    assignment.type !==
      "quiz" ||
    assignment.status ===
      "cancelled"
  ) {
    throw new Error(
      "ASSIGNMENT_NOT_AVAILABLE",
    );
  }

  const resourceId =
    cleanString(
      assignment.resourceId,
    );

  if (
    !resourceId ||
    !resourceIds.includes(
      resourceId,
    )
  ) {
    throw new Error(
      "ASSIGNMENT_MISMATCH",
    );
  }

  const classId =
    cleanString(
      assignment.classId,
    );

  const teacherId =
    cleanString(
      assignment.teacherId,
    );

  if (
    !classId ||
    !teacherId
  ) {
    throw new Error(
      "ASSIGNMENT_NOT_AVAILABLE",
    );
  }

  const classSnapshot =
    await adminDb
      .collection(
        "classes",
      )
      .doc(
        classId,
      )
      .get();

  if (
    !classSnapshot.exists
  ) {
    throw new Error(
      "ASSIGNMENT_NOT_AVAILABLE",
    );
  }

  const classData =
    classSnapshot.data() ||
    {};

  const studentIds =
    Array.isArray(
      classData.studentIds,
    )
      ? classData.studentIds.filter(
          (
            value: unknown,
          ): value is string =>
            typeof value ===
            "string",
        )
      : [];

  if (
    !studentIds.includes(
      uid,
    )
  ) {
    throw new Error(
      "FORBIDDEN",
    );
  }

  return {
    id:
      assignmentId,

    classId,

    teacherId,

    resourceId,

    deliveryMode:
      assignment.deliveryMode ===
      "assessment"
        ? "assessment"
        : "practice",
  };
}

async function loadQuiz({
  topic,
  identity,
  assignmentId,
}: {
  topic: string;
  identity: RequestIdentity;
  assignmentId?: string | null;
}): Promise<{
  quiz: Quiz;
  assignment: AssignmentContext | null;
} | null> {
  const builtIn =
    getCurriculumQuizByTopic(
      topic,
      identity.qualification,
      identity.examBoard,
    );

  if (builtIn) {
    const assignment =
      assignmentId
        ? await getAssignmentContext({
            assignmentId,
            uid:
              identity.uid,

            resourceIds: [
              builtIn.id,
              builtIn.topicId,
              topic,
            ],
          })
        : null;

    return {
      quiz:
        builtIn,

      assignment,
    };
  }

  const generatedSnapshot =
    await adminDb
      .collection(
        "generatedQuizzes",
      )
      .doc(
        topic,
      )
      .get();

  if (
    !generatedSnapshot.exists
  ) {
    return null;
  }

  const data =
    generatedSnapshot.data() ||
    {};

  const generatedQuiz =
    normaliseGeneratedQuiz(
      generatedSnapshot.id,
      data,
    );

  let assignment:
    AssignmentContext | null =
    null;

  if (assignmentId) {
    assignment =
      await getAssignmentContext({
        assignmentId,

        uid:
          identity.uid,

        resourceIds: [
          generatedSnapshot.id,
          generatedQuiz.id,
          generatedQuiz.topicId,
          topic,
        ],
      });
  } else {
    /*
     * Generated quizzes are teacher-created protected
     * content. Without a linked assignment, only the owner
     * may open the complete quiz through this endpoint.
     */
    const ownerId =
      cleanString(
        data.teacherId,
      );

    if (
      ownerId !==
      identity.uid
    ) {
      throw new Error(
        "FORBIDDEN",
      );
    }
  }

  return {
    quiz:
      generatedQuiz,

    assignment,
  };
}

async function createAttempt({
  identity,
  quiz,
  assignment,
}: {
  identity: RequestIdentity;
  quiz: Quiz;
  assignment: AssignmentContext | null;
}): Promise<string> {
  const reference =
    adminDb
      .collection(
        "quizAttempts",
      )
      .doc();

  const now =
    Timestamp.now();

  const expiresAt =
    Timestamp.fromMillis(
      now.toMillis() +
        ATTEMPT_LIFETIME_MS,
    );

  await reference.set({
    uid:
      identity.uid,

    quizId:
      quiz.id,

    topicId:
      quiz.topicId,

    assignmentId:
      assignment?.id ||
      null,

    teacherId:
      assignment?.teacherId ||
      null,

    classId:
      assignment?.classId ||
      null,

    resourceId:
      assignment?.resourceId ||
      null,

    deliveryMode:
      assignment?.deliveryMode ||
      "practice",

    status:
      "started",

    startedAt:
      now,

    expiresAt,

    submittedAt:
      null,

    result:
      null,
  });

  return reference.id;
}

function parseIntegrityIncidents(
  value: unknown,
): SecureQuizIntegrityIncident[] {
  if (
    !Array.isArray(
      value,
    )
  ) {
    return [];
  }

  return value
    .slice(
      0,
      100,
    )
    .flatMap(
      (
        item,
      ) => {
        if (
          !item ||
          typeof item !==
            "object"
        ) {
          return [];
        }

        const record =
          item as Record<
            string,
            unknown
          >;

        const type =
          cleanString(
            record.type,
          );

        if (
          type !==
            "fullscreen_exit" &&
          type !==
            "fullscreen_restore" &&
          type !==
            "visibility_hidden" &&
          type !==
            "auto_submit"
        ) {
          return [];
        }

        return [
          {
            type,

            occurredAt:
              cleanString(
                record.occurredAt,
              ) ||
              new Date().toISOString(),

            questionNumber:
              Math.max(
                1,
                Math.round(
                  typeof record.questionNumber ===
                    "number"
                    ? record.questionNumber
                    : 1,
                ),
              ),

            detail:
              cleanString(
                record.detail,
              ).slice(
                0,
                500,
              ),
          } as SecureQuizIntegrityIncident,
        ];
      },
    );
}

function errorResponse(
  error: unknown,
) {
  const code =
    error instanceof Error
      ? error.message
      : "";

  if (
    code ===
    "AUTH_REQUIRED"
  ) {
    return NextResponse.json(
      {
        error:
          "Sign in is required.",
      },
      {
        status: 401,
      },
    );
  }

  if (
    code ===
      "FORBIDDEN" ||
    code ===
      "ASSIGNMENT_MISMATCH"
  ) {
    return NextResponse.json(
      {
        error:
          "You do not have access to this quiz.",
      },
      {
        status: 403,
      },
    );
  }

  if (
    code ===
      "PROFILE_REQUIRED" ||
    code ===
      "CURRICULUM_REQUIRED"
  ) {
    return NextResponse.json(
      {
        error:
          "Complete your CS Master curriculum profile first.",
      },
      {
        status: 409,
      },
    );
  }

  if (
    code ===
      "ASSIGNMENT_NOT_FOUND" ||
    code ===
      "ASSIGNMENT_NOT_AVAILABLE"
  ) {
    return NextResponse.json(
      {
        error:
          "This quiz assignment is not available.",
      },
      {
        status: 404,
      },
    );
  }

  if (
    code ===
    "ATTEMPT_EXPIRED"
  ) {
    return NextResponse.json(
      {
        error:
          "This quiz attempt has expired. Re-open the quiz to start a new attempt.",
      },
      {
        status: 409,
      },
    );
  }

  if (
    code ===
    "ATTEMPT_INVALID"
  ) {
    return NextResponse.json(
      {
        error:
          "This quiz attempt is invalid.",
      },
      {
        status: 409,
      },
    );
  }

  console.error(
    "Secure quiz API error:",
    error,
  );

  return NextResponse.json(
    {
      error:
        "The secure quiz service could not complete the request.",
    },
    {
      status: 500,
    },
  );
}

export async function GET(
  request: Request,
) {
  try {
    const identity =
      await getIdentity(
        request,
      );

    const url =
      new URL(
        request.url,
      );

    const topic =
      cleanString(
        url.searchParams.get(
          "topic",
        ),
      );

    const assignmentId =
      cleanString(
        url.searchParams.get(
          "assignment",
        ),
      );

    if (!topic) {
      const quizzes =
        getCurriculumQuizzes(
          identity.qualification,
          identity.examBoard,
        ).map(
          ({
            quiz,
            topicId,
            unitTitle,
          }) => ({
            id:
              quiz.id,

            topicId,

            title:
              quiz.title,

            description:
              quiz.description,

            estimatedTime:
              quiz.estimatedTime,

            questionCount:
              quiz.questions.length,

            unitTitle,
          }),
        );

      return NextResponse.json(
        {
          quizzes,
        },
        {
          headers: {
            "Cache-Control":
              "private, no-store, max-age=0",
          },
        },
      );
    }

    const loaded =
      await loadQuiz({
        topic,

        identity,

        assignmentId:
          assignmentId ||
          null,
      });

    if (!loaded) {
      return NextResponse.json(
        {
          error:
            "The requested quiz could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    const attemptId =
      await createAttempt({
        identity,

        quiz:
          loaded.quiz,

        assignment:
          loaded.assignment,
      });

    return NextResponse.json(
      {
        quiz:
          publicQuiz(
            loaded.quiz,
            attemptId,
            loaded.assignment
              ?.deliveryMode ||
              "practice",
          ),
      },
      {
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      },
    );
  } catch (
    error
  ) {
    return errorResponse(
      error,
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const identity =
      await getIdentity(
        request,
      );

    const body =
      (await request.json()) as
        SubmitBody;

    const topic =
      cleanString(
        body.topic,
      );

    const attemptId =
      cleanString(
        body.attemptId,
      );

    const requestedAssignmentId =
      cleanString(
        body.assignmentId,
      );

    if (
      !topic ||
      !attemptId ||
      !body.answers ||
      typeof body.answers !==
        "object"
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid quiz submission.",
        },
        {
          status: 400,
        },
      );
    }

    const attemptReference =
      adminDb
        .collection(
          "quizAttempts",
        )
        .doc(
          attemptId,
        );

    const initialAttemptSnapshot =
      await attemptReference.get();

    if (
      !initialAttemptSnapshot.exists
    ) {
      throw new Error(
        "ATTEMPT_INVALID",
      );
    }

    const initialAttempt =
      initialAttemptSnapshot.data() ||
      {};

    if (
      cleanString(
        initialAttempt.uid,
      ) !==
      identity.uid
    ) {
      throw new Error(
        "FORBIDDEN",
      );
    }

    if (
      initialAttempt.status ===
        "completed" &&
      initialAttempt.result
    ) {
      return NextResponse.json(
        {
          result:
            initialAttempt.result,
        },
        {
          headers: {
            "Cache-Control":
              "private, no-store, max-age=0",
          },
        },
      );
    }

    if (
      !(initialAttempt.expiresAt instanceof
        Timestamp) ||
      initialAttempt.expiresAt.toMillis() <
        Date.now()
    ) {
      throw new Error(
        "ATTEMPT_EXPIRED",
      );
    }

    const attemptAssignmentId =
      cleanString(
        initialAttempt.assignmentId,
      );

    if (
      attemptAssignmentId !==
      requestedAssignmentId
    ) {
      throw new Error(
        "ATTEMPT_INVALID",
      );
    }

    const loaded =
      await loadQuiz({
        topic,

        identity,

        assignmentId:
          attemptAssignmentId ||
          null,
      });

    if (!loaded) {
      return NextResponse.json(
        {
          error:
            "The requested quiz could not be found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      cleanString(
        initialAttempt.quizId,
      ) !==
      loaded.quiz.id
    ) {
      throw new Error(
        "ATTEMPT_INVALID",
      );
    }

    const answers =
      body.answers as Record<
        string,
        unknown
      >;

    const review =
      loaded.quiz.questions.map(
        (
          question,
        ) => {
          const rawAnswer =
            answers[
              question.id
            ];

          const userAnswer =
            typeof rawAnswer ===
            "string"
              ? rawAnswer
              : "";

          const correct =
            userAnswer
              .trim()
              .toLowerCase() ===
            question.correctAnswer
              .trim()
              .toLowerCase();

          return {
            questionId:
              question.id,

            question:
              question.question,

            userAnswer,

            correctAnswer:
              question.correctAnswer,

            explanation:
              question.explanation,

            correct,
          };
        },
      );

    const correctCount =
      review.filter(
        (
          item,
        ) =>
          item.correct,
      ).length;

    const totalQuestions =
      loaded.quiz.questions.length;

    const scorePercent =
      totalQuestions > 0
        ? Math.round(
            (correctCount /
              totalQuestions) *
              100,
          )
        : 0;

    const integrityTerminated =
      body.integrityTerminated ===
      true;

    const integrityTerminationReason =
      cleanString(
        body.integrityTerminationReason,
      ).slice(
        0,
        500,
      );

    const integrityIncidents =
      parseIntegrityIncidents(
        body.integrityIncidents,
      );

    const calculatedXP =
      integrityTerminated
        ? 0
        : loaded.quiz.questions.reduce(
            (
              total,
              question,
            ) => {
              const item =
                review.find(
                  (
                    reviewItem,
                  ) =>
                    reviewItem.questionId ===
                    question.id,
                );

              return item?.correct
                ? total +
                    question.xpReward
                : total;
            },
            0,
          );

    const userReference =
      adminDb
        .collection(
          "users",
        )
        .doc(
          identity.uid,
        );

    const independentResultReference =
      userReference
        .collection(
          "quizResults",
        )
        .doc(
          quizResultId(
            loaded.quiz.id,
            identity.uid,
          ),
        );

    const assignmentResultReference =
      loaded.assignment
        ? adminDb
            .collection(
              "assignmentResults",
            )
            .doc(
              assignmentResultId(
                loaded.assignment.id,
                identity.uid,
              ),
            )
        : null;

    const persistedResult =
      await adminDb.runTransaction(
        async (
          transaction,
        ) => {
          const attemptSnapshot =
            await transaction.get(
              attemptReference,
            );

          if (
            !attemptSnapshot.exists
          ) {
            throw new Error(
              "ATTEMPT_INVALID",
            );
          }

          const attempt =
            attemptSnapshot.data() ||
            {};

          if (
            cleanString(
              attempt.uid,
            ) !==
            identity.uid
          ) {
            throw new Error(
              "FORBIDDEN",
            );
          }

          if (
            attempt.status ===
              "completed" &&
            attempt.result
          ) {
            return attempt.result as
              SecureQuizMarkResult;
          }

          if (
            !(attempt.expiresAt instanceof
              Timestamp) ||
            attempt.expiresAt.toMillis() <
              Date.now()
          ) {
            throw new Error(
              "ATTEMPT_EXPIRED",
            );
          }

          const [
            existingIndependentResult,
            existingAssignmentResult,
          ] =
            await Promise.all([
              transaction.get(
                independentResultReference,
              ),

              assignmentResultReference
                ? transaction.get(
                    assignmentResultReference,
                  )
                : Promise.resolve(
                    null,
                  ),
            ]);

          /*
           * XP is awarded only the first time this quiz/result
           * is completed. Replaying POST or repeatedly retaking
           * the same assignment cannot farm XP.
           */
          const alreadyRewarded =
            existingIndependentResult.exists ||
            Boolean(
              existingAssignmentResult?.exists,
            );

          const earnedXP =
            alreadyRewarded
              ? 0
              : calculatedXP;

          const serverNow =
            Timestamp.now();

          transaction.set(
            independentResultReference,
            {
              uid:
                identity.uid,

              quizId:
                loaded.quiz.id,

              topicId:
                loaded.quiz.topicId,

              title:
                loaded.quiz.title,

              scorePercent,

              correctCount,

              totalQuestions,

              earnedXP,

              status:
                "completed",

              attemptId,

              completedAt:
                serverNow,

              createdAt:
                existingIndependentResult.exists
                  ? existingIndependentResult.data()
                      ?.createdAt ||
                    serverNow
                  : serverNow,

              updatedAt:
                serverNow,
            },
            {
              merge: true,
            },
          );

          let assignmentResultPersisted =
            false;

          if (
            loaded.assignment &&
            assignmentResultReference
          ) {
            const startedAt =
              attempt.startedAt instanceof
              Timestamp
                ? attempt.startedAt
                : serverNow;

            const timeTakenSeconds =
              Math.max(
                0,
                Math.round(
                  (serverNow.toMillis() -
                    startedAt.toMillis()) /
                    1000,
                ),
              );

            transaction.set(
              assignmentResultReference,
              {
                assignmentId:
                  loaded.assignment.id,

                studentId:
                  identity.uid,

                classId:
                  loaded.assignment.classId,

                teacherId:
                  loaded.assignment.teacherId,

                assignmentType:
                  "quiz",

                resourceId:
                  loaded.assignment.resourceId ||
                  loaded.quiz.topicId,

                topicId:
                  loaded.quiz.topicId,

                quizTitle:
                  loaded.quiz.title,

                score:
                  correctCount,

                totalQuestions,

                percentage:
                  scorePercent,

                earnedXP,

                timeTakenSeconds,

                deliveryMode:
                  loaded.assignment.deliveryMode,

                integritySessionStartedAt:
                  startedAt.toDate().toISOString(),

                integrityIncidents,

                integrityTerminated,

                integrityTerminationReason,

                status:
                  "completed",

                attemptId,

                completedAt:
                  serverNow,

                createdAt:
                  existingAssignmentResult?.exists
                    ? existingAssignmentResult.data()
                        ?.createdAt ||
                      serverNow
                    : serverNow,

                updatedAt:
                  serverNow,
              },
              {
                merge: true,
              },
            );

            assignmentResultPersisted =
              true;
          }

          if (
            earnedXP > 0
          ) {
            transaction.update(
              userReference,
              {
                xp:
                  FieldValue.increment(
                    earnedXP,
                  ),

                updatedAt:
                  serverNow,
              },
            );
          }

          const result:
            SecureQuizMarkResult =
            {
              correctCount,

              totalQuestions,

              scorePercent,

              earnedXP,

              xpAwardedThisAttempt:
                earnedXP > 0,

              persisted:
                true,

              assignmentResultPersisted,

              review,
            };

          transaction.update(
            attemptReference,
            {
              status:
                "completed",

              submittedAt:
                serverNow,

              integrityIncidents,

              integrityTerminated,

              integrityTerminationReason,

              result,
            },
          );

          return result;
        },
      );

    return NextResponse.json(
      {
        result:
          persistedResult,
      },
      {
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0",
        },
      },
    );
  } catch (
    error
  ) {
    return errorResponse(
      error,
    );
  }
}
