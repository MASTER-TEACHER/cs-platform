import type {
  AnalyticsQualification,
  GradeBoundarySet,
  GradeLabel,
} from "@/types/analytics";

/*
 * IMPORTANT:
 * These are CS Master indicative percentage bands. They are NOT published
 * exam-board grade boundaries.
 *
 * Official boundaries vary by specification, paper, series and year.
 * The analytics engine is deliberately boundary-set driven so official or
 * teacher-defined boundary sets can be substituted later without changing
 * the calculation engine.
 */
export const GCSE_INDICATIVE_BOUNDARIES: GradeBoundarySet = {
  id: "cs-master-gcse-indicative-v1",
  title: "CS Master GCSE indicative bands",
  qualification: "GCSE",
  source: "indicative",
  boundaries: [
    { grade: "9", minimumPercentage: 90 },
    { grade: "8", minimumPercentage: 80 },
    { grade: "7", minimumPercentage: 70 },
    { grade: "6", minimumPercentage: 60 },
    { grade: "5", minimumPercentage: 50 },
    { grade: "4", minimumPercentage: 40 },
    { grade: "3", minimumPercentage: 30 },
    { grade: "2", minimumPercentage: 20 },
    { grade: "1", minimumPercentage: 10 },
    { grade: "U", minimumPercentage: 0 },
  ],
};

export const A_LEVEL_INDICATIVE_BOUNDARIES: GradeBoundarySet = {
  id: "cs-master-alevel-indicative-v1",
  title: "CS Master A Level indicative bands",
  qualification: "A_LEVEL",
  source: "indicative",
  boundaries: [
    { grade: "A*", minimumPercentage: 90 },
    { grade: "A", minimumPercentage: 80 },
    { grade: "B", minimumPercentage: 70 },
    { grade: "C", minimumPercentage: 60 },
    { grade: "D", minimumPercentage: 50 },
    { grade: "E", minimumPercentage: 40 },
    { grade: "U", minimumPercentage: 0 },
  ],
};

export function getDefaultBoundarySet(
  qualification: AnalyticsQualification,
): GradeBoundarySet {
  return qualification === "A_LEVEL"
    ? A_LEVEL_INDICATIVE_BOUNDARIES
    : GCSE_INDICATIVE_BOUNDARIES;
}

export function getGradeOrder(
  qualification: AnalyticsQualification,
): GradeLabel[] {
  return qualification === "A_LEVEL"
    ? ["U", "E", "D", "C", "B", "A", "A*"]
    : ["U", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
}
