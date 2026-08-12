import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson02: Lesson = {
  id: "machine-code-assembly",
  title: "Machine Code and Assembly Language",
  description:
    "Understand machine code, assembly language and how low-level instructions relate to processor operations.",
  estimatedTime: "22 mins",
  xpReward: 105,

  objectives: [
    "Define machine code.",
    "Define assembly language.",
    "Explain the purpose of mnemonics.",
    "Explain why assembly language requires translation.",
  ],

  explanation:
    "Machine code is the binary instruction set that a processor can execute directly. Different processor architectures may use different machine-code instructions. Assembly language is a low-level language that uses short mnemonic instructions such as MOV, ADD and SUB instead of raw binary. Assembly language is easier for humans to understand than machine code but must still be translated into machine code before execution.",

  workedExample:
    "An assembly instruction such as ADD R1, R2 may tell the processor to add values stored in two registers. The assembler translates this mnemonic instruction into the binary instruction pattern understood by the processor.",

  practiceQuestions: [
    {
      question: "Which language can the processor execute directly?",
      answer: "Machine code",
    },
    {
      question:
        "What does assembly language use instead of binary instruction patterns?",
      answer: "Mnemonics",
      acceptedAnswers: ["Mnemonic instructions", "Short instruction names"],
    },
    {
      question: "Give one example of an assembly-language mnemonic.",
      answer: "MOV",
      acceptedAnswers: ["ADD", "SUB", "CMP", "JMP"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why can the same assembly-language program not necessarily run unchanged on every processor architecture?",
      answer: "Different processors can have different instruction sets",
      acceptedAnswers: [
        "Assembly language is hardware dependent",
        "Different CPUs use different machine instructions",
      ],
    },
  ],

  examQuestion: {
    question:
      "Explain one advantage and one disadvantage of assembly language compared with a high-level language.",
    marks: 4,
    answer:
      "Assembly language can provide more direct control over processor instructions and hardware. However, it is harder to write and maintain because the programmer must work with low-level hardware-specific instructions.",
    markScheme: [
      "Identifies a valid assembly-language advantage.",
      "Develops the advantage.",
      "Identifies a valid disadvantage.",
      "Develops the disadvantage.",
    ],
    guidance: [
      "Credit control, efficiency, hardware dependence, readability and development time where explained correctly.",
    ],
  },

  reflectionPrompt:
    "Why is assembly language still useful if high-level languages are easier to program?",
};
