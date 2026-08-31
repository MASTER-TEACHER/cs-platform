import {
  buildExamClassIntelligence,
} from "@/services/analytics/examIntelligenceService";

import {
  getTeacherAnalyticsPortfolio,
} from "@/services/analytics/teacherAnalyticsService";

import {
  getTeacherExamAssignments,
} from "@/services/examAssignmentService";

import {
  getAssignmentSubmissions,
} from "@/services/examSubmissionService";

import type {
  AnalyticsEvidenceSourceCounts,
} from "@/types/analytics";

import type {
  ClassProgressReport,
  ReportExamSummary,
  ReportPriorityStudent,
} from "@/types/reporting";

function emptyEvidenceCounts(): AnalyticsEvidenceSourceCounts {
  return {
    written_exam: 0,
    quiz: 0,
    ai_quiz: 0,
    programming: 0,
    lesson: 0,
  };
}

function combineEvidenceCounts(
  rows: AnalyticsEvidenceSourceCounts[],
): AnalyticsEvidenceSourceCounts {
  return rows.reduce(
    (totals, row) => ({
      written_exam:
        totals.written_exam +
        row.written_exam,

      quiz:
        totals.quiz +
        row.quiz,

      ai_quiz:
        totals.ai_quiz +
        row.ai_quiz,

      programming:
        totals.programming +
        row.programming,

      lesson:
        totals.lesson +
        row.lesson,
    }),
    emptyEvidenceCounts(),
  );
}

function buildEvidenceWarnings({
  studentsWithEvidence,
  studentCount,
  lowEvidenceCount,
  sourceCounts,
}: {
  studentsWithEvidence: number;
  studentCount: number;
  lowEvidenceCount: number;
  sourceCounts: AnalyticsEvidenceSourceCounts;
}): string[] {
  const warnings: string[] = [];

  if (studentCount === 0) {
    warnings.push(
      "This class has no enrolled students.",
    );

    return warnings;
  }

  if (studentsWithEvidence === 0) {
    warnings.push(
      "No graded attainment evidence is available yet. Do not draw class-performance conclusions until assessed work has been completed.",
    );
  } else if (
    studentsWithEvidence <
    studentCount
  ) {
    const missing =
      studentCount -
      studentsWithEvidence;

    warnings.push(
      `${missing} learner${
        missing === 1 ? "" : "s"
      } currently have no graded attainment evidence.`,
    );
  }

  if (lowEvidenceCount > 0) {
    warnings.push(
      `${lowEvidenceCount} learner${
        lowEvidenceCount === 1
          ? " has"
          : "s have"
      } low or insufficient evidence confidence.`,
    );
  }

  const assessmentEvidence =
    sourceCounts.written_exam +
    sourceCounts.quiz +
    sourceCounts.ai_quiz;

  if (assessmentEvidence === 0) {
    warnings.push(
      "The class has no written-exam or quiz evidence in the current analytics portfolio.",
    );
  }

  return warnings;
}

function buildPriorityStudents(
  students: Array<{
    studentId: string;
    studentName: string;

    workingGrade:
      ReportPriorityStudent["workingGrade"];

    targetGrade:
      ReportPriorityStudent["targetGrade"];

    gradeGap: number | null;

    completionRate: number;

    confidence: unknown;

    interventionPriority:
      ReportPriorityStudent["priority"];

    analytics: {
      topics: Array<{
        topic: string;
        weightedPercentage: number;
        evidenceCount: number;
      }>;
    };
  }>,
): ReportPriorityStudent[] {
  const rank: Record<
    ReportPriorityStudent["priority"],
    number
  > = {
    high: 0,
    medium: 1,
    monitor: 2,
    none: 3,
  };

  return students
    .map((student) => {
      const weakestTopic = [
        ...student.analytics.topics,
      ]
        .filter(
          (topic) =>
            topic.evidenceCount > 0,
        )
        .sort(
          (first, second) =>
            first.weightedPercentage -
            second.weightedPercentage,
        )[0];

      return {
        studentId:
          student.studentId,

        studentName:
          student.studentName,

        workingGrade:
          student.workingGrade,

        targetGrade:
          student.targetGrade,

        gradeGap:
          student.gradeGap,

        completionRate:
          student.completionRate,

        confidence:
          String(
            student.confidence,
          ),

        priority:
          student.interventionPriority,

        weakestTopic:
          weakestTopic?.topic ??
          "No assessed topic evidence",

        weakestTopicPercentage:
          weakestTopic?.weightedPercentage ??
          null,
      };
    })
    .filter(
      (student) =>
        student.priority !==
        "none",
    )
    .sort((first, second) => {
      const priorityDifference =
        rank[first.priority] -
        rank[second.priority];

      if (
        priorityDifference !==
        0
      ) {
        return priorityDifference;
      }

      return (
        (
          first.weakestTopicPercentage ??
          101
        ) -
        (
          second.weakestTopicPercentage ??
          101
        )
      );
    })
    .slice(0, 8);
}

function buildExamSummary(
  assignmentId: string,
  title: string,
  intelligence: ReturnType<
    typeof buildExamClassIntelligence
  >,
): ReportExamSummary {
  return {
    assignmentId,
    title,

    markedCount:
      intelligence.markedCount,

    studentCount:
      intelligence.studentCount,

    classAverage:
      intelligence.classAverage,

    classAverageGrade:
      intelligence.gradeIntelligence
        .classAverageGrade,

    classMarksToNextGrade:
      intelligence.gradeIntelligence
        .classMarksToNextGrade,

    analysisConfidence:
      intelligence.analysisConfidence,

    weakestTopic:
      intelligence.weakestTopic
        ?.topic ?? null,

    weakestTopicSuccess:
      intelligence.weakestTopic
        ?.averageSuccessPercentage ??
      null,

    strongestTopic:
      intelligence.strongestTopic
        ?.topic ?? null,

    strongestTopicSuccess:
      intelligence.strongestTopic
        ?.averageSuccessPercentage ??
      null,

    hardestQuestionNumber:
      intelligence.hardestQuestion
        ?.questionNumber ?? null,

    hardestQuestionSuccess:
      intelligence.hardestQuestion
        ?.successPercentage ?? null,

    weakestAssessmentObjective:
      intelligence.weakestAssessmentObjective
        ?.assessmentObjective ??
      null,

    weakestAssessmentObjectiveSuccess:
      intelligence.weakestAssessmentObjective
        ?.averageSuccessPercentage ??
      null,

    marksLost:
      intelligence.questionIntelligence.reduce(
        (total, question) =>
          total +
          question.marksLost,
        0,
      ),

    nearBoundaryCount:
      intelligence.gradeIntelligence
        .nearBoundaryStudents.length,

    gradeDistribution:
      intelligence.gradeIntelligence
        .gradeDistribution,

    warnings:
      intelligence.analysisWarnings,
  };
}

export async function buildClassProgressReport({
  teacherId,
  classId,
}: {
  teacherId: string;
  classId: string;
}): Promise<ClassProgressReport | null> {
  const cleanedTeacherId =
    teacherId.trim();

  const cleanedClassId =
    classId.trim();

  if (
    !cleanedTeacherId ||
    !cleanedClassId
  ) {
    return null;
  }

  const portfolio =
    await getTeacherAnalyticsPortfolio(
      cleanedTeacherId,
    );

  const classAnalytics =
    portfolio.classes.find(
      (classItem) =>
        classItem.classId ===
        cleanedClassId,
    );

  if (!classAnalytics) {
    return null;
  }

  /*
   * Ignore zero-evidence topics when identifying curriculum
   * strengths and priorities.
   */
  const evidenceBackedTopics = [
    ...classAnalytics.topicAnalytics,
  ]
    .filter(
      (topic) =>
        topic.evidenceCount > 0,
    )
    .sort(
      (first, second) =>
        second.weightedPercentage -
        first.weightedPercentage,
    );

  const evidenceSourceCounts =
    combineEvidenceCounts(
      classAnalytics.students.map(
        (student) =>
          student.analytics
            .evidenceSourceCounts,
      ),
    );

  /*
   * ---------------------------------------------------------
   * WRITTEN EXAM / QLA INTELLIGENCE
   * ---------------------------------------------------------
   */

  const teacherExamAssignments =
    await getTeacherExamAssignments(
      cleanedTeacherId,
    );

  const classExamAssignments =
    teacherExamAssignments.filter(
      (assignment) =>
        assignment.classId ===
          cleanedClassId &&
        assignment.status !==
          "cancelled",
    );

  const examSummaries =
    await Promise.all(
      classExamAssignments.map(
        async (assignment) => {
          const submissions =
            await getAssignmentSubmissions(
              assignment.id,
              cleanedTeacherId,
            );

          const intelligence =
            buildExamClassIntelligence(
              assignment,
              submissions,
            );

          return buildExamSummary(
            assignment.id,
            assignment.title,
            intelligence,
          );
        },
      ),
    );

  /*
   * ---------------------------------------------------------
   * EVIDENCE QUALITY
   * ---------------------------------------------------------
   */

  const evidenceWarnings =
    buildEvidenceWarnings({
      studentsWithEvidence:
        classAnalytics.studentsWithEvidence,

      studentCount:
        classAnalytics.studentCount,

      lowEvidenceCount:
        classAnalytics.lowEvidenceCount,

      sourceCounts:
        evidenceSourceCounts,
    });

  const teacherInterpretation:
    string[] = [];

  const recommendedActions:
    string[] = [];

  const evidenceCoverage =
    classAnalytics.studentCount >
    0
      ? Math.round(
          (
            classAnalytics.studentsWithEvidence /
            classAnalytics.studentCount
          ) * 100,
        )
      : 0;

  const lowEvidenceProportion =
    classAnalytics.studentCount >
    0
      ? classAnalytics.lowEvidenceCount /
        classAnalytics.studentCount
      : 0;

  const limitedClassEvidence =
    classAnalytics.studentsWithEvidence ===
      0 ||
    evidenceCoverage < 70 ||
    lowEvidenceProportion >= 0.5;

  /*
   * ---------------------------------------------------------
   * ATTAINMENT INTERPRETATION
   * ---------------------------------------------------------
   */

  if (
    classAnalytics.averageWeightedPercentage !==
    null
  ) {
    teacherInterpretation.push(
      limitedClassEvidence
        ? `Available evidence currently indicates weighted class attainment of ${classAnalytics.averageWeightedPercentage}%, but evidence coverage is ${evidenceCoverage}% and this class-level judgement should be treated as provisional.`
        : `Current weighted class attainment is ${classAnalytics.averageWeightedPercentage}%.`,
    );
  } else {
    teacherInterpretation.push(
      "A class attainment percentage cannot yet be reported because there is insufficient graded evidence.",
    );
  }

  const studentsWithTargets =
    classAnalytics.students.filter(
      (student) =>
        student.targetGrade !==
          null &&
        student.gradeGap !==
          null,
    ).length;

  if (
    studentsWithTargets === 0
  ) {
    teacherInterpretation.push(
      "No usable target-grade comparison is currently available for this class.",
    );

    if (
      classAnalytics.targetNotSetCount >
      0
    ) {
      recommendedActions.push(
        "Set or review target grades where appropriate before using target-gap reporting for this class.",
      );
    }
  } else {
    teacherInterpretation.push(
      `${classAnalytics.onOrAboveTargetPercentage}% of learners with usable target comparisons are currently working on or above target.`,
    );

    if (
      classAnalytics.onOrAboveTargetPercentage <
      60
    ) {
      recommendedActions.push(
        "Review below-target learners and separate curriculum gaps from low-evidence or completion issues.",
      );
    }
  }

  if (
    classAnalytics.decliningCount >
    0
  ) {
    teacherInterpretation.push(
      `${classAnalytics.decliningCount} learner${
        classAnalytics.decliningCount ===
        1
          ? " has"
          : "s have"
      } a declining recent trend.`,
    );

    recommendedActions.push(
      "Review declining learners before the next assessment cycle and identify whether the decline is topic-specific.",
    );
  }

  if (
    classAnalytics.lowEvidenceCount >
    0
  ) {
    recommendedActions.push(
      "Collect additional graded evidence for learners with low evidence confidence before making high-stakes progress judgements.",
    );
  }

  if (
    classAnalytics.studentsWithEvidence <
    classAnalytics.studentCount
  ) {
    recommendedActions.push(
      "Increase assessed evidence coverage across the class before treating whole-class attainment patterns as secure.",
    );
  }

  /*
   * ---------------------------------------------------------
   * CURRICULUM INTERPRETATION
   * ---------------------------------------------------------
   */

  if (
    evidenceBackedTopics.length >
    0
  ) {
    const weakestTopic =
      evidenceBackedTopics[
        evidenceBackedTopics.length -
          1
      ];

    teacherInterpretation.push(
      limitedClassEvidence
        ? `${weakestTopic.topic} is currently indicated as the lowest evidence-backed curriculum area at ${weakestTopic.weightedPercentage}% mastery; confirm this pattern with further assessment before making a high-stakes curriculum judgement.`
        : `${weakestTopic.topic} is the current lowest evidence-backed class curriculum area at ${weakestTopic.weightedPercentage}% mastery.`,
    );

    if (
      weakestTopic.weightedPercentage <
      50
    ) {
      recommendedActions.push(
        `Prioritise reteaching or targeted reassessment in ${weakestTopic.topic}.`,
      );
    }
  } else {
    teacherInterpretation.push(
      "There is not yet enough topic-level graded evidence to identify secure curriculum strengths or priorities.",
    );
  }

  /*
   * ---------------------------------------------------------
   * WRITTEN EXAM INTERPRETATION
   * ---------------------------------------------------------
   */

  const usableExam =
    examSummaries
      .filter(
        (exam) =>
          exam.markedCount > 0,
      )
      .sort(
        (first, second) =>
          (
            first.classAverage ??
            101
          ) -
          (
            second.classAverage ??
            101
          ),
      )[0];

  if (
    usableExam?.weakestTopic
  ) {
    const limitedExamConfidence =
      usableExam.analysisConfidence ===
        "insufficient" ||
      usableExam.analysisConfidence ===
        "limited";

    teacherInterpretation.push(
      limitedExamConfidence
        ? `Written-exam QLA suggests ${usableExam.weakestTopic} may be a priority area in ${usableExam.title}, although the current analysis confidence is limited.`
        : `Written-exam QLA currently identifies ${usableExam.weakestTopic} as a priority area in ${usableExam.title}.`,
    );
  }

  /*
   * ---------------------------------------------------------
   * REPORT
   * ---------------------------------------------------------
   */

  return {
    classId:
      classAnalytics.classId,

    className:
      classAnalytics.className,

    generatedAt:
      new Date(),

    studentCount:
      classAnalytics.studentCount,

    studentsWithEvidence:
      classAnalytics.studentsWithEvidence,

    averageWorkingGrade:
      classAnalytics.averageWorkingGrade,

    averageTargetGrade:
      classAnalytics.averageTargetGrade,

    averageWeightedPercentage:
      classAnalytics.averageWeightedPercentage,

    averageCompletionRate:
      classAnalytics.averageCompletionRate,

    onOrAboveTargetPercentage:
      classAnalytics.onOrAboveTargetPercentage,

    highPriorityCount:
      classAnalytics.highPriorityCount,

    decliningCount:
      classAnalytics.decliningCount,

    lowEvidenceCount:
      classAnalytics.lowEvidenceCount,

    targetNotSetCount:
      classAnalytics.targetNotSetCount,

    gradeDistribution:
      classAnalytics.gradeDistribution,

    strongestTopics:
      evidenceBackedTopics
        .slice(0, 4)
        .map(
          (topic) => ({
            topic:
              topic.topic,

            mastery:
              topic.weightedPercentage,
          }),
        ),

    priorityTopics: [
      ...evidenceBackedTopics,
    ]
      .reverse()
      .slice(0, 4)
      .map(
        (topic) => ({
          topic:
            topic.topic,

          mastery:
            topic.weightedPercentage,
        }),
      ),

    priorityStudents:
      buildPriorityStudents(
        classAnalytics.students,
      ),

    evidenceSourceCounts,

    evidenceWarnings,

    writtenExamCount:
      classExamAssignments.length,

    examSummaries,

    teacherInterpretation,

    recommendedActions,
  };
}