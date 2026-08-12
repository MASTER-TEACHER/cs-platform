import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson09: Lesson = {
  id: "systems-software-challenge",
  title: "Systems Software Exam Challenge",
  description:
    "Apply operating-system and utility-software knowledge to GCSE-style scenarios.",
  estimatedTime: "30 mins",
  xpReward: 150,
  simulator: "operating-system",

  objectives: [
    "Apply operating-system knowledge to unfamiliar scenarios.",
    "Compare different systems-software functions.",
    "Explain relationships between hardware, operating systems and applications.",
    "Evaluate appropriate system-management solutions.",
  ],

  explanation:
    "Systems-software exam questions often require you to apply several concepts at once. Strong answers identify the relevant operating-system or utility function and explain how it solves the problem described in the scenario.",

  workedExample:
    "If a school computer becomes slow when many applications are open, the issue may involve both memory and processor management. The operating system must allocate RAM and schedule processor time between processes. If available RAM becomes insufficient, virtual memory may also be used.",

  practiceQuestions: [
    {
      question: "Which operating-system function controls running processes?",
      answer: "Processor management",
      acceptedAnswers: ["Process management", "CPU scheduling"],
    },
    {
      question:
        "Which software allows an operating system to communicate with a printer?",
      answer: "Device driver",
    },
    {
      question:
        "Which type of utility protects confidential data by making it unreadable without a key?",
      answer: "Encryption software",
      acceptedAnswers: ["Encryption"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why are operating-system functions often described as resource management?",
      answer: "The operating system controls access to hardware resources",
      acceptedAnswers: ["It manages CPU, memory, storage and devices"],
    },
  ],

  examQuestion: {
    question:
      "A school is installing new computers for students. Discuss how systems software helps the computers operate securely and efficiently.",
    marks: 8,
    answer:
      "The operating system manages processor time and memory so multiple applications can run efficiently. It manages files and storage and uses device drivers to communicate with peripherals. User accounts and permissions restrict access to settings and files, improving security. Utility software can provide backup, malware protection, encryption or other maintenance functions.",
    markScheme: [
      "Explains processor or process management.",
      "Explains memory management.",
      "Explains file or storage management.",
      "Explains peripheral or driver management.",
      "Explains user accounts or authentication.",
      "Explains permissions or access control.",
      "Explains an appropriate utility-software function.",
      "Provides a developed overall judgement or application to security and efficiency.",
    ],
    guidance: [
      "Use a levels-based judgement if your exam-board implementation requires it.",
      "Credit alternative accurate systems-software examples.",
    ],
  },

  reflectionPrompt:
    "Write a five-sentence summary explaining why systems software is essential to a modern computer.",
};
