import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson05: Lesson = {
  id: "magnetic-storage",
  title: "Magnetic Storage",
  description:
    "Understand how magnetic storage works and evaluate its suitability.",
  estimatedTime: "20 mins",
  xpReward: 90,
  simulator: "storage-comparison",

  objectives: [
    "Describe the basic operation of magnetic storage.",
    "Identify magnetic-storage devices.",
    "Explain advantages of magnetic storage.",
    "Explain disadvantages of magnetic storage.",
  ],

  explanation:
    "Magnetic storage represents data by magnetising areas of a surface. A hard disk drive contains rotating magnetic platters and a read/write head. Magnetic storage can provide very large capacities at relatively low cost, but moving mechanical parts make traditional hard drives slower and more vulnerable to damage from shock than solid-state storage.",

  workedExample:
    "A desktop backup system may use a multi-terabyte hard disk because it provides large storage capacity at a lower cost per gigabyte than many solid-state alternatives.",

  practiceQuestions: [
    {
      question: "Give one example of magnetic storage.",
      answer: "Hard disk drive",
      acceptedAnswers: ["HDD", "Hard drive"],
    },
    {
      question: "Give one advantage of magnetic storage.",
      answer: "High capacity",
      acceptedAnswers: ["Low cost per gigabyte", "Cheap for large capacities"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why can a hard disk drive be more vulnerable to physical damage than an SSD?",
      answer: "It contains moving mechanical parts",
      acceptedAnswers: [
        "It has moving parts",
        "The platters and read-write head can be damaged",
      ],
    },
  ],

  examQuestion: {
    question:
      "A company needs to store several terabytes of backup data. Explain why magnetic hard drives may be suitable.",
    marks: 4,
    answer:
      "Hard drives can provide very large capacities and relatively low cost per gigabyte. Backup data may not require the fastest possible access speed, so the lower speed compared with an SSD may be acceptable.",
    markScheme: [
      "High storage capacity.",
      "Relatively low cost per GB.",
      "Backup use may not require very high speed.",
      "Applies a property to the scenario.",
    ],
    guidance: ["Credit other reasonable scenario-based advantages."],
  },

  reflectionPrompt:
    "Recommend whether an HDD would be suitable inside a laptop that is frequently carried between classrooms.",
};
