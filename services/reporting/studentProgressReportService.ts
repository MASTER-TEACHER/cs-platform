import {
  getTeacherStudentAnalytics,
} from "@/services/analytics/teacherAnalyticsService";

import {
  getTeacherStudentInterventionHistory,
} from "@/services/teacherStudentInterventionHistoryService";

import type {
  AnalyticsEvidenceSourceCounts,
} from "@/types/analytics";

import type {
  StudentProgressReport,
} from "@/types/reporting";

function evidenceWarnings({
  confidence,
  evidenceCounts,
  completionRate,
}: {
  confidence: string;
  evidenceCounts: AnalyticsEvidenceSourceCounts;
  completionRate: number;
}): string[] {
  const warnings: string[] = [];

  if (
    confidence === "insufficient" ||
    confidence === "low"
  ) {
    warnings.push(
      "Evidence confidence is currently low. Treat the working grade and topic priorities cautiously until more graded evidence is available.",
    );
  }

  if (
    evidenceCounts.written_exam === 0 &&
    evidenceCounts.quiz === 0 &&
    evidenceCounts.ai_quiz === 0
  ) {
    warnings.push(
      "No written-exam or quiz evidence is currently contributing to this report.",
    );
  }

  if (completionRate < 70) {
    warnings.push(
      "Low assignment completion may make the current attainment picture unrepresentative.",
    );
  }

  return warnings;
}

function isLowConfidence(
  confidence: string,
): boolean {
  return (
    confidence === "insufficient" ||
    confidence === "low"
  );
}

export async function buildStudentProgressReport({
  teacherId,
  studentId,
  classId,
}: {
  teacherId: string;
  studentId: string;
  classId?: string;
}): Promise<StudentProgressReport | null> {
  /*
   * IMPORTANT:
   * classId is deliberately passed through to the analytics
   * service so that reporting uses the exact class selected
   * in ReportingWorkspace.
   */
  const analytics =
    await getTeacherStudentAnalytics({
      teacherId,
      studentId,
      classId,
    });

  if (!analytics) {
    return null;
  }

  /*
   * Defensive class-context check.
   *
   * If a specific reporting class was requested, never allow
   * a report generated from another class context to continue.
   */
  if (
    classId &&
    analytics.classId !== classId
  ) {
    return null;
  }

  const interventions =
    await getTeacherStudentInterventionHistory({
      teacherId,
      studentId,
    });

  const sortedTopics = [
    ...analytics.analytics.topics,
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

  const strengths = sortedTopics
    .slice(0, 3)
    .map((topic) => ({
      topic: topic.topic,
      mastery:
        topic.weightedPercentage,
    }));

  const priorities = [
    ...sortedTopics,
  ]
    .reverse()
    .slice(0, 3)
    .map((topic) => ({
      topic: topic.topic,
      mastery:
        topic.weightedPercentage,
    }));

  const recentEvidence = [
    ...analytics.analytics.evidence,
  ]
    .filter(
      (item) =>
        item.graded === true &&
        item.percentage !== null,
    )
    .sort(
      (first, second) =>
        (
          second.completedAt?.getTime() ??
          0
        ) -
        (
          first.completedAt?.getTime() ??
          0
        ),
    )
    .slice(0, 8)
    .map((item) => ({
      title: item.title,
      percentage: item.percentage,
      completedAt: item.completedAt,
    }));

  const evidenceSourceCounts =
    analytics.analytics
      .evidenceSourceCounts;

  const confidence = String(
    analytics.confidence,
  );

  const lowConfidence =
    isLowConfidence(confidence);

  const reportEvidenceWarnings =
    evidenceWarnings({
      confidence,
      evidenceCounts:
        evidenceSourceCounts,
      completionRate:
        analytics.completionRate,
    });

  const teacherCommentary:
    string[] = [];

  const studentNextSteps:
    string[] = [];

  /*
   * ---------------------------------------------------------
   * ATTAINMENT COMMENTARY
   * ---------------------------------------------------------
   */

  if (analytics.targetGrade) {
    if (
      analytics.gradeGap !== null &&
      analytics.gradeGap < 0
    ) {
      teacherCommentary.push(
        lowConfidence
          ? `Available evidence currently places ${analytics.studentName} below the target grade, but evidence confidence is limited and this judgement should be reviewed as further graded evidence becomes available.`
          : `${analytics.studentName} is currently working below the target grade and needs focused support to close the gap.`,
      );
    } else {
      teacherCommentary.push(
        lowConfidence
          ? `Available evidence currently places ${analytics.studentName} at or above the target grade, although confidence is limited and the judgement should be reviewed as further graded evidence becomes available.`
          : `${analytics.studentName} is currently working at or above the target grade.`,
      );
    }
  } else {
    teacherCommentary.push(
      "No target grade is currently set, so target-gap interpretation is unavailable.",
    );
  }

  if (lowConfidence) {
    teacherCommentary.push(
      "Current attainment and topic interpretations should be treated as provisional because the available graded evidence is limited.",
    );
  }

  if (
    analytics.trend ===
    "declining"
  ) {
    teacherCommentary.push(
      lowConfidence
        ? "The available recent evidence suggests a possible declining pattern, but additional assessed work is needed before treating this as a secure trend."
        : "Recent performance is declining and should be reviewed alongside the learner's weakest assessed topics.",
    );
  }

  /*
   * ---------------------------------------------------------
   * NEXT STEPS
   * ---------------------------------------------------------
   */

  if (priorities[0]) {
    studentNextSteps.push(
      lowConfidence
        ? `Use further assessment to confirm whether ${priorities[0].topic}, currently indicated at ${priorities[0].mastery}% mastery, should remain the highest curriculum priority.`
        : `Prioritise ${priorities[0].topic}, currently at ${priorities[0].mastery}% mastery.`,
    );
  }

  if (
    analytics.marksToNextGrade !==
    null
  ) {
    studentNextSteps.push(
      lowConfidence
        ? `Available evidence indicates approximately ${analytics.marksToNextGrade} more mark${
            analytics.marksToNextGrade === 1
              ? ""
              : "s"
          } may be required to reach the next indicative grade boundary. Confirm this with additional graded evidence.`
        : `Aim to gain approximately ${analytics.marksToNextGrade} more mark${
            analytics.marksToNextGrade === 1
              ? ""
              : "s"
          } to reach the next indicative grade boundary.`,
    );
  }

  if (
    analytics.completionRate <
    80
  ) {
    studentNextSteps.push(
      "Improve assignment completion so that progress decisions are based on stronger evidence.",
    );
  }

  if (lowConfidence) {
    studentNextSteps.push(
      "Complete additional graded assessment so that future working-grade, trend and curriculum-priority judgements are based on stronger evidence.",
    );
  }

  if (
    interventions.some(
      (item) =>
        item.status === "active",
    )
  ) {
    teacherCommentary.push(
      "This learner currently has an active intervention; review subsequent graded evidence before deciding whether to close or escalate support.",
    );
  }

  return {
    studentId:
      analytics.studentId,

    studentName:
      analytics.studentName,

    studentEmail:
      analytics.studentEmail,

    classId:
      analytics.classId,

    className:
      analytics.className,

    generatedAt:
      new Date(),

    workingGrade:
      analytics.workingGrade,

    targetGrade:
      analytics.targetGrade,

    gradeGap:
      analytics.gradeGap,

    workingPercentage:
      analytics.workingPercentage,

    nextGrade:
      analytics.nextGrade,

    marksToNextGrade:
      analytics.marksToNextGrade,

    trend:
      analytics.trend,

    completionRate:
      analytics.completionRate,

    confidence:
      analytics.confidence,

    strengths,

    priorities,

    recentEvidence,

    evidenceSourceCounts,

    evidenceWarnings:
      reportEvidenceWarnings,

    interventionSummary: {
      active:
        interventions.filter(
          (item) =>
            item.status ===
            "active",
        ).length,

      completed:
        interventions.filter(
          (item) =>
            item.status ===
            "completed",
        ).length,

      cancelled:
        interventions.filter(
          (item) =>
            item.status ===
            "cancelled",
        ).length,
    },

    teacherCommentary,

    studentNextSteps,
  };
}