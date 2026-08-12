import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson06: Lesson = {
  id: "file-management",
  title: "File Management",
  description:
    "Explore how operating systems organise and manage files and folders.",
  estimatedTime: "20 mins",
  xpReward: 95,
  simulator: "operating-system",

  objectives: [
    "Explain the purpose of file management.",
    "Describe files, folders and paths.",
    "Explain common file-management operations.",
    "Explain why permissions may be applied to files.",
  ],

  explanation:
    "Operating systems provide file-management services so users and applications can organise stored data. Files can be created, opened, copied, moved, renamed and deleted. Folders or directories group related files. File paths identify locations in a storage hierarchy. Permissions can control who is allowed to read, modify or execute particular files.",

  workedExample:
    "A school network may contain a folder for each student. The operating system can apply permissions so each student can modify their own files while teachers may have wider access.",

  practiceQuestions: [
    {
      question: "What is the purpose of a folder or directory?",
      answer: "To organise files",
      acceptedAnswers: ["To group related files"],
    },
    {
      question: "What does a file path identify?",
      answer: "The location of a file",
      acceptedAnswers: ["Where a file is stored"],
    },
  ],

  checkpointQuestions: [
    {
      question: "Why might an operating system apply permissions to files?",
      answer: "To control who can access or modify them",
      acceptedAnswers: ["To protect files from unauthorised access"],
    },
  ],

  examQuestion: {
    question:
      "Describe three file-management functions provided by an operating system.",
    marks: 6,
    answer:
      "The operating system allows files to be organised into folders, renamed or moved to different locations, and protected using permissions that control user access.",
    markScheme: [
      "Identifies a valid file-management function.",
      "Develops the first function.",
      "Identifies a second function.",
      "Develops the second function.",
      "Identifies a third function.",
      "Develops the third function.",
    ],
    guidance: [
      "Credit create, copy, move, delete, rename, organise, search and permissions.",
    ],
  },

  reflectionPrompt:
    "Design a sensible folder structure for organising all of your Computer Science coursework.",
};
