import type { Lesson } from "@/types/curriculum";

export const databaseLesson08: Lesson = {
  id: "sql-aggregate-functions",
  title: "SQL Aggregate Functions",
  description:
    "Calculate useful summary values using COUNT, SUM, AVG, MIN and MAX.",
  estimatedTime: "22 mins",
  xpReward: 105,
  simulator: "sql",

  objectives: [
    "Use COUNT, SUM and AVG.",
    "Use MIN and MAX.",
    "Explain what aggregate functions return.",
  ],

  explanation:
    "Aggregate functions perform calculations across multiple database records. COUNT counts records or values, SUM adds numeric values, AVG calculates a mean, MIN returns the smallest value and MAX returns the largest value.",

  workedExample:
    "SELECT AVG(Score) FROM Students; calculates the mean value stored in the Score field.",

  practiceQuestions: [
    {
      question: "Which aggregate function calculates the average?",
      answer: "AVG",
      acceptedAnswers: ["AVG()"],
    },
    {
      question: "Which function returns the largest value?",
      answer: "MAX",
      acceptedAnswers: ["MAX()"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Write SQL to calculate the number of records in a table called Orders.",
      answer: "SELECT COUNT(*) FROM Orders;",
      acceptedAnswers: ["SELECT COUNT(*) FROM Orders"],
    },
  ],

  examQuestion: {
    question:
      "Write SQL to calculate the average Price of products stored in the Products table.",
    marks: 3,
    answer: "SELECT AVG(Price) FROM Products;",
    markScheme: ["Uses SELECT.", "Uses AVG on Price.", "Uses FROM Products."],
    guidance: ["Credit equivalent valid SQL syntax."],
  },

  reflectionPrompt:
    "Explain why AVG would be more useful than SUM when comparing examination performance between two classes of different sizes.",
};
