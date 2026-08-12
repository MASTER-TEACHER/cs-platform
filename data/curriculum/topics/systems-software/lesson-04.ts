import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson04: Lesson = {
  id: "memory-processor-management",
  title: "Memory and Processor Management",
  description:
    "Understand how an operating system allocates memory and processor time to running processes.",
  estimatedTime: "22 mins",
  xpReward: 105,
  simulator: "operating-system",

  objectives: [
    "Explain process management.",
    "Explain memory management.",
    "Describe multitasking.",
    "Explain why processes need controlled access to resources.",
  ],

  explanation:
    "A process is a program that is currently running. Modern operating systems often manage many processes at the same time. The operating system allocates memory to each process and schedules processor time so processes can make progress. Rapid switching between processes creates the appearance that many programs are running simultaneously. The operating system must also prevent processes from incorrectly accessing memory belonging to other processes.",

  workedExample:
    "A user may listen to music while editing a document and downloading a file. The operating system allocates RAM and processor time to each process and repeatedly switches the CPU between them.",

  practiceQuestions: [
    {
      question: "What is a process?",
      answer: "A program that is currently running",
      acceptedAnswers: ["A running program"],
    },
    {
      question: "What does processor scheduling decide?",
      answer: "Which process receives CPU time",
      acceptedAnswers: ["Which process runs next"],
    },
  ],

  checkpointQuestions: [
    {
      question: "Why does multitasking require processor management?",
      answer: "Several processes need to share processor time",
      acceptedAnswers: ["The CPU must switch between processes"],
    },
  ],

  examQuestion: {
    question:
      "Explain how an operating system allows several applications to run apparently at the same time.",
    marks: 5,
    answer:
      "The operating system manages each running application as a process. It allocates memory and schedules small amounts of processor time to different processes. The CPU switches rapidly between them, creating the appearance that the applications are running simultaneously.",
    markScheme: [
      "Applications are managed as processes.",
      "Operating system allocates memory.",
      "Operating system schedules processor time.",
      "CPU switches between processes.",
      "Rapid switching creates apparent simultaneous execution.",
    ],
    guidance: ["Credit accurate descriptions of scheduling and multitasking."],
  },

  reflectionPrompt:
    "Explain what might happen if one process were allowed to use all available processor time.",
};
