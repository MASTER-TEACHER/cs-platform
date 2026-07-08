import QuizPlayer from "@/components/quiz/QuizPlayer";
import { quizLibrary } from "@/data/quizzes/index";

export default function QuizPage() {
  const quiz = quizLibrary.binary;

  return (
    <div className="space-y-8">
      <QuizPlayer quiz={quiz} />
    </div>
  );
}