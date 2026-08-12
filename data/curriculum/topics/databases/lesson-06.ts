import type { Lesson } from "@/types/curriculum";

export const databaseLesson06: Lesson = {
  id: "sql-where",
  title: "SQL WHERE",
  description:
    "Filter database records using conditions and comparison operators.",
  estimatedTime: "22 mins",
  xpReward: 105,
  simulator: "sql",

  objectives: [
    "Use WHERE to filter records.",
    "Apply comparison operators.",
    "Combine SELECT, FROM and WHERE.",
  ],

  explanation:
    "A WHERE clause filters records according to a condition. Comparison operators such as =, >, <, >= and <= can be used. Text values are normally written inside quotation marks.",

  workedExample:
    "SELECT Name, Score FROM Students WHERE Score >= 70; returns the Name and Score of students whose score is at least 70.",

  practiceQuestions: [
    {
      question: "Which SQL clause is used to filter records?",
      answer: "WHERE",
    },
    {
      question: "Write a condition that selects values of Age greater than 16.",
      answer: "Age > 16",
      acceptedAnswers: ["WHERE Age > 16"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Write SQL to return all records from Products where Price is below 10.",
      answer: "SELECT * FROM Products WHERE Price < 10;",
      acceptedAnswers: ["SELECT * FROM Products WHERE Price < 10"],
    },
  ],

  examQuestion: {
    question:
      "Write SQL that displays FirstName and Surname from Students for students in tutor group '10A'.",
    marks: 4,
    answer: "SELECT FirstName, Surname FROM Students WHERE TutorGroup = '10A';",
    markScheme: [
      "Uses SELECT.",
      "Selects FirstName and Surname.",
      "Uses FROM Students.",
      "Correct WHERE condition for TutorGroup 10A.",
    ],
    guidance: ["Credit equivalent valid quoting syntax."],
  },

  reflectionPrompt:
    "Explain why WHERE Score = 50 and WHERE Score >= 50 may produce different result sets.",
};
