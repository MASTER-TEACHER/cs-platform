import type { GCSEPracticeQuestion } from "./types";

export const gcseDatabaseQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-databases-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Database concepts",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Define field, record, table and database.",
    "markPoints": [
      "Field is one attribute/item of data",
      "Record is collection of fields about one entity",
      "Table stores related records",
      "Database is organised collection of related data/tables"
    ],
    "modelAnswer": "A field stores one attribute, a record groups fields for one entity, a table stores related records, and a database is an organised collection of related data.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "field",
      "record",
      "table",
      "database"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Primary key",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain why a StudentID is a better primary key than a student's surname.",
    "markPoints": [
      "Primary key uniquely identifies record",
      "StudentID can be unique",
      "Surnames can be duplicated"
    ],
    "modelAnswer": "A primary key must uniquely identify each record. StudentID can be assigned uniquely, whereas several students may share the same surname.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "primary key"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Data types",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "Choose suitable database data types for StudentID 1042, surname 'Khan', averageMark 67.5 and hasConsent TRUE.",
    "markPoints": [
      "Integer for StudentID",
      "String/text for surname",
      "Real/decimal for averageMark",
      "Boolean for hasConsent"
    ],
    "modelAnswer": "Suitable types are integer, text/string, real/decimal and Boolean respectively.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "database",
      "data type"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL SELECT",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "programming",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Write SQL to display every field from a table called Students.",
    "markPoints": [
      "SELECT keyword",
      "*",
      "FROM Students"
    ],
    "modelAnswer": "SELECT * FROM Students;",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "select"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL WHERE",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 4,
    "question": "Write SQL to display Name and Score from Students for records with Score at least 70.",
    "markPoints": [
      "SELECT Name, Score",
      "FROM Students",
      "WHERE Score >= 70",
      "Correct complete query"
    ],
    "modelAnswer": "SELECT Name, Score FROM Students WHERE Score >= 70;",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "where"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL ORDER BY",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 4,
    "question": "Write SQL to display Name and Score from Students with the highest scores first.",
    "markPoints": [
      "SELECT required fields",
      "FROM Students",
      "ORDER BY Score",
      "DESC"
    ],
    "modelAnswer": "SELECT Name, Score FROM Students ORDER BY Score DESC;",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "order by"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL compound criteria",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write SQL to display Name from Students where YearGroup is 11 and Score is below 50.",
    "markPoints": [
      "SELECT Name",
      "FROM Students",
      "YearGroup = 11",
      "Score < 50",
      "AND combines conditions"
    ],
    "modelAnswer": "SELECT Name FROM Students WHERE YearGroup = 11 AND Score < 50;",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "and",
      "where"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL INSERT",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write SQL to insert StudentID 205, Name 'Asha' and Score 74 into Students(StudentID, Name, Score).",
    "markPoints": [
      "INSERT INTO Students",
      "Column list correct",
      "VALUES keyword",
      "Values correspond to columns",
      "Strings quoted appropriately"
    ],
    "modelAnswer": "INSERT INTO Students (StudentID, Name, Score) VALUES (205, 'Asha', 74);",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "insert"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL UPDATE",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write SQL to change the Score to 81 for the student whose StudentID is 205.",
    "markPoints": [
      "UPDATE Students",
      "SET Score = 81",
      "WHERE clause",
      "StudentID = 205",
      "Does not update every record"
    ],
    "modelAnswer": "UPDATE Students SET Score = 81 WHERE StudentID = 205;",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "update"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL DELETE",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write SQL to delete only the student whose StudentID is 205.",
    "markPoints": [
      "DELETE FROM Students",
      "WHERE clause",
      "StudentID = 205",
      "Correct syntax",
      "Recognises WHERE prevents all rows being deleted"
    ],
    "modelAnswer": "DELETE FROM Students WHERE StudentID = 205;",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "delete"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL interpretation",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "A table Books has fields Title, Genre and Price. Explain the result of `SELECT Title FROM Books WHERE Genre='Science' ORDER BY Price ASC;`",
    "markPoints": [
      "Returns Title only",
      "Uses Books table",
      "Only Science records",
      "Ordered by Price",
      "ASC means lowest price first"
    ],
    "modelAnswer": "The query returns only the Title field for books whose Genre is Science, ordered from the lowest Price to the highest.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "select",
      "order by"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Validation",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "A database field stores an exam mark from 0 to 100. Explain a suitable validation check and what it can and cannot guarantee.",
    "markPoints": [
      "Range check 0–100",
      "Rejects values outside range",
      "Can ensure sensible format/range",
      "Cannot guarantee a valid in-range value is factually correct"
    ],
    "modelAnswer": "A range check can require 0 <= mark <= 100. It prevents out-of-range values but cannot prove that an accepted value, such as 72, is the student's actual mark.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "validation",
      "range check"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Relational databases",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "A school stores Students and Classes in separate related tables. Explain two benefits of this design compared with repeatedly storing full class details in every student record.",
    "markPoints": [
      "Reduces duplicated class data",
      "Changes made once",
      "Can improve consistency",
      "Relationship made using key",
      "Supports structured queries"
    ],
    "modelAnswer": "Storing class details once reduces duplication and the risk of inconsistent copies. Student records can reference the relevant class using a key, so a class detail can be updated in one place.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "relational",
      "key"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Foreign key",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "Students contains ClassID and Classes uses ClassID as its primary key. Explain the role of ClassID in Students.",
    "markPoints": [
      "It is a foreign key in Students",
      "References primary key in Classes",
      "Links each student to a class",
      "Supports relationship/join concept"
    ],
    "modelAnswer": "ClassID in Students is a foreign key referencing the ClassID primary key in Classes, linking each student record to the appropriate class.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "foreign key",
      "primary key"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL injection",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Explain why parameterised SQL queries are safer than concatenating raw user input into a query.",
    "markPoints": [
      "Concatenation can treat input as SQL syntax",
      "Crafted input can alter query",
      "Parameterisation separates code/query from data",
      "Input treated as value",
      "Reduces SQL injection risk",
      "Can combine with validation/least privilege"
    ],
    "modelAnswer": "Concatenating raw input can allow attacker-controlled text to become part of the SQL command. Parameterised queries send the SQL structure separately from values, so user input is treated as data rather than executable SQL syntax.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql injection",
      "parameterised"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Database design",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A table stores StudentID, StudentName, TutorName, TutorEmail for every student. Many students share the same tutor. Explain a better relational design.",
    "markPoints": [
      "Separate Students table",
      "Separate Tutors table",
      "Tutor details stored once",
      "TutorID primary key in Tutors",
      "TutorID foreign key in Students",
      "Reduces duplication/inconsistency"
    ],
    "modelAnswer": "Create a Tutors table with TutorID, TutorName and TutorEmail, and store TutorID as a foreign key in Students. Tutor details are then stored once rather than repeated for every student.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "relational",
      "normalisation"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL debugging",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "debugging",
    "difficulty": "standard",
    "marks": 5,
    "question": "A programmer writes `SELECT Name Score Students WHERE Score > 50;`. Identify the SQL syntax problems and give a corrected query.",
    "markPoints": [
      "Comma between selected fields",
      "FROM keyword required",
      "Correct table placement",
      "WHERE clause valid",
      "Corrected full query"
    ],
    "modelAnswer": "The query needs a comma and FROM: `SELECT Name, Score FROM Students WHERE Score > 50;`",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "debugging"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "SQL update safety",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A programmer runs `UPDATE Students SET YearGroup = 11;` when intending to update one student. Explain the consequence and how to prevent it.",
    "markPoints": [
      "Without WHERE every row is targeted",
      "All students' YearGroup becomes 11",
      "Use WHERE with unique identifier",
      "Test/preview condition or transaction/backup",
      "Primary key suitable criterion",
      "Reasoned prevention"
    ],
    "modelAnswer": "Because there is no WHERE clause, every record is updated. The programmer should target the required primary key, for example `WHERE StudentID = ...`, and should verify the condition or use transaction/backup safeguards before a bulk change.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "sql",
      "update",
      "where"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Database backup",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why a school database should be backed up even if user accounts have strong passwords.",
    "markPoints": [
      "Passwords reduce unauthorised access but not all loss",
      "Hardware/software failure can lose data",
      "Malware/human error can damage/delete data",
      "Backup supports recovery"
    ],
    "modelAnswer": "Strong passwords help prevent unauthorised access but do not protect against hardware failure, accidental deletion or all malware. Backups provide a separate recovery copy.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "database",
      "backup"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  },
  {
    "id": "gcse-databases-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "databases",
    "topicTitle": "Databases & SQL",
    "subtopic": "Databases",
    "specificationReferences": [
      "AQA 3.7 Relational databases and SQL",
      "OCR J277 1.3/2.2 data and programming contexts",
      "Pearson GCSE Computer Science - Data and SQL"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 7,
    "question": "A school is replacing spreadsheets with a relational database for thousands of student records. Evaluate the benefits and issues it should consider.",
    "markPoints": [
      "Structured tables/relationships",
      "Reduced duplication/consistency",
      "Queries can retrieve/filter data",
      "Validation/access control benefits",
      "Migration/data-quality challenge",
      "Security/backup/privacy requirements",
      "Balanced conclusion"
    ],
    "modelAnswer": "A relational database can reduce duplicated data, enforce structured relationships and support efficient queries and validation. The school must migrate and clean existing data, configure permissions and backups, and protect sensitive information. For thousands of related records, these controls generally make a database more appropriate than disconnected spreadsheets.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "database",
      "relational"
    ],
    "curriculumAreaIds": [
      "databases"
    ]
  }
];
