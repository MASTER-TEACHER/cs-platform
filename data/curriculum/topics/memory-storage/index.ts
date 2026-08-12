import type { Topic } from "@/types/curriculum";

import { memoryStorageLesson01 } from "./lesson-01";
import { memoryStorageLesson02 } from "./lesson-02";
import { memoryStorageLesson03 } from "./lesson-03";
import { memoryStorageLesson04 } from "./lesson-04";
import { memoryStorageLesson05 } from "./lesson-05";
import { memoryStorageLesson06 } from "./lesson-06";
import { memoryStorageLesson07 } from "./lesson-07";
import { memoryStorageLesson08 } from "./lesson-08";
import { memoryStorageLesson09 } from "./lesson-09";
import { memoryStorageLesson10 } from "./lesson-10";

export const memoryStorageTopic: Topic = {
  id: "memory-storage",

  title: "Memory and Storage",

  description:
    "Explore RAM, ROM, cache, virtual memory, secondary storage, storage technologies, capacity and choosing suitable storage.",

  difficulty: "⭐⭐☆",

  estimatedTime: "208 mins",

  status: "published",

  unit: "Computer Systems",

  specificationReferences: [
    "AQA GCSE Computer Science",
    "OCR J277",
    "Pearson Edexcel GCSE Computer Science",
  ],

  lessons: [
    memoryStorageLesson01,
    memoryStorageLesson02,
    memoryStorageLesson03,
    memoryStorageLesson04,
    memoryStorageLesson05,
    memoryStorageLesson06,
    memoryStorageLesson07,
    memoryStorageLesson08,
    memoryStorageLesson09,
    memoryStorageLesson10,
  ],
};
