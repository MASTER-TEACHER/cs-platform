import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson03: Lesson = {
  id: "user-interfaces",
  title: "User Interfaces",
  description:
    "Compare graphical, command-line and other ways users interact with computer systems.",
  estimatedTime: "20 mins",
  xpReward: 90,
  simulator: "operating-system",

  objectives: [
    "Define a user interface.",
    "Compare graphical and command-line interfaces.",
    "Select an appropriate interface for a scenario.",
  ],

  explanation:
    "A user interface allows a person to communicate with a computer system. A graphical user interface, or GUI, uses visual elements such as windows, icons, menus and pointers. A command-line interface, or CLI, requires users to type commands. GUIs are usually easier for inexperienced users, while command-line interfaces can be powerful and efficient for experienced users and automation.",

  workedExample:
    "A home computer may use a GUI because users can navigate visually. A network administrator may use a CLI to configure many machines efficiently using commands and scripts.",

  practiceQuestions: [
    {
      question: "What does GUI stand for?",
      answer: "Graphical user interface",
    },
    {
      question: "Give one advantage of a command-line interface.",
      answer: "Commands can be executed efficiently",
      acceptedAnswers: [
        "It uses fewer system resources",
        "It can be automated",
        "Experienced users can work quickly",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Which interface would normally be easier for a novice user: GUI or CLI?",
      answer: "GUI",
    },
  ],

  examQuestion: {
    question:
      "A server administrator regularly performs the same management tasks on hundreds of computers. Explain why a command-line interface may be more suitable than a graphical user interface.",
    marks: 4,
    answer:
      "A command-line interface allows commands to be entered quickly and can support scripts or automation. Repeated tasks can therefore be performed efficiently across many systems without manually navigating graphical menus.",
    markScheme: [
      "CLI allows typed commands.",
      "Commands can be executed efficiently.",
      "Tasks can be automated or scripted.",
      "Links automation or efficiency to managing many computers.",
    ],
    guidance: ["Credit other scenario-specific valid advantages."],
  },

  reflectionPrompt:
    "Describe one situation where a GUI would be preferable and one where a CLI would be preferable.",
};
