import type { Qualification } from "@/types/user";

/*
 * These bands are an internal learning-progress heuristic only.
 *
 * They are deliberately NOT described as official examination grade
 * boundaries. Real grade boundaries vary by board, paper and series.
 */
export function indicativeGradeFromPercentage(
  percentage: number,
  qualification: Qualification | "" | undefined,
): string {
  const value = Math.max(
    0,
    Math.min(100, Math.round(percentage)),
  );

  if (qualification === "A_LEVEL") {
    if (value >= 90) return "A*";
    if (value >= 80) return "A";
    if (value >= 70) return "B";
    if (value >= 60) return "C";
    if (value >= 50) return "D";
    if (value >= 40) return "E";
    return "U";
  }

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

export function isIndicativeGradeForQualification(
  grade: string,
  qualification: Qualification | "" | undefined,
): boolean {
  if (qualification === "A_LEVEL") {
    return ["A*", "A", "B", "C", "D", "E", "U"].includes(
      grade,
    );
  }

  return ["9", "8", "7", "6", "5", "4", "3", "2", "1"].includes(
    grade,
  );
}
