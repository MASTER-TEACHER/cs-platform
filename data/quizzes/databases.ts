import { Quiz } from "@/types/quiz";

export const databasesQuiz: Quiz = {
  id: "databases-quiz",
  topicId: "databases",
  title: "Databases and SQL Quiz",
  description: "Test your understanding of tables, records, fields, keys, validation and common SQL queries.",
  estimatedTime: "8 mins",
  questions: [
    { id: "databases-q1", type: "multipleChoice", question: "What is a record in a database table?", options: ["A complete set of fields describing one entity or item", "The database name only", "A network address", "A CPU instruction"], correctAnswer: "A complete set of fields describing one entity or item", explanation: "A record is a row containing related fields for one item.", xpReward: 10 },
    { id: "databases-q2", type: "multipleChoice", question: "What is a field?", options: ["A single category or attribute stored for records", "A complete database server", "A compression method", "A logic gate"], correctAnswer: "A single category or attribute stored for records", explanation: "Fields are columns that store attributes such as Name or Score.", xpReward: 10 },
    { id: "databases-q3", type: "multipleChoice", question: "What is the purpose of a primary key?", options: ["To uniquely identify each record", "To encrypt every field", "To calculate averages automatically", "To compress the table"], correctAnswer: "To uniquely identify each record", explanation: "A primary key uniquely identifies each row.", xpReward: 10 },
    { id: "databases-q4", type: "trueFalse", question: "Validation can help prevent unsuitable data from being entered into a database.", options: ["True", "False"], correctAnswer: "True", explanation: "Validation rules can check data against constraints.", xpReward: 10 },
    { id: "databases-q5", type: "multipleChoice", question: "Which SQL command is used to retrieve data?", options: ["SELECT", "DELETE", "UPDATE", "INSERT"], correctAnswer: "SELECT", explanation: "SELECT retrieves records and fields from tables.", xpReward: 10 },
    { id: "databases-q6", type: "multipleChoice", question: "Which SQL clause filters rows that meet a condition?", options: ["WHERE", "FROM", "SELECT", "TABLE"], correctAnswer: "WHERE", explanation: "WHERE specifies the condition records must satisfy.", xpReward: 10 },
    { id: "databases-q7", type: "shortAnswer", question: "Complete the SQL keyword: SELECT * ____ Students;", correctAnswer: "FROM", explanation: "FROM identifies the table to query.", xpReward: 10 },
    { id: "databases-q8", type: "multipleChoice", question: "What is a relational database?", options: ["A database that stores related data in tables linked by keys", "A database that can store only one record", "A collection of pixels", "A network topology"], correctAnswer: "A database that stores related data in tables linked by keys", explanation: "Relational databases use tables and keys to represent relationships.", xpReward: 10 },
  ],
};
