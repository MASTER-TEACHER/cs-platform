import { topics } from "@/data/topics";
import { lessons } from "@/data/lessons";
import { notFound } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { questions } from "@/data/questions";
import QuestionCard from "@/components/quiz/QuestionCard";
import LessonHero from "@/components/lesson/LessonHero";
import BinarySimulator from "@/components/Simulators/BinarySimulator";
import HexSimulator from "@/components/simulators/HexSimulator";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;

  const topic = topics.find((t) => t.id === topicId);
  const topicLessons = lessons
    .filter((lesson) => lesson.topicId === topicId)
    .sort((a, b) => a.order - b.order);

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <LessonHero
    title={topic.title}
    subtitle={topic.description}
    duration="20 mins"
    difficulty="Easy"
    progress={45}
    lessonNumber={1}
    totalLessons={topicLessons.length}
/>
{topic.id === "binary" && (
  <div className="space-y-6">
    <BinarySimulator />
    <HexSimulator />
  </div>
)}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {topicLessons.map((lesson) => (
          <Card key={lesson.id}>
            <div className="mt-5">
              <h3 className="font-semibold text-slate-900">
                Learning objectives
              </h3>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {lesson.objectives.map((objective) => (
                  <li key={objective}>{objective}</li>
                ))}
              </ul>
            </div>

            {/* Lesson Questions */}
            <div className="mt-6 space-y-4">
              {questions
                .filter((question) => question.lessonId === lesson.id)
                .map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                  />
                ))}
            </div>

<div className="mt-6">
  <Button>
    Start Lesson →
  </Button>
</div>
          </Card>
        ))}
      </div>
    </div>
  );
}