import { getExamTrainerHistory } from "@/services/examTrainerAttemptService";
import type {
  ExamTrainerDashboardSummary,
  ExamTrainerHistoryItem,
} from "@/types/examTrainer";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

function gradeFromPercentage(value: number): string {
  if (value >= 90) return "9";
  if (value >= 80) return "8";
  if (value >= 70) return "7";
  if (value >= 60) return "6";
  if (value >= 50) return "5";
  if (value >= 40) return "4";
  if (value >= 30) return "3";
  if (value >= 20) return "2";
  return "1";
}

function topicFrequency(
  history: ExamTrainerHistoryItem[],
  key: "priorityTopics",
): Map<string, number> {
  const counts = new Map<string, number>();

  history.forEach((attempt) => {
    attempt[key].forEach((topic) => {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    });
  });

  return counts;
}

export async function getExamTrainerDashboardSummary(
  studentId: string,
): Promise<ExamTrainerDashboardSummary> {
  const history = await getExamTrainerHistory(studentId);
  const percentages = history.map((attempt) => attempt.percentage);
  const recent = percentages.slice(0, 3);
  const previous = percentages.slice(3, 6);

  const weakestCounts = topicFrequency(history, "priorityTopics");
  const weakestTopic =
    [...weakestCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const topicPerformance = new Map<string, number[]>();

  history.forEach((attempt) => {
    if (
      attempt.selectedTopic !== "all" &&
      !attempt.priorityTopics.includes(attempt.selectedTopic)
    ) {
      topicPerformance.set(attempt.selectedTopic, [
        ...(topicPerformance.get(attempt.selectedTopic) ?? []),
        attempt.percentage,
      ]);
    }
  });

  const strongestTopic =
    [...topicPerformance.entries()]
      .map(([topic, scores]) => ({
        topic,
        average: average(scores),
      }))
      .sort((a, b) => b.average - a.average)[0]?.topic ?? null;

  const bestPercentage = percentages.length ? Math.max(...percentages) : 0;

  return {
    completedAttempts: history.length,
    averagePercentage: average(percentages),
    bestPercentage,
    bestGrade: gradeFromPercentage(bestPercentage),
    latestPercentage: percentages[0] ?? 0,
    weakestTopic,
    strongestTopic,
    recentTrend: average(recent) - average(previous),
  };
}
