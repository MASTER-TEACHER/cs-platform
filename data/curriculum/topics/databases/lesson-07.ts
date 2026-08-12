import type { Lesson } from "@/types/curriculum";

export const databaseLesson07: Lesson = {
  id: "sql-order-by",
  title: "Sorting Query Results with ORDER BY",
  description: "Arrange SQL query results into ascending or descending order.",
  estimatedTime: "18 mins",
  xpReward: 90,
  simulator: "sql",

  objectives: [
    "Use ORDER BY.",
    "Distinguish ascending and descending order.",
    "Combine filtering and sorting.",
  ],

  explanation:
    "ORDER BY sorts query results. ASC means ascending order and DESC means descending order. If no direction is specified, many database systems use ascending order by default.",

  workedExample:
    "SELECT Name, Score FROM Students ORDER BY Score DESC; displays students from the highest score to the lowest score.",

  practiceQuestions: [
    {
      question: "Which SQL keyword sorts query results?",
      answer: "ORDER BY",
    },
    {
      question: "Which keyword requests descending order?",
      answer: "DESC",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Write SQL to display all Products ordered by Price from lowest to highest.",
      answer: "SELECT * FROM Products ORDER BY Price ASC;",
      acceptedAnswers: [
        "SELECT * FROM Products ORDER BY Price;",
        "SELECT * FROM Products ORDER BY Price ASC",
      ],
    },
  ],

  examQuestion: {
    question:
      "Write SQL to display Name and Points from Players, showing the player with the highest Points first.",
    marks: 4,
    answer: "SELECT Name, Points FROM Players ORDER BY Points DESC;",
    markScheme: [
      "Uses SELECT.",
      "Selects Name and Points.",
      "Uses FROM Players.",
      "Orders Points using DESC.",
    ],
    guidance: ["Credit equivalent valid SQL."],
  },

  reflectionPrompt:
    "Give one situation where descending order would be more useful than ascending order.",
};
