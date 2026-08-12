import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson05: Lesson = {
  id: "interpreters",
  title: "Interpreters",
  description:
    "Understand how interpreters translate and execute programs and compare them with compilers.",
  estimatedTime: "22 mins",
  xpReward: 110,
  simulator: "python",

  objectives: [
    "Describe how an interpreter works.",
    "Explain benefits of interpretation during development.",
    "Explain disadvantages of interpretation.",
    "Compare interpreters and compilers.",
  ],

  explanation:
    "An interpreter translates and executes source code one instruction or section at a time while the program runs. This can make development convenient because the programmer can run code immediately and errors can be reported close to the instruction that caused the problem. However, the source code generally needs to be available and translation happens during execution, which can reduce performance compared with precompiled code.",

  workedExample:
    "A programmer runs a Python script and the interpreter executes instructions until it reaches an invalid statement. The interpreter stops and reports the location of the error, allowing the programmer to correct it and run the program again.",

  practiceQuestions: [
    {
      question: "How does an interpreter usually translate source code?",
      answer: "One instruction at a time",
      acceptedAnswers: ["Line by line", "As the program executes"],
    },
    {
      question:
        "Give one benefit of using an interpreter while developing a program.",
      answer: "Errors can be identified quickly during execution",
      acceptedAnswers: [
        "Code can be tested immediately",
        "No separate compilation step is required",
      ],
    },
    {
      question: "Why can interpreted programs be slower?",
      answer: "Translation occurs while the program is running",
      acceptedAnswers: ["Instructions are translated during execution"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Which translator is often convenient for interactive testing and rapid development?",
      answer: "Interpreter",
    },
  ],

  examQuestion: {
    question: "Compare a compiler with an interpreter.",
    marks: 6,
    answer:
      "A compiler translates the complete program before it runs and can produce executable code that is used repeatedly. An interpreter translates and executes instructions while the program runs. Compiled programs may execute faster, while interpreters can make testing and debugging convenient because errors can be reported during execution.",
    markScheme: [
      "Compiler translates the whole program before execution.",
      "Interpreter translates during execution.",
      "Compiler can produce executable or translated code.",
      "Interpreted execution may require source code and interpreter.",
      "Compiled program may execute faster.",
      "Interpreter can make testing or debugging convenient.",
    ],
    guidance: ["Reward direct comparisons."],
  },

  reflectionPrompt:
    "Which translator would you prefer while learning Python and why?",
};
