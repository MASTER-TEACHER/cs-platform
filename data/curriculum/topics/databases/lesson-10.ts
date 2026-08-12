import type { Lesson } from "@/types/curriculum";

export const databaseLesson10: Lesson = {
  id: "database-design-challenge",
  title: "Database Design and SQL Challenge",
  description:
    "Combine relational database design and SQL skills to solve a complete GCSE-style problem.",
  estimatedTime: "30 mins",
  xpReward: 140,
  simulator: "sql",

  objectives: [
    "Design related database tables.",
    "Choose suitable primary and foreign keys.",
    "Write SQL queries from requirements.",
    "Evaluate database design choices.",
  ],

  explanation:
    "Good database design begins by identifying the entities that must be stored, their attributes and the relationships between them. Related data should be separated into suitable tables and linked using keys. SQL can then be used to retrieve and analyse the stored information.",

  workedExample:
    "A school library system could contain Books(BookID, Title, Author) and Loans(LoanID, BookID, StudentID, DueDate). BookID is the primary key of Books and appears as a foreign key in Loans.",

  practiceQuestions: [
    {
      question: "Which field should uniquely identify each book?",
      answer: "BookID",
    },
    {
      question: "Why should BookID also appear in the Loans table?",
      answer: "To link each loan to the correct book",
      acceptedAnswers: [
        "It acts as a foreign key",
        "To create a relationship with Books",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question: "Write SQL to display every loan where StudentID is 'S200'.",
      answer: "SELECT * FROM Loans WHERE StudentID = 'S200';",
      acceptedAnswers: ["SELECT * FROM Loans WHERE StudentID='S200';"],
    },
  ],

  examQuestion: {
    question:
      "A shop stores Products(ProductID, Name, Category, Price) and Sales(SaleID, ProductID, Quantity). Explain how these tables are related and write SQL to display the Name and Price of products costing more than 20.",
    marks: 8,
    answer:
      "ProductID is the primary key of Products and appears as a foreign key in Sales, linking each sale to a product. The SQL query is: SELECT Name, Price FROM Products WHERE Price > 20;",
    markScheme: [
      "ProductID identified as the Products primary key.",
      "ProductID identified as a foreign key in Sales.",
      "Explains that the key creates the relationship.",
      "Links each Sale to the appropriate Product.",
      "Uses SELECT.",
      "Selects Name and Price.",
      "Uses FROM Products.",
      "Uses WHERE Price > 20.",
    ],
    guidance: ["Credit equivalent valid relational explanation and SQL."],
  },

  reflectionPrompt:
    "Design a two-table database for a cinema booking system and identify its primary and foreign keys.",
};
