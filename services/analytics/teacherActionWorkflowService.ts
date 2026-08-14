import type { TeacherStudentAnalyticsRow } from "@/types/teacherAnalytics";
import type {
  TeacherActionRecommendation,
  TeacherActionType,
} from "@/types/teacherActionWorkflow";

function chooseActionType(
  row: TeacherStudentAnalyticsRow,
): TeacherActionType {
  if (
    row.interventionPriority === "high" ||
    (row.gradeGap !== null && row.gradeGap <= -2)
  ) {
    return "intervention";
  }

  if (row.trend === "declining") {
    return "quiz";
  }

  const weakestTopic = [...row.analytics.topics].sort(
    (first, second) =>
      first.weightedPercentage - second.weightedPercentage,
  )[0];

  if (
    weakestTopic &&
    weakestTopic.weightedPercentage < 50
  ) {
    return "lesson";
  }

  if (row.completionRate < 70) {
    return "monitor";
  }

  return "monitor";
}

export function buildTeacherActionRecommendation(
  row: TeacherStudentAnalyticsRow,
): TeacherActionRecommendation {
  const weakestTopic = [...row.analytics.topics].sort(
    (first, second) =>
      first.weightedPercentage - second.weightedPercentage,
  )[0];

  const focusTopic =
    weakestTopic?.topic || "General Computer Science";

  const type = chooseActionType(row);

  const targetText = row.targetGrade
    ? `Working at ${row.workingGrade || "—"} against target ${row.targetGrade}.`
    : `Working grade ${row.workingGrade || "—"}; target grade is not set.`;

  const gapText =
    row.gradeGap !== null && row.gradeGap < 0
      ? ` The learner is ${Math.abs(row.gradeGap)} grade step${
          Math.abs(row.gradeGap) === 1 ? "" : "s"
        } below target.`
      : "";

  const trendText =
    row.trend === "declining"
      ? " Recent performance is declining."
      : "";

  const masteryText = weakestTopic
    ? ` ${focusTopic} is currently the weakest assessed area at ${weakestTopic.weightedPercentage}% mastery.`
    : "";

  const reason = `${targetText}${gapText}${trendText}${masteryText}`.trim();

  if (type === "intervention") {
    return {
      type,
      title: `Create targeted intervention: ${focusTopic}`,
      reason,
      focusTopic,
      suggestedInstruction:
        `Prioritise ${focusTopic}. Re-teach the misconception, use guided practice, then check understanding with a short reassessment. Review whether the grade gap and mastery score improve afterwards.`,
      priority: row.interventionPriority,
    };
  }

  if (type === "quiz") {
    return {
      type,
      title: `Reassess ${focusTopic}`,
      reason,
      focusTopic,
      suggestedInstruction:
        `Assign a short retrieval quiz on ${focusTopic}, review incorrect answers and compare the new result with the learner's recent evidence.`,
      priority: row.interventionPriority,
    };
  }

  if (type === "lesson") {
    return {
      type,
      title: `Assign targeted lesson: ${focusTopic}`,
      reason,
      focusTopic,
      suggestedInstruction:
        `Assign an exact CS Master lesson covering ${focusTopic}. Ask the learner to complete guided practice and the checkpoint before reassessment.`,
      priority: row.interventionPriority,
    };
  }

  return {
    type,
    title: "Monitor and review",
    reason,
    focusTopic,
    suggestedInstruction:
      "Continue collecting graded evidence. Review completion, trend and mastery again after the next assessment.",
    priority: row.interventionPriority,
  };
}
