import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson07: Lesson = {
  id: "ide-features",
  title: "Integrated Development Environments",
  description:
    "Explore the tools provided by an IDE and explain how they help programmers develop software.",
  estimatedTime: "24 mins",
  xpReward: 115,
  simulator: "debugging",

  objectives: [
    "Define an integrated development environment.",
    "Identify common IDE features.",
    "Explain how IDE features support programming.",
    "Apply IDE features to development scenarios.",
  ],

  explanation:
    "An integrated development environment, or IDE, combines tools used to write, test and debug software. Typical features include a source-code editor, syntax highlighting, auto-completion, error diagnostics, debugging tools, breakpoints, variable inspection and facilities to run or translate programs. These features can improve productivity and help programmers find errors.",

  workedExample:
    "A programmer places a breakpoint inside a loop. When the program reaches the breakpoint, execution pauses and the programmer inspects the current values of variables. This can help identify why the loop produces the wrong result.",

  practiceQuestions: [
    {
      question: "What does IDE stand for?",
      answer: "Integrated development environment",
    },
    {
      question:
        "Which IDE feature uses colours to distinguish programming-language elements?",
      answer: "Syntax highlighting",
    },
    {
      question: "What is a breakpoint?",
      answer: "A point where program execution pauses during debugging",
      acceptedAnswers: ["A place where the debugger stops execution"],
    },
  ],

  checkpointQuestions: [
    {
      question: "How can auto-completion help a programmer?",
      answer: "It suggests or completes code while the programmer types",
      acceptedAnswers: ["It reduces typing", "It can reduce spelling errors"],
    },
  ],

  examQuestion: {
    question:
      "Explain three features of an IDE that can help a programmer develop software.",
    marks: 6,
    answer:
      "Syntax highlighting makes different language elements easier to identify. Auto-completion can suggest valid code and reduce typing. Debugging tools such as breakpoints allow execution to pause so variable values can be inspected.",
    markScheme: [
      "Identifies an appropriate IDE feature.",
      "Explains how the first feature helps.",
      "Identifies a second feature.",
      "Explains how the second feature helps.",
      "Identifies a third feature.",
      "Explains how the third feature helps.",
    ],
    guidance: [
      "Credit editor, syntax highlighting, auto-completion, error diagnostics, translator integration, breakpoints, stepping and variable inspection.",
    ],
  },

  reflectionPrompt:
    "Which IDE feature do you find most useful when programming and why?",
};
