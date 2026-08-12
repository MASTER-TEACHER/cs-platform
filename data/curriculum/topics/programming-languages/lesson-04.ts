import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson04: Lesson = {
  id: "compilers",
  title: "Compilers",
  description:
    "Understand how compilers translate source programs and evaluate their advantages and disadvantages.",
  estimatedTime: "22 mins",
  xpReward: 110,

  objectives: [
    "Describe how a compiler works.",
    "Explain what happens before a compiled program executes.",
    "Explain advantages of compilation.",
    "Explain disadvantages of compilation.",
  ],

  explanation:
    "A compiler translates a whole source program before the translated program is executed. The compiler checks the source code, reports detected errors and can produce object or executable code. Once successfully compiled, the translated program may run without requiring the original source code or compiler each time. Compiled programs can execute efficiently because translation has already taken place.",

  workedExample:
    "A developer writes a program in C++. The compiler processes the source code and reports syntax errors. Once the errors are corrected, the program is compiled into executable code that can then be run many times without translating the original source again.",

  practiceQuestions: [
    {
      question:
        "Does a compiler normally translate the whole source program before execution?",
      answer: "Yes",
    },
    {
      question: "Give one advantage of compiled programs.",
      answer: "They can run faster because translation has already occurred",
      acceptedAnswers: [
        "They do not need to be retranslated each time",
        "The source code may not need to be distributed",
      ],
    },
    {
      question: "When does a compiler normally report source-code errors?",
      answer: "During compilation",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why can distributing compiled executable code help protect source code?",
      answer: "Users do not necessarily receive the original source code",
      acceptedAnswers: ["The source code can remain private"],
    },
  ],

  examQuestion: {
    question:
      "Explain two advantages of using a compiler to translate a program.",
    marks: 4,
    answer:
      "The program is translated before it runs, so the translated program can execute without translating each source instruction during every run. The developer can also distribute the compiled executable without necessarily distributing the original source code.",
    markScheme: [
      "Identifies a valid compiler advantage.",
      "Develops the first advantage.",
      "Identifies a second valid advantage.",
      "Develops the second advantage.",
    ],
    guidance: [
      "Credit execution speed, source-code protection and repeated execution where accurately explained.",
    ],
  },

  reflectionPrompt:
    "Why might a software company prefer to distribute compiled code instead of source code?",
};
