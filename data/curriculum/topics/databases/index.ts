import type { Topic } from "@/types/curriculum";

import { databaseLesson01 } from "./lesson-01";
import { databaseLesson02 } from "./lesson-02";
import { databaseLesson03 } from "./lesson-03";
import { databaseLesson04 } from "./lesson-04";
import { databaseLesson05 } from "./lesson-05";
import { databaseLesson06 } from "./lesson-06";
import { databaseLesson07 } from "./lesson-07";
import { databaseLesson08 } from "./lesson-08";
import { databaseLesson09 } from "./lesson-09";
import { databaseLesson10 } from "./lesson-10";

export const databasesTopic: Topic = {
  id: "databases",
  title: "Databases and SQL",
  description:
    "Design relational databases, use primary and foreign keys, build relationships and query data using SQL.",
  difficulty: "⭐⭐☆",
  estimatedTime: "210 mins",
  simulator: "sql",
  status: "published",
  unit: "Databases",
  specificationReferences: [
    "AQA GCSE Computer Science",
    "OCR J277",
    "Pearson Edexcel GCSE Computer Science",
  ],

  lessons: [
    databaseLesson01,
    databaseLesson02,
    databaseLesson03,
    databaseLesson04,
    databaseLesson05,
    databaseLesson06,
    databaseLesson07,
    databaseLesson08,
    databaseLesson09,
    databaseLesson10,
  ],
};
