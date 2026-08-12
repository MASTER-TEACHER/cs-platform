import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson01: Lesson = {
  id: "systems-software-intro",
  title: "Introduction to Systems Software",
  description:
    "Understand the purpose of systems software and distinguish it from application software.",
  estimatedTime: "18 mins",
  xpReward: 80,
  simulator: "operating-system",

  objectives: [
    "Define systems software.",
    "Describe the purpose of an operating system.",
    "Distinguish systems software from application software.",
  ],

  explanation:
    "Systems software manages the computer itself and provides a platform for other software to run. The operating system is the main example of systems software. It manages hardware resources, files, memory, processes, users and peripheral devices. Application software, such as a word processor or web browser, is designed to perform tasks for the user rather than manage the computer system.",

  workedExample:
    "Windows, macOS and Linux are operating systems because they manage computer hardware and provide services for applications. Microsoft Word is application software because its main purpose is to allow users to create and edit documents.",

  practiceQuestions: [
    {
      question: "What is systems software?",
      answer: "Software that manages the computer system and hardware",
      acceptedAnswers: [
        "Software that manages hardware",
        "Software that provides services for other software",
      ],
    },
    {
      question:
        "Is a spreadsheet an example of systems software or application software?",
      answer: "Application software",
    },
  ],

  checkpointQuestions: [
    {
      question: "Give one example of systems software.",
      answer: "Operating system",
      acceptedAnswers: ["Windows", "Linux", "macOS", "Utility software"],
    },
  ],

  examQuestion: {
    question:
      "Explain the difference between systems software and application software.",
    marks: 4,
    answer:
      "Systems software manages the computer's hardware and provides services required by other software. Application software performs specific tasks for the user, such as editing documents or browsing the web.",
    markScheme: [
      "Systems software manages computer hardware or resources.",
      "Systems software provides services or a platform for applications.",
      "Application software performs tasks for the user.",
      "Provides an appropriate application-software example or developed comparison.",
    ],
    guidance: ["Credit equivalent valid distinctions."],
  },

  reflectionPrompt:
    "Explain why a computer would be difficult to use without an operating system.",
};
