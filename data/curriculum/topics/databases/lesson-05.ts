import type { Lesson } from "@/types/curriculum";

export const databaseLesson05: Lesson = {
  id: "sql-select",
  title: "SQL SELECT and FROM",
  description: "Retrieve fields and records from relational database tables.",
  estimatedTime: "22 mins",
  xpReward: 100,
  simulator: "sql",

  objectives: [
    "Explain the purpose of SQL.",
    "Use SELECT and FROM.",
    "Retrieve one or more database fields.",
  ],

  explanation:
    "SQL stands for Structured Query Language. SQL can be used to retrieve and manipulate data stored in relational databases. SELECT specifies the fields to retrieve and FROM identifies the table.",

  workedExample:
    "SELECT FirstName, Surname FROM Students; returns the FirstName and Surname fields for every record in the Students table.",

  practiceQuestions: [
    {
      question:
        "Which SQL keyword identifies the fields that should be returned?",
      answer: "SELECT",
    },
    {
      question: "Which SQL keyword identifies the table being queried?",
      answer: "FROM",
    },
  ],

  checkpointQuestions: [
    {
      question: "Write SQL to display every field from a table called Games.",
      answer: "SELECT * FROM Games;",
      acceptedAnswers: ["SELECT * FROM Games", "select * from Games;"],
    },
  ],

  examQuestion: {
    question:
      "Write SQL that displays the Title and Author fields from a table called Books.",
    marks: 3,
    answer: "SELECT Title, Author FROM Books;",
    markScheme: [
      "Uses SELECT.",
      "Selects Title and Author.",
      "Uses FROM Books.",
    ],
    guidance: [
      "Do not penalise missing semicolon unless required by the examination convention.",
    ],
  },

  reflectionPrompt:
    "Explain the difference between SELECT * and selecting named fields.",
};
