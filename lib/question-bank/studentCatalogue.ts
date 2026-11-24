import "server-only";

import { catalogueQuestions } from "./staticCatalogue";
import { stageTwoQuestions } from "./staticCatalogueStage2";
import { expandedCatalogueQuestions } from "./staticCatalogueExpanded";
import { largeBatchQuestions } from "./staticCatalogueLargeBatch";
import { batch4Questions } from "./staticCatalogueBatch4";
import { batch5Questions } from "./staticCatalogueBatch5";
import { batch6Questions } from "./staticCatalogueBatch6";
import { batch7Questions } from "./staticCatalogueBatch7";
import { batch8Questions } from "./staticCatalogueBatch8";
import { isRetiredQuestion } from "./retiredQuestions";
import { imediaCatalogueQuestions } from "./imediaCatalogue";
import { imediaBatch2Questions } from "./imediaCatalogueBatch2";
import type { BankQuestion } from "./bankUtilities";

export type StudentQuestion = {
  id: string;
  subject: "COMPUTER_SCIENCE" | "CREATIVE_IMEDIA";
  qualification: string;
  examBoard: string;
  topic: string;
  prompt: string;
  context: string;
  marks: number;
  difficulty: string;
};

const source: BankQuestion[] = [
  ...catalogueQuestions,
  ...stageTwoQuestions,
  ...expandedCatalogueQuestions,
  ...largeBatchQuestions,
  ...batch4Questions,
  ...batch5Questions,
  ...batch6Questions,
  ...batch7Questions,
  ...batch8Questions,
  ...imediaCatalogueQuestions,
  ...imediaBatch2Questions,
];

const byId = new Map<string, BankQuestion>();

for (const entry of source) {
  const id = String(entry.key || entry.question.id);
  if (!byId.has(id)) byId.set(id, entry);
}

export function getStudentCatalogue() {
  // Retired repeats stay findable (for past submissions) but are not offered.
  return [...byId.entries()].filter(([id]) => !isRetiredQuestion(id)).map(([id, entry]) => {
    const imedia = entry.sourceId?.startsWith("imedia-") ||
      entry.qualification === "Cambridge National J834";

    return {
      id,
      subject: imedia
        ? "CREATIVE_IMEDIA"
        : "COMPUTER_SCIENCE",
      qualification: entry.qualification,
      examBoard: entry.examBoard,
      topic: entry.question.topic,
      prompt: entry.question.question,
      context: entry.question.context || "",
      marks: entry.question.marks,
      difficulty: entry.question.difficulty,
    } satisfies StudentQuestion;
  });
}

export function findStudentQuestion(id: string) {
  return byId.get(id);
}

export function getStudentGuidance(id: string) {
  const entry = byId.get(id);
  if (!entry) return null;

  return {
    modelAnswer: entry.question.modelAnswer || "",
    markingPoints: entry.question.markScheme.map(
      point => point.description
    ),
    guidance: entry.question.examinerGuidance || [],
    teacherReviewRequired:
      entry.qualification === "Cambridge National J834" ||
      !entry.question.markScheme.length,
  };
}