import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson06: Lesson = {
  id: "assemblers",
  title: "Assemblers",
  description:
    "Understand how assemblers convert mnemonic instructions into machine code.",
  estimatedTime: "18 mins",
  xpReward: 95,

  objectives: [
    "Define an assembler.",
    "Explain what an assembler translates.",
    "Explain the relationship between mnemonics and machine instructions.",
    "Distinguish an assembler from a compiler.",
  ],

  explanation:
    "An assembler translates assembly-language instructions into machine code. Assembly language uses mnemonic instructions and symbolic references that correspond closely to processor operations. Unlike a compiler, an assembler translates low-level assembly language rather than a high-level language.",

  workedExample:
    "The assembly instruction MOV R1, #5 may instruct the processor to place the value 5 into register R1. The assembler converts this mnemonic and its operands into the binary instruction format required by the target processor.",

  practiceQuestions: [
    {
      question: "Which language does an assembler translate?",
      answer: "Assembly language",
    },
    {
      question: "What does an assembler produce?",
      answer: "Machine code",
      acceptedAnswers: ["Binary machine instructions"],
    },
    {
      question:
        "Is an assembler used mainly for high-level or low-level languages?",
      answer: "Low-level languages",
      acceptedAnswers: ["Low level", "Low-level"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why does assembly language still need translation even though it is low level?",
      answer: "The processor executes machine code, not mnemonic instructions",
      acceptedAnswers: ["Mnemonics must be converted into binary instructions"],
    },
  ],

  examQuestion: {
    question: "Explain the purpose of an assembler.",
    marks: 3,
    answer:
      "An assembler translates assembly-language mnemonic instructions into the machine-code instructions that the processor can execute.",
    markScheme: [
      "Translates assembly language.",
      "Converts mnemonic instructions.",
      "Produces machine code executable by the processor.",
    ],
    guidance: ["Credit concise accurate descriptions."],
  },

  reflectionPrompt:
    "Explain one difference between an assembler and a compiler.",
};
