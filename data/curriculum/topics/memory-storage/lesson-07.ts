import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson07: Lesson = {
  id: "solid-state-storage",
  title: "Solid-State Storage",
  description:
    "Understand flash-based storage and compare SSDs with magnetic storage.",
  estimatedTime: "20 mins",
  xpReward: 95,
  simulator: "storage-comparison",

  objectives: [
    "Describe solid-state storage.",
    "Identify common solid-state devices.",
    "Explain advantages of SSDs.",
    "Compare SSDs and HDDs.",
  ],

  explanation:
    "Solid-state storage stores data electronically using flash memory and contains no moving mechanical parts. Examples include SSDs, USB flash drives and memory cards. SSDs normally provide faster access than magnetic hard drives, are quieter and more resistant to shock. They have historically cost more per gigabyte, although this difference has reduced over time.",

  workedExample:
    "An SSD is often used as the main drive in a laptop because fast access improves startup and application-loading times, while the absence of moving parts makes it more suitable for a portable device.",

  practiceQuestions: [
    {
      question: "Does an SSD contain moving mechanical parts?",
      answer: "No",
    },
    {
      question: "Give one advantage of an SSD over an HDD.",
      answer: "Faster access",
      acceptedAnswers: [
        "More resistant to shock",
        "No moving parts",
        "Quieter",
        "Uses less power",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why is solid-state storage often suitable for portable devices?",
      answer: "It has no moving parts and is resistant to shock",
      acceptedAnswers: [
        "It is durable",
        "It is less easily damaged by movement",
      ],
    },
  ],

  examQuestion: {
    question:
      "A student is buying a laptop for school. Compare an SSD with a magnetic HDD for use in the laptop.",
    marks: 6,
    answer:
      "An SSD normally provides faster access and has no moving parts, making it more resistant to shock and suitable for a portable laptop. An HDD can provide a larger capacity for a lower cost per gigabyte, but it is slower and its moving parts can be damaged more easily.",
    markScheme: [
      "SSD normally provides faster access.",
      "SSD has no moving mechanical parts.",
      "SSD is more resistant to shock or suitable for portability.",
      "HDD may offer greater capacity for the same price.",
      "HDD generally has lower cost per GB.",
      "HDD is slower or more vulnerable to physical damage.",
    ],
    guidance: ["Award marks for valid direct comparisons."],
  },

  reflectionPrompt:
    "Decide whether you would choose an SSD or HDD for a school laptop and justify your decision.",
};
