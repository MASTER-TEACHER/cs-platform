import { getRecencyMultiplier } from "@/data/analytics/analyticsConfig";
import { getGradeOrder } from "@/data/analytics/gradeBoundaries";
import type {
  AnalyticsEvidence,
  GradeBoundarySet,
  GradeLabel,
  GradeProgressAnalytics,
} from "@/types/analytics";

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function calculateWeightedPercentage(
  evidence: AnalyticsEvidence[],
): number | null {
  const graded = evidence.filter(
    (item) =>
      item.graded &&
      typeof item.percentage === "number",
  );

  if (graded.length === 0) return null;

  let weightedTotal = 0;
  let weightTotal = 0;

  for (const item of graded) {
    const recency = getRecencyMultiplier(item.completedAt);
    const finalWeight = item.weight * recency;

    weightedTotal +=
      clampPercentage(item.percentage as number) *
      finalWeight;

    weightTotal += finalWeight;
  }

  if (weightTotal <= 0) return null;

  return Math.round(weightedTotal / weightTotal);
}

export function gradeFromPercentage(
  percentage: number,
  boundarySet: GradeBoundarySet,
): GradeLabel {
  const sorted = [...boundarySet.boundaries].sort(
    (a, b) => b.minimumPercentage - a.minimumPercentage,
  );

  return (
    sorted.find(
      (boundary) =>
        percentage >= boundary.minimumPercentage,
    )?.grade || "U"
  );
}

export function nextGrade(
  currentGrade: GradeLabel,
  boundarySet: GradeBoundarySet,
): GradeLabel | null {
  const order = getGradeOrder(boundarySet.qualification);
  const index = order.indexOf(currentGrade);

  if (index < 0 || index >= order.length - 1) {
    return null;
  }

  return order[index + 1];
}

export function gradeGap(
  workingGrade: GradeLabel | null,
  targetGrade: GradeLabel | null,
  boundarySet: GradeBoundarySet,
): number | null {
  if (!workingGrade || !targetGrade) return null;

  const order = getGradeOrder(boundarySet.qualification);
  const workingIndex = order.indexOf(workingGrade);
  const targetIndex = order.indexOf(targetGrade);

  if (workingIndex < 0 || targetIndex < 0) return null;

  return workingIndex - targetIndex;
}

function boundaryForGrade(
  grade: GradeLabel,
  boundarySet: GradeBoundarySet,
) {
  return boundarySet.boundaries.find(
    (boundary) => boundary.grade === grade,
  );
}

function latestMarkedExam(
  evidence: AnalyticsEvidence[],
): AnalyticsEvidence | null {
  return (
    evidence
      .filter(
        (item) =>
          item.type === "written_exam" &&
          item.graded &&
          typeof item.rawScore === "number" &&
          typeof item.totalMarks === "number" &&
          item.totalMarks > 0,
      )
      .sort(
        (a, b) =>
          (b.completedAt?.getTime() ?? 0) -
          (a.completedAt?.getTime() ?? 0),
      )[0] || null
  );
}

export function calculateGradeProgress({
  evidence,
  targetGrade,
  boundarySet,
}: {
  evidence: AnalyticsEvidence[];
  targetGrade: GradeLabel | null;
  boundarySet: GradeBoundarySet;
}): GradeProgressAnalytics {
  const workingPercentage =
    calculateWeightedPercentage(evidence);

  const workingGrade =
    workingPercentage === null
      ? null
      : gradeFromPercentage(
          workingPercentage,
          boundarySet,
        );

  const followingGrade = workingGrade
    ? nextGrade(workingGrade, boundarySet)
    : null;

  const nextBoundary = followingGrade
    ? boundaryForGrade(followingGrade, boundarySet)
    : null;

  const currentBoundary = workingGrade
    ? boundaryForGrade(workingGrade, boundarySet)
    : null;

  const percentagePointsToNextGrade =
    workingPercentage !== null && nextBoundary
      ? Math.max(
          0,
          nextBoundary.minimumPercentage -
            workingPercentage,
        )
      : null;

  const exam = latestMarkedExam(evidence);

  let marksToNextGrade: number | null = null;
  let marksAboveCurrentBoundary: number | null = null;

  if (
    exam &&
    workingGrade &&
    typeof exam.rawScore === "number" &&
    typeof exam.totalMarks === "number"
  ) {
    if (nextBoundary) {
      const nextMark = Math.ceil(
        (nextBoundary.minimumPercentage / 100) *
          exam.totalMarks,
      );

      marksToNextGrade = Math.max(
        0,
        nextMark - exam.rawScore,
      );
    }

    if (currentBoundary) {
      const currentMark = Math.ceil(
        (currentBoundary.minimumPercentage / 100) *
          exam.totalMarks,
      );

      marksAboveCurrentBoundary = Math.max(
        0,
        exam.rawScore - currentMark,
      );
    }
  }

  return {
    workingGrade,
    workingPercentage,
    targetGrade,
    gradeGap: gradeGap(
      workingGrade,
      targetGrade,
      boundarySet,
    ),
    nextGrade: followingGrade,
    percentagePointsToNextGrade,
    marksToNextGrade,
    marksToNextGradeAssessmentTitle:
      exam?.title || null,
    marksAboveCurrentBoundary,
    boundarySet,
  };
}
