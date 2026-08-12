import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson03: Lesson = {
  id: "virtual-memory",
  title: "Virtual Memory",
  description:
    "Understand why virtual memory is used when available RAM becomes insufficient.",
  estimatedTime: "20 mins",
  xpReward: 95,
  simulator: "memory",

  objectives: [
    "Define virtual memory.",
    "Explain when virtual memory is required.",
    "Describe how secondary storage can act as additional memory.",
    "Explain why excessive virtual-memory use reduces performance.",
  ],

  explanation:
    "Virtual memory is a section of secondary storage used temporarily when there is not enough available RAM. Parts of programs or data that are not currently required can be moved from RAM to secondary storage. They can later be moved back into RAM when needed. Secondary storage is much slower than RAM, so frequent movement between RAM and virtual memory reduces performance.",

  workedExample:
    "A computer has several large applications open and runs out of free RAM. The operating system moves less frequently used data from RAM to an area on the SSD. When that data is required again, it is moved back into RAM.",

  practiceQuestions: [
    {
      question: "When is virtual memory normally used?",
      answer: "When there is insufficient RAM",
      acceptedAnswers: ["When RAM is full", "When available RAM runs out"],
    },
    {
      question: "Where is virtual memory stored?",
      answer: "Secondary storage",
      acceptedAnswers: ["On an HDD", "On an SSD", "On secondary storage"],
    },
  ],

  checkpointQuestions: [
    {
      question: "Why is virtual memory slower than using RAM?",
      answer: "Secondary storage is slower than RAM",
      acceptedAnswers: ["The storage device has slower access times"],
    },
  ],

  examQuestion: {
    question:
      "A computer becomes much slower when many applications are opened. Explain how virtual memory could be involved.",
    marks: 5,
    answer:
      "The applications may require more memory than the available RAM. The operating system therefore uses part of secondary storage as virtual memory. Data has to be transferred between RAM and secondary storage. Because secondary storage is slower than RAM, frequent transfers reduce performance.",
    markScheme: [
      "Available RAM becomes insufficient.",
      "Secondary storage is used as virtual memory.",
      "Data or program sections are moved out of RAM.",
      "Data may later be moved back into RAM.",
      "Secondary storage is slower, so performance falls.",
    ],
    guidance: ["Credit paging or swapping terminology where used accurately."],
  },

  reflectionPrompt:
    "Explain why installing more RAM may reduce a computer's reliance on virtual memory.",
};
