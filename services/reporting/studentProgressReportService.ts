import { getTeacherStudentAnalytics } from "@/services/analytics/teacherAnalyticsService";
import { getTeacherStudentInterventionHistory } from "@/services/teacherStudentInterventionHistoryService";
import type { StudentProgressReport } from "@/types/reporting";

export async function buildStudentProgressReport({
  teacherId,
  studentId,
}: {
  teacherId: string;
  studentId: string;
}): Promise<StudentProgressReport | null> {
  const analytics = await getTeacherStudentAnalytics({
    teacherId,
    studentId,
  });

  if (!analytics) {
    return null;
  }

  const interventions =
    await getTeacherStudentInterventionHistory({
      teacherId,
      studentId,
    });

  const sortedTopics = [...analytics.analytics.topics].sort(
    (first, second) =>
      second.weightedPercentage - first.weightedPercentage,
  );

  const strengths = sortedTopics
    .filter((topic) => topic.evidenceCount > 0)
    .slice(0, 3)
    .map((topic) => ({
      topic: topic.topic,
      mastery: topic.weightedPercentage,
    }));

  const priorities = [...sortedTopics]
    .filter((topic) => topic.evidenceCount > 0)
    .reverse()
    .slice(0, 3)
    .map((topic) => ({
      topic: topic.topic,
      mastery: topic.weightedPercentage,
    }));

  /*
   * RichStudentAnalytics does not expose `recentEvidence`.
   * It exposes the complete `evidence` array.
   *
   * Build recent report evidence from graded items only and
   * order them by the most recent completion/marking date.
   */
  const recentEvidence = [...analytics.analytics.evidence]
    .filter(
      (item) =>
        item.graded === true &&
        item.percentage !== null,
    )
    .sort(
      (first, second) =>
        (second.completedAt?.getTime() ?? 0) -
        (first.completedAt?.getTime() ?? 0),
    )
    .slice(0, 8)
    .map((item) => ({
      title: item.title,
      percentage: item.percentage,
      completedAt: item.completedAt,
    }));

  const teacherCommentary: string[] = [];
  const studentNextSteps: string[] = [];

  if (analytics.targetGrade) {
    teacherCommentary.push(
      analytics.gradeGap !== null &&
        analytics.gradeGap < 0
        ? `${analytics.studentName} is currently working below the target grade and needs focused support to close the gap.`
        : `${analytics.studentName} is currently working at or above the target grade.`,
    );
  }

  if (analytics.trend === "declining") {
    teacherCommentary.push(
      "Recent performance is declining and should be reviewed alongside the learner's weakest assessed topics.",
    );
  }

  if (priorities[0]) {
    studentNextSteps.push(
      `Prioritise ${priorities[0].topic}, currently at ${priorities[0].mastery}% mastery.`,
    );
  }

  if (analytics.marksToNextGrade !== null) {
    studentNextSteps.push(
      `Aim to gain approximately ${analytics.marksToNextGrade} more mark${
        analytics.marksToNextGrade === 1 ? "" : "s"
      } to reach the next indicative grade boundary.`,
    );
  }

  if (analytics.completionRate < 80) {
    studentNextSteps.push(
      "Improve assignment completion so that progress decisions are based on stronger evidence.",
    );
  }

  return {
    studentId: analytics.studentId,
    studentName: analytics.studentName,
    studentEmail: analytics.studentEmail,
    classId: analytics.classId,
    className: analytics.className,
    generatedAt: new Date(),

    workingGrade: analytics.workingGrade,
    targetGrade: analytics.targetGrade,
    gradeGap: analytics.gradeGap,
    workingPercentage: analytics.workingPercentage,
    nextGrade: analytics.nextGrade,
    marksToNextGrade: analytics.marksToNextGrade,

    trend: analytics.trend,
    completionRate: analytics.completionRate,

    /*
     * TeacherStudentAnalyticsRow already stores the
     * confidence level as a string such as high/medium/low.
     */
    confidence: analytics.confidence,

    strengths,
    priorities,
    recentEvidence,

    interventionSummary: {
      active: interventions.filter(
        (item) => item.status === "active",
      ).length,
      completed: interventions.filter(
        (item) => item.status === "completed",
      ).length,
      cancelled: interventions.filter(
        (item) => item.status === "cancelled",
      ).length,
    },

    teacherCommentary,
    studentNextSteps,
  };
}
