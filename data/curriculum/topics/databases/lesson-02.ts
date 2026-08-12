import type { Lesson } from "@/types/curriculum";

export const databaseLesson02: Lesson = {
  id: "tables-records-fields",
  title: "Tables, Records and Fields",
  description:
    "Learn how relational databases organise data into tables, records and fields.",
  estimatedTime: "18 mins",
  xpReward: 85,
  simulator: "sql",

  objectives: [
    "Define a database table.",
    "Distinguish records from fields.",
    "Choose suitable fields for a table.",
  ],

  explanation:
    "A relational database stores related data in tables. A field represents one attribute, such as StudentName or DateOfBirth. A record contains all the field values describing one individual item or entity. Each row normally represents one record and each column normally represents one field.",

  workedExample:
    "A Students table could contain StudentID, FirstName, Surname and TutorGroup. One row containing S104, Maya, Jones and 10A is one student record.",

  practiceQuestions: [
    {
      question: "What does a field represent?",
      answer: "One attribute of an entity",
      acceptedAnswers: ["One category of data", "A column in a database table"],
    },
    {
      question: "What does one row normally represent?",
      answer: "A record",
      acceptedAnswers: ["One database record"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "In a Students table, is DateOfBirth more likely to be a field or a record?",
      answer: "Field",
    },
  ],

  examQuestion: {
    question:
      "A database stores information about books in a library. Explain the difference between a field and a record using this database.",
    marks: 4,
    answer:
      "A field represents one attribute, such as BookTitle or Author. A record contains all the stored field values for one book.",
    markScheme: [
      "Field described as an attribute or category.",
      "Provides a suitable field example.",
      "Record described as information about one item.",
      "Relates the record to one book.",
    ],
    guidance: ["Credit equivalent relational database terminology."],
  },

  reflectionPrompt:
    "Design five suitable fields for a database table containing video games.",
};
