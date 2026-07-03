export function calculateCourseProgress(
  completedLessons: string[],
  totalLessons: number
) {
  if (totalLessons === 0) return 0;

  return Math.round(
    (completedLessons.length / totalLessons) * 100
  );
}