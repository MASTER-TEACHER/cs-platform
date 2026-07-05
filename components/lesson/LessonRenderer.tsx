import Card from "@/components/ui/Card";
import CompleteLessonButton from "@/components/lesson/CompleteLessonButton";
import SimulatorRenderer from "@/components/lesson/SimulatorRenderer";
import PracticeQuestionCard from "@/components/lesson/PracticeQuestionCard";
import { Lesson, SimulatorType } from "@/types/curriculum";

type Props = {
  lesson: Lesson;
  topicSimulator?: SimulatorType;
};

export default function LessonRenderer({ lesson, topicSimulator }: Props) {
  const simulator = lesson.simulator ?? topicSimulator;

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Lesson
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {lesson.title}
        </h1>

        <p className="mt-3 text-slate-600">{lesson.description}</p>

        <p className="mt-4 text-sm font-semibold text-slate-500">
          ⏱ {lesson.estimatedTime} · ⭐ {lesson.xpReward} XP
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold">🎯 Learning Objectives</h2>

        {(lesson.objectives?.length ?? 0) > 0 ? (
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
            {lesson.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 italic text-slate-500">
            Learning objectives coming soon.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="text-2xl font-bold">📖 Explanation</h2>
        <p className="mt-4 leading-7 text-slate-600">
          {lesson.explanation || "Explanation coming soon."}
        </p>
      </Card>

      {simulator && <SimulatorRenderer simulator={simulator} />}

      <Card>
        <h2 className="text-2xl font-bold">💡 Worked Example</h2>
        <p className="mt-4 leading-7 text-slate-600">
          {lesson.workedExample || "Worked example coming soon."}
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold">✍ Practice Questions</h2>

        {(lesson.practiceQuestions?.length ?? 0) > 0 ? (
          <div className="mt-4 space-y-6">
            {lesson.practiceQuestions.map((question, index) => (
              <PracticeQuestionCard
                key={index}
                question={question.question}
                answer={question.answer}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 italic text-slate-500">
            Practice questions coming soon.
          </p>
        )}
      </Card>

      <Card>
        <h2 className="text-2xl font-bold">📝 Exam Question</h2>

        {lesson.examQuestion ? (
          <>
            <p className="mt-4 font-semibold">
              {lesson.examQuestion.question}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Marks: {lesson.examQuestion.marks}
            </p>

            <p className="mt-4 text-slate-600">
              {lesson.examQuestion.answer}
            </p>
          </>
        ) : (
          <p className="mt-4 italic text-slate-500">
            Exam question coming soon.
          </p>
        )}
      </Card>

      <CompleteLessonButton lessonId={lesson.id} xpReward={lesson.xpReward} />
    </div>
  );
}