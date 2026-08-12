import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson04: Lesson = {
  id: "secondary-storage",
  title: "Secondary Storage",
  description:
    "Understand why computers require long-term non-volatile storage.",
  estimatedTime: "18 mins",
  xpReward: 85,
  simulator: "storage-comparison",

  objectives: [
    "Define secondary storage.",
    "Explain why secondary storage is required.",
    "Distinguish primary memory from secondary storage.",
    "Identify common secondary-storage technologies.",
  ],

  explanation:
    "Secondary storage provides long-term, non-volatile storage for programs and data. Unlike RAM, its contents remain when the computer is switched off. Common technologies include magnetic storage, optical storage and solid-state storage. Secondary storage normally offers much greater capacity than primary memory but slower access.",

  workedExample:
    "A video-editing application is stored on an SSD when the computer is off. When the application is launched, required instructions and data are copied from the SSD into RAM so that they can be accessed efficiently while the program runs.",

  practiceQuestions: [
    {
      question: "Is secondary storage volatile or non-volatile?",
      answer: "Non-volatile",
      acceptedAnswers: ["Non volatile"],
    },
    {
      question: "Give one example of a secondary-storage device.",
      answer: "SSD",
      acceptedAnswers: [
        "HDD",
        "Hard disk drive",
        "Solid state drive",
        "Optical disc",
        "USB flash drive",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why is secondary storage required if a computer already has RAM?",
      answer: "RAM loses its contents when power is removed",
      acceptedAnswers: [
        "Secondary storage provides permanent storage",
        "RAM is volatile",
      ],
    },
  ],

  examQuestion: {
    question: "Explain two differences between RAM and secondary storage.",
    marks: 4,
    answer:
      "RAM is volatile whereas secondary storage is non-volatile. RAM is normally faster but has less capacity than secondary storage.",
    markScheme: [
      "RAM is volatile.",
      "Secondary storage is non-volatile.",
      "RAM normally has faster access.",
      "Secondary storage normally has greater capacity.",
    ],
    guidance: [
      "Credit other accurate comparative properties such as cost per unit.",
    ],
  },

  reflectionPrompt:
    "Explain why a modern computer normally requires both primary memory and secondary storage.",
};
