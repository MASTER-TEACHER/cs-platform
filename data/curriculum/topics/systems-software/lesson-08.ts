import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson08: Lesson = {
  id: "utility-software",
  title: "Utility Software",
  description:
    "Understand how utility programs maintain, protect and optimise computer systems.",
  estimatedTime: "22 mins",
  xpReward: 105,

  objectives: [
    "Define utility software.",
    "Describe common utility programs.",
    "Explain the purpose of backup software.",
    "Explain the purpose of compression and encryption utilities.",
  ],

  explanation:
    "Utility software performs maintenance, protection or management tasks for a computer system. Examples include backup utilities, encryption tools, compression software, antivirus tools, disk-management tools and file-management utilities. Utilities support the effective operation and protection of the system rather than performing a main end-user task such as word processing.",

  workedExample:
    "A backup utility may automatically copy important files to another storage location every evening. If the original files are deleted or damaged, the backup can be used to restore them.",

  practiceQuestions: [
    {
      question: "What is utility software?",
      answer: "Software used to maintain, manage or protect a computer system",
      acceptedAnswers: ["Software that performs system maintenance"],
    },
    {
      question: "Give one example of utility software.",
      answer: "Backup software",
      acceptedAnswers: [
        "Compression software",
        "Encryption software",
        "Antivirus software",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question: "Why is backup software useful?",
      answer: "It allows lost or damaged data to be restored",
      acceptedAnswers: ["It creates copies of important files"],
    },
  ],

  examQuestion: {
    question: "Explain the purpose of two different utility programs.",
    marks: 4,
    answer:
      "Backup software creates copies of files so they can be restored if the originals are lost or damaged. Encryption software transforms data so unauthorised users cannot understand it without the correct key.",
    markScheme: [
      "Identifies a valid utility.",
      "Explains the first utility's purpose.",
      "Identifies a second valid utility.",
      "Explains the second utility's purpose.",
    ],
    guidance: [
      "Credit compression, backup, encryption, antivirus and other appropriate utility programs.",
    ],
  },

  reflectionPrompt:
    "Choose three utility programs you would install on a school computer and explain why.",
};
