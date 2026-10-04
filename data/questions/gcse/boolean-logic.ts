import type { GCSEPracticeQuestion } from "./types";

export const gcseBooleanLogicQuestions: GCSEPracticeQuestion[] = [
  {
    "id": "gcse-boolean-logic-001",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "AND",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "trace",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Complete the output values of A AND B for inputs 00, 01, 10 and 11.",
    "markPoints": [
      "00 -> 0",
      "01 and 10 -> 0",
      "11 -> 1"
    ],
    "modelAnswer": "The outputs are 0, 0, 0, 1.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "and",
      "truth table"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-002",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "OR",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "trace",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Complete the output values of A OR B for inputs 00, 01, 10 and 11.",
    "markPoints": [
      "00 -> 0",
      "01 -> 1 and 10 -> 1",
      "11 -> 1"
    ],
    "modelAnswer": "The outputs are 0, 1, 1, 1.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "or",
      "truth table"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-003",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "NOT",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "trace",
    "difficulty": "foundation",
    "marks": 2,
    "question": "State the outputs of NOT A when A is 0 and when A is 1.",
    "markPoints": [
      "A=0 gives 1",
      "A=1 gives 0"
    ],
    "modelAnswer": "NOT 0 = 1 and NOT 1 = 0.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "not"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-004",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Combined expression",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "Evaluate `(A AND B) OR C` for A=1, B=0, C=1. Show the intermediate result.",
    "markPoints": [
      "A AND B = 0",
      "0 OR C",
      "C=1",
      "Final output 1",
      "Correct Boolean reasoning"
    ],
    "modelAnswer": "A AND B is 0. Then 0 OR 1 is 1, so the final output is 1.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "boolean",
      "and",
      "or"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-005",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Truth table",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 6,
    "question": "Construct the truth table for `NOT A AND B` using all four combinations of A and B.",
    "markPoints": [
      "00 -> 0",
      "01 -> 1",
      "10 -> 0",
      "11 -> 0",
      "Correct NOT A intermediate reasoning",
      "All combinations included"
    ],
    "modelAnswer": "For A,B = 00,01,10,11 the outputs are 0,1,0,0 respectively.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "truth table",
      "not",
      "and"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-006",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Logic scenario",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A door opens only when cardValid is TRUE AND pinCorrect is TRUE. Write the Boolean expression and state the result when cardValid=TRUE and pinCorrect=FALSE.",
    "markPoints": [
      "cardValid AND pinCorrect",
      "Both must be true",
      "TRUE AND FALSE",
      "Result FALSE"
    ],
    "modelAnswer": "`cardValid AND pinCorrect`; with TRUE and FALSE the result is FALSE, so the door remains locked.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "and",
      "boolean"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-007",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Logic scenario",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "An alarm sounds when smokeDetected is TRUE OR heatDetected is TRUE. Explain the output for inputs (0,0), (1,0) and (0,1).",
    "markPoints": [
      "00 -> alarm false",
      "10 -> true",
      "01 -> true",
      "OR requires at least one true input"
    ],
    "modelAnswer": "The alarm is false for 0,0 and true for both 1,0 and 0,1 because OR is true when at least one input is true.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "or",
      "alarm"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-008",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Expression",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Write a Boolean expression that is true when a user is an admin OR when the user is a teacher AND hasPermission is true. Use brackets to make the intended precedence clear.",
    "markPoints": [
      "admin condition",
      "teacher condition",
      "hasPermission condition",
      "AND teacher with permission",
      "OR with admin and appropriate brackets"
    ],
    "modelAnswer": "`isAdmin OR (isTeacher AND hasPermission)`",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "boolean",
      "precedence"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-009",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Truth table",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 7,
    "question": "Construct the truth table for `(A OR B) AND NOT C` for all eight input combinations.",
    "markPoints": [
      "000 -> 0",
      "001 -> 0",
      "010 -> 1",
      "011 -> 0",
      "100 -> 1",
      "101 -> 0",
      "110 -> 1 and 111 -> 0"
    ],
    "modelAnswer": "For ABC = 000,001,010,011,100,101,110,111 the outputs are 0,0,1,0,1,0,1,0.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "truth table",
      "boolean"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-010",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "De Morgan reasoning",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 5,
    "question": "Using Boolean reasoning, explain why `NOT (A OR B)` is true only when both A and B are false.",
    "markPoints": [
      "A OR B true if either input true",
      "NOT reverses output",
      "Therefore any true input makes whole expression false",
      "Only 00 makes A OR B false",
      "NOT false becomes true"
    ],
    "modelAnswer": "A OR B is false only for A=0 and B=0. Applying NOT reverses that result, so `NOT(A OR B)` is true only when both inputs are false.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "boolean",
      "not",
      "or"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-011",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "AND vs OR",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 4,
    "question": "Compare AND and OR for controlling access with two conditions.",
    "markPoints": [
      "AND requires both conditions true",
      "OR requires at least one condition true",
      "AND is stricter for two required checks",
      "Valid access example"
    ],
    "modelAnswer": "AND grants access only when both checks pass, while OR grants access when either check passes. If both a valid card and PIN are required, AND is the appropriate operator.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "and",
      "or"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-012",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "NOT",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 4,
    "question": "A program stores `accountLocked`. It should allow login attempts only when the account is not locked. Write and explain a suitable Boolean condition.",
    "markPoints": [
      "Uses NOT accountLocked or accountLocked = FALSE",
      "When locked true condition becomes false",
      "When locked false condition becomes true",
      "Correct interpretation"
    ],
    "modelAnswer": "`NOT accountLocked` is true only when accountLocked is false, so login attempts are allowed only for an unlocked account.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "not",
      "boolean"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-013",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Boolean debugging",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "debugging",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A discount should apply only to members aged 65 or over. The programmer writes `isMember OR age >= 65`. Explain the logic error and correct it.",
    "markPoints": [
      "OR accepts either condition alone",
      "Non-member aged 65+ incorrectly qualifies",
      "Member under 65 incorrectly qualifies",
      "AND is required",
      "Correct expression `isMember AND age >= 65`",
      "Links correction to requirement"
    ],
    "modelAnswer": "OR is too permissive because either condition can make it true. The correct expression is `isMember AND age >= 65`, which requires both conditions.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "boolean",
      "debugging"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-014",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Boolean logic",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 6,
    "question": "A security rule is `(hasCard AND knowsPIN) OR isEmergencyOverride`. Explain how the expression behaves and one risk of the override.",
    "markPoints": [
      "Normal access requires card and PIN",
      "AND combines normal checks",
      "OR allows emergency override independently",
      "Override can bypass normal authentication",
      "Override must be strongly controlled/audited",
      "Balanced explanation"
    ],
    "modelAnswer": "Normally both a valid card and PIN are required. The OR branch allows an emergency override to grant access without those two checks, so override credentials or controls must be tightly restricted and audited.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "boolean",
      "security"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  },
  {
    "id": "gcse-boolean-logic-015",
    "boards": [
      "AQA",
      "OCR",
      "EDEXCEL"
    ],
    "topicId": "boolean-logic",
    "topicTitle": "Boolean Logic",
    "subtopic": "Boolean logic",
    "specificationReferences": [
      "AQA 3.4 Boolean logic",
      "OCR J277 2.4 Boolean logic",
      "Pearson GCSE Computer Science - Boolean logic"
    ],
    "questionType": "programming",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Write a Boolean expression for a student being eligible when attendance is at least 90 AND (courseworkComplete is TRUE OR hasApprovedExtension is TRUE). Explain the brackets.",
    "markPoints": [
      "attendance >= 90",
      "courseworkComplete",
      "hasApprovedExtension",
      "OR combines completion/extension",
      "AND combines attendance with bracketed alternative",
      "Brackets ensure alternative condition evaluated as one group"
    ],
    "modelAnswer": "`attendance >= 90 AND (courseworkComplete OR hasApprovedExtension)`. The brackets make either coursework completion or an approved extension satisfy the second requirement, while attendance is always required.",
    "examinerGuidance": [
      "Credit equivalent technically accurate wording.",
      "Award only distinct points that answer the question."
    ],
    "lessonKeywords": [
      "boolean",
      "precedence"
    ],
    "curriculumAreaIds": [
      "boolean-logic"
    ]
  }
];
