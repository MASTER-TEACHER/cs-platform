import { curriculumRegistry } from "@/data/curriculum/curriculumRegistry";

export const topicDependencies = new Map(
  curriculumRegistry.map((topic) => [topic.id, topic.prerequisites]),
);
