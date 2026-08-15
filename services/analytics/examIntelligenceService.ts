import type {
  ExamAssignment,
  ExamIntegrityIncidentType,
  ExamSubmission,
} from "@/types/examAssignment";
import type {
  ExamClassIntelligence,
  ExamQuestionDifficulty,
  ExamQuestionIntelligence,
  ExamStudentPriority,
  ExamTopicIntelligence,
} from "@/types/examIntelligence";

const INCIDENT_TYPES: ExamIntegrityIncidentType[] = [
  "fullscreen_exit",
  "fullscreen_restored",
  "page_hidden",
  "page_visible",
  "integrity_termination",
];

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

function questionTopic(
  question: unknown,
  fallback: string,
): string {
  if (!question || typeof question !== "object") {
    return fallback;
  }

  const data = question as Record<string, unknown>;

  const candidates = [
    data.topic,
    data.topicFocus,
    data.subtopic,
    data.curriculumTopic,
  ];

  for (const value of candidates) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return fallback;
}

function questionDifficulty(
  successPercentage: number | null,
  markedStudents: number,
): ExamQuestionDifficulty {
  if (
    markedStudents === 0 ||
    successPercentage === null
  ) {
    return "insufficient";
  }

  if (successPercentage >= 70) {
    return "secure";
  }

  if (successPercentage >= 50) {
    return "developing";
  }

  return "priority";
}

type StudentExamWeakness = {
  topic: string | null;
  questionNumber: number | null;
  successPercentage: number | null;
};

function getStudentExamWeakness(
  assignment: ExamAssignment,
  submission: ExamSubmission,
  fallbackTopic: string,
): StudentExamWeakness {
  if (submission.status !== "marked") {
    return {
      topic: null,
      questionNumber: null,
      successPercentage: null,
    };
  }

  const scored = assignment.questionSetSnapshot.questions
    .map((question) => {
      const answer = submission.answers.find(
        (item) =>
          item.questionId === question.id,
      );

      if (
        !answer ||
        answer.awardedMarks === null ||
        question.marks <= 0
      ) {
        return null;
      }

      return {
        topic: questionTopic(
          question,
          fallbackTopic,
        ),
        questionNumber:
          question.questionNumber,
        successPercentage: round(
          (answer.awardedMarks /
            question.marks) *
            100,
        ),
      };
    })
    .filter(
      (
        value,
      ): value is NonNullable<
        typeof value
      > => Boolean(value),
    )
    .sort(
      (first, second) =>
        first.successPercentage -
        second.successPercentage,
    );

  const weakest = scored[0];

  if (!weakest) {
    return {
      topic: null,
      questionNumber: null,
      successPercentage: null,
    };
  }

  return {
    topic: weakest.topic,
    questionNumber:
      weakest.questionNumber,
    successPercentage:
      weakest.successPercentage,
  };
}

function buildStudentPriority(
  assignment: ExamAssignment,
  submission: ExamSubmission,
  classAverage: number | null,
  fallbackTopic: string,
): ExamStudentPriority {
  const reasons: string[] = [];
  let priority: ExamStudentPriority["priority"] =
    "none";

  if (submission.integrityTerminated) {
    priority = "high";
    reasons.push(
      "The attempt was automatically submitted by an integrity rule.",
    );
  }

  if (
    submission.integrityIncidents.length >= 3
  ) {
    if (priority !== "high") {
      priority = "medium";
    }

    reasons.push(
      `${submission.integrityIncidents.length} integrity-monitoring events were recorded for teacher review.`,
    );
  } else if (
    submission.integrityIncidents.length >
      0 &&
    priority === "none"
  ) {
    priority = "monitor";

    reasons.push(
      `${submission.integrityIncidents.length} integrity-monitoring event${submission.integrityIncidents.length === 1 ? "" : "s"} recorded.`,
    );
  }

  const percentage =
    submission.status === "marked"
      ? submission.percentage
      : null;

  if (
    percentage !== null &&
    percentage < 40
  ) {
    priority = "high";

    reasons.push(
      `Marked result is ${percentage}%, below the 40% intervention threshold.`,
    );
  } else if (
    percentage !== null &&
    classAverage !== null &&
    percentage <= classAverage - 15
  ) {
    if (priority !== "high") {
      priority = "medium";
    }

    reasons.push(
      `Result is ${round(classAverage - percentage)} percentage points below the current class average.`,
    );
  }

  if (
    ["submitted", "marking"].includes(
      submission.status,
    ) &&
    priority === "none"
  ) {
    priority = "monitor";

    reasons.push(
      "The paper is submitted but not yet fully marked, so attainment evidence is incomplete.",
    );
  }

  const weakness = getStudentExamWeakness(
    assignment,
    submission,
    fallbackTopic,
  );

  if (
    weakness.topic &&
    weakness.successPercentage !== null &&
    weakness.successPercentage < 50
  ) {
    if (priority === "none") {
      priority = "monitor";
    }

    reasons.push(
      `Weakest marked exam evidence is ${weakness.topic} at ${weakness.successPercentage}% on Q${weakness.questionNumber}.`,
    );
  }

  return {
    studentId: submission.studentId,
    studentName: submission.studentName,
    studentEmail:
      submission.studentEmail,
    status: submission.status,
    percentage,
    integrityIncidentCount:
      submission.integrityIncidents.length,
    integrityTerminated:
      submission.integrityTerminated,
    priority,
    reasons,
    weakestExamTopic: weakness.topic,
    weakestQuestionNumber:
      weakness.questionNumber,
    weakestQuestionSuccessPercentage:
      weakness.successPercentage,
  };
}

export function buildExamClassIntelligence(
  assignment: ExamAssignment,
  submissions: ExamSubmission[],
): ExamClassIntelligence {
  const submitted = submissions.filter(
    (submission) =>
      [
        "submitted",
        "marking",
        "marked",
      ].includes(submission.status),
  );

  const marked = submissions.filter(
    (submission) =>
      submission.status === "marked",
  );

  const started = submissions.filter(
    (submission) =>
      submission.status !== "not_started",
  );

  const markedPercentages =
    marked.map(
      (submission) =>
        submission.percentage,
    );

  const classAverage =
    markedPercentages.length > 0
      ? round(
          markedPercentages.reduce(
            (sum, value) =>
              sum + value,
            0,
          ) /
            markedPercentages.length,
        )
      : null;

  const highestPercentage =
    markedPercentages.length > 0
      ? Math.max(...markedPercentages)
      : null;

  const lowestPercentage =
    markedPercentages.length > 0
      ? Math.min(...markedPercentages)
      : null;

  const fallbackTopic =
    assignment.questionSetSnapshot.topic ||
    assignment.questionSetTitle ||
    "General Computer Science";

  const questionIntelligence: ExamQuestionIntelligence[] =
    assignment.questionSetSnapshot.questions.map(
      (question) => {
        const relevantAnswers = marked
          .map((submission) =>
            submission.answers.find(
              (answer) =>
                answer.questionId ===
                question.id,
            ),
          )
          .filter(
            (
              answer,
            ): answer is NonNullable<
              typeof answer
            > => Boolean(answer),
          );

        const awardedMarks =
          relevantAnswers.map(
            (answer) =>
              answer.awardedMarks ?? 0,
          );

        const attemptedStudents =
          relevantAnswers.filter(
            (answer) =>
              answer.response.trim().length >
              0,
          ).length;

        const zeroMarkStudents =
          relevantAnswers.filter(
            (answer) =>
              (answer.awardedMarks ?? 0) ===
              0,
          ).length;

        const averageAwardedMarks =
          awardedMarks.length > 0
            ? round(
                awardedMarks.reduce(
                  (sum, value) =>
                    sum + value,
                  0,
                ) /
                  awardedMarks.length,
              )
            : null;

        const successPercentage =
          averageAwardedMarks !== null &&
          question.marks > 0
            ? round(
                (averageAwardedMarks /
                  question.marks) *
                  100,
              )
            : null;

        return {
          questionId: question.id,
          questionNumber:
            question.questionNumber,
          questionText:
            question.question,
          topic: questionTopic(
            question,
            fallbackTopic,
          ),
          availableMarks:
            question.marks,
          markedStudents:
            relevantAnswers.length,
          attemptedStudents,
          zeroMarkStudents,
          averageAwardedMarks,
          successPercentage,
          difficulty:
            questionDifficulty(
              successPercentage,
              relevantAnswers.length,
            ),
        };
      },
    );

  const topicMap = new Map<
    string,
    ExamQuestionIntelligence[]
  >();

  for (
    const question of
    questionIntelligence
  ) {
    const current =
      topicMap.get(question.topic) || [];

    current.push(question);
    topicMap.set(
      question.topic,
      current,
    );
  }

  const topicIntelligence: ExamTopicIntelligence[] =
    Array.from(topicMap.entries())
      .map(
        (
          [topic, questions],
        ): ExamTopicIntelligence => {
          const scored =
            questions.filter(
              (question) =>
                question.successPercentage !==
                null,
            );

          const averageSuccessPercentage =
            scored.length > 0
              ? round(
                  scored.reduce(
                    (
                      sum,
                      question,
                    ) =>
                      sum +
                      (question.successPercentage ||
                        0),
                    0,
                  ) / scored.length,
                )
              : null;

          return {
            topic,
            questionCount:
              questions.length,
            availableMarks:
              questions.reduce(
                (
                  sum,
                  question,
                ) =>
                  sum +
                  question.availableMarks,
                0,
              ),
            averageSuccessPercentage,
            priority:
              averageSuccessPercentage ===
              null
                ? "low"
                : averageSuccessPercentage <
                    50
                  ? "high"
                  : averageSuccessPercentage <
                      70
                    ? "medium"
                    : "low",
          };
        },
      )
      .sort((first, second) => {
        if (
          first.averageSuccessPercentage ===
          null
        ) {
          return 1;
        }

        if (
          second.averageSuccessPercentage ===
          null
        ) {
          return -1;
        }

        return (
          first.averageSuccessPercentage -
          second.averageSuccessPercentage
        );
      });

  const assessedQuestions =
    questionIntelligence
      .filter(
        (question) =>
          question.successPercentage !==
          null,
      )
      .sort(
        (first, second) =>
          (first.successPercentage || 0) -
          (second.successPercentage || 0),
      );

  const integrityByType =
    Object.fromEntries(
      INCIDENT_TYPES.map(
        (type) => [type, 0],
      ),
    ) as Record<
      ExamIntegrityIncidentType,
      number
    >;

  let totalIncidents = 0;

  for (const submission of submissions) {
    for (
      const incident of
      submission.integrityIncidents
    ) {
      integrityByType[
        incident.type
      ] += 1;

      totalIncidents += 1;
    }
  }

  const studentPriorities =
    submissions
      .map((submission) =>
        buildStudentPriority(
          assignment,
          submission,
          classAverage,
          fallbackTopic,
        ),
      )
      .sort((first, second) => {
        const order = {
          high: 0,
          medium: 1,
          monitor: 2,
          none: 3,
        };

        return (
          order[first.priority] -
          order[second.priority]
        );
      });

  return {
    studentCount:
      assignment.studentIds.length,
    startedCount: started.length,
    submittedCount:
      submitted.length,
    markedCount: marked.length,

    submissionPercentage:
      assignment.studentIds.length > 0
        ? Math.round(
            (submitted.length /
              assignment.studentIds
                .length) *
              100,
          )
        : 0,

    markingPercentage:
      submitted.length > 0
        ? Math.round(
            (marked.length /
              submitted.length) *
              100,
          )
        : 0,

    classAverage,
    highestPercentage,
    lowestPercentage,

    questionIntelligence,
    topicIntelligence,
    studentPriorities,

    integrity: {
      cleanSubmissionCount:
        submitted.filter(
          (submission) =>
            submission
              .integrityIncidents
              .length === 0 &&
            !submission.integrityTerminated,
        ).length,

      submissionsWithIncidents:
        submitted.filter(
          (submission) =>
            submission
              .integrityIncidents
              .length > 0,
        ).length,

      integrityTerminatedCount:
        submitted.filter(
          (submission) =>
            submission.integrityTerminated,
        ).length,

      totalIncidents,
      incidentsByType:
        integrityByType,
    },

    hardestQuestion:
      assessedQuestions[0] || null,

    easiestQuestion:
      assessedQuestions.length > 0
        ? assessedQuestions[
            assessedQuestions.length - 1
          ]
        : null,

    weakestTopic:
      topicIntelligence.find(
        (topic) =>
          topic.averageSuccessPercentage !==
          null,
      ) || null,

    strongestTopic:
      [...topicIntelligence]
        .reverse()
        .find(
          (topic) =>
            topic.averageSuccessPercentage !==
            null,
        ) || null,
  };
}
