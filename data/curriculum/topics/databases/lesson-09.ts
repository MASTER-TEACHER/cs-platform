import type { Lesson } from "@/types/curriculum";

export const databaseLesson09: Lesson = {
  id: "database-crud",
  title: "Creating and Modifying Database Records",
  description:
    "Understand CRUD operations and how database records are created, updated and deleted.",
  estimatedTime: "22 mins",
  xpReward: 105,
  simulator: "sql",

  objectives: [
    "Define CRUD.",
    "Explain create, read, update and delete operations.",
    "Recognise SQL used to modify stored data.",
  ],

  explanation:
    "CRUD describes four fundamental data operations: Create, Read, Update and Delete. SQL commonly uses INSERT to create new records, SELECT to read records, UPDATE to modify existing records and DELETE to remove records. Modification commands should use conditions carefully to avoid changing unintended records.",

  workedExample:
    "UPDATE Students SET TutorGroup = '10B' WHERE StudentID = 'S104'; changes the tutor group only for the student whose ID is S104.",

  practiceQuestions: [
    {
      question: "What does the R in CRUD represent?",
      answer: "Read",
    },
    {
      question:
        "Which SQL command is normally used to change an existing record?",
      answer: "UPDATE",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why is a WHERE clause especially important when using UPDATE or DELETE?",
      answer: "Without it multiple unintended records may be changed",
      acceptedAnswers: [
        "It restricts which records are changed",
        "Otherwise every record may be affected",
      ],
    },
  ],

  examQuestion: {
    question:
      "Explain why the following command could be dangerous: DELETE FROM Students;",
    marks: 3,
    answer:
      "The command contains no WHERE clause, so it could delete every record from the Students table instead of removing one selected student.",
    markScheme: [
      "Identifies the missing WHERE condition.",
      "States that the command affects more than one record.",
      "Explains that all Students records could be deleted.",
    ],
    guidance: ["Credit clear explanation of unintended mass deletion."],
  },

  reflectionPrompt:
    "Describe one safety check a system should perform before permanently deleting a database record.",
};
