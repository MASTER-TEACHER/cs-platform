import { getCurriculumCoverage } from "@/services/curriculumCoverageService";

import type {
  ExamBoard,
  Qualification,
} from "@/types/user";

export type StudentJourneyMission = {
  topicId: string;
  topic: string;
  lesson: string;
  lessonId: string;
  xp: number;
  difficulty: string;
  estimatedTime: string;
  href: string;
};

export type StudentJourney = {
  qualification: Qualification;
  examBoard: ExamBoard;
  curriculumTitle: string;
  completedLessonCount: number;
  totalLessonCount: number;
  progressPercentage: number;
  mission: StudentJourneyMission | null;
  courseComplete: boolean;
};

function difficultyLabel(
  difficulty: string,
): string {
  if (difficulty === "⭐⭐⭐") {
    return "Advanced";
  }

  if (difficulty === "⭐⭐☆") {
    return "Intermediate";
  }

  return "Foundation";
}

/**
 * Build the student's dashboard learning journey from the exact
 * qualification + exam board stored in their profile.
 *
 * This deliberately does not use the old global mission/lesson helpers.
 * Those helpers could select a lesson from outside the student's
 * curriculum because they did not have qualification/exam-board context.
 */
export function buildStudentJourney({
  qualification,
  examBoard,
  completedLessons,
}: {
  qualification: Qualification;
  examBoard: ExamBoard;
  completedLessons: string[];
}): StudentJourney | null {
  const coverage = getCurriculumCoverage(
    qualification,
    examBoard,
  );

  if (!coverage) {
    return null;
  }

  const completed = new Set(
    completedLessons.filter(Boolean),
  );

  const availableLessons = coverage.units.flatMap(
    (unitCoverage) =>
      unitCoverage.topics.flatMap((topic) =>
        topic.lessons.map((lesson) => ({
          topic,
          lesson,
        })),
      ),
  );

  const completedLessonCount =
    availableLessons.filter(({ lesson }) =>
      completed.has(lesson.id),
    ).length;

  const totalLessonCount =
    availableLessons.length;

  const next =
    availableLessons.find(
      ({ lesson }) =>
        !completed.has(lesson.id),
    ) || null;

  const progressPercentage =
    totalLessonCount > 0
      ? Math.min(
          100,
          Math.round(
            (completedLessonCount /
              totalLessonCount) *
              100,
          ),
        )
      : 0;

  return {
    qualification,
    examBoard,
    curriculumTitle:
      coverage.curriculum.title,

    completedLessonCount,
    totalLessonCount,
    progressPercentage,

    mission: next
      ? {
          topicId: next.topic.id,
          topic: next.topic.title,
          lesson: next.lesson.title,
          lessonId: next.lesson.id,
          xp: next.lesson.xpReward,
          difficulty: difficultyLabel(
            next.topic.difficulty,
          ),
          estimatedTime:
            next.lesson.estimatedTime,
          href: `/learn/${encodeURIComponent(
            next.topic.id,
          )}?lesson=${encodeURIComponent(
            next.lesson.id,
          )}`,
        }
      : null,

    courseComplete:
      totalLessonCount > 0 &&
      completedLessonCount >=
        totalLessonCount,
  };
}
