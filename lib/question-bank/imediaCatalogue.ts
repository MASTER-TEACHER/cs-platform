import { imediaPracticeBank } from "@/data/imedia/practiceBank";
import type { BankQuestion } from "@/lib/question-bank/bankUtilities";
import type { GeneratedExamQuestion } from "@/types/examQuestion";

import {
  IMEDIA_BOARD,
  IMEDIA_QUALIFICATION,
  IMEDIA_UNITS,
} from "./subjectTaxonomy";

/**
 * Only explicitly marked activities can be converted into
 * formal question-bank entries.
 *
 * Unmarked coursework practice remains in /imedia-practice.
 * No mark allocations or model answers are invented.
 */
export const imediaCatalogueQuestions: BankQuestion[] =
  imediaPracticeBank.flatMap((item, index): BankQuestion[] => {
    const candidate = item as typeof item & {
      marks?: number;
    };

    if (
      item.assessmentSafe !== true ||
      typeof candidate.marks !== "number" ||
      !Number.isInteger(candidate.marks) ||
      candidate.marks <= 0
    ) {
      return [];
    }

    const unit = item.unitId.toUpperCase();

    const question: GeneratedExamQuestion = {
      id: item.id,
      questionNumber: index + 1,
      topic: `${unit} - ${IMEDIA_UNITS[unit] ?? unit}`,
      questionType: "short-response",
      commandWord: "explain",
      question: item.prompt,
      context: item.title,
      marks: candidate.marks,
      difficulty: "standard",
      assessmentObjective: "AO2",
      markScheme: [],
      levelDescriptors: [],
      modelAnswer: "",
      examinerGuidance: [
        ...(item.successCriteria ?? []),
        item.modelGuidance,
        "Teacher review required before formal assessment.",
      ].filter(Boolean),
      commonMisconceptions: [],
    };

    return [{
      key: `imedia:${item.id}`,
      sourceId: item.id,
      sourceTitle: `Creative iMedia ${unit} - Formative practice`,
      qualification: IMEDIA_QUALIFICATION,
      examBoard: IMEDIA_BOARD,
      question,
    }];
  });