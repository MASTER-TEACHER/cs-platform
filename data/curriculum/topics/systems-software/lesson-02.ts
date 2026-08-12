import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson02: Lesson = {
  id: "operating-system-functions",
  title: "Operating System Functions",
  description: "Explore the major functions performed by an operating system.",
  estimatedTime: "22 mins",
  xpReward: 95,
  simulator: "operating-system",

  objectives: [
    "Identify major operating-system functions.",
    "Explain how an operating system manages resources.",
    "Explain why applications depend on the operating system.",
  ],

  explanation:
    "An operating system performs many important functions. These include providing a user interface, managing memory, managing processor time, managing files, controlling peripheral devices, managing users and providing security. The operating system acts as an intermediary between applications, users and hardware.",

  workedExample:
    "When a user opens a browser, the operating system allocates memory to the browser, gives the browser processor time, allows it to access files and communicates with devices such as the keyboard, mouse and network adapter.",

  practiceQuestions: [
    {
      question: "Give two functions of an operating system.",
      answer: "Memory management and file management",
      acceptedAnswers: [
        "Processor management and file management",
        "User interface and device management",
        "Security and memory management",
      ],
    },
    {
      question:
        "What component provides communication between applications and hardware?",
      answer: "Operating system",
    },
  ],

  checkpointQuestions: [
    {
      question: "Why must the operating system manage processor time?",
      answer: "Multiple processes need access to the processor",
      acceptedAnswers: [
        "So programs can share CPU time",
        "To manage running processes",
      ],
    },
  ],

  examQuestion: {
    question: "Describe three functions performed by an operating system.",
    marks: 6,
    answer:
      "The operating system manages memory by allocating RAM to running processes. It manages files by organising, naming and accessing stored data. It also manages peripheral devices using drivers so applications can communicate with hardware.",
    markScheme: [
      "Identifies a valid operating-system function.",
      "Develops the first function.",
      "Identifies a second valid function.",
      "Develops the second function.",
      "Identifies a third valid function.",
      "Develops the third function.",
    ],
    guidance: [
      "Credit user interface, processor management, memory management, file management, peripheral management, user management and security.",
    ],
  },

  reflectionPrompt:
    "Rank the three operating-system functions you think are most important and justify your first choice.",
};
