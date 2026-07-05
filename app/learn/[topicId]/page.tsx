import { notFound } from "next/navigation";
import LessonRenderer from "../../../components/lesson/LessonRenderer";
import LessonNavigation from "@/components/lesson/LessonNavigation";
import { topicLibrary } from "@/data/curriculum/topics/index";
import type { Lesson, Topic } from "@/types/curriculum";

type Props = {
  params: Promise<{
    topicId: string;
  }>;
  searchParams: Promise<{
    lesson?: string;
  }>;
};

export default async function LessonPage({ params, searchParams }: Props) {
  const { topicId } = await params;
  const { lesson } = await searchParams;

  const topics = topicLibrary as unknown as Record<string, Topic>;
  const topic = topics[topicId];

  if (!topic) {
    notFound();
  }

  const lessonIndex = lesson
    ? topic.lessons.findIndex((item: Lesson) => item.id === lesson)
    : 0;

  if (lessonIndex === -1) {
    notFound();
  }

  const currentLesson = topic.lessons[lessonIndex];
  const previousLesson = topic.lessons[lessonIndex - 1];
  const nextLesson = topic.lessons[lessonIndex + 1];

  return (
    <div className="space-y-8">
      <LessonNavigation
        topicId={topicId}
        currentIndex={lessonIndex}
        totalLessons={topic.lessons.length}
        previousLessonId={previousLesson?.id}
        nextLessonId={nextLesson?.id}
      />

      <LessonRenderer
  lesson={currentLesson}
  topicSimulator={topic.simulator}
/>

      <LessonNavigation
        topicId={topicId}
        currentIndex={lessonIndex}
        totalLessons={topic.lessons.length}
        previousLessonId={previousLesson?.id}
        nextLessonId={nextLesson?.id}
      />
    </div>
  );
}