import type { GCSEPracticeQuestion } from "./types";

export const gcseProgrammingQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-programming-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Data types",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Choose a suitable data type for each value: number of students, whether a user is logged in, a student's surname, and a temperature of 18.5°C.",
    "markPoints": [
      "Integer",
      "Boolean",
      "String",
      "Real/float"
    ],
    "modelAnswer": "Integer, Boolean, string and real/float respectively.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "data type"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Variables and constants",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "explain",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain the difference between a variable and a constant, giving one suitable example of each.",
    "markPoints": [
      "Variable can change during execution",
      "Constant is intended not to change",
      "Suitable examples"
    ],
    "modelAnswer": "A variable stores a value that may change, such as score. A constant stores a value intended to remain fixed, such as VAT_RATE.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "variable",
      "constant"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Selection",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write pseudocode that inputs an age and outputs 'Child' for under 13, 'Teen' for 13 to 17 inclusive, and 'Adult' for 18 or over.",
    "markPoints": [
      "Input age",
      "Under-13 condition",
      "13–17 branch",
      "18+ branch",
      "Correct outputs"
    ],
    "modelAnswer": "INPUT age\nIF age < 13 THEN\n  OUTPUT 'Child'\nELSE IF age <= 17 THEN\n  OUTPUT 'Teen'\nELSE\n  OUTPUT 'Adult'\nENDIF",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "selection",
      "if"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Iteration",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write pseudocode that inputs five temperatures and outputs the highest temperature entered.",
    "markPoints": [
      "Initialise highest from an input",
      "Repeat for remaining inputs",
      "Input each temperature",
      "Compare/update highest",
      "Output highest"
    ],
    "modelAnswer": "INPUT temperature\nSET highest TO temperature\nFOR i <- 2 TO 5\n  INPUT temperature\n  IF temperature > highest THEN SET highest TO temperature ENDIF\nENDFOR\nOUTPUT highest",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "iteration",
      "maximum"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "DIV and MOD",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "calculation",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Calculate 29 DIV 6 and 29 MOD 6. Explain what each result represents.",
    "markPoints": [
      "DIV result 4",
      "MOD result 5",
      "DIV is integer quotient and MOD is remainder"
    ],
    "modelAnswer": "29 DIV 6 = 4 and 29 MOD 6 = 5. DIV gives the whole-number quotient and MOD gives the remainder.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "div",
      "mod"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Boolean conditions",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "trace",
    "difficulty": "foundation",
    "marks": 4,
    "question": "For score = 72 and attendance = 88, determine the value of `(score >= 60) AND (attendance >= 90)` and explain your answer.",
    "markPoints": [
      "score condition is true",
      "attendance condition is false",
      "true AND false is false",
      "Final result false"
    ],
    "modelAnswer": "score >= 60 is true, attendance >= 90 is false, and true AND false evaluates to false.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "boolean",
      "and",
      "condition"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Arrays",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 6,
    "question": "An array scores contains 20 integers. Write pseudocode to count how many scores are at least 50.",
    "markPoints": [
      "Initialise counter",
      "Traverse array",
      "Access each element",
      "Test >= 50",
      "Increment conditionally",
      "Output count"
    ],
    "modelAnswer": "SET passed TO 0\nFOR i <- 0 TO 19\n  IF scores[i] >= 50 THEN SET passed TO passed + 1 ENDIF\nENDFOR\nOUTPUT passed",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "array",
      "iteration"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Records",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "A program stores each book as a record with ISBN, title, author and onLoan fields. Explain why a record is suitable.",
    "markPoints": [
      "Groups related fields",
      "Fields can have different data types",
      "Represents one entity/book",
      "Makes structured access/processing clearer"
    ],
    "modelAnswer": "A record groups the related fields for one book into one structure. The fields can have different data types, such as strings and a Boolean, while still representing the same entity.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "record",
      "field"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Subroutines",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain two benefits of using a function `calculateArea(width, height)` rather than repeating the calculation throughout a program.",
    "markPoints": [
      "Avoids duplicated code",
      "Reusable with different arguments",
      "Can change/test logic in one place",
      "Improves modularity/readability; credit two developed benefits"
    ],
    "modelAnswer": "The function can be reused with different dimensions, avoiding duplicated code. It can also be tested or changed in one place, improving maintainability.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "function",
      "subroutine"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Strings",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write pseudocode that inputs a word and outputs the number of characters in it and its first character.",
    "markPoints": [
      "Input string",
      "Obtains length",
      "Outputs length",
      "Accesses first character correctly",
      "Outputs first character"
    ],
    "modelAnswer": "INPUT word\nOUTPUT LENGTH(word)\nOUTPUT word[0]",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "string",
      "length",
      "index"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "File handling",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Write pseudocode that opens `names.txt`, reads every line until end-of-file, counts the names, closes the file and outputs the count.",
    "markPoints": [
      "Open for reading",
      "Initialise count",
      "Loop until EOF",
      "Read line",
      "Increment count",
      "Close and output"
    ],
    "modelAnswer": "OPEN 'names.txt' FOR READ\nSET count TO 0\nWHILE NOT EOF\n  READ line\n  SET count TO count + 1\nENDWHILE\nCLOSE file\nOUTPUT count",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "file",
      "eof",
      "read"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Nested constructs",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "State the output of:\n\nFOR row <- 1 TO 3\n  FOR col <- 1 TO row\n    OUTPUT row\n  ENDFOR\nENDFOR",
    "markPoints": [
      "Outputs 1 once",
      "Outputs 2 twice",
      "Outputs 3 three times",
      "Correct order",
      "Sequence 1 2 2 3 3 3"
    ],
    "modelAnswer": "The output is 1, 2, 2, 3, 3, 3.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "nested",
      "loop"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Variables and constants",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A game stores lives, current score and the maximum number of levels (20). Decide which should be variables and which should be a constant, with reasons.",
    "markPoints": [
      "lives variable",
      "score variable",
      "maximum levels constant",
      "Reason linked to changing/fixed values"
    ],
    "modelAnswer": "lives and current score are variables because they change during play. MAX_LEVELS can be a constant because the designed maximum remains 20 while the program runs.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "variable",
      "constant"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Selection",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "Trace the output when mark = 68:\n\nIF mark >= 70 THEN\n OUTPUT 'A'\nELSE IF mark >= 60 THEN\n OUTPUT 'B'\nELSE\n OUTPUT 'C'\nENDIF",
    "markPoints": [
      "68 >= 70 is false",
      "Moves to second condition",
      "68 >= 60 is true",
      "Outputs B",
      "Does not execute final ELSE"
    ],
    "modelAnswer": "The first condition is false and the second is true, so the program outputs B.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "selection",
      "trace"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Iteration",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare a count-controlled FOR loop with a condition-controlled WHILE loop. Give one suitable use for each.",
    "markPoints": [
      "FOR suits known number of repetitions",
      "WHILE suits repetitions controlled by condition",
      "Correct FOR example",
      "Correct WHILE example",
      "Clear comparison"
    ],
    "modelAnswer": "A FOR loop is suitable when the number of repetitions is known, such as processing 30 students. A WHILE loop is suitable when repetition continues until a condition changes, such as asking until valid input is entered.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "for",
      "while",
      "iteration"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "DIV and MOD",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A program converts 367 seconds into whole minutes and remaining seconds using DIV and MOD. Calculate both values and give suitable expressions.",
    "markPoints": [
      "367 DIV 60",
      "6 minutes",
      "367 MOD 60",
      "7 seconds"
    ],
    "modelAnswer": "minutes = 367 DIV 60 = 6 and seconds = 367 MOD 60 = 7.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "div",
      "mod",
      "time"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Boolean conditions",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write a Boolean condition that is true only when age is from 16 to 18 inclusive and hasPermission is true.",
    "markPoints": [
      "age >= 16",
      "age <= 18",
      "Uses AND between age limits",
      "Includes hasPermission",
      "Whole expression correctly grouped"
    ],
    "modelAnswer": "(age >= 16 AND age <= 18) AND hasPermission = TRUE",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "boolean",
      "condition"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Arrays",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 7,
    "question": "An array scores contains 20 integers. Write pseudocode to calculate the mean and count how many scores are below the mean.",
    "markPoints": [
      "Calculate total",
      "Traverse 20 values for total",
      "Calculate mean",
      "Initialise below counter",
      "Traverse values again",
      "Compare each with mean",
      "Output mean and count"
    ],
    "modelAnswer": "SET total TO 0\nFOR i <- 0 TO 19\n SET total TO total + scores[i]\nENDFOR\nSET mean TO total / 20\nSET below TO 0\nFOR i <- 0 TO 19\n IF scores[i] < mean THEN SET below TO below + 1 ENDIF\nENDFOR\nOUTPUT mean, below",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "array",
      "mean",
      "iteration"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Records",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Using a record `student` with fields name, yearGroup and score, write pseudocode to set all three fields and output the name if score is at least 50.",
    "markPoints": [
      "Sets name field",
      "Sets yearGroup",
      "Sets score",
      "Tests score >= 50",
      "Accesses record field correctly",
      "Outputs name conditionally"
    ],
    "modelAnswer": "SET student.name TO 'Amina'\nSET student.yearGroup TO 11\nSET student.score TO 67\nIF student.score >= 50 THEN\n OUTPUT student.name\nENDIF",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "record",
      "field",
      "selection"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Subroutines",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 6,
    "question": "Write a function `isEven(number)` that returns TRUE when number is even and FALSE otherwise.",
    "markPoints": [
      "Function with parameter",
      "Uses MOD 2",
      "Tests equality to zero",
      "Returns TRUE for even",
      "Returns FALSE otherwise",
      "Correct function structure"
    ],
    "modelAnswer": "FUNCTION isEven(number)\n IF number MOD 2 = 0 THEN\n  RETURN TRUE\n ELSE\n  RETURN FALSE\n ENDIF\nENDFUNCTION",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "function",
      "mod",
      "return"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-021",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Strings",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Write pseudocode that counts how many times the character 'a' occurs in an input string.",
    "markPoints": [
      "Input string",
      "Initialise counter",
      "Iterate through characters",
      "Compare with 'a'",
      "Increment on match",
      "Output count"
    ],
    "modelAnswer": "INPUT text\nSET count TO 0\nFOR EACH character IN text\n IF character = 'a' THEN SET count TO count + 1 ENDIF\nENDFOR\nOUTPUT count",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "string",
      "character",
      "iteration"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-022",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "File handling",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 7,
    "question": "Write pseudocode that appends a student's name and score to `results.txt` without deleting existing data.",
    "markPoints": [
      "Open in append mode",
      "Input/has name",
      "Input/has score",
      "Writes name",
      "Writes score in suitable format",
      "Does not overwrite existing content",
      "Closes file"
    ],
    "modelAnswer": "OPEN 'results.txt' FOR APPEND\nINPUT name\nINPUT score\nWRITE name + ',' + STRING(score)\nCLOSE file",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "file",
      "append",
      "write"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-023",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Nested constructs",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 7,
    "question": "Write pseudocode using nested loops to output a 5 by 4 rectangle of `*` characters, one row at a time.",
    "markPoints": [
      "Outer loop for rows",
      "Runs 4 rows or consistent interpretation",
      "Inner loop for columns",
      "Runs 5 columns",
      "Outputs star in inner loop",
      "Starts new line after each row",
      "Correct nested structure"
    ],
    "modelAnswer": "FOR row <- 1 TO 4\n FOR col <- 1 TO 5\n  OUTPUT '*' WITHOUT NEWLINE\n ENDFOR\n OUTPUT NEWLINE\nENDFOR",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "nested",
      "loop"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-024",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Data types",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A school registration form stores dateOfBirth as text, numberOfSiblings, averageGrade, and consentGiven. Choose suitable data types and justify one choice.",
    "markPoints": [
      "String/date representation for dateOfBirth acceptable in GCSE context",
      "Integer for siblings",
      "Real/float for averageGrade",
      "Boolean for consent",
      "Valid justification"
    ],
    "modelAnswer": "Suitable choices are string/date representation for dateOfBirth, integer for numberOfSiblings, real for averageGrade and Boolean for consentGiven. Boolean is appropriate for consent because there are only two logical states.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "data type",
      "boolean",
      "integer",
      "real"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-025",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Selection",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "debugging",
    "difficulty": "standard",
    "marks": 5,
    "question": "The program should output 'Pass' for marks of 50 or more but fails for exactly 50:\n`IF mark > 50 THEN OUTPUT 'Pass' ELSE OUTPUT 'Fail'`\nIdentify and correct the logic error.",
    "markPoints": [
      "50 should pass",
      "> excludes 50",
      "Use >=",
      "Corrected condition",
      "Recognises this is a logic error"
    ],
    "modelAnswer": "The comparison should be `mark >= 50`. Using `>` incorrectly sends a mark of exactly 50 to the Fail branch.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "selection",
      "logic error"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-026",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Iteration",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "debugging",
    "difficulty": "standard",
    "marks": 5,
    "question": "This loop should output 1 to 5 but never ends:\n\nSET n TO 1\nWHILE n <= 5\n OUTPUT n\nENDWHILE\n\nExplain the error and correct it.",
    "markPoints": [
      "n never changes",
      "Condition remains true",
      "Add increment",
      "n <- n + 1 inside loop",
      "Correct loop then terminates after 5"
    ],
    "modelAnswer": "The loop never updates n, so n <= 5 stays true. Add `SET n TO n + 1` inside the loop after the output.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "while",
      "infinite loop",
      "debugging"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-027",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Arrays",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 6,
    "question": "Trace this code for values = [3, 8, 2, 8].\n\nSET total TO 0\nFOR i <- 0 TO 3\n SET total TO total + values[i]\nENDFOR\nOUTPUT total",
    "markPoints": [
      "After index 0 total 3",
      "After index 1 total 11",
      "After index 2 total 13",
      "After index 3 total 21",
      "Correct array indexing",
      "Output 21"
    ],
    "modelAnswer": "The totals are 3, 11, 13 and 21, so the final output is 21.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "array",
      "trace",
      "accumulator"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-028",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Subroutines",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Compare a procedure and a function. Explain why a function is suitable for calculating a value such as VAT.",
    "markPoints": [
      "Both are subroutines",
      "Procedure performs task",
      "Function returns a value",
      "Function can accept parameters",
      "Returned value can be used in expression/assignment",
      "VAT recommendation justified"
    ],
    "modelAnswer": "Both are reusable subroutines, but a function returns a value whereas a procedure is generally called to perform an action. A VAT calculation is naturally a function because it can accept an amount and return the calculated VAT for use elsewhere.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "procedure",
      "function",
      "return"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-029",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Strings",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "For text = 'COMPUTER', state the result of LENGTH(text), text[0], and the substring containing characters at indexes 1 to 3 inclusive.",
    "markPoints": [
      "Length 8",
      "First character C",
      "Indexes are zero-based",
      "Characters 1..3 are OMP",
      "Correct substring OMP"
    ],
    "modelAnswer": "LENGTH(text) is 8, text[0] is C, and indexes 1 to 3 give OMP.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "string",
      "index",
      "substring"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-030",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "File handling",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why a program should close a file after reading or writing it.",
    "markPoints": [
      "Ensures buffered data can be written",
      "Releases file/system resource",
      "Reduces risk of corruption/locking",
      "Allows other processes to access file; any four distinct accurate points"
    ],
    "modelAnswer": "Closing a file releases the resource and ensures pending writes are completed. It also reduces the risk of corruption or the file remaining locked for other programs.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "file",
      "close"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-031",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Nested constructs",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 7,
    "question": "Trace the values of count for this code and state the final output.\n\nSET count TO 0\nFOR x <- 1 TO 3\n FOR y <- 1 TO 2\n  SET count TO count + x\n ENDFOR\nENDFOR\nOUTPUT count",
    "markPoints": [
      "x=1 adds 1 twice -> 2",
      "x=2 first addition -> 4",
      "x=2 second -> 6",
      "x=3 first -> 9",
      "x=3 second -> 12",
      "Inner loop runs twice per x",
      "Output 12"
    ],
    "modelAnswer": "count progresses 1, 2, 4, 6, 9, 12. The final output is 12.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "nested",
      "trace"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-032",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Variables and constants",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A programmer writes the number 0.2 directly in twelve places to represent a discount rate. Evaluate replacing these values with a named constant DISCOUNT_RATE.",
    "markPoints": [
      "Avoids magic numbers",
      "Meaning becomes clearer",
      "Single change updates intended uses",
      "Reduces inconsistent edits",
      "Constant prevents accidental modification during execution",
      "Justified conclusion"
    ],
    "modelAnswer": "A named constant makes the purpose of 0.2 clear and avoids repeating a magic number. If the rate changes, the programmer can update one definition instead of twelve locations, reducing inconsistent edits. A constant also signals that the value should not change while the program runs.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "constant",
      "maintainability"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-033",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Selection",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 7,
    "question": "Write pseudocode for a delivery charge: £0 for orders at least £50; otherwise £3 if the customer is a member and £5 if not. Input orderTotal and isMember, then output charge.",
    "markPoints": [
      "Inputs orderTotal",
      "Inputs isMember",
      "Tests >= 50",
      "Sets zero charge",
      "Handles member branch",
      "Handles non-member branch",
      "Outputs charge"
    ],
    "modelAnswer": "INPUT orderTotal\nINPUT isMember\nIF orderTotal >= 50 THEN\n SET charge TO 0\nELSE IF isMember = TRUE THEN\n SET charge TO 3\nELSE\n SET charge TO 5\nENDIF\nOUTPUT charge",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "selection",
      "boolean"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-034",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Iteration",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Write pseudocode that repeatedly inputs positive integers until 0 is entered. Output the number of positive values entered and their mean. Assume at least one positive value is entered.",
    "markPoints": [
      "Initialise total",
      "Initialise count",
      "Input first/value in loop",
      "Uses 0 as sentinel",
      "Adds positive values",
      "Increments count only for positive values",
      "Repeats until 0",
      "Outputs count and total/count"
    ],
    "modelAnswer": "SET total TO 0\nSET count TO 0\nINPUT number\nWHILE number <> 0\n IF number > 0 THEN\n  SET total TO total + number\n  SET count TO count + 1\n ENDIF\n INPUT number\nENDWHILE\nOUTPUT count\nOUTPUT total / count",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "while",
      "sentinel",
      "mean"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  },
  {
    "id": "gcse-programming-035",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "programming",
    "topicTitle": "Programming",
    "subtopic": "Arrays",
    "specificationReferences": [
      "AQA 3.2 Programming",
      "OCR J277 2.2 Programming fundamentals",
      "Pearson GCSE Computer Science - Programming"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 9,
    "question": "An array temperatures stores 24 hourly readings. Write pseudocode to find the highest reading, the lowest reading and the range.",
    "markPoints": [
      "Initialises highest from first element",
      "Initialises lowest from first element",
      "Traverses remaining elements",
      "Compares for highest",
      "Updates highest",
      "Compares for lowest",
      "Updates lowest",
      "Calculates range = highest-lowest",
      "Outputs all required results"
    ],
    "modelAnswer": "SET highest TO temperatures[0]\nSET lowest TO temperatures[0]\nFOR i <- 1 TO 23\n IF temperatures[i] > highest THEN SET highest TO temperatures[i] ENDIF\n IF temperatures[i] < lowest THEN SET lowest TO temperatures[i] ENDIF\nENDFOR\nSET range TO highest - lowest\nOUTPUT highest, lowest, range",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question; do not award repeated statements."
    ],
    "lessonKeywords": [
      "array",
      "maximum",
      "minimum",
      "range"
    ],
    "curriculumAreaIds": [
      "programming"
    ]
  }
];
