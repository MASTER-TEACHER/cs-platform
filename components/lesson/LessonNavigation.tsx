import Link from "next/link";

type Props = {
  topicId: string;
  currentIndex: number;
  totalLessons: number;
  previousLessonId?: string;
  nextLessonId?: string;
  assignmentId?: string;
};

export default function LessonNavigation({
  topicId,
  currentIndex,
  totalLessons,
  previousLessonId,
  nextLessonId,
  assignmentId,
}: Props) {
  /*
   * Assignment access applies ONLY to the
   * exact lesson selected by the teacher.
   *
   * We intentionally do not carry the
   * assignment ID into previous/next lesson
   * links because that could imply that the
   * assignment unlocks neighbouring lessons.
   */
  const previousHref =
    previousLessonId
      ? `/learn/${encodeURIComponent(
          topicId,
        )}?lesson=${encodeURIComponent(
          previousLessonId,
        )}`
      : null;

  const nextHref =
    nextLessonId
      ? `/learn/${encodeURIComponent(
          topicId,
        )}?lesson=${encodeURIComponent(
          nextLessonId,
        )}`
      : null;

  return (
    <div className="space-y-4">
      {assignmentId && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-blue-700">
                Teacher assignment
              </p>

              <p className="mt-1 text-sm font-semibold text-blue-950">
                You opened this lesson
                from an assignment.
              </p>
            </div>

            <Link
              href={`/assignments/${encodeURIComponent(
                assignmentId,
              )}`}
              className="inline-flex rounded-xl border border-blue-300 bg-white px-4 py-2 text-sm font-black text-blue-700 transition hover:bg-blue-100"
            >
              ← Back to assignment
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          {previousHref ? (
            <Link
              href={previousHref}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              ← Previous Lesson
            </Link>
          ) : (
            <span className="text-slate-400">
              ← Previous Lesson
            </span>
          )}
        </div>

        <p className="text-sm font-semibold text-slate-600">
          Lesson {currentIndex + 1} of{" "}
          {totalLessons}
        </p>

        <div>
          {nextHref ? (
            <Link
              href={nextHref}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Next Lesson →
            </Link>
          ) : (
            <span className="text-slate-400">
              Next Lesson →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}