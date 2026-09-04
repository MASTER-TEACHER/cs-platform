import { notFound } from "next/navigation";

import LessonRenderer from "@/components/lesson/LessonRenderer";
import LessonNavigation from "@/components/lesson/LessonNavigation";
import CurriculumLessonGate from "@/components/lesson/CurriculumLessonGate";
import { topicLibrary } from "@/data/curriculum/topics";
import type { Lesson, Topic } from "@/types/curriculum";

type Props = {
  params: Promise<{
    topicId: string;
  }>;

  searchParams: Promise<{
    lesson?: string;
    assignment?: string;
  }>;
};

export default async function LessonPage({
  params,
  searchParams,
}: Props) {
  const { topicId } = await params;

  const {
    lesson: requestedLessonId,
    assignment: assignmentId,
  } = await searchParams;

  const topic =
    (topicLibrary as Record<string, Topic>)[topicId];

  if (!topic) {
    notFound();
  }

  const lessonIndex = requestedLessonId
    ? topic.lessons.findIndex(
        (item: Lesson) =>
          item.id === requestedLessonId,
      )
    : 0;

  if (lessonIndex === -1) {
    notFound();
  }

  const currentLesson =
    topic.lessons[lessonIndex];

  const previousLesson =
    topic.lessons[lessonIndex - 1];

  const nextLesson =
    topic.lessons[lessonIndex + 1];

  if (!currentLesson) {
    notFound();
  }

  return (
    <CurriculumLessonGate
      topicId={topicId}
      lessonId={currentLesson.id}
      assignmentId={assignmentId}
    >
      <div className="space-y-8">
        <LessonNavigation
          topicId={topicId}
          currentIndex={lessonIndex}
          totalLessons={topic.lessons.length}
          previousLessonId={
            previousLesson?.id
          }
          nextLessonId={
            nextLesson?.id
          }
          assignmentId={assignmentId}
        />

        <LessonRenderer
          lesson={currentLesson}
          topicId={topicId}
          nextLessonId={
            nextLesson?.id
          }
          topicSimulator={
            topic.simulator
          }
        />
      </div>
    </CurriculumLessonGate>
  );
}