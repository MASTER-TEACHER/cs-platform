import type { Topic } from "@/types/curriculum";

import { systemsSoftwareLesson01 } from "./lesson-01";
import { systemsSoftwareLesson02 } from "./lesson-02";
import { systemsSoftwareLesson03 } from "./lesson-03";
import { systemsSoftwareLesson04 } from "./lesson-04";
import { systemsSoftwareLesson05 } from "./lesson-05";
import { systemsSoftwareLesson06 } from "./lesson-06";
import { systemsSoftwareLesson07 } from "./lesson-07";
import { systemsSoftwareLesson08 } from "./lesson-08";
import { systemsSoftwareLesson09 } from "./lesson-09";

export const systemsSoftwareTopic: Topic = {
  id: "systems-software",

  title: "Systems Software",

  description:
    "Understand operating systems, user interfaces, memory and processor management, device drivers, files, users, security and utility software.",

  difficulty: "⭐⭐☆",

  estimatedTime: "196 mins",

  status: "published",

  unit: "Computer Systems",

  specificationReferences: [
    "AQA GCSE Computer Science",
    "OCR J277",
    "Pearson Edexcel GCSE Computer Science",
  ],

  lessons: [
    systemsSoftwareLesson01,
    systemsSoftwareLesson02,
    systemsSoftwareLesson03,
    systemsSoftwareLesson04,
    systemsSoftwareLesson05,
    systemsSoftwareLesson06,
    systemsSoftwareLesson07,
    systemsSoftwareLesson08,
    systemsSoftwareLesson09,
  ],
};
