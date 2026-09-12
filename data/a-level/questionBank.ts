import type {
  ALevelExamBoard,
  ALevelPracticeQuestion,
} from "@/types/aLevelPractice";

export const aLevelPracticeQuestions: ALevelPracticeQuestion[] =
[
  {
    "id": "al-advanced-programming-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "Scope",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain the difference between local and global scope.",
    "markPoints": [
      "A local variable is available only within its defining scope, while a global variable is visible more widely",
      "Restricting scope reduces unintended dependencies",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "A local variable is available only within its defining scope, while a global variable is visible more widely. Restricting scope reduces unintended dependencies.",
    "lessonKeywords": [
      "scope",
      "variables"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-advanced-programming-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "Parameters",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain the difference between a parameter and an argument.",
    "markPoints": [
      "A parameter is the named input in a subroutine definition",
      "An argument is the actual value or expression supplied when the subroutine is called",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "A parameter is the named input in a subroutine definition. An argument is the actual value or expression supplied when the subroutine is called.",
    "lessonKeywords": [
      "parameter",
      "subroutine"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-advanced-programming-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "Recursion",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain why a recursive algorithm needs a base case.",
    "markPoints": [
      "The base case stops further recursive calls",
      "Each recursive step should move toward it; otherwise the call stack may grow until the program fails",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "The base case stops further recursive calls. Each recursive step should move toward it; otherwise the call stack may grow until the program fails.",
    "lessonKeywords": [
      "recursion",
      "base case"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-advanced-programming-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "OOP",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare inheritance and composition as ways of reusing behaviour.",
    "markPoints": [
      "Inheritance creates an is-a relationship and specialises a parent class",
      "Composition creates a has-a relationship and combines collaborating objects, often with less coupling",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Inheritance creates an is-a relationship and specialises a parent class. Composition creates a has-a relationship and combines collaborating objects, often with less coupling.",
    "lessonKeywords": [
      "inheritance",
      "composition"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-advanced-programming-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "Robustness",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A program reads numeric data from a user-selected file. Explain how exception handling can make the program more robust.",
    "markPoints": [
      "Exception handling can catch file-access and conversion failures, report them clearly and recover without an uncontrolled crash",
      "It complements, rather than replaces, normal input validation",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Exception handling can catch file-access and conversion failures, report them clearly and recover without an uncontrolled crash. It complements, rather than replaces, normal input validation.",
    "lessonKeywords": [
      "exception",
      "robust"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-advanced-programming-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "Persistent data",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why serialisation can be useful when an application must preserve object state between runs.",
    "markPoints": [
      "Serialisation converts object state into a storable representation that can be written to persistent storage and reconstructed later",
      "The format must be managed carefully when structures change",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Serialisation converts object state into a storable representation that can be written to persistent storage and reconstructed later. The format must be managed carefully when structures change.",
    "lessonKeywords": [
      "serialisation",
      "persistent"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-advanced-programming-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "Recursive trace",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "trace",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A recursive function returns 0 when n <= 0; otherwise it returns n + f(n - 2). Trace f(8) and explain the result.",
    "markPoints": [
      "The calls are f(8), f(6), f(4), f(2), f(0)",
      "The returns are 0, 2, 6, 12 and finally 20",
      "Each call reduces n by 2 until the base case",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "The calls are f(8), f(6), f(4), f(2), f(0). The returns are 0, 2, 6, 12 and finally 20. Each call reduces n by 2 until the base case.",
    "lessonKeywords": [
      "trace",
      "recursion"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-advanced-programming-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-programming",
    "topicTitle": "Advanced Programming",
    "subtopic": "Design choice",
    "specificationReferences": [
      "AQA 4.1",
      "OCR 2.2"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate using object-oriented design for a large school management system.",
    "markPoints": [
      "OOP can model stateful entities such as Student and Class, use encapsulation to protect state, and use composition for reuse",
      "Poorly designed inheritance hierarchies can increase coupling",
      "It is suitable when responsibilities and interfaces are kept clear",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "OOP can model stateful entities such as Student and Class, use encapsulation to protect state, and use composition for reuse. Poorly designed inheritance hierarchies can increase coupling. It is suitable when responsibilities and interfaces are kept clear.",
    "lessonKeywords": [
      "object",
      "design"
    ],
    "curriculumAreaIds": [
      "aqa-4-1",
      "ocr-1-2",
      "ocr-2-2"
    ]
  },
  {
    "id": "al-functional-programming-01",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Pure functions",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "State two characteristics of a pure function and one benefit.",
    "markPoints": [
      "A pure function depends only on its explicit inputs and has no externally visible side effects",
      "This makes behaviour predictable and easier to test",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "A pure function depends only on its explicit inputs and has no externally visible side effects. This makes behaviour predictable and easier to test.",
    "lessonKeywords": [
      "pure",
      "function"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-functional-programming-02",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Immutability",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain what immutable data means.",
    "markPoints": [
      "Immutable data is not changed after creation",
      "A new value is created instead of modifying the existing one",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "Immutable data is not changed after creation. A new value is created instead of modifying the existing one.",
    "lessonKeywords": [
      "immutable",
      "data"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-functional-programming-03",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Higher-order functions",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "What is a higher-order function? Give one collection-processing example.",
    "markPoints": [
      "A higher-order function takes another function as an argument or returns one",
      "For example, map applies a supplied transformation to each item in a collection",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "A higher-order function takes another function as an argument or returns one. For example, map applies a supplied transformation to each item in a collection.",
    "lessonKeywords": [
      "higher-order",
      "map"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-functional-programming-04",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Referential transparency",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain referential transparency and why it helps reasoning about code.",
    "markPoints": [
      "An expression is referentially transparent if replacing it with its value does not change program behaviour",
      "This absence of hidden effects makes local reasoning and some optimisations safer",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "An expression is referentially transparent if replacing it with its value does not change program behaviour. This absence of hidden effects makes local reasoning and some optimisations safer.",
    "lessonKeywords": [
      "referential",
      "pure"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-functional-programming-05",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Recursive list",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Describe a recursive functional algorithm that returns the sum of a list.",
    "markPoints": [
      "Return 0 for the empty list",
      "Otherwise return the first element plus the recursive sum of the remaining list",
      "Each call receives a shorter list, so the algorithm terminates",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Return 0 for the empty list. Otherwise return the first element plus the recursive sum of the remaining list. Each call receives a shorter list, so the algorithm terminates.",
    "lessonKeywords": [
      "recursion",
      "list"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-functional-programming-06",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Functional vs imperative",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare functional and imperative approaches for transforming a collection of records.",
    "markPoints": [
      "Functional code can compose pure transformations and avoid shared mutation, helping testability and parallelism",
      "Imperative code may update structures directly and can be straightforward and efficient",
      "The best choice depends on state and performance needs",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Functional code can compose pure transformations and avoid shared mutation, helping testability and parallelism. Imperative code may update structures directly and can be straightforward and efficient. The best choice depends on state and performance needs.",
    "lessonKeywords": [
      "functional",
      "imperative"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-functional-programming-07",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Tail recursion",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Explain tail recursion and why a runtime may optimise it.",
    "markPoints": [
      "In tail recursion the recursive call is the final operation, so no work remains in the current frame",
      "A runtime can therefore reuse the frame and avoid stack growth, although not every language guarantees this optimisation",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "In tail recursion the recursive call is the final operation, so no work remains in the current frame. A runtime can therefore reuse the frame and avoid stack growth, although not every language guarantees this optimisation.",
    "lessonKeywords": [
      "tail",
      "recursion"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-functional-programming-08",
    "boards": [
      "AQA"
    ],
    "topicId": "functional-programming",
    "topicTitle": "Functional Programming",
    "subtopic": "Pipeline design",
    "specificationReferences": [
      "AQA 4.12"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate a functional style for a large data-processing pipeline.",
    "markPoints": [
      "A functional core suits independent transformations because pure functions are composable and easier to test, while immutability reduces shared-state bugs",
      "Costs can include allocations and explicit handling of I/O effects",
      "It is strong when stateful boundaries are controlled",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "A functional core suits independent transformations because pure functions are composable and easier to test, while immutability reduces shared-state bugs. Costs can include allocations and explicit handling of I/O effects. It is strong when stateful boundaries are controlled.",
    "lessonKeywords": [
      "pipeline",
      "functional"
    ],
    "curriculumAreaIds": [
      "aqa-4-12"
    ]
  },
  {
    "id": "al-software-development-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Lifecycle",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "State three activities in a disciplined software development lifecycle.",
    "markPoints": [
      "Valid activities include requirements analysis, design, implementation, testing, deployment and maintenance",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Valid activities include requirements analysis, design, implementation, testing, deployment and maintenance.",
    "lessonKeywords": [
      "lifecycle",
      "development"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-software-development-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Requirements",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain why success criteria should be measurable.",
    "markPoints": [
      "Measurable criteria can be tested objectively, reduce ambiguity and allow the final evaluation to judge whether the agreed requirement was met",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Measurable criteria can be tested objectively, reduce ambiguity and allow the final evaluation to judge whether the agreed requirement was met.",
    "lessonKeywords": [
      "criteria",
      "requirements"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-software-development-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Agile vs waterfall",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare iterative development with a strict waterfall approach when requirements are likely to change.",
    "markPoints": [
      "Iterative development delivers increments and revisits requirements using feedback",
      "Waterfall uses more sequential stages and can make late changes expensive",
      "Iteration is usually more adaptable when requirements are volatile",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Iterative development delivers increments and revisits requirements using feedback. Waterfall uses more sequential stages and can make late changes expensive. Iteration is usually more adaptable when requirements are volatile.",
    "lessonKeywords": [
      "agile",
      "waterfall"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-software-development-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Unit and integration",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why unit testing and integration testing are both needed.",
    "markPoints": [
      "Unit tests isolate individual components",
      "Integration tests check that components exchange data and coordinate correctly",
      "Components can pass unit tests but still fail when combined",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Unit tests isolate individual components. Integration tests check that components exchange data and coordinate correctly. Components can pass unit tests but still fail when combined.",
    "lessonKeywords": [
      "testing",
      "integration"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-software-development-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Version control",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how version control supports a team working on the same program.",
    "markPoints": [
      "Version control records a history of changes, supports branches and merging, identifies conflicts and allows earlier versions to be restored",
      "It also links changes to contributors and purposes",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Version control records a history of changes, supports branches and merging, identifies conflicts and allows earlier versions to be restored. It also links changes to contributors and purposes.",
    "lessonKeywords": [
      "version",
      "team"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-software-development-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Code review",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain two benefits of peer code review that automated tests alone may not provide.",
    "markPoints": [
      "Reviewers can identify readability and design problems and notice assumptions or missing cases not represented in tests",
      "Review also spreads knowledge across the team",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Reviewers can identify readability and design problems and notice assumptions or missing cases not represented in tests. Review also spreads knowledge across the team.",
    "lessonKeywords": [
      "review",
      "testing"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-software-development-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Maintainability",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate the importance of maintainability when two solutions both meet the current specification.",
    "markPoints": [
      "Software normally changes after release",
      "Clear modular code, tests and documentation reduce the cost and risk of future changes, although they can require more initial effort",
      "Maintainability should be weighted against genuine performance and delivery constraints",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "Software normally changes after release. Clear modular code, tests and documentation reduce the cost and risk of future changes, although they can require more initial effort. Maintainability should be weighted against genuine performance and delivery constraints.",
    "lessonKeywords": [
      "maintenance",
      "quality"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-software-development-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "software-development",
    "topicTitle": "Software Development",
    "subtopic": "Safety-critical release",
    "specificationReferences": [
      "AQA 4.1/NEA",
      "OCR 1.2/2.2"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A safety-critical system passes current tests but the code is difficult to understand and poorly documented. Evaluate whether it should be released.",
    "markPoints": [
      "Passing tests is useful but incomplete evidence",
      "Poor readability and documentation make independent verification and safe maintenance harder, and tests may omit hazardous cases",
      "Release should normally wait for stronger review and assurance",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "Passing tests is useful but incomplete evidence. Poor readability and documentation make independent verification and safe maintenance harder, and tests may omit hazardous cases. Release should normally wait for stronger review and assurance.",
    "lessonKeywords": [
      "safety",
      "documentation"
    ],
    "curriculumAreaIds": [
      "aqa-4-13",
      "aqa-4-14",
      "ocr-1-2",
      "ocr-2-2",
      "ocr-3"
    ]
  },
  {
    "id": "al-data-structures-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Stack",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Describe LIFO behaviour and name two stack operations.",
    "markPoints": [
      "A stack is last-in, first-out",
      "Push adds an item to the top and pop removes the top item",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "A stack is last-in, first-out. Push adds an item to the top and pop removes the top item.",
    "lessonKeywords": [
      "stack",
      "push"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-data-structures-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Queue",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Describe FIFO behaviour and name two queue operations.",
    "markPoints": [
      "A queue is first-in, first-out",
      "Enqueue adds an item at the rear and dequeue removes one from the front",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "A queue is first-in, first-out. Enqueue adds an item at the rear and dequeue removes one from the front.",
    "lessonKeywords": [
      "queue",
      "fifo"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-data-structures-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Balanced tree",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why a balanced binary search tree has more predictable search performance than a highly unbalanced tree.",
    "markPoints": [
      "A balanced tree keeps its height relatively small, so comparisons eliminate large parts of the remaining search",
      "An unbalanced tree can become chain-like and approach linear search time",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "A balanced tree keeps its height relatively small, so comparisons eliminate large parts of the remaining search. An unbalanced tree can become chain-like and approach linear search time.",
    "lessonKeywords": [
      "tree",
      "balanced"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-data-structures-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Graph representation",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare an adjacency matrix and adjacency list for a sparse graph.",
    "markPoints": [
      "A matrix reserves space for every possible vertex pair and gives direct edge lookup",
      "An adjacency list stores only neighbours, so it usually uses much less memory for a sparse graph",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "A matrix reserves space for every possible vertex pair and gives direct edge lookup. An adjacency list stores only neighbours, so it usually uses much less memory for a sparse graph.",
    "lessonKeywords": [
      "graph",
      "adjacency"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-data-structures-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Hash collision",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why hash collisions occur and describe one way to handle them.",
    "markPoints": [
      "A finite table maps many possible keys into a limited set of positions, so distinct keys can share an index",
      "Chaining can store colliding entries together and search that collection",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "A finite table maps many possible keys into a limited set of positions, so distinct keys can share an index. Chaining can store colliding entries together and search that collection.",
    "lessonKeywords": [
      "hash",
      "collision"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-data-structures-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Linked list",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare an array-based list and linked list when many insertions occur near the front.",
    "markPoints": [
      "Array insertion near the front may require shifting many elements, while a linked list can relink references once the position is known",
      "Arrays provide fast indexed access; linked lists use sequential traversal and extra references",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "Array insertion near the front may require shifting many elements, while a linked list can relink references once the position is known. Arrays provide fast indexed access; linked lists use sequential traversal and extra references.",
    "lessonKeywords": [
      "linked",
      "array"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-data-structures-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Priority queue",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A hospital triage system must serve patients by urgency rather than arrival order. Explain and evaluate a suitable data structure.",
    "markPoints": [
      "A priority queue associates each patient with urgency and removes the highest-priority item next",
      "A tie rule such as FIFO can preserve fairness among equal priorities",
      "It is more suitable than an ordinary queue because later urgent arrivals can be served first",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "A priority queue associates each patient with urgency and removes the highest-priority item next. A tie rule such as FIFO can preserve fairness among equal priorities. It is more suitable than an ordinary queue because later urgent arrivals can be served first.",
    "lessonKeywords": [
      "priority",
      "queue"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-data-structures-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "data-structures",
    "topicTitle": "Advanced Data Structures",
    "subtopic": "Structure choice",
    "specificationReferences": [
      "AQA 4.2",
      "OCR 1.4"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate a hash table rather than a balanced search tree for a dictionary keyed by username.",
    "markPoints": [
      "A hash table can provide near-constant average exact lookup but has collision and resizing concerns and does not naturally maintain order",
      "A balanced tree gives logarithmic operations and ordered traversal",
      "For exact lookup without ordering, the hash table is usually preferable",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "A hash table can provide near-constant average exact lookup but has collision and resizing concerns and does not naturally maintain order. A balanced tree gives logarithmic operations and ordered traversal. For exact lookup without ordering, the hash table is usually preferable.",
    "lessonKeywords": [
      "hash",
      "tree"
    ],
    "curriculumAreaIds": [
      "aqa-4-2",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-computational-thinking-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Abstraction",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain abstraction in computational problem solving.",
    "markPoints": [
      "Abstraction keeps the details relevant to the problem and hides or removes irrelevant detail, producing a simpler model",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Abstraction keeps the details relevant to the problem and hides or removes irrelevant detail, producing a simpler model.",
    "lessonKeywords": [
      "abstraction",
      "model"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-computational-thinking-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Decomposition",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain decomposition and give one benefit.",
    "markPoints": [
      "Decomposition splits a complex problem into smaller subproblems",
      "This supports focused design, separate testing and division of work",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "Decomposition splits a complex problem into smaller subproblems. This supports focused design, separate testing and division of work.",
    "lessonKeywords": [
      "decomposition",
      "problem"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-computational-thinking-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Algorithmic thinking",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain algorithmic thinking and why precision matters.",
    "markPoints": [
      "Algorithmic thinking expresses a solution as ordered, unambiguous operations",
      "Precision matters because a computer cannot reliably execute vague instructions",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Algorithmic thinking expresses a solution as ordered, unambiguous operations. Precision matters because a computer cannot reliably execute vague instructions.",
    "lessonKeywords": [
      "algorithmic",
      "precision"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-computational-thinking-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Preconditions",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how preconditions and postconditions support reasoning about an algorithm.",
    "markPoints": [
      "A precondition states what must be true before execution, while a postcondition states what should be true after successful execution",
      "Together they form a contract for reasoning and testing",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "A precondition states what must be true before execution, while a postcondition states what should be true after successful execution. Together they form a contract for reasoning and testing.",
    "lessonKeywords": [
      "precondition",
      "postcondition"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-computational-thinking-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Route model",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why representing towns and roads as a weighted graph is an abstraction.",
    "markPoints": [
      "The model retains towns, connections and relevant weights such as distance or time while omitting irrelevant physical detail",
      "This simpler representation supports route algorithms",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "The model retains towns, connections and relevant weights such as distance or time while omitting irrelevant physical detail. This simpler representation supports route algorithms.",
    "lessonKeywords": [
      "abstraction",
      "graph"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-computational-thinking-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Heuristic",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare an exact algorithm with a heuristic for a difficult optimisation problem.",
    "markPoints": [
      "An exact algorithm aims to guarantee the optimal answer but may be expensive",
      "A heuristic uses problem-specific rules to obtain a good solution quickly without guaranteeing the optimum",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "An exact algorithm aims to guarantee the optimal answer but may be expensive. A heuristic uses problem-specific rules to obtain a good solution quickly without guaranteeing the optimum.",
    "lessonKeywords": [
      "heuristic",
      "optimisation"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-computational-thinking-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Backtracking",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Explain how backtracking can solve a constraint problem.",
    "markPoints": [
      "Backtracking builds a partial solution, checks constraints and abandons a choice when it cannot lead to a valid solution",
      "It returns to an earlier decision and tries alternatives until a solution is found or the search is exhausted",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Backtracking builds a partial solution, checks constraints and abandons a choice when it cannot lead to a valid solution. It returns to an earlier decision and tries alternatives until a solution is found or the search is exhausted.",
    "lessonKeywords": [
      "backtracking",
      "constraint"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-computational-thinking-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "computational-thinking",
    "topicTitle": "Computational Thinking",
    "subtopic": "Decomposition claim",
    "specificationReferences": [
      "AQA 4.3",
      "OCR 2.1"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate the claim that decomposition always makes a software problem easier.",
    "markPoints": [
      "Decomposition often reduces cognitive complexity and supports testing and parallel work, but poor boundaries can create complex interfaces and coupling",
      "It helps when subproblems represent meaningful responsibilities, not automatically in every case",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Decomposition often reduces cognitive complexity and supports testing and parallel work, but poor boundaries can create complex interfaces and coupling. It helps when subproblems represent meaningful responsibilities, not automatically in every case.",
    "lessonKeywords": [
      "decomposition",
      "design"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "aqa-4-13",
      "ocr-2-1",
      "ocr-2-3"
    ]
  },
  {
    "id": "al-theory-computation-01",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "FSM components",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "State the main components of a deterministic finite-state machine.",
    "markPoints": [
      "An FSM has a finite set of states, an input alphabet, transition rules, a start state and one or more accepting states",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "An FSM has a finite set of states, an input alphabet, transition rules, a start state and one or more accepting states.",
    "lessonKeywords": [
      "fsm",
      "state"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-theory-computation-02",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "Regular language",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain what it means for a language to be regular.",
    "markPoints": [
      "A regular language is one that can be recognised by a finite-state machine and equivalently described by a regular expression",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "A regular language is one that can be recognised by a finite-state machine and equivalently described by a regular expression.",
    "lessonKeywords": [
      "regular",
      "language"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-theory-computation-03",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "Suffix FSM",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "Describe how an FSM could recognise binary strings ending in 01.",
    "markPoints": [
      "States can represent relevant suffix information: no useful suffix, a final 0, and the accepted suffix 01",
      "Each input bit changes state according to the new suffix",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "States can represent relevant suffix information: no useful suffix, a final 0, and the accepted suffix 01. Each input bit changes state according to the new suffix.",
    "lessonKeywords": [
      "fsm",
      "binary"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-theory-computation-04",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "Regex and FSM",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain the relationship between regular expressions and finite-state machines.",
    "markPoints": [
      "Regular expressions describe patterns in regular languages, while FSMs recognise strings through transitions",
      "They have equivalent expressive power for regular languages",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Regular expressions describe patterns in regular languages, while FSMs recognise strings through transitions. They have equivalent expressive power for regular languages.",
    "lessonKeywords": [
      "regex",
      "fsm"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-theory-computation-05",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "Turing vs FSM",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare the memory model of a Turing machine with that of an FSM.",
    "markPoints": [
      "An FSM stores only its current finite state",
      "A Turing machine has an unbounded conceptual tape it can read and write and a movable head, giving a much more general computational model",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "An FSM stores only its current finite state. A Turing machine has an unbounded conceptual tape it can read and write and a movable head, giving a much more general computational model.",
    "lessonKeywords": [
      "turing",
      "fsm"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-theory-computation-06",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "Identifier language",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why the pattern 'letter followed by zero or more letters or digits' is suitable for a regular expression.",
    "markPoints": [
      "The rule is a simple sequence and repetition pattern",
      "It does not require unbounded nested memory, so a regular expression can describe it and an FSM can recognise it",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "The rule is a simple sequence and repetition pattern. It does not require unbounded nested memory, so a regular expression can describe it and an FSM can recognise it.",
    "lessonKeywords": [
      "regex",
      "identifier"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-theory-computation-07",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "Undecidable",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Explain what it means for a decision problem to be undecidable.",
    "markPoints": [
      "A problem is undecidable if no algorithm can always terminate and give the correct yes/no answer for every valid input",
      "This is a fundamental limit, not simply a performance problem",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "A problem is undecidable if no algorithm can always terminate and give the correct yes/no answer for every valid input. This is a fundamental limit, not simply a performance problem.",
    "lessonKeywords": [
      "undecidable",
      "computability"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-theory-computation-08",
    "boards": [
      "AQA"
    ],
    "topicId": "theory-computation",
    "topicTitle": "Theory of Computation",
    "subtopic": "Halting problem",
    "specificationReferences": [
      "AQA 4.4"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A developer proposes a perfect tool that decides whether every possible program/input pair will halt. Evaluate the claim.",
    "markPoints": [
      "A universal halting analyser cannot exist because the halting problem is undecidable",
      "Tools can handle restricted cases or return conservative results, but cannot correctly decide every possible program/input pair",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "A universal halting analyser cannot exist because the halting problem is undecidable. Tools can handle restricted cases or return conservative results, but cannot correctly decide every possible program/input pair.",
    "lessonKeywords": [
      "halting",
      "analysis"
    ],
    "curriculumAreaIds": [
      "aqa-4-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Two's complement",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "State the range of an 8-bit two's-complement integer and explain the extra negative value.",
    "markPoints": [
      "The range is -128 to 127",
      "The most significant bit contributes -128 while the remaining bits total at most 127, so there is one more negative value",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "The range is -128 to 127. The most significant bit contributes -128 while the remaining bits total at most 127, so there is one more negative value.",
    "lessonKeywords": [
      "two's complement",
      "signed"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Unicode",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain why Unicode is more suitable than ASCII for a global application.",
    "markPoints": [
      "Unicode represents a much larger range of writing systems and symbols, while ASCII has a small character repertoire",
      "Encodings such as UTF-8 can represent Unicode efficiently",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "Unicode represents a much larger range of writing systems and symbols, while ASCII has a small character repertoire. Encodings such as UTF-8 can represent Unicode efficiently.",
    "lessonKeywords": [
      "unicode",
      "ascii"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Mantissa",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why increasing mantissa bits generally increases floating-point precision.",
    "markPoints": [
      "The mantissa stores significant bits",
      "More mantissa bits preserve more significant detail, making representable values closer together and reducing rounding error",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "The mantissa stores significant bits. More mantissa bits preserve more significant detail, making representable values closer together and reducing rounding error.",
    "lessonKeywords": [
      "mantissa",
      "precision"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Exponent",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare the effect of adding bits to the mantissa with adding bits to the exponent.",
    "markPoints": [
      "More mantissa bits increase precision, while more exponent bits increase the range of magnitudes",
      "With a fixed word length there is a trade-off between them",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "More mantissa bits increase precision, while more exponent bits increase the range of magnitudes. With a fixed word length there is a trade-off between them.",
    "lessonKeywords": [
      "mantissa",
      "exponent"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Normalisation",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 4,
    "question": "Explain two benefits of normalising a binary floating-point value.",
    "markPoints": [
      "Normalisation uses significant mantissa bits efficiently, maximising precision for the available format, and gives a consistent standard representation",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Normalisation uses significant mantissa bits efficiently, maximising precision for the available format, and gives a consistent standard representation.",
    "lessonKeywords": [
      "normalisation",
      "floating"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Rounding",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why repeatedly adding a decimal fraction in binary floating point can accumulate error.",
    "markPoints": [
      "Some decimal fractions have no finite binary representation, so they are stored as approximations",
      "Repeated calculations can accumulate the small rounding differences",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Some decimal fractions have no finite binary representation, so they are stored as approximations. Repeated calculations can accumulate the small rounding differences.",
    "lessonKeywords": [
      "rounding",
      "floating"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Compression",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate using lossy compression for diagnostic medical images.",
    "markPoints": [
      "Lossy compression can reduce file size but permanently removes information and may introduce artefacts",
      "Diagnostic images should normally preserve exact detail using lossless compression; lossy copies may be acceptable for non-diagnostic previews",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Lossy compression can reduce file size but permanently removes information and may introduce artefacts. Diagnostic images should normally preserve exact detail using lossless compression; lossy copies may be acceptable for non-diagnostic previews.",
    "lessonKeywords": [
      "compression",
      "lossy"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-data-representation-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-data-representation",
    "topicTitle": "Advanced Data Representation",
    "subtopic": "Sample size",
    "specificationReferences": [
      "AQA 4.5",
      "OCR 1.4"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A sensor can store 16-bit or 32-bit samples. Evaluate the trade-off.",
    "markPoints": [
      "More bits provide finer representable precision but increase storage, bandwidth and processing costs",
      "If the sensor is noisy or not accurate enough to use the extra levels, 32 bits adds little value",
      "The choice should match measurement quality and downstream needs",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "More bits provide finer representable precision but increase storage, bandwidth and processing costs. If the sensor is noisy or not accurate enough to use the extra levels, 32 bits adds little value. The choice should match measurement quality and downstream needs.",
    "lessonKeywords": [
      "sample",
      "precision"
    ],
    "curriculumAreaIds": [
      "aqa-4-5",
      "ocr-1-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-advanced-systems-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "Registers",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "State the roles of the PC, MAR, MDR and CIR during instruction processing.",
    "markPoints": [
      "The PC holds the next instruction address, the MAR holds the address being accessed, the MDR carries data or instructions to/from memory, and the CIR holds the current instruction",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "The PC holds the next instruction address, the MAR holds the address being accessed, the MDR carries data or instructions to/from memory, and the CIR holds the current instruction.",
    "lessonKeywords": [
      "register",
      "fetch"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-systems-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "Cache",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain why cache memory can improve processor performance.",
    "markPoints": [
      "Cache is faster than main memory and stores recently or frequently used data and instructions, reducing average memory access time",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Cache is faster than main memory and stores recently or frequently used data and instructions, reducing average memory access time.",
    "lessonKeywords": [
      "cache",
      "memory"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-systems-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "Pipelining",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how pipelining increases throughput and why branches can reduce the benefit.",
    "markPoints": [
      "Pipelining overlaps different instruction stages so more instructions complete per unit time",
      "A branch can make the next instruction uncertain, causing stalls or discarded work after a misprediction",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Pipelining overlaps different instruction stages so more instructions complete per unit time. A branch can make the next instruction uncertain, causing stalls or discarded work after a misprediction.",
    "lessonKeywords": [
      "pipeline",
      "branch"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-systems-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "RISC CISC",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare typical RISC and CISC design approaches.",
    "markPoints": [
      "RISC emphasises simple regular instructions that can be easy to pipeline, while CISC offers richer complex instructions and addressing modes",
      "Modern processors may combine ideas from both",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "RISC emphasises simple regular instructions that can be easy to pipeline, while CISC offers richer complex instructions and addressing modes. Modern processors may combine ideas from both.",
    "lessonKeywords": [
      "risc",
      "cisc"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-systems-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "Virtual memory",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why virtual memory is used and why excessive paging reduces performance.",
    "markPoints": [
      "Virtual memory moves pages between RAM and secondary storage so programs can use a larger address space",
      "Secondary storage is far slower than RAM, so frequent paging or thrashing damages performance",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Virtual memory moves pages between RAM and secondary storage so programs can use a larger address space. Secondary storage is far slower than RAM, so frequent paging or thrashing damages performance.",
    "lessonKeywords": [
      "virtual",
      "paging"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-systems-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "Interrupt",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how the CPU can handle a keyboard event using an interrupt.",
    "markPoints": [
      "The device signals an interrupt, the CPU preserves its current context and executes an interrupt service routine",
      "After handling the event it restores the previous state and continues",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "The device signals an interrupt, the CPU preserves its current context and executes an interrupt service routine. After handling the event it restores the previous state and continues.",
    "lessonKeywords": [
      "interrupt",
      "keyboard"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-systems-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "Multicore",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate the claim that doubling processor cores doubles the speed of every program.",
    "markPoints": [
      "Only parallelisable work benefits",
      "Sequential sections, synchronisation, scheduling and memory contention limit speedup",
      "Highly parallel workloads may scale well, but doubling cores does not guarantee double performance",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "Only parallelisable work benefits. Sequential sections, synchronisation, scheduling and memory contention limit speedup. Highly parallel workloads may scale well, but doubling cores does not guarantee double performance.",
    "lessonKeywords": [
      "multicore",
      "parallel"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-systems-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-systems",
    "topicTitle": "Advanced Computer Systems",
    "subtopic": "Embedded choice",
    "specificationReferences": [
      "AQA 4.6/4.7",
      "OCR 1.1"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Discuss processor priorities for a battery-powered embedded control system.",
    "markPoints": [
      "The processor must meet timing needs while prioritising low power, predictable behaviour, reliability, thermal limits and cost",
      "Maximum desktop-style performance may be unnecessary; simpler or specialised hardware may be preferable",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "The processor must meet timing needs while prioritising low power, predictable behaviour, reliability, thermal limits and cost. Maximum desktop-style performance may be unnecessary; simpler or specialised hardware may be preferable.",
    "lessonKeywords": [
      "embedded",
      "power"
    ],
    "curriculumAreaIds": [
      "aqa-4-6",
      "aqa-4-7",
      "ocr-1-1"
    ]
  },
  {
    "id": "al-advanced-networks-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "Layering",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain one benefit of a layered network model.",
    "markPoints": [
      "Layering separates responsibilities behind defined interfaces, allowing protocols within one layer to change with limited effects elsewhere and supporting interoperability",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Layering separates responsibilities behind defined interfaces, allowing protocols within one layer to change with limited effects elsewhere and supporting interoperability.",
    "lessonKeywords": [
      "layer",
      "protocol"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-networks-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "DNS",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain the purpose of DNS.",
    "markPoints": [
      "DNS maps human-readable domain names to resource records such as IP addresses so clients can locate network services",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "DNS maps human-readable domain names to resource records such as IP addresses so clients can locate network services.",
    "lessonKeywords": [
      "dns",
      "domain"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-networks-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "TCP UDP",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 6,
    "question": "Compare TCP and UDP for an online multiplayer game.",
    "markPoints": [
      "TCP provides reliable ordered delivery but retransmission can add delay",
      "UDP has less overhead and suits time-sensitive updates that can tolerate loss",
      "Critical messages still need reliability",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "TCP provides reliable ordered delivery but retransmission can add delay. UDP has less overhead and suits time-sensitive updates that can tolerate loss. Critical messages still need reliability.",
    "lessonKeywords": [
      "tcp",
      "udp"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-networks-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "Routing",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain how a router forwards a packet toward another network.",
    "markPoints": [
      "The router examines the destination address, consults its routing table and selects an outgoing interface or next hop",
      "Routers repeat this until the packet reaches the destination network",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "The router examines the destination address, consults its routing table and selects an outgoing interface or next hop. Routers repeat this until the packet reaches the destination network.",
    "lessonKeywords": [
      "router",
      "routing"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-networks-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "HTTPS",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 6,
    "question": "Explain how public-key cryptography contributes to establishing HTTPS.",
    "markPoints": [
      "The server presents a certificate containing its public key",
      "The client validates it, asymmetric cryptography helps authenticate the server and establish session secrets, and symmetric encryption then protects normal traffic",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "The server presents a certificate containing its public key. The client validates it, asymmetric cryptography helps authenticate the server and establish session secrets, and symmetric encryption then protects normal traffic.",
    "lessonKeywords": [
      "https",
      "public key"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-networks-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "Brute force defence",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 6,
    "question": "Recommend controls for repeated password guessing against many accounts.",
    "markPoints": [
      "Use rate limiting, progressive delays or carefully designed lockout, MFA and monitoring",
      "Passwords should also be stored using strong salted hashes so a separate credential-store breach is less damaging",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "Use rate limiting, progressive delays or carefully designed lockout, MFA and monitoring. Passwords should also be stored using strong salted hashes so a separate credential-store breach is less damaging.",
    "lessonKeywords": [
      "brute",
      "authentication"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-networks-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "Latency",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Explain why increasing bandwidth does not always remove network latency.",
    "markPoints": [
      "Higher bandwidth reduces transmission delay but not propagation distance, processing time, protocol handshakes or queueing elsewhere",
      "End-to-end latency depends on every stage and bottleneck",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Higher bandwidth reduces transmission delay but not propagation distance, processing time, protocol handshakes or queueing elsewhere. End-to-end latency depends on every stage and bottleneck.",
    "lessonKeywords": [
      "latency",
      "bandwidth"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-networks-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-networks",
    "topicTitle": "Advanced Networks and Security",
    "subtopic": "Database exposure",
    "specificationReferences": [
      "AQA 4.9",
      "OCR 1.3"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate exposing an internal database directly to the public internet for remote staff.",
    "markPoints": [
      "Direct exposure increases attack surface",
      "Strong authentication and encryption are necessary but a VPN, application gateway or identity-aware proxy with segmentation is normally safer",
      "Direct exposure should be avoided unless strongly justified",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "Direct exposure increases attack surface. Strong authentication and encryption are necessary but a VPN, application gateway or identity-aware proxy with segmentation is normally safer. Direct exposure should be avoided unless strongly justified.",
    "lessonKeywords": [
      "security",
      "database"
    ],
    "curriculumAreaIds": [
      "aqa-4-9",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "Keys",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain the purpose of a primary key and a foreign key.",
    "markPoints": [
      "A primary key uniquely identifies a record",
      "A foreign key stores a key value referring to another table and creates a relationship between records",
      "Uses accurate Computer Science terminology"
    ],
    "modelAnswer": "A primary key uniquely identifies a record. A foreign key stores a key value referring to another table and creates a relationship between records.",
    "lessonKeywords": [
      "primary",
      "foreign"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "SQL SELECT",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "What do SELECT and FROM specify in a basic SQL query?",
    "markPoints": [
      "SELECT identifies fields or expressions to return; FROM identifies the table or tables from which the data is read",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "SELECT identifies fields or expressions to return; FROM identifies the table or tables from which the data is read.",
    "lessonKeywords": [
      "sql",
      "select"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "Normalisation",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 6,
    "question": "Explain how normalisation reduces update anomalies.",
    "markPoints": [
      "Normalisation separates facts into related tables so duplicated information is reduced",
      "Updates then occur in the appropriate place, lowering the chance of inconsistent copies while keys preserve relationships",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "Normalisation separates facts into related tables so duplicated information is reduced. Updates then occur in the appropriate place, lowering the chance of inconsistent copies while keys preserve relationships.",
    "lessonKeywords": [
      "normalisation",
      "anomaly"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "Join",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "programming",
    "difficulty": "standard",
    "marks": 5,
    "question": "Describe an SQL query that returns student names with their class names from related Student and Class tables.",
    "markPoints": [
      "Select Student.name and Class.className and join Student to Class on their matching classId values, for example using INNER JOIN",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "Select Student.name and Class.className and join Student to Class on their matching classId values, for example using INNER JOIN.",
    "lessonKeywords": [
      "sql",
      "join"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "Transactions",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 6,
    "question": "Explain why a bank transfer should be a database transaction.",
    "markPoints": [
      "The debit and credit are related operations that must commit together",
      "If one fails, rollback should prevent a partial transfer and preserve consistency",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "The debit and credit are related operations that must commit together. If one fails, rollback should prevent a partial transfer and preserve consistency.",
    "lessonKeywords": [
      "transaction",
      "bank"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "Index",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "evaluate",
    "difficulty": "standard",
    "marks": 6,
    "question": "Evaluate adding an index to a large column that is searched frequently but updated rarely.",
    "markPoints": [
      "An index can avoid full scans and improve search speed, while rare updates reduce maintenance overhead",
      "It uses storage and is most useful when queries can narrow results effectively",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "An index can avoid full scans and improve search speed, while rare updates reduce maintenance overhead. It uses storage and is most useful when queries can narrow results effectively.",
    "lessonKeywords": [
      "index",
      "query"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "Concurrency",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Explain why concurrent transactions may require isolation or locking.",
    "markPoints": [
      "Without control, overlapping transactions can cause lost updates, dirty reads or other anomalies",
      "Isolation through locking or versioning limits which intermediate states are visible and preserves required consistency",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Without control, overlapping transactions can cause lost updates, dirty reads or other anomalies. Isolation through locking or versioning limits which intermediate states are visible and preserves required consistency.",
    "lessonKeywords": [
      "isolation",
      "locking"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-advanced-databases-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "advanced-databases",
    "topicTitle": "Advanced Databases",
    "subtopic": "Schema design",
    "specificationReferences": [
      "AQA 4.10",
      "OCR 1.3/1.4"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A table repeats customer and product details for every order item. Evaluate a normalised redesign.",
    "markPoints": [
      "Separate Customer and Product tables, an Order table and an OrderItem relationship reduce duplication",
      "Primary and foreign keys preserve links and make updates more consistent, although queries may require joins",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Separate Customer and Product tables, an Order table and an OrderItem relationship reduce duplication. Primary and foreign keys preserve links and make updates more consistent, although queries may require joins.",
    "lessonKeywords": [
      "schema",
      "normalisation"
    ],
    "curriculumAreaIds": [
      "aqa-4-10",
      "ocr-1-3"
    ]
  },
  {
    "id": "al-big-data-01",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "Three Vs",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain volume, velocity and variety in big data.",
    "markPoints": [
      "Volume is the scale of data, velocity is the rate at which it arrives or must be processed, and variety is the range of formats and sources",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Volume is the scale of data, velocity is the rate at which it arrives or must be processed, and variety is the range of formats and sources.",
    "lessonKeywords": [
      "volume",
      "velocity"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-big-data-02",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "Data cleaning",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain why data cleaning is important before combining large datasets.",
    "markPoints": [
      "Cleaning standardises formats, resolves invalid or duplicate values and reduces inconsistencies that could distort analysis",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Cleaning standardises formats, resolves invalid or duplicate values and reduces inconsistencies that could distort analysis.",
    "lessonKeywords": [
      "cleaning",
      "quality"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-big-data-03",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "Distributed storage",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why distributed storage is useful for a dataset too large for one machine.",
    "markPoints": [
      "Data can be partitioned across machines, increasing combined capacity and enabling parallel access",
      "Replication can improve resilience, but coordination and network failure add complexity",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Data can be partitioned across machines, increasing combined capacity and enabling parallel access. Replication can improve resilience, but coordination and network failure add complexity.",
    "lessonKeywords": [
      "distributed",
      "storage"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-big-data-04",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "Map reduce",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Describe the general map-reduce idea for large-scale processing.",
    "markPoints": [
      "The input is partitioned and map operations process parts independently",
      "Intermediate results are then grouped or combined by reduce operations, allowing substantial parallel work",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "The input is partitioned and map operations process parts independently. Intermediate results are then grouped or combined by reduce operations, allowing substantial parallel work.",
    "lessonKeywords": [
      "map",
      "reduce"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-big-data-05",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "Bias",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 6,
    "question": "Explain how a very large dataset can still produce biased conclusions.",
    "markPoints": [
      "Size does not guarantee representativeness",
      "Collection may exclude groups, historical labels may encode bias and chosen variables can act as poor proxies",
      "Quality and sampling matter as much as quantity",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Size does not guarantee representativeness. Collection may exclude groups, historical labels may encode bias and chosen variables can act as poor proxies. Quality and sampling matter as much as quantity.",
    "lessonKeywords": [
      "bias",
      "data"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-big-data-06",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "Privacy",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 6,
    "question": "Discuss privacy risks when combining travel-card histories with mobile-location data.",
    "markPoints": [
      "Combining movement datasets can reveal sensitive routines and increase re-identification risk",
      "Data should be minimised, access restricted, retention limited and any anonymisation assessed carefully",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "Combining movement datasets can reveal sensitive routines and increase re-identification risk. Data should be minimised, access restricted, retention limited and any anonymisation assessed carefully.",
    "lessonKeywords": [
      "privacy",
      "location"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-big-data-07",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "More data",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Evaluate the claim that more training data always improves a machine-learning system.",
    "markPoints": [
      "Representative data can help, but noisy, duplicated or biased data may reduce quality or fairness",
      "Model design, validation, cost and privacy also matter, so quantity alone does not guarantee improvement",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Representative data can help, but noisy, duplicated or biased data may reduce quality or fairness. Model design, validation, cost and privacy also matter, so quantity alone does not guarantee improvement.",
    "lessonKeywords": [
      "machine",
      "training"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-big-data-08",
    "boards": [
      "AQA"
    ],
    "topicId": "big-data",
    "topicTitle": "Big Data",
    "subtopic": "City analytics",
    "specificationReferences": [
      "AQA 4.11"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "Discuss technical and ethical issues in using live sensor, ticketing and social-media data to predict crowding.",
    "markPoints": [
      "The system needs scalable ingestion, reliable integration and low-latency processing",
      "Security, privacy, representativeness and transparency are also important",
      "Predictions should be validated and used with awareness of their limitations",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "The system needs scalable ingestion, reliable integration and low-latency processing. Security, privacy, representativeness and transparency are also important. Predictions should be validated and used with awareness of their limitations.",
    "lessonKeywords": [
      "stream",
      "ethics"
    ],
    "curriculumAreaIds": [
      "aqa-4-11"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Data principles",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "State three principles relevant to processing personal data.",
    "markPoints": [
      "Valid examples include lawfulness and transparency, purpose limitation, data minimisation, accuracy, storage limitation, security and accountability",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Valid examples include lawfulness and transparency, purpose limitation, data minimisation, accuracy, storage limitation, security and accountability.",
    "lessonKeywords": [
      "privacy",
      "principles"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Licensing",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 3,
    "question": "Explain what a developer should check before using an online library in a commercial product.",
    "markPoints": [
      "Check the copyright licence, permission for commercial use and any attribution, redistribution, modification or source-disclosure conditions",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Check the copyright licence, permission for commercial use and any attribution, redistribution, modification or source-disclosure conditions.",
    "lessonKeywords": [
      "licence",
      "copyright"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Open source",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "compare",
    "difficulty": "standard",
    "marks": 5,
    "question": "Compare open-source and proprietary software for a critical organisational system.",
    "markPoints": [
      "Open source may allow inspection and modification but requires suitable support expertise",
      "Proprietary software may offer contractual vendor support but can increase licence cost and lock-in",
      "Security depends on the actual product and maintenance",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question"
    ],
    "modelAnswer": "Open source may allow inspection and modification but requires suitable support expertise. Proprietary software may offer contractual vendor support but can increase licence cost and lock-in. Security depends on the actual product and maintenance.",
    "lessonKeywords": [
      "open",
      "proprietary"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Accessibility",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why accessibility should be considered from the start of software design.",
    "markPoints": [
      "Accessibility affects structure, navigation and interaction choices",
      "Early consideration allows continuous testing, supports more users and avoids expensive redesign late in development",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term"
    ],
    "modelAnswer": "Accessibility affects structure, navigation and interaction choices. Early consideration allows continuous testing, supports more users and avoids expensive redesign late in development.",
    "lessonKeywords": [
      "accessibility",
      "design"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Automated ranking",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "evaluate",
    "difficulty": "standard",
    "marks": 6,
    "question": "Discuss issues when a university uses an automated system to rank applicants.",
    "markPoints": [
      "The university should validate accuracy and relevance, check for bias, minimise and protect personal data, provide transparency and human oversight, and offer a way to challenge consequential decisions",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly"
    ],
    "modelAnswer": "The university should validate accuracy and relevance, check for bias, minimise and protect personal data, provide transparency and human oversight, and offer a way to challenge consequential decisions.",
    "lessonKeywords": [
      "automation",
      "bias"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Environmental impact",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "evaluate",
    "difficulty": "standard",
    "marks": 6,
    "question": "Discuss the environmental impact of replacing computers every three years.",
    "markPoints": [
      "Frequent replacement increases manufacturing, raw-material and e-waste impacts",
      "Extending life, repairing and redeploying can reduce them, although energy efficiency and security support may justify some replacements",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate"
    ],
    "modelAnswer": "Frequent replacement increases manufacturing, raw-material and e-waste impacts. Extending life, repairing and redeploying can reduce them, although energy efficiency and security support may justify some replacements.",
    "lessonKeywords": [
      "environment",
      "hardware"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Facial recognition",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "scenario",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A school proposes facial recognition at every entrance. Evaluate legal and ethical concerns.",
    "markPoints": [
      "Biometric data is sensitive",
      "The school should assess necessity, proportionality, accuracy, bias, security, retention, transparency and less intrusive alternatives before deployment",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "Biometric data is sensitive. The school should assess necessity, proportionality, accuracy, bias, security, retention, transparency and less intrusive alternatives before deployment.",
    "lessonKeywords": [
      "facial",
      "privacy"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-legal-ethical-a-level-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "legal-ethical-a-level",
    "topicTitle": "Legal, Ethical and Social Issues",
    "subtopic": "Security disclosure",
    "specificationReferences": [
      "AQA 4.8",
      "OCR 1.5"
    ],
    "questionType": "extended-response",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A developer discovers a serious security flaw just before launch but management wants to release. Discuss professional responsibilities.",
    "markPoints": [
      "The developer should document and escalate the severity, consider likely user harm, legal duties and mitigations, and resist concealing material risk",
      "A serious exploitable flaw normally justifies delaying or restricting release until adequately mitigated",
      "Uses accurate Computer Science terminology",
      "Applies the explanation directly to the question",
      "Develops the reasoning rather than only naming a term",
      "Makes a justified conclusion where appropriate",
      "Links cause and effect clearly",
      "Uses a relevant example or consequence where appropriate"
    ],
    "modelAnswer": "The developer should document and escalate the severity, consider likely user harm, legal duties and mitigations, and resist concealing material risk. A serious exploitable flaw normally justifies delaying or restricting release until adequately mitigated.",
    "lessonKeywords": [
      "professional",
      "security"
    ],
    "curriculumAreaIds": [
      "aqa-4-8",
      "ocr-1-5"
    ]
  },
  {
    "id": "al-algorithms-a-level-01",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Graph traversal",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "short-answer",
    "difficulty": "foundation",
    "marks": 4,
    "question": "State one data structure commonly used by breadth-first search and one commonly used by depth-first search.",
    "markPoints": [
      "Breadth-first search commonly uses a queue.",
      "Depth-first search commonly uses a stack or recursion.",
      "Each structure determines the order in which frontier nodes are revisited.",
      "Both answers are linked to the correct traversal."
    ],
    "modelAnswer": "Breadth-first search normally uses a queue so vertices are explored level by level. Depth-first search normally uses a stack, either explicitly or through recursion, so one branch is followed before backtracking.",
    "lessonKeywords": [
      "graph",
      "breadth first",
      "depth first",
      "queue",
      "stack"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-02",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Breadth-first search",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 5,
    "question": "Explain why breadth-first search can find a shortest path measured by number of edges in an unweighted graph.",
    "markPoints": [
      "Vertices are explored in increasing distance from the start.",
      "All vertices at one depth are processed before deeper vertices.",
      "The first time a target is reached uses the minimum number of edges.",
      "A queue supports this traversal order.",
      "Applies only to unweighted/equal-cost edges."
    ],
    "modelAnswer": "BFS explores all vertices one edge away before vertices two edges away, and so on. Therefore the first time it reaches a target, no path with fewer edges can exist. This guarantee assumes each edge has equal cost.",
    "lessonKeywords": [
      "bfs",
      "shortest path",
      "graph"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-03",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Depth-first search",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "scenario",
    "difficulty": "standard",
    "marks": 5,
    "question": "A maze solver must explore a route deeply and backtrack when it reaches a dead end. Explain why depth-first search is a suitable strategy.",
    "markPoints": [
      "DFS follows one branch deeply.",
      "Uses stack/recursion.",
      "Dead end causes backtracking.",
      "Alternative branches are then explored.",
      "Matches maze-search behaviour."
    ],
    "modelAnswer": "DFS follows one route until it can go no further, then backtracks to the most recent choice point and tries another route. A stack or recursion naturally records the path of choices.",
    "lessonKeywords": [
      "dfs",
      "backtracking",
      "maze"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-04",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Dijkstra's algorithm",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 6,
    "question": "Explain how Dijkstra's algorithm finds shortest paths from one source in a graph with non-negative edge weights.",
    "markPoints": [
      "Stores tentative distances.",
      "Source starts at zero and others effectively infinity.",
      "Selects unvisited vertex with smallest tentative distance.",
      "Relaxes outgoing edges.",
      "Marks/settles processed vertex.",
      "Non-negative weights required for the standard guarantee."
    ],
    "modelAnswer": "Dijkstra's algorithm maintains the best known distance to each vertex. It repeatedly chooses the unvisited vertex with the smallest tentative distance and relaxes its outgoing edges. Once settled, that distance is final provided edge weights are non-negative.",
    "lessonKeywords": [
      "dijkstra",
      "weighted graph",
      "shortest path"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-05",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "A* search",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Compare A* search with Dijkstra's algorithm when a useful admissible heuristic is available.",
    "markPoints": [
      "Both accumulate path cost.",
      "Dijkstra uses path cost only.",
      "A* adds an estimated remaining cost.",
      "A useful heuristic can reduce explored states.",
      "Admissible heuristic can preserve optimality.",
      "If heuristic is zero A* behaves like Dijkstra."
    ],
    "modelAnswer": "Dijkstra expands according to cost from the start. A* combines that cost with a heuristic estimate to the goal. An admissible informative heuristic can guide the search toward the goal while preserving optimality and often exploring fewer states.",
    "lessonKeywords": [
      "a star",
      "dijkstra",
      "heuristic"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-06",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Binary search",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "trace",
    "difficulty": "standard",
    "marks": 5,
    "question": "A sorted array contains 3, 7, 12, 18, 25, 31, 44, 52, 68. Trace the key comparisons made by binary search when looking for 31.",
    "markPoints": [
      "First compares with middle value 25.",
      "31 is larger so lower half is discarded.",
      "Next comparison reaches 44 or the midpoint of remaining upper region depending on convention.",
      "Search narrows to 31.",
      "31 is found.",
      "Trace respects sorted-order halving."
    ],
    "modelAnswer": "Using a standard midpoint rule, compare with 25 first and discard the lower half because 31 is larger. Continue in the upper half, narrowing by comparison until 31 is selected and found.",
    "lessonKeywords": [
      "binary search",
      "trace",
      "search"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-07",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Merge sort",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "explain",
    "difficulty": "standard",
    "marks": 6,
    "question": "Explain how merge sort works and state its typical time complexity.",
    "markPoints": [
      "Divides data into smaller halves.",
      "Continues until trivial sublists.",
      "Merges sorted sublists.",
      "Merge step selects next smallest/largest item.",
      "Typical complexity O(n log n).",
      "Requires additional merge storage in common implementations."
    ],
    "modelAnswer": "Merge sort repeatedly divides the collection into halves, then merges sorted sublists by repeatedly taking the next item in order. Its time complexity is typically O(n log n), though common implementations use additional memory during merging.",
    "lessonKeywords": [
      "merge sort",
      "sorting",
      "complexity"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-08",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Quicksort",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Explain the role of the pivot in quicksort and why pivot choice can affect performance.",
    "markPoints": [
      "Pivot partitions values.",
      "Items placed on appropriate side relative to pivot.",
      "Partitions are sorted recursively.",
      "Balanced partitions give good performance.",
      "Poor pivots can create highly uneven partitions.",
      "Worst case can become quadratic."
    ],
    "modelAnswer": "Quicksort chooses a pivot and partitions the remaining values around it, then recursively sorts the partitions. Pivots that divide the data fairly evenly keep recursion shallow; consistently poor pivots can create near-linear-depth recursion and O(n squared) behaviour.",
    "lessonKeywords": [
      "quicksort",
      "pivot",
      "sorting"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-09",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Complexity",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "calculate",
    "difficulty": "standard",
    "marks": 4,
    "question": "An algorithm performs 4n squared + 9n + 50 basic operations. State its Big O time complexity and justify the answer.",
    "markPoints": [
      "States O(n^2).",
      "Identifies n squared as dominant term.",
      "Linear term ignored asymptotically.",
      "Constant ignored asymptotically."
    ],
    "modelAnswer": "The complexity is O(n^2). As n grows, the n-squared term dominates the growth rate, while the linear and constant terms do not change the asymptotic class.",
    "lessonKeywords": [
      "big o",
      "complexity"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-10",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Complexity classes",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "compare",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Compare O(log n), O(n) and O(n squared) growth for very large input sizes.",
    "markPoints": [
      "O(log n) grows slowest.",
      "O(n) grows proportionally with input.",
      "O(n^2) grows much faster.",
      "Differences become more significant as n increases.",
      "Connects to scalability.",
      "Avoids claiming Big O gives exact running time."
    ],
    "modelAnswer": "Logarithmic growth increases very slowly as input size grows, linear growth rises in direct proportion, and quadratic growth rises much more rapidly. For large inputs these growth-rate differences dominate scalability, although Big O does not specify exact execution time.",
    "lessonKeywords": [
      "complexity",
      "logarithmic",
      "linear",
      "quadratic"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-11",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Memoisation",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "explain",
    "difficulty": "advanced",
    "marks": 6,
    "question": "Explain how memoisation can improve an algorithm with overlapping subproblems.",
    "markPoints": [
      "Stores previously computed results.",
      "Checks cache before recomputing.",
      "Avoids repeated work.",
      "Useful when subproblems repeat.",
      "Trades memory for time.",
      "Can transform practical performance substantially."
    ],
    "modelAnswer": "Memoisation stores the result of a subproblem the first time it is solved. Later calls reuse the cached result instead of recomputing it. This is especially useful when recursive branches repeatedly encounter the same subproblems, trading additional memory for reduced execution time.",
    "lessonKeywords": [
      "memoisation",
      "dynamic programming",
      "recursion"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  },
  {
    "id": "al-algorithms-a-level-12",
    "boards": [
      "AQA",
      "OCR"
    ],
    "topicId": "algorithms-a-level",
    "topicTitle": "Algorithms",
    "subtopic": "Algorithm choice",
    "specificationReferences": [
      "AQA 4.3",
      "OCR H446 2.3"
    ],
    "questionType": "evaluate",
    "difficulty": "advanced",
    "marks": 8,
    "question": "A route-planning service must answer millions of path queries on a road network that changes only occasionally. Evaluate factors that should influence its algorithm and data-structure choices.",
    "markPoints": [
      "Weighted graph representation considered.",
      "Query volume encourages preprocessing/caching.",
      "Road changes affect update cost.",
      "Dijkstra/A* or related shortest-path methods considered.",
      "Heuristics may speed goal-directed queries.",
      "Memory usage considered.",
      "Latency and correctness considered.",
      "Justified trade-off."
    ],
    "modelAnswer": "The road network should be represented as a weighted graph because roads have different costs. Large query volume may justify preprocessing, indexes or cached route information, while infrequent updates make that preprocessing more attractive. Goal-directed algorithms such as A* can reduce search work when a suitable heuristic exists. The final design should balance latency, memory, update cost and guaranteed route quality.",
    "lessonKeywords": [
      "route planning",
      "algorithm choice",
      "graph"
    ],
    "curriculumAreaIds": [
      "aqa-4-3",
      "ocr-2-3",
      "ocr-1-4"
    ]
  }
] as ALevelPracticeQuestion[];

export function getALevelQuestionsForBoard(
  board: ALevelExamBoard,
): ALevelPracticeQuestion[] {
  return aLevelPracticeQuestions.filter((question) =>
    question.boards.includes(board),
  );
}

export function getALevelQuestionsForCurriculumArea(
  board: ALevelExamBoard,
  curriculumAreaId: string,
): ALevelPracticeQuestion[] {
  return getALevelQuestionsForBoard(board).filter(
    (question) =>
      question.curriculumAreaIds.includes(curriculumAreaId),
  );
}

export function getALevelQuestionsForTopic(
  board: ALevelExamBoard,
  topicId: string,
): ALevelPracticeQuestion[] {
  return getALevelQuestionsForBoard(board).filter(
    (question) => question.topicId === topicId,
  );
}

export function getALevelLessonQuestions({
  board,
  topicId,
  lessonTitle,
}: {
  board: ALevelExamBoard;
  topicId: string;
  lessonTitle: string;
}): ALevelPracticeQuestion[] {
  const pool = getALevelQuestionsForTopic(board, topicId);

  if (pool.length <= 4) {
    return pool;
  }

  const titleWords = lessonTitle
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 4);

  return pool
    .map((question) => {
      const haystack = [
        question.subtopic,
        question.question,
        ...(question.lessonKeywords || []),
      ]
        .join(" ")
        .toLowerCase();

      const score = titleWords.reduce(
        (total, word) =>
          total + (haystack.includes(word) ? 1 : 0),
        0,
      );

      return { question, score };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.question.id.localeCompare(b.question.id),
    )
    .map((item) => item.question);
}
