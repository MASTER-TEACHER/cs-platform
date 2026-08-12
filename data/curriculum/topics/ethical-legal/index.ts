import type { Topic } from "@/types/curriculum";

import { ethicalLegalLesson01 } from "./lesson-01";
import { ethicalLegalLesson02 } from "./lesson-02";
import { ethicalLegalLesson03 } from "./lesson-03";
import { ethicalLegalLesson04 } from "./lesson-04";
import { ethicalLegalLesson05 } from "./lesson-05";
import { ethicalLegalLesson06 } from "./lesson-06";
import { ethicalLegalLesson07 } from "./lesson-07";
import { ethicalLegalLesson08 } from "./lesson-08";
import { ethicalLegalLesson09 } from "./lesson-09";

export const ethicalLegalTopic: Topic = {
  id: "ethical-legal",

  title: "Ethical, Legal, Cultural and Environmental Impacts",

  description:
    "Explore privacy, legislation, software licensing, copyright, environmental impact, cultural change and ethical issues created by digital technology.",

  difficulty: "⭐⭐☆",

  estimatedTime: "200 mins",

  status: "published",

  unit: "Impacts of Digital Technology",

  specificationReferences: [
    "AQA 3.8",
    "OCR J277 1.6",
    "Pearson Edexcel GCSE Computer Science",
  ],

  lessons: [
    ethicalLegalLesson01,
    ethicalLegalLesson02,
    ethicalLegalLesson03,
    ethicalLegalLesson04,
    ethicalLegalLesson05,
    ethicalLegalLesson06,
    ethicalLegalLesson07,
    ethicalLegalLesson08,
    ethicalLegalLesson09,
  ],
};
