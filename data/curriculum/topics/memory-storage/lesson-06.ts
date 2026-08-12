import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson06: Lesson = {
  id: "optical-storage",
  title: "Optical Storage",
  description:
    "Explore optical discs and evaluate when optical storage may be appropriate.",
  estimatedTime: "18 mins",
  xpReward: 85,
  simulator: "storage-comparison",

  objectives: [
    "Describe optical storage.",
    "Identify common optical-disc formats.",
    "Explain advantages of optical media.",
    "Explain limitations of optical media.",
  ],

  explanation:
    "Optical storage uses laser light to read data from discs. Examples include CD, DVD and Blu-ray. Optical discs are inexpensive to distribute, portable and useful where physical media is required. However, they generally have lower capacity and slower access than modern hard drives and SSDs, and discs can be scratched or damaged.",

  workedExample:
    "A film distributor could use Blu-ray because it provides greater capacity than a DVD and can physically distribute high-definition video without requiring an internet connection.",

  practiceQuestions: [
    {
      question: "What is used to read an optical disc?",
      answer: "A laser",
      acceptedAnswers: ["Laser light"],
    },
    {
      question: "Name one optical storage format.",
      answer: "DVD",
      acceptedAnswers: ["CD", "Blu-ray", "Blu ray"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Which generally has the greatest capacity: CD, DVD or Blu-ray?",
      answer: "Blu-ray",
      acceptedAnswers: ["Blu ray"],
    },
  ],

  examQuestion: {
    question:
      "Give one advantage and one disadvantage of using optical discs to distribute software.",
    marks: 4,
    answer:
      "Optical discs are inexpensive physical media that can be distributed without requiring an internet connection. However, they have limited capacity compared with many modern storage devices and can be physically damaged.",
    markScheme: [
      "Identifies a valid advantage.",
      "Develops or applies the advantage.",
      "Identifies a valid disadvantage.",
      "Develops or applies the disadvantage.",
    ],
    guidance: [
      "Credit portability, low production cost, capacity, speed and durability where explained accurately.",
    ],
  },

  reflectionPrompt:
    "Explain why optical storage is less common for everyday personal file storage than it once was.",
};
