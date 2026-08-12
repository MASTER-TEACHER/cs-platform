import InteractiveLessonEngine from "@/components/lesson-engine/InteractiveLessonEngine";
import type { Lesson, SimulatorType } from "@/types/curriculum";

type Props = {
  lesson: Lesson;
  topicId: string;
  nextLessonId?: string;
  topicSimulator?: SimulatorType;
};

export default function LessonRenderer({
  lesson,
  topicId,
  nextLessonId,
  topicSimulator,
}: Props) {
  return (
    <InteractiveLessonEngine
      lesson={lesson}
      topicId={topicId}
      nextLessonId={nextLessonId}
      topicSimulator={topicSimulator}
    />
  );
}
