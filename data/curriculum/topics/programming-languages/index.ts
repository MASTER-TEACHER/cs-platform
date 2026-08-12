import type { Topic } from "@/types/curriculum";

import { programmingLanguagesLesson01 } from "./lesson-01";
import { programmingLanguagesLesson02 } from "./lesson-02";
import { programmingLanguagesLesson03 } from "./lesson-03";
import { programmingLanguagesLesson04 } from "./lesson-04";
import { programmingLanguagesLesson05 } from "./lesson-05";
import { programmingLanguagesLesson06 } from "./lesson-06";
import { programmingLanguagesLesson07 } from "./lesson-07";
import { programmingLanguagesLesson08 } from "./lesson-08";
import { programmingLanguagesLesson09 } from "./lesson-09";

export const programmingLanguagesTopic: Topic = {
  id: "programming-languages",

  title: "Programming Languages, Translators and IDEs",

  description:
    "Compare high-level and low-level languages, understand machine code and assembly language, use compilers, interpreters and assemblers, and explore IDE and debugging tools.",

  difficulty: "⭐⭐☆",

  estimatedTime: "206 mins",

  status: "published",

  unit: "Programming Languages and Software Development",

  specificationReferences: [
    "OCR J277",
    "AQA GCSE Computer Science",
    "Pearson Edexcel GCSE Computer Science",
  ],

  lessons: [
    programmingLanguagesLesson01,
    programmingLanguagesLesson02,
    programmingLanguagesLesson03,
    programmingLanguagesLesson04,
    programmingLanguagesLesson05,
    programmingLanguagesLesson06,
    programmingLanguagesLesson07,
    programmingLanguagesLesson08,
    programmingLanguagesLesson09,
  ],
};
