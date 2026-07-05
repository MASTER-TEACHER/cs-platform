import Link from "next/link";

type Props = {
  topicId: string;
  currentIndex: number;
  totalLessons: number;
  previousLessonId?: string;
  nextLessonId?: string;
};

export default function LessonNavigation({
  topicId,
  currentIndex,
  totalLessons,
  previousLessonId,
  nextLessonId,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        {previousLessonId ? (
          <Link
            href={`/learn/${topicId}?lesson=${previousLessonId}`}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Previous Lesson
          </Link>
        ) : (
          <span className="text-slate-400">← Previous Lesson</span>
        )}
      </div>

      <p className="text-sm font-semibold text-slate-600">
        Lesson {currentIndex + 1} of {totalLessons}
      </p>

      <div>
        {nextLessonId ? (
          <Link
            href={`/learn/${topicId}?lesson=${nextLessonId}`}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Next Lesson →
          </Link>
        ) : (
          <span className="text-slate-400">Next Lesson →</span>
        )}
      </div>
    </div>
  );
}