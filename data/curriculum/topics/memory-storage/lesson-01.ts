import type { Lesson } from "@/types/curriculum";

export const memoryStorageLesson01: Lesson = {
  id: "primary-memory",
  title: "Primary Memory: RAM and ROM",
  description:
    "Understand the roles and characteristics of RAM and ROM in a computer system.",
  estimatedTime: "20 mins",
  xpReward: 85,
  simulator: "memory",

  objectives: [
    "Define primary memory.",
    "Describe the purpose of RAM.",
    "Describe the purpose of ROM.",
    "Compare volatile and non-volatile memory.",
  ],

  explanation:
    "Primary memory is memory that is directly accessible by the processor. RAM, or random access memory, stores programs and data currently being used. RAM is volatile, which means its contents are lost when power is removed. ROM, or read-only memory, is non-volatile and retains its contents when power is removed. ROM commonly stores instructions needed to start or initialise a computer system.",

  workedExample:
    "When a user opens a web browser, the browser program and the data it is currently using are loaded into RAM. When the computer is switched off, this information is removed from RAM. The firmware required during startup remains available because it is stored in non-volatile memory such as ROM.",

  practiceQuestions: [
    {
      question: "What does RAM stand for?",
      answer: "Random access memory",
      acceptedAnswers: ["Random Access Memory"],
    },
    {
      question: "Which type of primary memory is volatile?",
      answer: "RAM",
      acceptedAnswers: ["Random access memory"],
    },
    {
      question: "Which type of memory retains its contents without power?",
      answer: "ROM",
      acceptedAnswers: ["Read only memory", "Non-volatile memory"],
    },
  ],

  checkpointQuestions: [
    {
      question: "What happens to data stored in RAM when power is removed?",
      answer: "It is lost",
      acceptedAnswers: [
        "The data is lost",
        "RAM is cleared",
        "Its contents are lost",
      ],
    },
  ],

  examQuestion: {
    question: "Compare RAM and ROM in a computer system.",
    marks: 6,
    answer:
      "RAM is volatile memory that stores programs and data currently in use. Its contents are lost when power is removed and it can normally be read from and written to. ROM is non-volatile and retains its contents without power. It commonly stores instructions or firmware required when the computer starts.",
    markScheme: [
      "RAM is volatile.",
      "RAM stores programs or data currently being used.",
      "RAM can normally be written to.",
      "ROM is non-volatile.",
      "ROM retains its contents when power is removed.",
      "ROM stores startup instructions or firmware.",
    ],
    guidance: [
      "Credit developed comparisons rather than two unrelated descriptions.",
    ],
  },

  reflectionPrompt:
    "Explain why a computer needs both RAM and non-volatile memory.",
};
