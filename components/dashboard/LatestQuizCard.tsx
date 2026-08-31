import Card from "@/components/ui/Card";
import { type RecentQuiz } from "@/hooks/useRecentQuiz";

type Props = {
  quiz: RecentQuiz | null;
  loading: boolean;
};

export default function LatestQuizCard({
  quiz,
  loading,
}: Props) {
  if (loading) {
    return (
      <Card>
        <p className="text-slate-500">
          Loading your latest curriculum quiz...
        </p>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Current curriculum
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          📝 Latest Quiz
        </h2>

        <p className="mt-4 text-slate-600">
          No completed quiz from your current curriculum is available yet.
          Historical results remain available in your analytics.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        Current curriculum
      </p>

      <h2 className="mt-2 text-xl font-bold text-slate-900">
        📝 Latest Quiz
      </h2>

      <p className="mt-4 text-lg font-semibold">
        {quiz.title}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-slate-500">Score</p>
          <p className="text-2xl font-bold text-blue-700">
            {quiz.scorePercent}%
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-slate-500">XP Earned</p>
          <p className="text-2xl font-bold text-green-700">
            ⭐ {quiz.earnedXP}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-600">
        Correct Answers: {quiz.correctCount} / {quiz.totalQuestions}
      </p>
    </Card>
  );
}
