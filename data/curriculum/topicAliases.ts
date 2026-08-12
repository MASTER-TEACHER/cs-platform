import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";

export function normaliseAliasKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_/\\]+/g, " ")
    .replace(/[-]+/g, " ")
    .replace(/\s+/g, " ");
}

export const topicAliasMap = new Map<string, string>();

curriculumRegistry.forEach((topic) => {
  [topic.id, topic.title, ...topic.aliases, ...topic.lessonIds].forEach(
    (value) => {
      topicAliasMap.set(normaliseAliasKey(value), topic.id);
    },
  );
});
