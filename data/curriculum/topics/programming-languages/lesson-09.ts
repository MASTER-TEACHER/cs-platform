import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson09: Lesson = {
  id: "programming-languages-challenge",
  title: "Programming Languages and Translators Exam Challenge",
  description:
    "Apply language-level, translator, IDE and debugging knowledge to GCSE-style scenarios.",
  estimatedTime: "30 mins",
  xpReward: 150,
  simulator: "debugging",

  objectives: [
    "Compare programming-language levels.",
    "Select appropriate translators.",
    "Explain IDE features.",
    "Apply error and debugging knowledge.",
    "Write developed exam responses.",
  ],

  explanation:
    "Exam questions in this topic often combine several ideas. You may need to identify a suitable translator, compare compiler and interpreter behaviour, explain an IDE feature or diagnose an error. Strong answers use precise terminology and link technical features directly to the scenario.",

  workedExample:
    "A developer is producing a commercial desktop application. During development, interactive testing may be useful because errors can be found quickly. For release, compiled executable code may improve execution speed and allow the developer to distribute the program without distributing the original source code.",

  practiceQuestions: [
    {
      question:
        "Which translator converts assembly language into machine code?",
      answer: "Assembler",
    },
    {
      question:
        "Which translator typically translates an entire high-level program before execution?",
      answer: "Compiler",
    },
    {
      question:
        "Which translator normally executes high-level code while translating it?",
      answer: "Interpreter",
    },
    {
      question:
        "Which error type produces incorrect results even though the program runs?",
      answer: "Logic error",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "A programmer wants to pause a running program and inspect variable values. Which IDE feature would help?",
      answer: "Debugger",
      acceptedAnswers: ["Breakpoint", "Debugging tools"],
    },
  ],

  examQuestion: {
    question:
      "A company is developing a large commercial application. Discuss the use of high-level languages, compilers and IDE features during development and release.",
    marks: 10,
    answer:
      "A high-level language can improve development productivity because it is easier to read, write and maintain than low-level code. An IDE can provide features such as syntax highlighting, auto-completion, error diagnostics and debugging tools to help programmers develop and test the software. A compiler can translate the complete program before release so the resulting program can execute without translating source instructions each time. The company can also distribute compiled code without necessarily providing its original source code.",
    markScheme: [
      "Explains an advantage of a high-level language.",
      "Links high-level language to readability or productivity.",
      "Identifies a valid IDE feature.",
      "Explains how the IDE feature helps development.",
      "Identifies another valid IDE or debugging feature.",
      "Explains its usefulness.",
      "Compiler translates the complete program before execution.",
      "Compiled program can be repeatedly executed without source translation each time.",
      "Recognises source-code distribution or protection considerations.",
      "Provides a coherent overall discussion applied to the scenario.",
    ],
    guidance: [
      "Reward developed technical explanations rather than unsupported feature lists.",
    ],
  },

  reflectionPrompt:
    "Write a short comparison explaining when a compiler, interpreter and assembler would each be used.",
};
