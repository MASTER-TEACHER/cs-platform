import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson02: Lesson = {
  id: "cache-memory",
  title: "Cache Memory",
  description:
    "Explain how cache reduces the time the processor spends waiting for data and instructions.",
  estimatedTime: "18 mins",
  xpReward: 90,
  simulator: "memory",

  objectives: [
    "Define cache memory.",
    "Explain why cache is located close to the CPU.",
    "Explain how cache size can affect performance.",
    "Compare cache with RAM.",
  ],

  explanation:
    "Cache is a small amount of very fast memory located in or close to the processor. It stores frequently or recently used instructions and data so that the CPU does not always have to retrieve them from slower main memory. Cache normally has much less capacity than RAM but is considerably faster and more expensive per unit of storage.",

  workedExample:
    "If a processor repeatedly executes instructions inside a loop, keeping those instructions in cache can reduce the number of slower accesses to RAM.",

  practiceQuestions: [
    {
      question: "Where is cache memory located?",
      answer: "In or close to the CPU",
      acceptedAnswers: [
        "Close to the processor",
        "Inside the processor",
        "On the CPU",
      ],
    },
    {
      question: "Is cache normally faster or slower than RAM?",
      answer: "Faster",
    },
  ],

  checkpointQuestions: [
    {
      question: "Why can a larger cache improve CPU performance?",
      answer:
        "More frequently used data and instructions can be accessed quickly",
      acceptedAnswers: [
        "The CPU needs to access RAM less often",
        "More data can be stored close to the CPU",
      ],
    },
  ],

  examQuestion: {
    question:
      "Explain how cache memory can improve the performance of a computer.",
    marks: 4,
    answer:
      "Cache stores frequently used data and instructions close to the processor. Cache can be accessed faster than RAM, so the CPU spends less time waiting for frequently needed information.",
    markScheme: [
      "Cache stores frequently or recently used data or instructions.",
      "Cache is located in or close to the CPU.",
      "Cache is faster than RAM.",
      "Reduces CPU waiting time or improves processing performance.",
    ],
    guidance: ["Do not credit statements that cache increases clock speed."],
  },

  reflectionPrompt:
    "Explain why computers do not simply replace all RAM with cache memory.",
};
