import type { Lesson } from "@/types/curriculum";

export const databaseLesson01: Lesson = {
  id: "database-fundamentals",
  title: "Database Fundamentals",
  description:
    "Understand why databases are used and how structured data is organised.",
  estimatedTime: "18 mins",
  xpReward: 80,
  simulator: "sql",

  objectives: [
    "Define a database.",
    "Explain why databases are used.",
    "Distinguish structured data from unstructured data.",
  ],

  explanation:
    "A database is an organised collection of data that can be stored, searched, updated and managed efficiently. Databases are useful when large amounts of related information must be kept accurately. A school database might store students, classes, attendance and examination results. Structured data follows a defined organisation, such as rows and columns in a table.",

  workedExample:
    "A school could use a database to store each student's name, date of birth, class and examination results. Staff could then search for one student, update a result or produce reports without manually searching through separate files.",

  practiceQuestions: [
    {
      question: "What is a database?",
      answer: "An organised collection of data",
      acceptedAnswers: [
        "A structured collection of data",
        "An organised collection of related data",
      ],
    },
    {
      question: "Give one advantage of storing school data in a database.",
      answer: "Data can be searched efficiently",
      acceptedAnswers: [
        "Data can be updated efficiently",
        "Data can be organised",
        "Data can be queried",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question: "Is a database designed only for storing data?",
      answer: "No",
      acceptedAnswers: ["No, data can also be searched and updated"],
    },
  ],

  examQuestion: {
    question:
      "Explain two reasons why a school might use a database to store student information.",
    marks: 4,
    answer:
      "A database allows staff to search for student information quickly. It also allows records to be updated consistently without maintaining multiple separate copies of the same data.",
    markScheme: [
      "Identifies a valid database benefit.",
      "Develops the first benefit.",
      "Identifies a second valid benefit.",
      "Develops the second benefit.",
    ],
    guidance: [
      "Credit valid references to searching, updating, consistency, security or reporting.",
    ],
  },

  reflectionPrompt:
    "Identify three types of information your school could store in a database.",
};
