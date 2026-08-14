import type {
  AnalyticsEvidence,
  EvidenceConfidenceAnalytics,
} from "@/types/analytics";

export function calculateEvidenceConfidence({
  evidence,
  totalActivityCount,
  completedActivityCount,
}: {
  evidence: AnalyticsEvidence[];
  totalActivityCount: number;
  completedActivityCount: number;
}): EvidenceConfidenceAnalytics {
  const graded = evidence.filter(
    (item) =>
      item.graded &&
      typeof item.percentage === "number",
  );

  const writtenExamCount = graded.filter(
    (item) => item.type === "written_exam",
  ).length;

  const quizCount = graded.filter(
    (item) =>
      item.type === "quiz" ||
      item.type === "ai_quiz",
  ).length;

  const curriculumCoverage =
    totalActivityCount > 0
      ? Math.round(
          (completedActivityCount /
            totalActivityCount) *
            100,
        )
      : 0;

  let score = 0;

  score += Math.min(40, graded.length * 8);
  score += Math.min(30, writtenExamCount * 15);
  score += Math.min(15, quizCount * 3);
  score += Math.min(
    15,
    Math.round(curriculumCoverage * 0.15),
  );

  let level: EvidenceConfidenceAnalytics["level"] =
    "insufficient";

  if (graded.length >= 1) level = "low";
  if (score >= 45) level = "medium";
  if (
    score >= 70 &&
    writtenExamCount >= 2 &&
    graded.length >= 5
  ) {
    level = "high";
  }

  const explanation =
    level === "high"
      ? "The working grade is supported by multiple graded activities, including written assessment evidence."
      : level === "medium"
        ? "The working grade has a reasonable evidence base but would benefit from more written assessment evidence."
        : level === "low"
          ? "The current grade estimate is based on limited graded evidence and should be treated cautiously."
          : "There is not yet enough graded evidence to calculate a reliable working grade.";

  return {
    level,
    score: Math.min(100, score),
    gradedEvidenceCount: graded.length,
    writtenExamCount,
    quizCount,
    curriculumCoverage,
    explanation,
  };
}
