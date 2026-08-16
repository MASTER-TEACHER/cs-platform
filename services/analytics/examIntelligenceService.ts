import type {
  ExamAssignment,
  ExamIntegrityIncidentType,
  ExamSubmission,
} from "@/types/examAssignment";
import {
  buildExamGradeIntelligence,
} from "@/services/analytics/examGradeIntelligenceService";
import type {
  ExamAnalysisConfidence,
  ExamAssessmentObjectiveIntelligence,
  ExamClassIntelligence,
  ExamDiscriminationLabel,
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

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function median(
  values: number[],
): number | null {
  if (!values.length) return null;

  const sorted = [...values].sort(
    (a, b) => a - b,
  );

  const middle =
    Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? round(
        (sorted[middle - 1] +
          sorted[middle]) /
          2,
      )
    : sorted[middle];
}

function questionRecord(
  question: unknown,
): Record<string, unknown> {
  return question &&
    typeof question === "object"
    ? (question as Record<string, unknown>)
    : {};
}

function questionTopic(
  question: unknown,
  fallback: string,
): string {
  const data = questionRecord(question);

  for (const value of [
    data.topic,
    data.topicFocus,
    data.subtopic,
    data.curriculumTopic,
  ]) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return fallback;
}

function assessmentObjective(
  question: unknown,
): "AO1" | "AO2" | "AO3" | null {
  const value =
    questionRecord(
      question,
    ).assessmentObjective;

  return value === "AO1" ||
    value === "AO2" ||
    value === "AO3"
    ? value
    : null;
}

function commandWord(
  question: unknown,
): string | null {
  const value =
    questionRecord(
      question,
    ).commandWord;

  return typeof value === "string" &&
    value.trim()
    ? value.trim()
    : null;
}

function priorityFromPercentage(
  successPercentage: number | null,
): "high" | "medium" | "low" {
  if (successPercentage === null) return "low";
  if (successPercentage < 50) return "high";
  if (successPercentage < 70) return "medium";
  return "low";
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

  if (successPercentage >= 70) return "secure";
  if (successPercentage >= 50) return "developing";
  return "priority";
}

function discriminationLabel(
  value: number | null,
): ExamDiscriminationLabel {
  if (value === null) return "insufficient";
  if (value < 0) return "negative";
  if (value < 0.2) return "weak";
  if (value < 0.3) return "moderate";
  return "strong";
}

function questionDiscrimination({
  questionId,
  availableMarks,
  marked,
}: {
  questionId: string;
  availableMarks: number;
  marked: ExamSubmission[];
}): number | null {
  /*
   * Small cohorts produce unstable discrimination statistics.
   * Wait until at least 10 marked submissions are available.
   */
  if (
    marked.length < 10 ||
    availableMarks <= 0
  ) {
    return null;
  }

  const sorted = [...marked].sort(
    (first, second) =>
      second.percentage -
      first.percentage,
  );

  const groupSize =
    Math.max(
      2,
      Math.floor(
        sorted.length * 0.27,
      ),
    );

  const top = sorted.slice(
    0,
    groupSize,
  );

  const bottom = sorted.slice(
    -groupSize,
  );

  function groupFacility(
    group: ExamSubmission[],
  ): number {
    const awarded =
      group.reduce(
        (sum, submission) => {
          const answer =
            submission.answers.find(
              (item) =>
                item.questionId ===
                questionId,
            );

          return (
            sum +
            (answer?.awardedMarks ?? 0)
          );
        },
        0,
      );

    return (
      awarded /
      (group.length *
        availableMarks)
    );
  }

  return round2(
    groupFacility(top) -
      groupFacility(bottom),
  );
}

function analysisConfidence(
  markedCount: number,
): {
  confidence: ExamAnalysisConfidence;
  warnings: string[];
} {
  if (markedCount === 0) {
    return {
      confidence: "insufficient",
      warnings: [
        "No marked submissions are available, so class-level QLA interpretation is not yet possible.",
      ],
    };
  }

  if (markedCount < 5) {
    return {
      confidence: "limited",
      warnings: [
        `Only ${markedCount} marked submission${markedCount === 1 ? " is" : "s are"} available. Treat class-level percentages and priorities cautiously.`,
        "Question discrimination is withheld until at least 10 marked submissions are available.",
      ],
    };
  }

  if (markedCount < 10) {
    return {
      confidence: "developing",
      warnings: [
        `${markedCount} marked submissions provide useful early class evidence, but question discrimination is withheld until the sample reaches 10.`,
      ],
    };
  }

  return {
    confidence: "robust",
    warnings: [],
  };
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
  if (
    submission.status !== "marked"
  ) {
    return {
      topic: null,
      questionNumber: null,
      successPercentage: null,
    };
  }

  const scored =
    assignment.questionSetSnapshot
      .questions
      .map((question) => {
        const answer =
          submission.answers.find(
            (item) =>
              item.questionId ===
              question.id,
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
    submission.integrityIncidents.length > 0 &&
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
    percentage <=
      classAverage - 15
  ) {
    if (priority !== "high") {
      priority = "medium";
    }

    reasons.push(
      `Result is ${round(classAverage - percentage)} percentage points below the current class average.`,
    );
  }

  if (
    [
      "submitted",
      "marking",
    ].includes(
      submission.status,
    ) &&
    priority === "none"
  ) {
    priority = "monitor";

    reasons.push(
      "The paper is submitted but not yet fully marked, so attainment evidence is incomplete.",
    );
  }

  const weakness =
    getStudentExamWeakness(
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
    studentId:
      submission.studentId,
    studentName:
      submission.studentName,
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
    weakestExamTopic:
      weakness.topic,
    weakestQuestionNumber:
      weakness.questionNumber,
    weakestQuestionSuccessPercentage:
      weakness.successPercentage,
  };
}

function buildQuestionIntelligence(
  assignment: ExamAssignment,
  marked: ExamSubmission[],
  fallbackTopic: string,
): ExamQuestionIntelligence[] {
  return assignment.questionSetSnapshot
    .questions.map((question) => {
      let attemptedStudents = 0;
      let omittedStudents = 0;
      let zeroMarkStudents = 0;
      let fullMarkStudents = 0;
      let totalAwardedMarks = 0;

      for (const submission of marked) {
        const answer =
          submission.answers.find(
            (item) =>
              item.questionId ===
              question.id,
          );

        const response =
          answer?.response?.trim() || "";

        if (response) {
          attemptedStudents += 1;
        } else {
          omittedStudents += 1;
        }

        const awarded =
          answer?.awardedMarks ?? 0;

        totalAwardedMarks += awarded;

        if (awarded === 0) {
          zeroMarkStudents += 1;
        }

        if (
          question.marks > 0 &&
          awarded >= question.marks
        ) {
          fullMarkStudents += 1;
        }
      }

      const markedStudents =
        marked.length;

      const totalPossibleClassMarks =
        question.marks *
        markedStudents;

      const averageAwardedMarks =
        markedStudents > 0
          ? round(
              totalAwardedMarks /
                markedStudents,
            )
          : null;

      const successPercentage =
        totalPossibleClassMarks > 0
          ? round(
              (totalAwardedMarks /
                totalPossibleClassMarks) *
                100,
            )
          : null;

      const marksLost =
        Math.max(
          0,
          totalPossibleClassMarks -
            totalAwardedMarks,
        );

      const discriminationIndex =
        questionDiscrimination({
          questionId: question.id,
          availableMarks:
            question.marks,
          marked,
        });

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
        assessmentObjective:
          assessmentObjective(question),
        commandWord:
          commandWord(question),

        availableMarks:
          question.marks,
        markedStudents,
        attemptedStudents,
        omittedStudents,
        zeroMarkStudents,
        fullMarkStudents,

        totalAwardedMarks,
        totalPossibleClassMarks,
        marksLost,

        averageAwardedMarks,
        successPercentage,

        attemptPercentage:
          markedStudents > 0
            ? round(
                (attemptedStudents /
                  markedStudents) *
                  100,
              )
            : null,

        omissionPercentage:
          markedStudents > 0
            ? round(
                (omittedStudents /
                  markedStudents) *
                  100,
              )
            : null,

        zeroMarkPercentage:
          markedStudents > 0
            ? round(
                (zeroMarkStudents /
                  markedStudents) *
                  100,
              )
            : null,

        fullMarkPercentage:
          markedStudents > 0
            ? round(
                (fullMarkStudents /
                  markedStudents) *
                  100,
              )
            : null,

        marksLostPercentage:
          totalPossibleClassMarks > 0
            ? round(
                (marksLost /
                  totalPossibleClassMarks) *
                  100,
              )
            : null,

        discriminationIndex,
        discriminationLabel:
          discriminationLabel(
            discriminationIndex,
          ),

        difficulty:
          questionDifficulty(
            successPercentage,
            markedStudents,
          ),
      };
    });
}

function buildTopicIntelligence(
  questions: ExamQuestionIntelligence[],
): ExamTopicIntelligence[] {
  const map = new Map<
    string,
    ExamQuestionIntelligence[]
  >();

  for (const question of questions) {
    const current =
      map.get(question.topic) || [];

    current.push(question);
    map.set(question.topic, current);
  }

  return Array.from(map.entries())
    .map(
      (
        [topic, items],
      ): ExamTopicIntelligence => {
        const awardedMarks =
          items.reduce(
            (sum, item) =>
              sum +
              item.totalAwardedMarks,
            0,
          );

        const possibleMarks =
          items.reduce(
            (sum, item) =>
              sum +
              item.totalPossibleClassMarks,
            0,
          );

        const marksLost =
          Math.max(
            0,
            possibleMarks -
              awardedMarks,
          );

        const averageSuccessPercentage =
          possibleMarks > 0
            ? round(
                (awardedMarks /
                  possibleMarks) *
                  100,
              )
            : null;

        return {
          topic,
          questionCount:
            items.length,
          availableMarks:
            items.reduce(
              (sum, item) =>
                sum +
                item.availableMarks,
              0,
            ),
          averageSuccessPercentage,
          awardedMarks,
          possibleMarks,
          marksLost,
          marksLostPercentage:
            possibleMarks > 0
              ? round(
                  (marksLost /
                    possibleMarks) *
                    100,
                )
              : null,
          priority:
            priorityFromPercentage(
              averageSuccessPercentage,
            ),
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
}

function buildAssessmentObjectiveIntelligence(
  questions: ExamQuestionIntelligence[],
): ExamAssessmentObjectiveIntelligence[] {
  const objectives: (
    | "AO1"
    | "AO2"
    | "AO3"
  )[] = ["AO1", "AO2", "AO3"];

  return objectives
    .map((objective) => {
      const items =
        questions.filter(
          (question) =>
            question.assessmentObjective ===
            objective,
        );

      if (!items.length) {
        return null;
      }

      const awardedMarks =
        items.reduce(
          (sum, item) =>
            sum +
            item.totalAwardedMarks,
          0,
        );

      const possibleMarks =
        items.reduce(
          (sum, item) =>
            sum +
            item.totalPossibleClassMarks,
          0,
        );

      const marksLost =
        Math.max(
          0,
          possibleMarks -
            awardedMarks,
        );

      const averageSuccessPercentage =
        possibleMarks > 0
          ? round(
              (awardedMarks /
                possibleMarks) *
                100,
            )
          : null;

      return {
        assessmentObjective:
          objective,
        questionCount:
          items.length,
        availableMarks:
          items.reduce(
            (sum, item) =>
              sum +
              item.availableMarks,
            0,
          ),
        awardedMarks,
        possibleMarks,
        averageSuccessPercentage,
        marksLost,
        marksLostPercentage:
          possibleMarks > 0
            ? round(
                (marksLost /
                  possibleMarks) *
                  100,
              )
            : null,
        priority:
          priorityFromPercentage(
            averageSuccessPercentage,
          ),
      } satisfies ExamAssessmentObjectiveIntelligence;
    })
    .filter(
      (
        value,
      ): value is ExamAssessmentObjectiveIntelligence =>
        Boolean(value),
    )
    .sort((a, b) => {
      if (
        a.averageSuccessPercentage ===
        null
      ) {
        return 1;
      }

      if (
        b.averageSuccessPercentage ===
        null
      ) {
        return -1;
      }

      return (
        a.averageSuccessPercentage -
        b.averageSuccessPercentage
      );
    });
}

export function buildExamClassIntelligence(
  assignment: ExamAssignment,
  submissions: ExamSubmission[],
): ExamClassIntelligence {
  const submitted =
    submissions.filter(
      (submission) =>
        [
          "submitted",
          "marking",
          "marked",
        ].includes(
          submission.status,
        ),
    );

  const marked =
    submissions.filter(
      (submission) =>
        submission.status === "marked",
    );

  const started =
    submissions.filter(
      (submission) =>
        submission.status !==
        "not_started",
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

  const medianPercentage =
    median(markedPercentages);

  const confidence =
    analysisConfidence(
      marked.length,
    );

  const fallbackTopic =
    assignment.questionSetSnapshot
      .topic ||
    assignment.questionSetTitle ||
    "General Computer Science";

  const questionIntelligence =
    buildQuestionIntelligence(
      assignment,
      marked,
      fallbackTopic,
    );

  const topicIntelligence =
    buildTopicIntelligence(
      questionIntelligence,
    );

  const assessmentObjectiveIntelligence =
    buildAssessmentObjectiveIntelligence(
      questionIntelligence,
    );

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

  const gradeIntelligence =
    buildExamGradeIntelligence(
      assignment,
      submissions,
    );

  const analysisWarnings = [
    ...confidence.warnings,
  ];

  if (
    gradeIntelligence.boundarySource ===
    "indicative"
  ) {
    analysisWarnings.push(
      "The assessment grade uses CS Master indicative boundaries, not an official exam-series boundary set.",
    );
  }

  if (
    questionIntelligence.every(
      (question) =>
        question.assessmentObjective ===
        null,
    )
  ) {
    analysisWarnings.push(
      "Assessment-objective metadata is unavailable for this paper, so AO analysis cannot be produced.",
    );
  }

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
              assignment.studentIds.length) *
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
    medianPercentage,

    analysisConfidence:
      confidence.confidence,
    analysisWarnings,

    questionIntelligence,
    topicIntelligence,
    assessmentObjectiveIntelligence,
    studentPriorities,

    gradeIntelligence,

    integrity: {
      cleanSubmissionCount:
        submitted.filter(
          (submission) =>
            submission.integrityIncidents.length === 0 &&
            !submission.integrityTerminated,
        ).length,

      submissionsWithIncidents:
        submitted.filter(
          (submission) =>
            submission.integrityIncidents.length > 0,
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

    weakestAssessmentObjective:
      assessmentObjectiveIntelligence.find(
        (item) =>
          item.averageSuccessPercentage !==
          null,
      ) || null,

    strongestAssessmentObjective:
      [
        ...assessmentObjectiveIntelligence,
      ]
        .reverse()
        .find(
          (item) =>
            item.averageSuccessPercentage !==
            null,
        ) || null,
  };
}
