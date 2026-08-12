import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson09: Lesson = {
  id: "choosing-storage",
  title: "Choosing Suitable Storage",
  description:
    "Select storage devices by considering capacity, speed, portability, durability, reliability and cost.",
  estimatedTime: "22 mins",
  xpReward: 110,
  simulator: "storage-comparison",

  objectives: [
    "Identify important storage-device characteristics.",
    "Compare storage technologies for a scenario.",
    "Recommend suitable storage devices.",
    "Justify storage choices using technical properties.",
  ],

  explanation:
    "The most suitable storage device depends on the requirements of the situation. Important factors include capacity, speed, portability, durability, reliability and cost. A strong exam answer links each property directly to the scenario rather than simply listing advantages and disadvantages.",

  workedExample:
    "For a professional photographer working away from a studio, an external SSD may be suitable because it offers fast transfers, reasonable capacity and better resistance to movement than a traditional external hard disk. For long-term low-cost backups in an office, high-capacity hard drives may be more economical.",

  practiceQuestions: [
    {
      question:
        "Which storage factor describes how much data a device can hold?",
      answer: "Capacity",
    },
    {
      question:
        "Which storage factor is especially important for a device regularly carried in a backpack?",
      answer: "Durability",
      acceptedAnswers: ["Portability", "Resistance to physical damage"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why should an exam answer link storage properties to the scenario?",
      answer: "Because the suitability depends on the user's requirements",
      acceptedAnswers: [
        "Different uses require different storage characteristics",
      ],
    },
  ],

  examQuestion: {
    question:
      "A video-production company needs storage for very large video files that are edited every day. Recommend a suitable storage technology and justify your answer.",
    marks: 6,
    answer:
      "A high-capacity SSD would be suitable because video files require large capacity and editing benefits from fast read and write speeds. An SSD has no moving parts and can provide fast access. The company would need to consider the greater cost compared with some magnetic-storage options.",
    markScheme: [
      "Makes a suitable storage recommendation.",
      "Identifies high capacity as relevant.",
      "Links capacity to large video files.",
      "Identifies fast read/write or access speed.",
      "Links speed to frequent editing.",
      "Provides another developed consideration such as durability or cost.",
    ],
    guidance: [
      "Other storage technologies may receive full credit if justified convincingly.",
    ],
  },

  reflectionPrompt:
    "Choose different storage technologies for a phone, a school server and an archive backup, explaining each choice.",
};
