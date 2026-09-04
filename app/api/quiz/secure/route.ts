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
  quizSource: "built-in" | "ai-generated";
  qualification: Qualification | null;
  examBoard: ExamBoard | null;
  deliveryMode: SecureQuizDeliveryMode;
  status: "active" | "closed";
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
}: {
  assignmentId: string;
  uid: string;
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

  const classId =
    cleanString(
      assignment.classId,
    );

  const teacherId =
    cleanString(
      assignment.teacherId,
    );

  if (
    !resourceId ||
    !classId ||
    !teacherId
  ) {
    throw new Error(
      "ASSIGNMENT_NOT_AVAILABLE",
    );
  }

  /*
   * New targeted assignments carry their explicit studentIds.
   * Prefer that list so another student in the same class cannot
   * open an individually targeted quiz simply by discovering the
   * assignment ID.
   *
   * Older assignments may not have studentIds, so class membership
   * remains as a legacy fallback only.
   */
  const assignedStudentIds =
    Array.isArray(
      assignment.studentIds,
    )
      ? assignment.studentIds.filter(
          (
            value: unknown,
          ): value is string =>
            typeof value ===
            "string" &&
            Boolean(
              value.trim(),
            ),
        )
      : [];

  if (
    assignedStudentIds.length >
      0
  ) {
    if (
      !assignedStudentIds.includes(
        uid,
      )
    ) {
      throw new Error(
        "FORBIDDEN",
      );
    }
  } else {
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

    const classStudentIds =
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
      !classStudentIds.includes(
        uid,
      )
    ) {
      throw new Error(
        "FORBIDDEN",
      );
    }
  }

  const qualification =
    assignment.qualification ===
      "GCSE" ||
    assignment.qualification ===
      "A_LEVEL"
      ? (assignment.qualification as Qualification)
      : null;

  const examBoardValue =
    cleanString(
      assignment.examBoard,
    );

  return {
    id:
      assignmentId,

    classId,

    teacherId,

    resourceId,

    quizSource:
      assignment.quizSource ===
      "ai-generated"
        ? "ai-generated"
        : "built-in",

    qualification,

    examBoard:
      examBoardValue
        ? (examBoardValue as ExamBoard)
        : null,

    deliveryMode:
      assignment.deliveryMode ===
      "assessment"
        ? "assessment"
        : "practice",

    status:
      assignment.status === "closed"
        ? "closed"
        : "active",
  };
}

function assignmentMatchesQuiz(
  assignment: AssignmentContext,
  quiz: Quiz,
  requestedTopic: string,
): boolean {
  return [
    quiz.id,
    quiz.topicId,
    requestedTopic,
  ].includes(
    assignment.resourceId,
  );
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
  /*
   * Assignment-driven quiz access is intentionally resolved before
   * the student's normal curriculum lookup.
   *
   * A teacher may assign a quiz from a different curriculum from the
   * student's current browsing selection. The assignment is therefore
   * the authority for the exact quiz, but only after getAssignmentContext()
   * has verified assignment status and student access.
   */
  if (assignmentId) {
    const assignment =
      await getAssignmentContext({
        assignmentId,
        uid:
          identity.uid,
      });

    if (
      assignment.quizSource ===
      "ai-generated"
    ) {
      const generatedSnapshot =
        await adminDb
          .collection(
            "generatedQuizzes",
          )
          .doc(
            assignment.resourceId,
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

      if (
        !assignmentMatchesQuiz(
          assignment,
          generatedQuiz,
          topic,
        )
      ) {
        throw new Error(
          "ASSIGNMENT_MISMATCH",
        );
      }

      return {
        quiz:
          generatedQuiz,

        assignment,
      };
    }

    /*
     * Fresh built-in quiz assignments store the qualification and
     * exam board chosen by the teacher. Legacy assignments without
     * those fields fall back to the student's own curriculum so
     * existing same-curriculum assignments remain usable.
     */
    const assignmentQualification =
      assignment.qualification ||
      identity.qualification;

    const assignmentExamBoard =
      assignment.examBoard ||
      identity.examBoard;

    /*
     * Resolve assigned built-in quizzes from the same curriculum-aware
     * collection used by the teacher selector. Assignments may store either
     * the quiz id or the canonical topic id as resourceId.
     */
    const curriculumQuizzes =
      getCurriculumQuizzes(
        assignmentQualification,
        assignmentExamBoard,
      );

    const assignedEntry =
      curriculumQuizzes.find(
        ({ quiz, topicId }) =>
          assignment.resourceId === quiz.id ||
          assignment.resourceId === quiz.topicId ||
          assignment.resourceId === topicId,
      ) ||
      curriculumQuizzes.find(
        ({ quiz, topicId }) =>
          topic === quiz.id ||
          topic === quiz.topicId ||
          topic === topicId,
      );

    const assignedBuiltIn =
      assignedEntry?.quiz ||
      getCurriculumQuizByTopic(
        assignment.resourceId,
        assignmentQualification,
        assignmentExamBoard,
      ) ||
      getCurriculumQuizByTopic(
        topic,
        assignmentQualification,
        assignmentExamBoard,
      );

    if (!assignedBuiltIn) {
      console.error(
        "Assigned built-in quiz could not be resolved:",
        {
          assignmentId: assignment.id,
          resourceId: assignment.resourceId,
          requestedTopic: topic,
          qualification: assignmentQualification,
          examBoard: assignmentExamBoard,
          available: curriculumQuizzes.map(
            ({ quiz, topicId }) => ({
              id: quiz.id,
              topicId,
              quizTopicId: quiz.topicId,
            }),
          ),
        },
      );

      return null;
    }

    if (
      !assignmentMatchesQuiz(
        assignment,
        assignedBuiltIn,
        topic,
      )
    ) {
      throw new Error(
        "ASSIGNMENT_MISMATCH",
      );
    }

    return {
      quiz:
        assignedBuiltIn,

      assignment,
    };
  }

  /*
   * Normal, non-assignment quiz browsing remains locked to the
   * student's selected qualification and exam board.
   */
  const builtIn =
    getCurriculumQuizByTopic(
      topic,
      identity.qualification,
      identity.examBoard,
    );

  if (builtIn) {
    return {
      quiz:
        builtIn,

      assignment:
        null,
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

  /*
   * Generated quizzes are teacher-created protected content.
   * Without a linked assignment, only the owner may open the
   * complete quiz through this endpoint.
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

  return {
    quiz:
      generatedQuiz,

    assignment:
      null,
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

function timestampToIso(
  value: unknown,
): string | null {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? null
      : parsed.toISOString();
  }

  return null;
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

    const reviewRequested =
      url.searchParams.get("review") === "1";

    if (reviewRequested) {
      if (!topic || !assignmentId) {
        return NextResponse.json(
          {
            error:
              "A completed quiz assignment is required for review.",
          },
          { status: 400 },
        );
      }

      /*
       * Validate the assignment/student/topic using the same secure resolver
       * used for normal quiz delivery, but DO NOT create a new attempt.
       */
      const loadedReviewQuiz =
        await loadQuiz({
          topic,
          identity,
          assignmentId,
        });

      if (!loadedReviewQuiz?.assignment) {
        throw new Error("FORBIDDEN");
      }

      const resultReference =
        adminDb
          .collection("assignmentResults")
          .doc(
            assignmentResultId(
              assignmentId,
              identity.uid,
            ),
          );

      const resultSnapshot =
        await resultReference.get();

      if (!resultSnapshot.exists) {
        return NextResponse.json(
          {
            error:
              "This quiz has not been completed yet.",
          },
          { status: 404 },
        );
      }

      const resultData =
        resultSnapshot.data() || {};

      if (
        cleanString(resultData.studentId) !==
        identity.uid
      ) {
        throw new Error("FORBIDDEN");
      }

      if (resultData.status !== "completed") {
        return NextResponse.json(
          {
            error:
              "This quiz has not been completed yet.",
          },
          { status: 409 },
        );
      }

      let savedReview =
        Array.isArray(resultData.review)
          ? resultData.review
          : [];

      /*
       * Backward-compatible fallback for assignments completed before the
       * review snapshot was stored directly on assignmentResults.
       */
      if (savedReview.length === 0) {
        const savedAttemptId =
          cleanString(resultData.attemptId);

        if (savedAttemptId) {
          const attemptSnapshot =
            await adminDb
              .collection("quizAttempts")
              .doc(savedAttemptId)
              .get();

          if (attemptSnapshot.exists) {
            const attemptData =
              attemptSnapshot.data() || {};

            if (
              cleanString(attemptData.uid) ===
                identity.uid &&
              attemptData.status === "completed" &&
              attemptData.result &&
              Array.isArray(
                attemptData.result.review,
              )
            ) {
              savedReview =
                attemptData.result.review;
            }
          }
        }
      }

      return NextResponse.json(
        {
          reviewResult: {
            assignmentId,
            quizTitle:
              cleanString(resultData.quizTitle) ||
              loadedReviewQuiz.quiz.title,
            score:
              typeof resultData.score === "number"
                ? resultData.score
                : 0,
            totalQuestions:
              typeof resultData.totalQuestions ===
              "number"
                ? resultData.totalQuestions
                : savedReview.length,
            percentage:
              typeof resultData.percentage ===
              "number"
                ? resultData.percentage
                : 0,
            earnedXP:
              typeof resultData.earnedXP === "number"
                ? resultData.earnedXP
                : 0,
            completedAt:
              timestampToIso(
                resultData.completedAt,
              ),
            review: savedReview,
          },
        },
        {
          headers: {
            "Cache-Control":
              "private, no-store, max-age=0",
          },
        },
      );
    }

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

    if (
      loaded.assignment &&
      loaded.assignment.status !== "active"
    ) {
      return NextResponse.json(
        {
          error:
            "This quiz assignment has been closed by your teacher.",
        },
        { status: 409 },
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
      loaded.assignment &&
      loaded.assignment.status !== "active"
    ) {
      throw new Error(
        "ASSIGNMENT_NOT_AVAILABLE",
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
            loaded.assignment
              ? Boolean(
                  existingAssignmentResult?.exists,
                )
              : existingIndependentResult.exists;

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

                /*
                 * Store the authoritative server-marked review with the
                 * assignment result so completed work can be reopened in
                 * read-only mode without creating a new attempt.
                 */
                review,

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
