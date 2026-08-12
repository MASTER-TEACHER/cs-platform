import type { Lesson } from "@/types/curriculum";

export const programmingLanguagesLesson08: Lesson = {
  id: "programming-errors",
  title: "Syntax, Runtime and Logic Errors",
  description:
    "Recognise common error types and use debugging techniques to locate and correct faults.",
  estimatedTime: "24 mins",
  xpReward: 120,
  simulator: "debugging",

  objectives: [
    "Define syntax errors.",
    "Define runtime errors.",
    "Define logic errors.",
    "Use debugging techniques to identify errors.",
  ],

  explanation:
    "Programs can contain different types of error. A syntax error breaks the grammatical rules of the programming language and normally prevents correct translation or execution. A runtime error occurs while the program is running, such as attempting an invalid operation. A logic error allows the program to run but produces incorrect behaviour or results. Debugging tools and testing help locate and correct these errors.",

  workedExample:
    "The Python statement if score > 50 print('Pass') contains a syntax error because the required colon is missing. Dividing by zero may cause a runtime error. Using total = price - quantity when multiplication was intended is a logic error because the program can run but produces an incorrect result.",

  practiceQuestions: [
    {
      question:
        "What type of error breaks the grammatical rules of a programming language?",
      answer: "Syntax error",
    },
    {
      question: "What type of error occurs while a program is executing?",
      answer: "Runtime error",
    },
    {
      question:
        "What type of error allows a program to run but produces the wrong result?",
      answer: "Logic error",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "A program calculates an average using total / 5 even when there are 6 values. What type of error is this?",
      answer: "Logic error",
    },
  ],

  examQuestion: {
    question:
      "Describe the difference between syntax, runtime and logic errors.",
    marks: 6,
    answer:
      "A syntax error breaks the rules of the programming language and may prevent the program from being translated or run. A runtime error occurs while the program is executing. A logic error does not necessarily stop execution but causes the program to produce incorrect behaviour or results.",
    markScheme: [
      "Syntax error breaks language rules.",
      "Syntax error may prevent translation or execution.",
      "Runtime error occurs during execution.",
      "Provides or implies a valid runtime-error example.",
      "Logic error allows execution but causes incorrect output or behaviour.",
      "Clearly distinguishes the three categories.",
    ],
    guidance: ["Credit valid examples where they demonstrate understanding."],
  },

  reflectionPrompt:
    "Create one example each of a syntax error, runtime error and logic error in a programming language you know.",
};
