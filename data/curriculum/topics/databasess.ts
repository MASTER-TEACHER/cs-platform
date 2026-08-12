import type { Topic } from "@/types/curriculum";

export const databasesTopic: Topic = {
  id: "databases",
  title: "Databases and SQL",
  description:
    "Understand relational databases, keys, relationships, validation, SQL and normalisation.",
  difficulty: "⭐⭐☆",
  estimatedTime: "110 mins",
  simulator: "database",
  status: "published",
  unit: "Databases",
  specificationReferences: ["AQA 3.7"],
  lessons: [
    {
      id: "database-basics",
      title: "Tables, Records and Fields",
      description: "Understand how structured data is organised.",
      estimatedTime: "18 mins",
      xpReward: 80,
      simulator: "database",
      objectives: [
        "Define table, record and field.",
        "Select suitable data types.",
        "Explain why structured data is useful.",
      ],
      explanation:
        "A relational database stores data in tables. A field is one category of data and a record contains all field values for one entity.",
      workedExample:
        "A Student table could contain StudentID, FirstName, Surname and YearGroup. Each row is one student record.",
      practiceQuestions: [
        {
          question: "What is a record?",
          answer: "A complete set of field values for one entity",
          acceptedAnswers: ["One row in a table", "All data about one item"],
        },
        {
          question: "What is a field?",
          answer: "One category or attribute of data",
          acceptedAnswers: ["A column in a table"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Which data type is suitable for a true-or-false field?",
          answer: "Boolean",
        },
      ],
      examQuestion: {
        question: "Explain the difference between a field and a record.",
        marks: 4,
        answer:
          "A field stores one category of data and is represented by a column. A record stores all field values for one entity and is represented by a row.",
        markScheme: [
          "Field is one category or attribute.",
          "Field is represented by a column.",
          "Record contains all data for one entity.",
          "Record is represented by a row.",
        ],
      },
      reflectionPrompt:
        "Design suitable fields and data types for a book-loan table.",
    },
    {
      id: "keys-relationships",
      title: "Primary Keys, Foreign Keys and Relationships",
      description: "Link related tables using unique identifiers.",
      estimatedTime: "22 mins",
      xpReward: 95,
      simulator: "entity-relationship",
      objectives: [
        "Define primary and foreign keys.",
        "Identify one-to-many relationships.",
        "Explain referential integrity.",
      ],
      explanation:
        "A primary key uniquely identifies each record. A foreign key stores a matching primary-key value from another table. This creates relationships between records.",
      workedExample:
        "CustomerID is the primary key in Customer and appears as a foreign key in Order.",
      practiceQuestions: [
        {
          question: "What is the purpose of a primary key?",
          answer: "To uniquely identify each record",
        },
        {
          question: "What does a foreign key reference?",
          answer: "A primary key in another table",
        },
      ],
      checkpointQuestions: [
        {
          question: "Can primary-key values be duplicated?",
          answer: "No",
        },
      ],
      examQuestion: {
        question: "Explain how primary and foreign keys create a relationship.",
        marks: 4,
        answer:
          "The primary key uniquely identifies a record in the first table. A matching foreign-key value in the second table links its record to that first record.",
        markScheme: [
          "Primary key uniquely identifies.",
          "Foreign key appears in related table.",
          "Matching values are stored.",
          "Matching values link records.",
        ],
      },
      reflectionPrompt:
        "Explain why names are usually unsuitable as primary keys.",
    },
    {
      id: "normalisation",
      title: "Normalisation",
      description: "Reduce duplication and improve data consistency.",
      estimatedTime: "18 mins",
      xpReward: 90,
      simulator: "entity-relationship",
      objectives: [
        "Explain data redundancy.",
        "Describe update anomalies.",
        "Explain why data is split into related tables.",
      ],
      explanation:
        "Normalisation reorganises data to reduce unnecessary duplication, improve consistency and avoid update anomalies.",
      workedExample:
        "Customer details are stored once in Customer, while each Order stores only CustomerID.",
      practiceQuestions: [
        {
          question: "What is data redundancy?",
          answer: "Unnecessary duplication of data",
        },
        {
          question: "Give one benefit of normalisation.",
          answer: "It reduces duplicated data",
          acceptedAnswers: ["It improves consistency", "It reduces anomalies"],
        },
      ],
      checkpointQuestions: [
        {
          question: "What is an update anomaly?",
          answer:
            "A problem caused when duplicated data is updated inconsistently",
        },
      ],
      examQuestion: {
        question:
          "Explain why customer and order data should be stored in separate related tables.",
        marks: 5,
        answer:
          "One customer can place many orders. Storing customer details once reduces duplication. Orders store CustomerID as a foreign key, improving consistency and maintenance.",
        markScheme: [
          "Recognises one-to-many relationship.",
          "Reduces duplication.",
          "Uses separate Customer table.",
          "Uses CustomerID as foreign key.",
          "Improves consistency or maintenance.",
        ],
      },
      reflectionPrompt:
        "Explain how duplicated addresses can create an update anomaly.",
    },
    {
      id: "sql-select",
      title: "SQL SELECT Queries",
      description: "Retrieve, filter and sort data.",
      estimatedTime: "22 mins",
      xpReward: 105,
      simulator: "sql",
      objectives: [
        "Use SELECT and FROM.",
        "Filter using WHERE.",
        "Sort using ORDER BY.",
      ],
      explanation:
        "SELECT chooses fields, FROM identifies the table, WHERE filters records and ORDER BY sorts the result.",
      workedExample:
        "SELECT Name, Score FROM Student WHERE Score >= 70 ORDER BY Score DESC;",
      practiceQuestions: [
        { question: "Which keyword identifies the table?", answer: "FROM" },
        { question: "Which keyword filters records?", answer: "WHERE" },
      ],
      checkpointQuestions: [
        { question: "Which keyword sorts query results?", answer: "ORDER BY" },
      ],
      examQuestion: {
        question:
          "Write SQL to display Name and Score from Student for scores of at least 60, highest first.",
        marks: 5,
        answer:
          "SELECT Name, Score FROM Student WHERE Score >= 60 ORDER BY Score DESC;",
        markScheme: [
          "Uses SELECT.",
          "Selects Name and Score.",
          "Uses FROM Student.",
          "Uses WHERE Score >= 60.",
          "Uses ORDER BY Score DESC.",
        ],
      },
      reflectionPrompt:
        "Explain the difference between selecting fields and filtering records.",
    },
    {
      id: "sql-modification-validation",
      title: "SQL Modification and Data Integrity",
      description: "Modify records safely and protect data quality.",
      estimatedTime: "22 mins",
      xpReward: 105,
      simulator: "sql",
      objectives: [
        "Describe INSERT, UPDATE and DELETE.",
        "Explain validation checks.",
        "Explain referential integrity.",
      ],
      explanation:
        "INSERT adds records, UPDATE changes records and DELETE removes them. WHERE should be tested carefully. Validation checks data against rules, while referential integrity prevents invalid foreign-key relationships.",
      workedExample: "UPDATE Student SET Score = 75 WHERE StudentID = 104;",
      practiceQuestions: [
        { question: "Which command adds a record?", answer: "INSERT" },
        {
          question: "Why is WHERE important in UPDATE?",
          answer: "It limits which records are changed",
        },
      ],
      checkpointQuestions: [
        {
          question: "What does referential integrity prevent?",
          answer: "Foreign keys referring to non-existent records",
        },
      ],
      examQuestion: {
        question:
          "Explain why WHERE and validation are important when changing database data.",
        marks: 4,
        answer:
          "WHERE limits changes to intended records. Validation prevents unsuitable values being accepted, reducing unintended changes and improving data quality.",
        markScheme: [
          "WHERE identifies affected records.",
          "Missing or incorrect WHERE can affect many records.",
          "Validation checks data against rules.",
          "Validation improves data quality.",
        ],
      },
      reflectionPrompt: "Describe a safe process for deleting old records.",
    },
  ],
};
