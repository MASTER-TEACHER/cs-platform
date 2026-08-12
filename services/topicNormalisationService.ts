import { curriculumTopicById } from "@/data/curriculum/curriculumRegistry";
import {
  normaliseAliasKey,
  topicAliasMap,
} from "@/data/curriculum/topicAliases";
import type { NormalisedTopic } from "@/types/knowledgeMap";

function removeGenericWords(value: string): string {
  return value
    .replace(
      /\b(demo|assigned|practice|gcse|aqa|ocr|edexcel|quiz|test|exam|question|questions)\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) =>
      word.length <= 3 && word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

export function normaliseTopic(rawTopic: string): NormalisedTopic {
  const cleaned = removeGenericWords(rawTopic.trim());
  const aliasKey = normaliseAliasKey(cleaned || rawTopic);
  const directId = topicAliasMap.get(aliasKey);

  if (directId) {
    const definition = curriculumTopicById.get(directId);
    if (definition) {
      return {
        topicId: definition.id,
        topicTitle: definition.title,
        unitId: definition.unitId,
        unitTitle: definition.unitTitle,
      };
    }
  }

  for (const [alias, topicId] of topicAliasMap) {
    if (aliasKey.includes(alias) || alias.includes(aliasKey)) {
      const definition = curriculumTopicById.get(topicId);
      if (definition) {
        return {
          topicId: definition.id,
          topicTitle: definition.title,
          unitId: definition.unitId,
          unitTitle: definition.unitTitle,
        };
      }
    }
  }

  const fallbackTitle = titleCase(cleaned || rawTopic || "Computer Science");

  return {
    topicId: normaliseAliasKey(fallbackTitle).replace(/\s+/g, "-"),
    topicTitle: fallbackTitle,
    unitId: "other",
    unitTitle: "Other",
  };
}
