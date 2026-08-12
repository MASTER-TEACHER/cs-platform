import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson10: Lesson = {
  id: "memory-storage-challenge",
  title: "Memory and Storage Exam Challenge",
  description:
    "Apply RAM, ROM, cache, virtual memory and secondary-storage knowledge to exam-style scenarios.",
  estimatedTime: "30 mins",
  xpReward: 150,
  simulator: "memory",

  objectives: [
    "Compare primary memory and secondary storage.",
    "Explain how RAM, cache and virtual memory interact.",
    "Evaluate storage technologies.",
    "Apply memory and storage knowledge to unfamiliar scenarios.",
  ],

  explanation:
    "Exam questions often combine several memory and storage concepts. A strong answer identifies the relevant technology, states an accurate property and then explains how that property affects the scenario. For comparisons, make direct comparative statements rather than writing two separate descriptions.",

  workedExample:
    "A gaming laptop benefits from sufficient RAM so active programs and game data can remain in fast primary memory. A larger cache may reduce processor waiting time. An SSD provides fast persistent storage, while excessive virtual-memory use can reduce performance because secondary storage is slower than RAM.",

  practiceQuestions: [
    {
      question: "Which memory stores programs and data currently being used?",
      answer: "RAM",
    },
    {
      question:
        "Which small, fast memory stores frequently used data close to the CPU?",
      answer: "Cache",
      acceptedAnswers: ["Cache memory"],
    },
    {
      question:
        "What may a computer use when available RAM becomes insufficient?",
      answer: "Virtual memory",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why does replacing an HDD with an SSD not directly increase the amount of RAM?",
      answer:
        "RAM and secondary storage are different types of memory or storage",
      acceptedAnswers: ["An SSD is secondary storage rather than RAM"],
    },
  ],

  examQuestion: {
    question:
      "A student has an old computer with 4 GB of RAM and a magnetic hard drive. The computer becomes slow when several applications are open. The student can afford either more RAM or a new SSD. Discuss the possible benefits of each upgrade.",
    marks: 8,
    answer:
      "Adding RAM would allow more active programs and data to remain in primary memory and could reduce the need for virtual memory. This may particularly improve performance when many applications are open. Replacing the HDD with an SSD would improve secondary-storage access because SSDs normally provide faster read and write speeds. Applications and the operating system may load more quickly. If the main problem is insufficient RAM and heavy virtual-memory use, adding RAM may have the greater effect on multitasking.",
    markScheme: [
      "More RAM provides additional primary-memory capacity.",
      "More active programs or data can remain in RAM.",
      "More RAM may reduce virtual-memory use.",
      "Links reduced virtual-memory use to improved performance.",
      "SSD is faster than a magnetic HDD.",
      "SSD can reduce application or operating-system loading times.",
      "Recognises that the two upgrades solve different limitations.",
      "Provides a justified conclusion based on the scenario.",
    ],
    guidance: [
      "Use a levels-based judgement where appropriate.",
      "Credit technically accurate alternative conclusions.",
    ],
  },

  reflectionPrompt:
    "Decide which upgrade you would recommend in the scenario and write a three-sentence justification.",
};
