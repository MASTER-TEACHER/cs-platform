import { topicLibrary } from "@/data/curriculum/topics";
import type { Lesson, Topic } from "@/types/curriculum";

const LESSON_RESOURCE_SEPARATOR = "::";

export type LessonAssignmentIdentity = {
  topicId: string;
  lessonId: string;
};

export type LessonAssignmentOption = {
  topicId: string;
  topicTitle: string;
  lesson: Lesson;
};

export function createLessonAssignmentResourceId(
  topicId: string,
  lessonId: string,
): string {
  return `${topicId}${LESSON_RESOURCE_SEPARATOR}${lessonId}`;
}

export function parseLessonAssignmentResourceId(
  resourceId: string,
): LessonAssignmentIdentity | null {
  const separatorIndex = resourceId.indexOf(
    LESSON_RESOURCE_SEPARATOR,
  );

  if (separatorIndex <= 0) {
    return null;
  }

  const topicId = resourceId.slice(0, separatorIndex).trim();
  const lessonId = resourceId
    .slice(separatorIndex + LESSON_RESOURCE_SEPARATOR.length)
    .trim();

  if (!topicId || !lessonId) {
    return null;
  }

  return { topicId, lessonId };
}

export function getLessonAssignmentOption(
  resourceId: string,
): LessonAssignmentOption | null {
  const identity = parseLessonAssignmentResourceId(resourceId);

  if (!identity) {
    return null;
  }

  const topic = (topicLibrary as Record<string, Topic>)[identity.topicId];

  if (!topic) {
    return null;
  }

  const lesson = topic.lessons.find(
    (item) => item.id === identity.lessonId,
  );

  if (!lesson) {
    return null;
  }

  return {
    topicId: topic.id,
    topicTitle: topic.title,
    lesson,
  };
}

export function getLessonAssignmentHref(
  resourceId: string,
  assignmentId?: string,
): string | null {
  const identity = parseLessonAssignmentResourceId(resourceId);

  if (!identity) {
    return null;
  }

  const search = new URLSearchParams({
    lesson: identity.lessonId,
  });

  if (assignmentId) {
    search.set("assignment", assignmentId);
  }

  return `/learn/${encodeURIComponent(identity.topicId)}?${search.toString()}`;
}
