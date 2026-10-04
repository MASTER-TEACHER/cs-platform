import type { GCSEPracticeQuestion } from "./types";

export const gcseRobustProgrammingQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-robust-programming-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Validation",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "Name four validation checks that could be applied to user input.",
    "markPoints": [
      "Range",
      "Length",
      "Type",
      "Presence/format/list; any valid fourth"
    ],
    "modelAnswer": "Examples include range, length, type and presence checks.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "validation"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Range check",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "foundation",
    "marks": 3,
    "question": "A field accepts an age from 11 to 18 inclusive. Write the condition for a range check and explain what it rejects.",
    "markPoints": [
      "age >= 11",
      "age <= 18 / combined condition",
      "Rejects values below 11 or above 18"
    ],
    "modelAnswer": "`age >= 11 AND age <= 18`; values outside 11–18 are rejected.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "range check"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Length check",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A candidate number must contain exactly six characters. Explain a suitable validation check.",
    "markPoints": [
      "Length check",
      "LENGTH(value)=6",
      "Reject shorter values",
      "Reject longer values"
    ],
    "modelAnswer": "Use a length check requiring `LENGTH(candidateNumber) = 6`. Values with fewer or more than six characters are rejected.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "length check"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Presence check",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain how a presence check could be used on an email field and one limitation of the check.",
    "markPoints": [
      "Checks field is not empty",
      "Rejects missing input",
      "Does not prove entered email is valid/correct"
    ],
    "modelAnswer": "A presence check ensures something has been entered. It cannot prove that the entered text is a genuine or correctly formatted email address.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "presence check"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Validation vs verification",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare validation and verification using an example of entering a student's date of birth.",
    "markPoints": [
      "Validation checks against rules",
      "Example range/format check",
      "Verification checks copied/entered data matches source",
      "Example double entry/visual check",
      "Neither necessarily proves source fact itself is true"
    ],
    "modelAnswer": "Validation checks whether the value follows rules, such as a valid date format. Verification checks that the entered value matches the source, for example by double entry. They address different kinds of error.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "validation",
      "verification"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Double entry",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain how double-entry verification can detect a typing error.",
    "markPoints": [
      "Same data entered twice",
      "Two entries compared",
      "Mismatch flags possible error",
      "Does not guarantee correctness if same wrong value entered twice"
    ],
    "modelAnswer": "The user enters the data twice and the system compares the two entries. A mismatch indicates a likely typing error, although identical incorrect entries can still pass.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "verification",
      "double entry"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Normal test data",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "foundation",
    "marks": 3,
    "question": "A program accepts marks from 0 to 100. Give one item of normal test data and state the expected outcome.",
    "markPoints": [
      "Value clearly within range e.g. 63",
      "Expected accepted",
      "Recognises normal data is typical valid input"
    ],
    "modelAnswer": "63 is normal test data and should be accepted.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "testing",
      "normal"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Boundary test data",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A program accepts quantities from 1 to 20 inclusive. Give four useful boundary-related test values and expected outcomes.",
    "markPoints": [
      "0 reject",
      "1 accept",
      "20 accept",
      "21 reject"
    ],
    "modelAnswer": "Useful values are 0 reject, 1 accept, 20 accept and 21 reject.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "testing",
      "boundary"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Erroneous/invalid data",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A field expects an integer from 1 to 10. Give two items of erroneous/invalid data that test different validation rules and state expected outcomes.",
    "markPoints": [
      "Out-of-range example such as 11",
      "Rejected by range check",
      "Wrong-type example such as 'five'",
      "Rejected by type check"
    ],
    "modelAnswer": "11 should be rejected by the range check, while 'five' should be rejected by a type check if an integer is required.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "testing",
      "erroneous"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Syntax error",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "debugging",
    "difficulty": "foundation",
    "marks": 3,
    "question": "The Python line `if score >= 50 print('Pass')` causes an error. Identify the error type and give a corrected line.",
    "markPoints": [
      "Syntax error",
      "Missing colon / malformed if syntax",
      "Correct example `if score >= 50: print('Pass')`"
    ],
    "modelAnswer": "It is a syntax error. One correction is `if score >= 50: print('Pass')`.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "syntax error",
      "python"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Logic error",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "debugging",
    "difficulty": "standard",
    "marks": 4,
    "question": "A program calculates rectangle area using `area = length + width`. Identify the error type and correct it.",
    "markPoints": [
      "Logic error",
      "Program can run but gives wrong result",
      "Should multiply",
      "Correct `area = length * width`"
    ],
    "modelAnswer": "This is a logic error because the statement is syntactically valid but implements the wrong calculation. It should be `area = length * width`.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "logic error"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Runtime error",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "A program executes `result = total / count` when count is 0. Explain the type of error and one way to prevent it.",
    "markPoints": [
      "Runtime error/exception",
      "Occurs during execution",
      "Division by zero",
      "Validate/test count before division"
    ],
    "modelAnswer": "Division by zero causes a runtime error during execution. The program should check that count is not zero before performing the division.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "runtime error",
      "division"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Defensive design",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain three defensive-design techniques that can make software more robust.",
    "markPoints": [
      "Input validation",
      "Authentication/access control",
      "Clear error handling",
      "Anticipating misuse / maintainable code; any developed three",
      "Links to robustness"
    ],
    "modelAnswer": "Defensive design includes validating inputs before processing them, restricting actions to authenticated/authorised users and handling errors predictably rather than allowing the program to fail unexpectedly.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "defensive design"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Maintainability",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how meaningful identifiers, indentation and comments can improve maintainability.",
    "markPoints": [
      "Meaningful names reveal purpose",
      "Indentation shows structure",
      "Comments explain non-obvious intent",
      "Easier for others/future developer to understand",
      "Supports safer modification/debugging"
    ],
    "modelAnswer": "Meaningful identifiers communicate purpose, consistent indentation makes control structure visible, and useful comments explain non-obvious decisions. Together they make later debugging and modification easier.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "maintainability",
      "comments"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Testing",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A login form requires a username of 4–12 characters. Design five tests that include normal and boundary cases.",
    "markPoints": [
      "Normal valid value",
      "Length 4 accepted",
      "Length 12 accepted",
      "Length 3 rejected",
      "Length 13 rejected"
    ],
    "modelAnswer": "For example: length 8 accept, length 4 accept, length 12 accept, length 3 reject and length 13 reject.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "testing",
      "boundary",
      "length"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-016",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Trace debugging",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Trace this code for values [2,4,6]. It should calculate the mean but outputs 6.\n\nSET total TO 0\nFOR EACH x IN values\n SET total TO x\nENDFOR\nOUTPUT total / 3\n\nIdentify and correct the fault.",
    "markPoints": [
      "After 2 total 2",
      "After 4 total 4",
      "After 6 total 6",
      "Assignment overwrites total",
      "Use total <- total + x",
      "Correct mean is 4"
    ],
    "modelAnswer": "The trace shows total being overwritten: 2, 4, then 6. Replace the assignment with `total <- total + x`; the total becomes 12 and the mean is 4.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "trace",
      "debugging",
      "accumulator"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-017",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Test planning",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A function accepts an integer month from 1 to 12. Create a compact test plan containing normal, boundary and erroneous data with expected results.",
    "markPoints": [
      "Normal e.g. 6 accept",
      "Lower boundary 1 accept",
      "Upper boundary 12 accept",
      "Below boundary 0 reject",
      "Above boundary 13 reject",
      "Wrong type e.g. 'June' reject"
    ],
    "modelAnswer": "A suitable plan is: 6 accept; 1 accept; 12 accept; 0 reject; 13 reject; 'June' reject.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "test plan",
      "boundary"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-018",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Verification",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A receptionist copies a passport number from a paper form into a system. Recommend a verification method and explain why validation alone is insufficient.",
    "markPoints": [
      "Visual check or double entry",
      "Compares entered value with source/second entry",
      "Validation may only check format/length",
      "A plausible but mistyped value can pass validation"
    ],
    "modelAnswer": "A visual check against the original form or double entry can verify transcription. A format check alone may accept a mistyped passport number if it still has a valid-looking format.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "verification",
      "validation"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-019",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Robust programming",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 7,
    "question": "A programmer says, 'If my program passes one normal test, it is ready for release.' Evaluate this claim.",
    "markPoints": [
      "One normal test gives very limited evidence",
      "Boundary cases needed",
      "Invalid/erroneous cases needed",
      "Different paths/branches need testing",
      "Runtime/error handling needs testing",
      "Representative/edge data improves confidence",
      "Conclusion that claim is inadequate"
    ],
    "modelAnswer": "Passing one typical case only shows that one path works for one input. Boundary and invalid data, alternative branches and error conditions also need testing. A broader planned test set provides much stronger evidence of robustness, though testing cannot prove the absence of every defect.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "testing",
      "robustness"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  },
  {
    "id": "gcse-robust-programming-020",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "robust-programming",
    "topicTitle": "Robust Programming & Testing",
    "subtopic": "Robust programming",
    "specificationReferences": [
      "AQA 3.2 Programming / robust programs",
      "OCR J277 2.3 Producing robust programs",
      "Pearson GCSE Computer Science - Programming and testing"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Write pseudocode that repeatedly asks for an integer mark from 0 to 100 until valid input is supplied, then outputs 'Pass' for 50 or above and 'Fail' otherwise.",
    "markPoints": [
      "Input mark",
      "Loop/repetition for invalid input",
      "Tests lower bound",
      "Tests upper bound",
      "Repeats until valid",
      "Selection after validation",
      ">=50 outputs Pass",
      "Otherwise outputs Fail"
    ],
    "modelAnswer": "INPUT mark\nWHILE mark < 0 OR mark > 100\n INPUT mark\nENDWHILE\nIF mark >= 50 THEN\n OUTPUT 'Pass'\nELSE\n OUTPUT 'Fail'\nENDIF",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "validation",
      "while",
      "selection"
    ],
    "curriculumAreaIds": [
      "robust-programming"
    ]
  }
];
