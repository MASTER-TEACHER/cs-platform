import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson01: Lesson = {
  id: "high-low-level-languages",
  title: "High-Level and Low-Level Languages",
  description:
    "Compare high-level and low-level programming languages and understand why different languages are used.",
  estimatedTime: "22 mins",
  xpReward: 100,

  objectives: [
    "Define high-level and low-level languages.",
    "Compare abstraction in high-level and low-level languages.",
    "Explain why high-level languages are easier for humans to use.",
    "Explain why low-level languages are closer to machine hardware.",
  ],

  explanation:
    "Programming languages can be described as high-level or low-level. High-level languages use instructions that are easier for humans to read and write and hide many hardware details. Examples include Python, Java and C#. Low-level languages are closer to the instructions executed by the processor. Assembly language uses mnemonics such as MOV and ADD, while machine code uses binary instructions. High-level languages improve programmer productivity, while low-level languages can provide greater control over hardware.",

  workedExample:
    "A Python statement such as total = price * quantity is easy for a programmer to understand. The equivalent machine-level operations would involve several processor instructions and memory locations. This shows how a high-level language provides abstraction from the hardware.",

  practiceQuestions: [
    {
      question:
        "Which type of language is generally easier for humans to read and write?",
      answer: "High-level language",
      acceptedAnswers: ["High level language", "High-level"],
    },
    {
      question: "Which type of language is closer to the hardware?",
      answer: "Low-level language",
      acceptedAnswers: ["Low level language", "Low-level"],
    },
    {
      question: "Give one example of a high-level language.",
      answer: "Python",
      acceptedAnswers: ["Java", "C#", "JavaScript", "C++"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why do programmers usually prefer high-level languages for large software projects?",
      answer: "They are easier to read, write and maintain",
      acceptedAnswers: [
        "They require less hardware-specific knowledge",
        "They improve programmer productivity",
      ],
    },
  ],

  examQuestion: {
    question: "Compare high-level and low-level programming languages.",
    marks: 6,
    answer:
      "High-level languages are easier for humans to read and write because they use greater abstraction and hide hardware details. They are generally faster to develop and maintain. Low-level languages are closer to machine instructions and provide more direct control over hardware, but they are harder for programmers to understand and write.",
    markScheme: [
      "High-level languages provide greater abstraction.",
      "High-level languages are easier for humans to read or write.",
      "High-level languages are generally easier to develop or maintain.",
      "Low-level languages are closer to hardware or machine instructions.",
      "Low-level languages provide more direct hardware control.",
      "Low-level languages are generally harder for humans to use.",
    ],
    guidance: ["Credit clear comparative statements."],
  },

  reflectionPrompt:
    "Explain why an operating-system developer might sometimes use a lower-level language than a web developer.",
};
