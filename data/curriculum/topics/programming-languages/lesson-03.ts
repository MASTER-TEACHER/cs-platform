import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson03: Lesson = {
  id: "translators-overview",
  title: "Language Translators",
  description:
    "Understand why source code must be translated and compare compilers, interpreters and assemblers.",
  estimatedTime: "22 mins",
  xpReward: 105,

  objectives: [
    "Explain why translation is necessary.",
    "Identify the roles of compilers, interpreters and assemblers.",
    "Match translator types to source languages.",
  ],

  explanation:
    "Processors execute machine code, so programs written in other languages must be translated before or during execution. A compiler translates a complete high-level program into machine code or another target form before execution. An interpreter translates and executes high-level code instruction by instruction. An assembler translates assembly language into machine code.",

  workedExample:
    "A Python interpreter may read one Python instruction, translate it and execute it before moving to the next instruction. A C compiler normally processes the source program and produces translated code before the program is run.",

  practiceQuestions: [
    {
      question: "Why is a translator required for high-level source code?",
      answer: "The processor only executes machine code",
      acceptedAnswers: ["High-level code must be converted into machine code"],
    },
    {
      question:
        "Which translator converts assembly language into machine code?",
      answer: "Assembler",
    },
    {
      question:
        "Name the two main translator types used with high-level languages.",
      answer: "Compiler and interpreter",
      acceptedAnswers: ["Compilers and interpreters"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Which translator typically translates and executes code one instruction at a time?",
      answer: "Interpreter",
    },
  ],

  examQuestion: {
    question:
      "State the purpose of a translator and name three types of translator.",
    marks: 4,
    answer:
      "A translator converts source code into a form that can be executed by the computer. Three translator types are compiler, interpreter and assembler.",
    markScheme: [
      "Explains that source code is translated into executable or machine code.",
      "Compiler.",
      "Interpreter.",
      "Assembler.",
    ],
    guidance: ["Accept equivalent accurate descriptions of translation."],
  },

  reflectionPrompt:
    "Explain why a computer cannot simply execute a Python source file directly as processor instructions.",
};
