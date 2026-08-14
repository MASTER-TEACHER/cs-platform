import type {
  GradeProgressAnalytics,
  PerformanceTrend,
  StudentAnalyticsInterpretation,
  TopicMastery,
} from "@/types/analytics";

function trendText(
  trend: PerformanceTrend,
): string {
  switch (trend) {
    case "strong_improvement":
      return "Recent performance is improving strongly.";
    case "improving":
      return "Recent performance is improving.";
    case "declining":
      return "Recent performance has declined and should be reviewed.";
    case "stable":
      return "Recent performance is broadly stable.";
    default:
      return "More graded evidence is needed before a reliable trend can be identified.";
  }
}

export function buildAnalyticsInterpretation({
  grade,
  trend,
  strongestTopics,
  weakestTopics,
}: {
  grade: GradeProgressAnalytics;
  trend: PerformanceTrend;
  strongestTopics: TopicMastery[];
  weakestTopics: TopicMastery[];
}): StudentAnalyticsInterpretation {
  const strengths = strongestTopics
    .slice(0, 3)
    .map(
      (topic) =>
        `${topic.topic}: ${topic.weightedPercentage}% mastery`,
    );

  const priorities = weakestTopics
    .filter((topic) => topic.status !== "secure")
    .slice(0, 3)
    .map(
      (topic) =>
        `${topic.topic}: ${topic.weightedPercentage}% mastery`,
    );

  const nextActions: string[] = [];

  if (grade.nextGrade) {
    if (
      grade.marksToNextGrade !== null &&
      grade.marksToNextGradeAssessmentTitle
    ) {
      nextActions.push(
        `On the latest marked exam (${grade.marksToNextGradeAssessmentTitle}), ${grade.marksToNextGrade} more mark${
          grade.marksToNextGrade === 1 ? "" : "s"
        } would reach the indicative ${grade.nextGrade} boundary.`,
      );
    } else if (
      grade.percentagePointsToNextGrade !== null
    ) {
      nextActions.push(
        `Improve the weighted assessment score by approximately ${grade.percentagePointsToNextGrade} percentage point${
          grade.percentagePointsToNextGrade === 1
            ? ""
            : "s"
        } to reach the next indicative grade band.`,
      );
    }
  }

  if (weakestTopics[0]) {
    nextActions.push(
      `Prioritise ${weakestTopics[0].topic}; it is currently the highest-impact weak area.`,
    );
  }

  nextActions.push(
    "Complete further exam-style assessment to strengthen the reliability of the working-grade estimate.",
  );

  const targetText = grade.targetGrade
    ? ` against a target of ${grade.targetGrade}`
    : "";

  const headline = grade.workingGrade
    ? `Working at ${grade.workingGrade}${targetText}`
    : "Working grade awaiting evidence";

  const nextGradeText =
    grade.nextGrade &&
    grade.percentagePointsToNextGrade !== null
      ? ` The next indicative grade is ${grade.nextGrade}, approximately ${grade.percentagePointsToNextGrade} percentage point${
          grade.percentagePointsToNextGrade === 1
            ? ""
            : "s"
        } away.`
      : "";

  const priorityText = weakestTopics[0]
    ? ` ${weakestTopics[0].topic} is currently the main priority area.`
    : "";

  return {
    headline,
    summary: `${trendText(trend)}${nextGradeText}${priorityText}`,
    strengths,
    priorities,
    nextActions,
  };
}
