import type { Lesson } from "@/types/curriculum";

export const databaseLesson04: Lesson = {
  id: "foreign-keys-relationships",
  title: "Foreign Keys and Relationships",
  description:
    "Connect related database tables using primary and foreign keys.",
  estimatedTime: "22 mins",
  xpReward: 100,
  simulator: "sql",

  objectives: [
    "Define a foreign key.",
    "Explain how tables are related.",
    "Recognise one-to-many relationships.",
  ],

  explanation:
    "A foreign key is a field in one table that refers to the primary key of another table. Foreign keys allow related data to be stored in separate tables without repeatedly copying the same information. A common relationship is one-to-many, where one record in the first table can be linked to many records in another.",

  workedExample:
    "A Customers table could use CustomerID as its primary key. An Orders table could contain CustomerID as a foreign key. One customer can then be linked to many orders.",

  practiceQuestions: [
    {
      question: "What does a foreign key reference?",
      answer: "A primary key in another table",
      acceptedAnswers: ["The primary key of another table", "A primary key"],
    },
    {
      question:
        "What type of relationship exists when one customer can place many orders?",
      answer: "One-to-many",
      acceptedAnswers: ["One to many"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "If StudentID is the primary key in Students, can StudentID appear as a foreign key in Results?",
      answer: "Yes",
    },
  ],

  examQuestion: {
    question:
      "Explain how primary and foreign keys could link a Students table to a Results table.",
    marks: 4,
    answer:
      "StudentID can be the primary key in Students. StudentID is stored as a foreign key in Results. Each result can then be linked to the correct student without copying all of the student's personal information.",
    markScheme: [
      "StudentID identified as the Students primary key.",
      "StudentID appears in Results.",
      "It acts as a foreign key.",
      "The key links each result to the appropriate student.",
    ],
    guidance: ["Credit a clear equivalent relational design."],
  },

  reflectionPrompt:
    "Explain why storing a student's full address in every Results record would be poor database design.",
};
