import type { Lesson } from "@/types/curriculum";

export const databaseLesson03: Lesson = {
  id: "primary-keys",
  title: "Primary Keys",
  description: "Use primary keys to uniquely identify database records.",
  estimatedTime: "18 mins",
  xpReward: 90,
  simulator: "sql",

  objectives: [
    "Define a primary key.",
    "Explain why primary keys must be unique.",
    "Select suitable primary keys.",
  ],

  explanation:
    "A primary key is a field, or sometimes a combination of fields, that uniquely identifies each record in a table. Primary-key values must not be duplicated. A student ID is normally better than a student name because two students could have the same name.",

  workedExample:
    "StudentID is a suitable primary key for a Students table because every student receives a unique identifier. Surname would be unsuitable because several students may share the same surname.",

  practiceQuestions: [
    {
      question: "What property must every primary-key value have?",
      answer: "It must be unique",
      acceptedAnswers: ["Unique", "It cannot be duplicated"],
    },
    {
      question:
        "Why is StudentID normally better than StudentName as a primary key?",
      answer: "Student names may be duplicated",
      acceptedAnswers: [
        "StudentID is unique",
        "Two students can have the same name",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question: "Can two records have the same primary-key value?",
      answer: "No",
    },
  ],

  examQuestion: {
    question:
      "Explain why EmailAddress may be more suitable than Surname as a primary key for a customer table.",
    marks: 3,
    answer:
      "A primary key must uniquely identify each record. Different customers may share a surname, while an email address can be required to be unique.",
    markScheme: [
      "Primary key uniquely identifies a record.",
      "Surname may contain duplicates.",
      "Email address can be unique for each customer.",
    ],
    guidance: ["Credit clear references to uniqueness."],
  },

  reflectionPrompt:
    "Choose a suitable primary key for a table containing school classrooms and justify your answer.",
};
