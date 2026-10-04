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
  },
{
  "id": "al-advanced-programming-x01",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-programming",
  "topicTitle": "Advanced Programming",
  "subtopic": "Stack frames",
  "specificationReferences": [
    "AQA 4.1",
    "OCR 2.2"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 6,
  "question": "A recursive procedure is called three times before reaching its base case. Explain what information must be retained in each stack frame and why the frames are removed in reverse order.",
  "markPoints": [
    "Each call has its own frame",
    "Return address retained",
    "Parameters/local variables retained",
    "Frames follow LIFO order",
    "Deepest call returns first",
    "Links stack behaviour to recursion"
  ],
  "modelAnswer": "Each call has its own frame Return address retained Parameters/local variables retained Frames follow LIFO order Deepest call returns first Links stack behaviour to recursion",
  "lessonKeywords": [
    "stack",
    "frames"
  ],
  "curriculumAreaIds": [
    "aqa-4-1",
    "ocr-2-2"
  ]
},
{
  "id": "al-advanced-programming-x02",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-programming",
  "topicTitle": "Advanced Programming",
  "subtopic": "OOP polymorphism",
  "specificationReferences": [
    "AQA 4.1",
    "OCR 2.2"
  ],
  "questionType": "programming",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A list contains objects of subclasses Car and Bicycle, each overriding a method named move(). Write pseudocode that iterates through the list and calls the correct move() implementation. Explain why this demonstrates polymorphism.",
  "markPoints": [
    "Iterates through collection",
    "Calls item.move()",
    "No explicit type test required",
    "Same interface/message used",
    "Runtime/object determines implementation",
    "Identifies overriding",
    "Explains polymorphism"
  ],
  "modelAnswer": "Iterates through collection Calls item.move() No explicit type test required Same interface/message used Runtime/object determines implementation Identifies overriding Explains polymorphism",
  "lessonKeywords": [
    "oop",
    "polymorphism"
  ],
  "curriculumAreaIds": [
    "aqa-4-1",
    "ocr-2-2"
  ]
},
{
  "id": "al-advanced-programming-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-programming",
  "topicTitle": "Advanced Programming",
  "subtopic": "Reference parameters",
  "specificationReferences": [
    "AQA 4.1",
    "OCR 2.2"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 5,
  "question": "A procedure receives a reference to a list and appends 9 to it. The caller then outputs the list. Explain why the caller can observe the change and contrast this with passing an immutable integer value.",
  "markPoints": [
    "Reference identifies same mutable object",
    "Mutation affects shared object",
    "Caller therefore sees appended value",
    "Integer value is not the same mutable list object",
    "Distinguishes mutation from rebinding"
  ],
  "modelAnswer": "Reference identifies same mutable object Mutation affects shared object Caller therefore sees appended value Integer value is not the same mutable list object Distinguishes mutation from rebinding",
  "lessonKeywords": [
    "reference",
    "parameters"
  ],
  "curriculumAreaIds": [
    "aqa-4-1",
    "ocr-2-2"
  ]
},
{
  "id": "al-advanced-programming-x04",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-programming",
  "topicTitle": "Advanced Programming",
  "subtopic": "Exception handling",
  "specificationReferences": [
    "AQA 4.1",
    "OCR 2.2"
  ],
  "questionType": "programming",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Write pseudocode for reading an integer from a file where both a missing file and non-numeric data are handled without an uncontrolled crash.",
  "markPoints": [
    "Attempts file open",
    "Handles missing-file exception",
    "Attempts conversion",
    "Handles conversion exception",
    "Closes/resources handled appropriately",
    "Useful error/recovery action",
    "Program remains controlled"
  ],
  "modelAnswer": "Attempts file open Handles missing-file exception Attempts conversion Handles conversion exception Closes/resources handled appropriately Useful error/recovery action Program remains controlled",
  "lessonKeywords": [
    "exception",
    "handling"
  ],
  "curriculumAreaIds": [
    "aqa-4-1",
    "ocr-2-2"
  ]
},
{
  "id": "al-advanced-programming-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-programming",
  "topicTitle": "Advanced Programming",
  "subtopic": "Class design",
  "specificationReferences": [
    "AQA 4.1",
    "OCR 2.2"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A library system has Book, PrintedBook and EBook. Explain a suitable use of inheritance and one situation where composition would be preferable.",
  "markPoints": [
    "Common Book state/behaviour identified",
    "PrintedBook/EBook are specialisations",
    "Inheritance models is-a",
    "Composition models has-a",
    "Example component such as Licence/Publisher/Storage",
    "Justified design choice"
  ],
  "modelAnswer": "Common Book state/behaviour identified PrintedBook/EBook are specialisations Inheritance models is-a Composition models has-a Example component such as Licence/Publisher/Storage Justified design choice",
  "lessonKeywords": [
    "class",
    "design"
  ],
  "curriculumAreaIds": [
    "aqa-4-1",
    "ocr-2-2"
  ]
},
{
  "id": "al-advanced-programming-x06",
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
  "questionType": "programming",
  "difficulty": "advanced",
  "marks": 8,
  "question": "Write a recursive algorithm that returns the number of occurrences of target in a list. State the base case and explain how termination is guaranteed.",
  "markPoints": [
    "Base case empty/end of list",
    "Returns 0 at base",
    "Compares current item",
    "Adds 1 on match",
    "Recursive call on smaller remainder/index",
    "Correct result propagation",
    "Problem size decreases",
    "Termination explained"
  ],
  "modelAnswer": "Base case empty/end of list Returns 0 at base Compares current item Adds 1 on match Recursive call on smaller remainder/index Correct result propagation Problem size decreases Termination explained",
  "lessonKeywords": [
    "recursion"
  ],
  "curriculumAreaIds": [
    "aqa-4-1",
    "ocr-2-2"
  ]
},
{
  "id": "al-functional-programming-x01",
  "boards": [
    "AQA"
  ],
  "topicId": "functional-programming",
  "topicTitle": "Functional Programming",
  "subtopic": "Function types",
  "specificationReferences": [
    "AQA 4.12"
  ],
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 4,
  "question": "For a function length : String → Integer, identify the domain and co-domain and state the result type of applying length to 'COMPUTER'.",
  "markPoints": [
    "Domain is String",
    "Co-domain is Integer",
    "Application returns an Integer",
    "For COMPUTER result is 8"
  ],
  "modelAnswer": "Domain is String Co-domain is Integer Application returns an Integer For COMPUTER result is 8",
  "lessonKeywords": [
    "function",
    "types"
  ],
  "curriculumAreaIds": [
    "aqa-4-12"
  ]
},
{
  "id": "al-functional-programming-x02",
  "boards": [
    "AQA"
  ],
  "topicId": "functional-programming",
  "topicTitle": "Functional Programming",
  "subtopic": "Partial application",
  "specificationReferences": [
    "AQA 4.12"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 5,
  "question": "Given add : Integer → Integer → Integer and add x y = x + y, let add10 = add 10. Evaluate add10 7 and explain what add 10 returns.",
  "markPoints": [
    "add 10 returns a function",
    "Returned function awaits one Integer",
    "It adds 10 to its argument",
    "add10 7 = 17",
    "Explains partial application"
  ],
  "modelAnswer": "add 10 returns a function Returned function awaits one Integer It adds 10 to its argument add10 7 = 17 Explains partial application",
  "lessonKeywords": [
    "partial",
    "application"
  ],
  "curriculumAreaIds": [
    "aqa-4-12"
  ]
},
{
  "id": "al-functional-programming-x03",
  "boards": [
    "AQA"
  ],
  "topicId": "functional-programming",
  "topicTitle": "Functional Programming",
  "subtopic": "Composition",
  "specificationReferences": [
    "AQA 4.12"
  ],
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 5,
  "question": "Let f(x)=x+3 and g(x)=2x. Calculate (g ○ f)(5) and (f ○ g)(5), showing the order of application.",
  "markPoints": [
    "f(5)=8",
    "g(f(5))=16",
    "g(5)=10",
    "f(g(5))=13",
    "Shows composition order matters"
  ],
  "modelAnswer": "f(5)=8 g(f(5))=16 g(5)=10 f(g(5))=13 Shows composition order matters",
  "lessonKeywords": [
    "composition"
  ],
  "curriculumAreaIds": [
    "aqa-4-12"
  ]
},
{
  "id": "al-functional-programming-x04",
  "boards": [
    "AQA"
  ],
  "topicId": "functional-programming",
  "topicTitle": "Functional Programming",
  "subtopic": "First-class functions",
  "specificationReferences": [
    "AQA 4.12"
  ],
  "questionType": "programming",
  "difficulty": "standard",
  "marks": 6,
  "question": "Describe pseudocode for a function applyTwice(f, x) that returns f(f(x)). Explain which functional-programming property allows f to be passed in.",
  "markPoints": [
    "Function accepted as parameter",
    "Calls f(x)",
    "Calls f on first result",
    "Returns result",
    "Functions treated as first-class values",
    "Higher-order function identified"
  ],
  "modelAnswer": "Function accepted as parameter Calls f(x) Calls f on first result Returns result Functions treated as first-class values Higher-order function identified",
  "lessonKeywords": [
    "first",
    "class",
    "functions"
  ],
  "curriculumAreaIds": [
    "aqa-4-12"
  ]
},
{
  "id": "al-functional-programming-x05",
  "boards": [
    "AQA"
  ],
  "topicId": "functional-programming",
  "topicTitle": "Functional Programming",
  "subtopic": "Map/filter",
  "specificationReferences": [
    "AQA 4.12"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A list of temperatures must be converted from Celsius to Fahrenheit and then values below 32°F removed. Explain how map and filter could express this pipeline.",
  "markPoints": [
    "Map performs conversion on each item",
    "Conversion formula/function applied",
    "Filter applies predicate",
    "Below-32 values removed",
    "Operations compose as pipeline",
    "No need for explicit shared mutable accumulator"
  ],
  "modelAnswer": "Map performs conversion on each item Conversion formula/function applied Filter applies predicate Below-32 values removed Operations compose as pipeline No need for explicit shared mutable accumulator",
  "lessonKeywords": [
    "map",
    "filter"
  ],
  "curriculumAreaIds": [
    "aqa-4-12"
  ]
},
{
  "id": "al-functional-programming-x06",
  "boards": [
    "AQA"
  ],
  "topicId": "functional-programming",
  "topicTitle": "Functional Programming",
  "subtopic": "Functional evaluation",
  "specificationReferences": [
    "AQA 4.12"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "Evaluate using immutable data and pure functions in a concurrent data-processing service.",
  "markPoints": [
    "Pure functions avoid hidden side effects",
    "Immutability reduces shared-state races",
    "Easier testing/reasoning",
    "May allocate additional objects",
    "I/O/state still needs handling",
    "Performance trade-off",
    "Concurrency benefit contextualised",
    "Justified conclusion"
  ],
  "modelAnswer": "Pure functions avoid hidden side effects Immutability reduces shared-state races Easier testing/reasoning May allocate additional objects I/O/state still needs handling Performance trade-off Concurrency benefit contextualised Justified conclusion",
  "lessonKeywords": [
    "functional",
    "evaluation"
  ],
  "curriculumAreaIds": [
    "aqa-4-12"
  ]
},
{
  "id": "al-software-development-x01",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "software-development",
  "topicTitle": "Software Development",
  "subtopic": "Requirements",
  "specificationReferences": [
    "AQA 4.13",
    "OCR 1.2"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 5,
  "question": "A client says a search feature must be 'fast'. Rewrite this as a measurable success criterion and explain why the revised form is more testable.",
  "markPoints": [
    "Provides measurable threshold",
    "Defines relevant conditions/data size",
    "Can be objectively tested",
    "Removes ambiguity",
    "Links criterion to evaluation"
  ],
  "modelAnswer": "Provides measurable threshold Defines relevant conditions/data size Can be objectively tested Removes ambiguity Links criterion to evaluation",
  "lessonKeywords": [
    "requirements"
  ],
  "curriculumAreaIds": [
    "aqa-4-13",
    "ocr-1-2"
  ]
},
{
  "id": "al-software-development-x02",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "software-development",
  "topicTitle": "Software Development",
  "subtopic": "Black-box testing",
  "specificationReferences": [
    "AQA 4.13",
    "OCR 1.2"
  ],
  "questionType": "compare",
  "difficulty": "standard",
  "marks": 6,
  "question": "Compare black-box and white-box testing for a function containing several branches.",
  "markPoints": [
    "Black-box based on inputs/outputs/specification",
    "Does not require internal code knowledge",
    "White-box uses internal structure",
    "Can target branches/paths",
    "Each can reveal different defects",
    "Concludes complementary use"
  ],
  "modelAnswer": "Black-box based on inputs/outputs/specification Does not require internal code knowledge White-box uses internal structure Can target branches/paths Each can reveal different defects Concludes complementary use",
  "lessonKeywords": [
    "black",
    "box",
    "testing"
  ],
  "curriculumAreaIds": [
    "aqa-4-13",
    "ocr-1-2"
  ]
},
{
  "id": "al-software-development-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "software-development",
  "topicTitle": "Software Development",
  "subtopic": "Boundary analysis",
  "specificationReferences": [
    "AQA 4.13",
    "OCR 1.2"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A booking system accepts groups from 1 to 12 people. Design six tests that exercise normal, boundary and invalid cases.",
  "markPoints": [
    "Normal valid value",
    "1 accepted",
    "12 accepted",
    "0 rejected",
    "13 rejected",
    "Non-integer/type-invalid case"
  ],
  "modelAnswer": "Normal valid value 1 accepted 12 accepted 0 rejected 13 rejected Non-integer/type-invalid case",
  "lessonKeywords": [
    "boundary",
    "analysis"
  ],
  "curriculumAreaIds": [
    "aqa-4-13",
    "ocr-1-2"
  ]
},
{
  "id": "al-software-development-x04",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "software-development",
  "topicTitle": "Software Development",
  "subtopic": "Version control",
  "specificationReferences": [
    "AQA 4.13",
    "OCR 1.2"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "Two developers edit the same function on separate branches. Explain how version control supports their work and what a merge conflict means.",
  "markPoints": [
    "Branches isolate work",
    "Commits record changes",
    "Merge combines histories",
    "Conflict when changes cannot be reconciled automatically",
    "Developer resolves conflict",
    "History supports rollback/audit"
  ],
  "modelAnswer": "Branches isolate work Commits record changes Merge combines histories Conflict when changes cannot be reconciled automatically Developer resolves conflict History supports rollback/audit",
  "lessonKeywords": [
    "version",
    "control"
  ],
  "curriculumAreaIds": [
    "aqa-4-13",
    "ocr-1-2"
  ]
},
{
  "id": "al-software-development-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "software-development",
  "topicTitle": "Software Development",
  "subtopic": "Prototyping",
  "specificationReferences": [
    "AQA 4.13",
    "OCR 1.2"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A client is unsure how a new user interface should work. Evaluate using an iterative prototype before full implementation.",
  "markPoints": [
    "Early feedback",
    "Clarifies requirements",
    "Can expose usability issues",
    "Reduces risk of building wrong interface",
    "Prototype may create unrealistic expectations",
    "Time/cost or throwaway-code risk",
    "Justified conclusion"
  ],
  "modelAnswer": "Early feedback Clarifies requirements Can expose usability issues Reduces risk of building wrong interface Prototype may create unrealistic expectations Time/cost or throwaway-code risk Justified conclusion",
  "lessonKeywords": [
    "prototyping"
  ],
  "curriculumAreaIds": [
    "aqa-4-13",
    "ocr-1-2"
  ]
},
{
  "id": "al-software-development-x06",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "software-development",
  "topicTitle": "Software Development",
  "subtopic": "Testing strategy",
  "specificationReferences": [
    "AQA 4.13",
    "OCR 1.2"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "A team has 95% unit-test coverage but has performed no integration or user-acceptance testing. Evaluate whether the software is ready for release.",
  "markPoints": [
    "Coverage is useful evidence",
    "Coverage does not prove correctness",
    "Unit tests may miss interface failures",
    "Integration testing needed",
    "Acceptance testing checks user requirements",
    "Untested edge/nonfunctional concerns",
    "Risk-based release judgement",
    "Justified conclusion"
  ],
  "modelAnswer": "Coverage is useful evidence Coverage does not prove correctness Unit tests may miss interface failures Integration testing needed Acceptance testing checks user requirements Untested edge/nonfunctional concerns Risk-based release judgement Justified conclusion",
  "lessonKeywords": [
    "testing",
    "strategy"
  ],
  "curriculumAreaIds": [
    "aqa-4-13",
    "ocr-1-2"
  ]
},
{
  "id": "al-data-structures-x01",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "data-structures",
  "topicTitle": "Advanced Data Structures",
  "subtopic": "Stack trace",
  "specificationReferences": [
    "AQA 4.2",
    "OCR 1.4"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 5,
  "question": "Starting with an empty stack, perform PUSH A, PUSH B, POP, PUSH C, PUSH D, POP. State both popped values and the final stack from bottom to top.",
  "markPoints": [
    "First pop returns B",
    "Stack then A",
    "Push C then D",
    "Second pop returns D",
    "Final stack A,C"
  ],
  "modelAnswer": "First pop returns B Stack then A Push C then D Second pop returns D Final stack A,C",
  "lessonKeywords": [
    "stack",
    "trace"
  ],
  "curriculumAreaIds": [
    "aqa-4-2",
    "ocr-1-4"
  ]
},
{
  "id": "al-data-structures-x02",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "data-structures",
  "topicTitle": "Advanced Data Structures",
  "subtopic": "Queue trace",
  "specificationReferences": [
    "AQA 4.2",
    "OCR 1.4"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 5,
  "question": "A queue initially contains [P,Q] with P at the front. Perform ENQUEUE R, DEQUEUE, ENQUEUE S, DEQUEUE. State the dequeued values and final queue.",
  "markPoints": [
    "First dequeue P",
    "Queue Q,R",
    "Enqueue S",
    "Second dequeue Q",
    "Final queue R,S"
  ],
  "modelAnswer": "First dequeue P Queue Q,R Enqueue S Second dequeue Q Final queue R,S",
  "lessonKeywords": [
    "queue",
    "trace"
  ],
  "curriculumAreaIds": [
    "aqa-4-2",
    "ocr-1-4"
  ]
},
{
  "id": "al-data-structures-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "data-structures",
  "topicTitle": "Advanced Data Structures",
  "subtopic": "BST construction",
  "specificationReferences": [
    "AQA 4.2",
    "OCR 1.4"
  ],
  "questionType": "trace",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Insert 40, 25, 60, 10, 30, 50, 70 into an empty binary search tree. Describe the resulting parent-child relationships.",
  "markPoints": [
    "40 root",
    "25 left of 40",
    "60 right of 40",
    "10 left of 25",
    "30 right of 25",
    "50 left of 60",
    "70 right of 60"
  ],
  "modelAnswer": "40 root 25 left of 40 60 right of 40 10 left of 25 30 right of 25 50 left of 60 70 right of 60",
  "lessonKeywords": [
    "bst",
    "construction"
  ],
  "curriculumAreaIds": [
    "aqa-4-2",
    "ocr-1-4"
  ]
},
{
  "id": "al-data-structures-x04",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "data-structures",
  "topicTitle": "Advanced Data Structures",
  "subtopic": "Graph traversal",
  "specificationReferences": [
    "AQA 4.2",
    "OCR 1.4"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 6,
  "question": "A graph has adjacency lists A:[B,C], B:[D], C:[E], D:[], E:[]. Starting at A and visiting neighbours alphabetically, give BFS and DFS visit orders.",
  "markPoints": [
    "BFS begins A",
    "BFS A,B,C,D,E",
    "DFS begins A,B",
    "DFS reaches D before backtracking",
    "DFS then C,E",
    "Correct DFS A,B,D,C,E"
  ],
  "modelAnswer": "BFS begins A BFS A,B,C,D,E DFS begins A,B DFS reaches D before backtracking DFS then C,E Correct DFS A,B,D,C,E",
  "lessonKeywords": [
    "graph",
    "traversal"
  ],
  "curriculumAreaIds": [
    "aqa-4-2",
    "ocr-1-4"
  ]
},
{
  "id": "al-data-structures-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "data-structures",
  "topicTitle": "Advanced Data Structures",
  "subtopic": "Hashing",
  "specificationReferences": [
    "AQA 4.2",
    "OCR 1.4"
  ],
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 6,
  "question": "A hash table of size 10 uses key MOD 10 with linear probing. Insert keys 23, 43, 13, 27. State the final index of each key.",
  "markPoints": [
    "23 hashes 3",
    "43 collides then index 4",
    "13 collides at 3 and 4 then index 5",
    "27 hashes 7",
    "Shows linear probing",
    "Final mapping correct"
  ],
  "modelAnswer": "23 hashes 3 43 collides then index 4 13 collides at 3 and 4 then index 5 27 hashes 7 Shows linear probing Final mapping correct",
  "lessonKeywords": [
    "hashing"
  ],
  "curriculumAreaIds": [
    "aqa-4-2",
    "ocr-1-4"
  ]
},
{
  "id": "al-data-structures-x06",
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
  "question": "A text editor must support undo, a printer service must preserve arrival order, and a route planner stores weighted connections. Select and justify a suitable data structure for each.",
  "markPoints": [
    "Undo uses stack",
    "LIFO justification",
    "Printer uses queue",
    "FIFO justification",
    "Route network uses weighted graph",
    "Vertices/edges justification",
    "Recognises different access patterns",
    "Coherent overall justification"
  ],
  "modelAnswer": "Undo uses stack LIFO justification Printer uses queue FIFO justification Route network uses weighted graph Vertices/edges justification Recognises different access patterns Coherent overall justification",
  "lessonKeywords": [
    "structure",
    "choice"
  ],
  "curriculumAreaIds": [
    "aqa-4-2",
    "ocr-1-4"
  ]
},
{
  "id": "al-computational-thinking-x01",
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
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 5,
  "question": "A railway route model stores stations, connections and journey times but not station paint colours or shop layouts. Explain why this is an appropriate abstraction.",
  "markPoints": [
    "Retains relevant stations",
    "Retains connectivity",
    "Retains journey cost/time",
    "Omits irrelevant physical detail",
    "Simplifies route computation"
  ],
  "modelAnswer": "Retains relevant stations Retains connectivity Retains journey cost/time Omits irrelevant physical detail Simplifies route computation",
  "lessonKeywords": [
    "abstraction"
  ],
  "curriculumAreaIds": [
    "aqa-4-3",
    "ocr-2-1"
  ]
},
{
  "id": "al-computational-thinking-x02",
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
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "Decompose an online examination system into at least four meaningful subproblems and explain one interface between two of them.",
  "markPoints": [
    "Four valid components",
    "Authentication valid",
    "Question delivery valid",
    "Submission/marking/storage valid",
    "Interface identified",
    "Data exchanged across interface explained"
  ],
  "modelAnswer": "Four valid components Authentication valid Question delivery valid Submission/marking/storage valid Interface identified Data exchanged across interface explained",
  "lessonKeywords": [
    "decomposition"
  ],
  "curriculumAreaIds": [
    "aqa-4-3",
    "ocr-2-1"
  ]
},
{
  "id": "al-computational-thinking-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "computational-thinking",
  "topicTitle": "Computational Thinking",
  "subtopic": "State modelling",
  "specificationReferences": [
    "AQA 4.3",
    "OCR 2.1"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A vending machine can be Idle, HasCredit or Dispensing. Explain how state-based decomposition can help design its behaviour.",
  "markPoints": [
    "States represent meaningful conditions",
    "Inputs/events trigger transitions",
    "Actions depend on current state",
    "Prevents impossible behaviour",
    "Simplifies reasoning/testing",
    "Applies to scenario"
  ],
  "modelAnswer": "States represent meaningful conditions Inputs/events trigger transitions Actions depend on current state Prevents impossible behaviour Simplifies reasoning/testing Applies to scenario",
  "lessonKeywords": [
    "state",
    "modelling"
  ],
  "curriculumAreaIds": [
    "aqa-4-3",
    "ocr-2-1"
  ]
},
{
  "id": "al-computational-thinking-x04",
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
  "questionType": "evaluate",
  "difficulty": "standard",
  "marks": 6,
  "question": "A route finder uses straight-line distance to the destination as a heuristic. Explain why the quality of this estimate matters.",
  "markPoints": [
    "Heuristic estimates remaining cost",
    "More informative estimate can reduce explored states",
    "Must not overestimate if optimal A* required",
    "Poor heuristic approaches uninformed search",
    "Accuracy/performance trade-off",
    "Links to route finding"
  ],
  "modelAnswer": "Heuristic estimates remaining cost More informative estimate can reduce explored states Must not overestimate if optimal A* required Poor heuristic approaches uninformed search Accuracy/performance trade-off Links to route finding",
  "lessonKeywords": [
    "heuristic"
  ],
  "curriculumAreaIds": [
    "aqa-4-3",
    "ocr-2-1"
  ]
},
{
  "id": "al-computational-thinking-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "computational-thinking",
  "topicTitle": "Computational Thinking",
  "subtopic": "Parallel thinking",
  "specificationReferences": [
    "AQA 4.3",
    "OCR 2.1"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A problem contains four independent image-processing tasks followed by one final aggregation step. Explain which work can be parallelised and what dependency remains.",
  "markPoints": [
    "Four independent tasks can run concurrently",
    "Aggregation waits for required results",
    "Dependency/synchronisation identified",
    "Potential speed-up",
    "Limited by final serial work/overheads",
    "Correct decomposition"
  ],
  "modelAnswer": "Four independent tasks can run concurrently Aggregation waits for required results Dependency/synchronisation identified Potential speed-up Limited by final serial work/overheads Correct decomposition",
  "lessonKeywords": [
    "parallel",
    "thinking"
  ],
  "curriculumAreaIds": [
    "aqa-4-3",
    "ocr-2-1"
  ]
},
{
  "id": "al-computational-thinking-x06",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "computational-thinking",
  "topicTitle": "Computational Thinking",
  "subtopic": "Problem solving",
  "specificationReferences": [
    "AQA 4.3",
    "OCR 2.1"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "Evaluate whether the most computationally efficient algorithm is always the best engineering choice.",
  "markPoints": [
    "Efficiency important at scale",
    "Development complexity matters",
    "Maintainability/readability matter",
    "Memory trade-offs",
    "Input sizes matter",
    "Correctness/reliability matter",
    "Hardware/context matters",
    "Justified conclusion"
  ],
  "modelAnswer": "Efficiency important at scale Development complexity matters Maintainability/readability matter Memory trade-offs Input sizes matter Correctness/reliability matter Hardware/context matters Justified conclusion",
  "lessonKeywords": [
    "problem",
    "solving"
  ],
  "curriculumAreaIds": [
    "aqa-4-3",
    "ocr-2-1"
  ]
},
{
  "id": "al-theory-computation-x01",
  "boards": [
    "AQA"
  ],
  "topicId": "theory-computation",
  "topicTitle": "Theory of Computation",
  "subtopic": "FSM trace",
  "specificationReferences": [
    "AQA 4.4"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 6,
  "question": "An FSM has state S0 (start) and S1 (accept). Reading 1 toggles state; reading 0 leaves the state unchanged. Trace input 10111 and state whether it is accepted.",
  "markPoints": [
    "Start S0",
    "1 -> S1",
    "0 -> S1",
    "1 -> S0",
    "1 -> S1 then 1 -> S0",
    "Ends S0 so rejected"
  ],
  "modelAnswer": "Start S0 1 -> S1 0 -> S1 1 -> S0 1 -> S1 then 1 -> S0 Ends S0 so rejected",
  "lessonKeywords": [
    "fsm",
    "trace"
  ],
  "curriculumAreaIds": [
    "aqa-4-4"
  ]
},
{
  "id": "al-theory-computation-x02",
  "boards": [
    "AQA"
  ],
  "topicId": "theory-computation",
  "topicTitle": "Theory of Computation",
  "subtopic": "Regular expression",
  "specificationReferences": [
    "AQA 4.4"
  ],
  "questionType": "programming",
  "difficulty": "standard",
  "marks": 5,
  "question": "Write a regular expression over {0,1} for strings that begin with 1 and are followed by zero or more binary digits. Explain each part.",
  "markPoints": [
    "Begins with literal 1",
    "Character choice/group for 0 or 1",
    "Kleene star/repetition",
    "Allows no following digit",
    "Explanation matches expression"
  ],
  "modelAnswer": "Begins with literal 1 Character choice/group for 0 or 1 Kleene star/repetition Allows no following digit Explanation matches expression",
  "lessonKeywords": [
    "regular",
    "expression"
  ],
  "curriculumAreaIds": [
    "aqa-4-4"
  ]
},
{
  "id": "al-theory-computation-x03",
  "boards": [
    "AQA"
  ],
  "topicId": "theory-computation",
  "topicTitle": "Theory of Computation",
  "subtopic": "Turing machine",
  "specificationReferences": [
    "AQA 4.4"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 6,
  "question": "A Turing machine scans right over 1s until it finds a blank, writes 0 and halts. Starting with tape 111 followed by blanks and the head on the first 1, describe the final non-blank tape contents.",
  "markPoints": [
    "Moves across first 1",
    "Moves across second 1",
    "Moves across third 1",
    "Finds blank",
    "Writes 0",
    "Final contents 1110"
  ],
  "modelAnswer": "Moves across first 1 Moves across second 1 Moves across third 1 Finds blank Writes 0 Final contents 1110",
  "lessonKeywords": [
    "turing",
    "machine"
  ],
  "curriculumAreaIds": [
    "aqa-4-4"
  ]
},
{
  "id": "al-theory-computation-x04",
  "boards": [
    "AQA"
  ],
  "topicId": "theory-computation",
  "topicTitle": "Theory of Computation",
  "subtopic": "Classification",
  "specificationReferences": [
    "AQA 4.4"
  ],
  "questionType": "compare",
  "difficulty": "standard",
  "marks": 6,
  "question": "Compare a decision problem with an optimisation problem, giving one computing example of each.",
  "markPoints": [
    "Decision answer yes/no",
    "Optimisation seeks best feasible solution",
    "Decision example",
    "Optimisation example",
    "Distinction clear",
    "Examples correctly classified"
  ],
  "modelAnswer": "Decision answer yes/no Optimisation seeks best feasible solution Decision example Optimisation example Distinction clear Examples correctly classified",
  "lessonKeywords": [
    "classification"
  ],
  "curriculumAreaIds": [
    "aqa-4-4"
  ]
},
{
  "id": "al-theory-computation-x05",
  "boards": [
    "AQA"
  ],
  "topicId": "theory-computation",
  "topicTitle": "Theory of Computation",
  "subtopic": "Intractability",
  "specificationReferences": [
    "AQA 4.4"
  ],
  "questionType": "explain",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Explain why an algorithm with exponential time complexity may become impractical even when it works quickly for small inputs.",
  "markPoints": [
    "Exponential growth identified",
    "Small increase in n causes large work increase",
    "Example doubling/exponential factor",
    "Hardware speed-up does not remove growth class",
    "Small inputs may still be feasible",
    "Large inputs become infeasible",
    "Links complexity to practicality"
  ],
  "modelAnswer": "Exponential growth identified Small increase in n causes large work increase Example doubling/exponential factor Hardware speed-up does not remove growth class Small inputs may still be feasible Large inputs become infeasible Links complexity to practicality",
  "lessonKeywords": [
    "intractability"
  ],
  "curriculumAreaIds": [
    "aqa-4-4"
  ]
},
{
  "id": "al-theory-computation-x06",
  "boards": [
    "AQA"
  ],
  "topicId": "theory-computation",
  "topicTitle": "Theory of Computation",
  "subtopic": "Computability",
  "specificationReferences": [
    "AQA 4.4"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "Explain the significance of showing that a problem is non-computable rather than merely difficult to compute.",
  "markPoints": [
    "Non-computable means no algorithm solves all instances",
    "Different from high time complexity",
    "More hardware does not solve undecidability",
    "Approximation/restriction may still be possible",
    "Recognises limits of computation",
    "Avoids equating with slow",
    "Practical implication",
    "Clear conclusion"
  ],
  "modelAnswer": "Non-computable means no algorithm solves all instances Different from high time complexity More hardware does not solve undecidability Approximation/restriction may still be possible Recognises limits of computation Avoids equating with slow Practical implication Clear conclusion",
  "lessonKeywords": [
    "computability"
  ],
  "curriculumAreaIds": [
    "aqa-4-4"
  ]
},
{
  "id": "al-advanced-data-representation-x01",
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
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 5,
  "question": "Represent -37 as an 8-bit two's-complement value. Show your method.",
  "markPoints": [
    "37 = 00100101",
    "Invert -> 11011010",
    "Add 1 -> 11011011",
    "8-bit answer correct",
    "Method clear"
  ],
  "modelAnswer": "37 = 00100101 Invert -> 11011010 Add 1 -> 11011011 8-bit answer correct Method clear",
  "lessonKeywords": [
    "two",
    "s",
    "complement"
  ],
  "curriculumAreaIds": [
    "aqa-4-5",
    "ocr-1-4"
  ]
},
{
  "id": "al-advanced-data-representation-x02",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-data-representation",
  "topicTitle": "Advanced Data Representation",
  "subtopic": "Fixed point",
  "specificationReferences": [
    "AQA 4.5",
    "OCR 1.4"
  ],
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 6,
  "question": "An 8-bit fixed-point format uses 4 bits after the binary point. Represent 5.625 and state the smallest positive step size.",
  "markPoints": [
    "5 = 0101 integer portion",
    "0.625 = .1010",
    "Representation 01011010",
    "Four fractional bits",
    "Step = 2^-4",
    "Step = 0.0625"
  ],
  "modelAnswer": "5 = 0101 integer portion 0.625 = .1010 Representation 01011010 Four fractional bits Step = 2^-4 Step = 0.0625",
  "lessonKeywords": [
    "fixed",
    "point"
  ],
  "curriculumAreaIds": [
    "aqa-4-5",
    "ocr-1-4"
  ]
},
{
  "id": "al-advanced-data-representation-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-data-representation",
  "topicTitle": "Advanced Data Representation",
  "subtopic": "Floating point",
  "specificationReferences": [
    "AQA 4.5",
    "OCR 1.4"
  ],
  "questionType": "explain",
  "difficulty": "standard",
  "marks": 6,
  "question": "Explain why floating-point representation can represent a much wider range than fixed point using the same number of bits, and identify the trade-off.",
  "markPoints": [
    "Exponent changes scale",
    "Mantissa/significand stores significant digits",
    "Very large/small magnitudes possible",
    "Fixed point has fixed scale",
    "Finite precision causes rounding",
    "Range-precision trade-off"
  ],
  "modelAnswer": "Exponent changes scale Mantissa/significand stores significant digits Very large/small magnitudes possible Fixed point has fixed scale Finite precision causes rounding Range-precision trade-off",
  "lessonKeywords": [
    "floating",
    "point"
  ],
  "curriculumAreaIds": [
    "aqa-4-5",
    "ocr-1-4"
  ]
},
{
  "id": "al-advanced-data-representation-x04",
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
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 5,
  "question": "A binary floating-point mantissa is written 0.001101 × 2^5. Rewrite it in normalised form using a mantissa beginning 0.1 and adjust the exponent.",
  "markPoints": [
    "Moves binary point two places right",
    "Mantissa 0.1101",
    "Exponent reduced by 2",
    "New exponent 3",
    "Equivalent value retained"
  ],
  "modelAnswer": "Moves binary point two places right Mantissa 0.1101 Exponent reduced by 2 New exponent 3 Equivalent value retained",
  "lessonKeywords": [
    "normalisation"
  ],
  "curriculumAreaIds": [
    "aqa-4-5",
    "ocr-1-4"
  ]
},
{
  "id": "al-advanced-data-representation-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-data-representation",
  "topicTitle": "Advanced Data Representation",
  "subtopic": "Character encoding",
  "specificationReferences": [
    "AQA 4.5",
    "OCR 1.4"
  ],
  "questionType": "compare",
  "difficulty": "standard",
  "marks": 6,
  "question": "Compare ASCII and Unicode for a global messaging application.",
  "markPoints": [
    "ASCII limited character repertoire",
    "Unicode supports far more scripts/symbols",
    "Unicode suitable globally",
    "Encoding such as UTF-8 may use variable bytes",
    "ASCII may use less space for simple repertoire",
    "Justified suitability"
  ],
  "modelAnswer": "ASCII limited character repertoire Unicode supports far more scripts/symbols Unicode suitable globally Encoding such as UTF-8 may use variable bytes ASCII may use less space for simple repertoire Justified suitability",
  "lessonKeywords": [
    "character",
    "encoding"
  ],
  "curriculumAreaIds": [
    "aqa-4-5",
    "ocr-1-4"
  ]
},
{
  "id": "al-advanced-data-representation-x06",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-data-representation",
  "topicTitle": "Advanced Data Representation",
  "subtopic": "File calculation",
  "specificationReferences": [
    "AQA 4.5",
    "OCR 1.4"
  ],
  "questionType": "calculate",
  "difficulty": "advanced",
  "marks": 7,
  "question": "An uncompressed stereo audio clip is sampled at 44,100 Hz with 16-bit samples for 3 minutes. Calculate its approximate size in MiB, ignoring metadata.",
  "markPoints": [
    "180 seconds",
    "Two channels",
    "44100*16*2*180 bits",
    "Correct bit total",
    "Divide by 8 for bytes",
    "Divide by 1024^2",
    "Approximately 30.3 MiB"
  ],
  "modelAnswer": "180 seconds Two channels 44100*16*2*180 bits Correct bit total Divide by 8 for bytes Divide by 1024^2 Approximately 30.3 MiB",
  "lessonKeywords": [
    "file",
    "calculation"
  ],
  "curriculumAreaIds": [
    "aqa-4-5",
    "ocr-1-4"
  ]
},
{
  "id": "al-advanced-systems-x01",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-systems",
  "topicTitle": "Advanced Computer Systems",
  "subtopic": "FDE registers",
  "specificationReferences": [
    "AQA 4.6/4.7",
    "OCR 1.1"
  ],
  "questionType": "trace",
  "difficulty": "advanced",
  "marks": 7,
  "question": "At the start of a fetch cycle PC=240. Describe the roles and likely changes of PC, MAR, MDR and CIR as the instruction is fetched.",
  "markPoints": [
    "PC address copied to MAR",
    "Memory addressed via MAR",
    "Instruction transferred to MDR",
    "MDR copied to CIR",
    "PC incremented",
    "CIR holds current instruction",
    "Sequence linked correctly"
  ],
  "modelAnswer": "PC address copied to MAR Memory addressed via MAR Instruction transferred to MDR MDR copied to CIR PC incremented CIR holds current instruction Sequence linked correctly",
  "lessonKeywords": [
    "fde",
    "registers"
  ],
  "curriculumAreaIds": [
    "aqa-4-6",
    "aqa-4-7",
    "ocr-1-1"
  ]
},
{
  "id": "al-advanced-systems-x02",
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
  "marks": 6,
  "question": "Explain how instruction pipelining can increase processor throughput and why a branch may reduce the benefit.",
  "markPoints": [
    "Overlaps fetch/decode/execute stages",
    "Multiple instructions in pipeline",
    "Improves throughput not necessarily single-instruction latency",
    "Branch changes next instruction",
    "May flush/stall pipeline",
    "Performance penalty explained"
  ],
  "modelAnswer": "Overlaps fetch/decode/execute stages Multiple instructions in pipeline Improves throughput not necessarily single-instruction latency Branch changes next instruction May flush/stall pipeline Performance penalty explained",
  "lessonKeywords": [
    "pipelining"
  ],
  "curriculumAreaIds": [
    "aqa-4-6",
    "aqa-4-7",
    "ocr-1-1"
  ]
},
{
  "id": "al-advanced-systems-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-systems",
  "topicTitle": "Advanced Computer Systems",
  "subtopic": "RISC/CISC",
  "specificationReferences": [
    "AQA 4.6/4.7",
    "OCR 1.1"
  ],
  "questionType": "compare",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Compare RISC and CISC processor design, including instruction complexity, execution and compiler implications.",
  "markPoints": [
    "RISC simpler instruction set",
    "Often fixed/simple instructions",
    "CISC more complex instructions",
    "RISC may need more instructions per task",
    "Pipeline/decoding implications",
    "Compiler implications",
    "Balanced comparison"
  ],
  "modelAnswer": "RISC simpler instruction set Often fixed/simple instructions CISC more complex instructions RISC may need more instructions per task Pipeline/decoding implications Compiler implications Balanced comparison",
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
  "id": "al-advanced-systems-x04",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-systems",
  "topicTitle": "Advanced Computer Systems",
  "subtopic": "Parallel processing",
  "specificationReferences": [
    "AQA 4.6/4.7",
    "OCR 1.1"
  ],
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 6,
  "question": "A program takes 100 seconds. 80% can be perfectly parallelised across 4 cores while 20% remains serial. Ignoring overhead, calculate the new time and speed-up.",
  "markPoints": [
    "Parallel part 80 s",
    "80/4 = 20 s",
    "Serial part 20 s",
    "New time 40 s",
    "Speed-up 100/40",
    "Speed-up 2.5"
  ],
  "modelAnswer": "Parallel part 80 s 80/4 = 20 s Serial part 20 s New time 40 s Speed-up 100/40 Speed-up 2.5",
  "lessonKeywords": [
    "parallel",
    "processing"
  ],
  "curriculumAreaIds": [
    "aqa-4-6",
    "aqa-4-7",
    "ocr-1-1"
  ]
},
{
  "id": "al-advanced-systems-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-systems",
  "topicTitle": "Advanced Computer Systems",
  "subtopic": "Assembly",
  "specificationReferences": [
    "AQA 4.6/4.7",
    "OCR 1.1"
  ],
  "questionType": "trace",
  "difficulty": "standard",
  "marks": 6,
  "question": "Given LDA 20, ADD 21, STA 22 where memory[20]=7 and memory[21]=5, trace the accumulator and state memory[22] after execution.",
  "markPoints": [
    "LDA loads 7",
    "ACC=7",
    "ADD adds 5",
    "ACC=12",
    "STA stores ACC",
    "memory[22]=12"
  ],
  "modelAnswer": "LDA loads 7 ACC=7 ADD adds 5 ACC=12 STA stores ACC memory[22]=12",
  "lessonKeywords": [
    "assembly"
  ],
  "curriculumAreaIds": [
    "aqa-4-6",
    "aqa-4-7",
    "ocr-1-1"
  ]
},
{
  "id": "al-advanced-systems-x06",
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
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Evaluate the effect of relying heavily on virtual memory when a workstation runs a dataset larger than physical RAM.",
  "markPoints": [
    "Allows program/data beyond RAM capacity",
    "Uses secondary storage",
    "Secondary storage slower than RAM",
    "Paging/swapping overhead",
    "May cause thrashing",
    "Performance depends on access pattern",
    "Justified conclusion"
  ],
  "modelAnswer": "Allows program/data beyond RAM capacity Uses secondary storage Secondary storage slower than RAM Paging/swapping overhead May cause thrashing Performance depends on access pattern Justified conclusion",
  "lessonKeywords": [
    "virtual",
    "memory"
  ],
  "curriculumAreaIds": [
    "aqa-4-6",
    "aqa-4-7",
    "ocr-1-1"
  ]
},
{
  "id": "al-advanced-networks-x01",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-networks",
  "topicTitle": "Advanced Networks",
  "subtopic": "Bit and baud rate",
  "specificationReferences": [
    "AQA 4.9",
    "OCR 1.3"
  ],
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 5,
  "question": "A communication system sends 2400 symbols per second and each symbol represents 3 bits. Calculate the baud rate and bit rate.",
  "markPoints": [
    "Baud = symbols per second",
    "Baud rate 2400",
    "3 bits per symbol",
    "Bit rate 2400*3",
    "Bit rate 7200 bit/s"
  ],
  "modelAnswer": "Baud = symbols per second Baud rate 2400 3 bits per symbol Bit rate 2400*3 Bit rate 7200 bit/s",
  "lessonKeywords": [
    "bit",
    "and",
    "baud"
  ],
  "curriculumAreaIds": [
    "aqa-4-9",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-networks-x02",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-networks",
  "topicTitle": "Advanced Networks",
  "subtopic": "Serial/parallel",
  "specificationReferences": [
    "AQA 4.9",
    "OCR 1.3"
  ],
  "questionType": "compare",
  "difficulty": "standard",
  "marks": 6,
  "question": "Compare serial and parallel transmission over a long cable connection.",
  "markPoints": [
    "Serial sends bits sequentially",
    "Parallel sends multiple bits simultaneously",
    "Parallel susceptible to skew over distance",
    "Serial uses fewer wires/channels",
    "Serial often more reliable at high speed/distance",
    "Contextual conclusion"
  ],
  "modelAnswer": "Serial sends bits sequentially Parallel sends multiple bits simultaneously Parallel susceptible to skew over distance Serial uses fewer wires/channels Serial often more reliable at high speed/distance Contextual conclusion",
  "lessonKeywords": [
    "serial",
    "parallel"
  ],
  "curriculumAreaIds": [
    "aqa-4-9",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-networks-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-networks",
  "topicTitle": "Advanced Networks",
  "subtopic": "TCP/IP",
  "specificationReferences": [
    "AQA 4.9",
    "OCR 1.3"
  ],
  "questionType": "scenario",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A browser retrieves a web page from a remote server. Explain roles of DNS, IP, TCP and HTTP/HTTPS in the process.",
  "markPoints": [
    "DNS resolves name to IP address",
    "IP addressing/routing",
    "TCP reliable ordered transport",
    "Ports/connections acceptable",
    "HTTP requests/resources",
    "HTTPS adds TLS security",
    "Layers/protocol roles distinguished"
  ],
  "modelAnswer": "DNS resolves name to IP address IP addressing/routing TCP reliable ordered transport Ports/connections acceptable HTTP requests/resources HTTPS adds TLS security Layers/protocol roles distinguished",
  "lessonKeywords": [
    "tcp",
    "ip"
  ],
  "curriculumAreaIds": [
    "aqa-4-9",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-networks-x04",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-networks",
  "topicTitle": "Advanced Networks",
  "subtopic": "Subnetting",
  "specificationReferences": [
    "AQA 4.9",
    "OCR 1.3"
  ],
  "questionType": "calculate",
  "difficulty": "standard",
  "marks": 6,
  "question": "An IPv4 /27 subnet is used. Calculate the number of addresses in the subnet and the number normally available for host devices.",
  "markPoints": [
    "32-27=5 host bits",
    "2^5=32 addresses",
    "Network address reserved",
    "Broadcast address reserved",
    "30 usable hosts",
    "Correct reasoning"
  ],
  "modelAnswer": "32-27=5 host bits 2^5=32 addresses Network address reserved Broadcast address reserved 30 usable hosts Correct reasoning",
  "lessonKeywords": [
    "subnetting"
  ],
  "curriculumAreaIds": [
    "aqa-4-9",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-networks-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-networks",
  "topicTitle": "Advanced Networks",
  "subtopic": "Packet switching",
  "specificationReferences": [
    "AQA 4.9",
    "OCR 1.3"
  ],
  "questionType": "explain",
  "difficulty": "standard",
  "marks": 6,
  "question": "Explain why packets from one message may take different routes and how the destination reconstructs the data.",
  "markPoints": [
    "Message split into packets",
    "Routers choose routes independently",
    "Routes may differ with conditions",
    "Packets contain addressing/sequence information",
    "Destination reorders/reassembles",
    "Missing data can be handled by transport protocol"
  ],
  "modelAnswer": "Message split into packets Routers choose routes independently Routes may differ with conditions Packets contain addressing/sequence information Destination reorders/reassembles Missing data can be handled by transport protocol",
  "lessonKeywords": [
    "packet",
    "switching"
  ],
  "curriculumAreaIds": [
    "aqa-4-9",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-networks-x06",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-networks",
  "topicTitle": "Advanced Networks",
  "subtopic": "Network design",
  "specificationReferences": [
    "AQA 4.9",
    "OCR 1.3"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "A company needs reliable low-latency communication between two offices and secure remote access for home workers. Evaluate relevant network choices.",
  "markPoints": [
    "Bandwidth/latency requirements",
    "Leased/dedicated link or suitable WAN consideration",
    "Internet/VPN trade-off",
    "Encryption for remote access",
    "Authentication/MFA",
    "Redundancy/reliability",
    "Cost consideration",
    "Justified design"
  ],
  "modelAnswer": "Bandwidth/latency requirements Leased/dedicated link or suitable WAN consideration Internet/VPN trade-off Encryption for remote access Authentication/MFA Redundancy/reliability Cost consideration Justified design",
  "lessonKeywords": [
    "network",
    "design"
  ],
  "curriculumAreaIds": [
    "aqa-4-9",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-databases-x01",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-databases",
  "topicTitle": "Advanced Databases",
  "subtopic": "Normalisation",
  "specificationReferences": [
    "AQA 4.10",
    "OCR 1.3"
  ],
  "questionType": "scenario",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A table stores OrderID, CustomerID, CustomerName, ProductID, ProductName, Quantity, with many products per order. Explain how the design could be normalised.",
  "markPoints": [
    "Separate Customer entity",
    "Separate Product entity",
    "Separate Order entity",
    "OrderLine/junction entity",
    "Keys identified",
    "Reduces duplicated names/details",
    "Relationships preserved"
  ],
  "modelAnswer": "Separate Customer entity Separate Product entity Separate Order entity OrderLine/junction entity Keys identified Reduces duplicated names/details Relationships preserved",
  "lessonKeywords": [
    "normalisation"
  ],
  "curriculumAreaIds": [
    "aqa-4-10",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-databases-x02",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-databases",
  "topicTitle": "Advanced Databases",
  "subtopic": "SQL join",
  "specificationReferences": [
    "AQA 4.10",
    "OCR 1.3"
  ],
  "questionType": "programming",
  "difficulty": "standard",
  "marks": 6,
  "question": "Tables Student(StudentID,Name,ClassID) and Class(ClassID,Teacher) are related. Write SQL to list each student's Name and Teacher.",
  "markPoints": [
    "SELECT Student.Name, Class.Teacher",
    "FROM Student",
    "JOIN Class",
    "ON Student.ClassID = Class.ClassID",
    "Correct key relationship",
    "Syntactically coherent query"
  ],
  "modelAnswer": "SELECT Student.Name, Class.Teacher FROM Student JOIN Class ON Student.ClassID = Class.ClassID Correct key relationship Syntactically coherent query",
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
  "id": "al-advanced-databases-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-databases",
  "topicTitle": "Advanced Databases",
  "subtopic": "Aggregate SQL",
  "specificationReferences": [
    "AQA 4.10",
    "OCR 1.3"
  ],
  "questionType": "programming",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Write SQL to show each ClassID and its average Score from Results(ClassID,Score), but only for classes with an average of at least 60.",
  "markPoints": [
    "SELECT ClassID",
    "AVG(Score)",
    "FROM Results",
    "GROUP BY ClassID",
    "HAVING AVG(Score) >= 60",
    "Distinguishes HAVING from WHERE",
    "Complete query"
  ],
  "modelAnswer": "SELECT ClassID AVG(Score) FROM Results GROUP BY ClassID HAVING AVG(Score) >= 60 Distinguishes HAVING from WHERE Complete query",
  "lessonKeywords": [
    "aggregate",
    "sql"
  ],
  "curriculumAreaIds": [
    "aqa-4-10",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-databases-x04",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-databases",
  "topicTitle": "Advanced Databases",
  "subtopic": "Transactions",
  "specificationReferences": [
    "AQA 4.10",
    "OCR 1.3"
  ],
  "questionType": "explain",
  "difficulty": "standard",
  "marks": 6,
  "question": "A bank transfer subtracts money from one account and adds it to another. Explain why this should be treated as a transaction.",
  "markPoints": [
    "Operations form one logical unit",
    "Both changes should succeed or neither",
    "Atomicity",
    "Failure between updates risks inconsistency",
    "Rollback valid",
    "Consistency/integrity protected"
  ],
  "modelAnswer": "Operations form one logical unit Both changes should succeed or neither Atomicity Failure between updates risks inconsistency Rollback valid Consistency/integrity protected",
  "lessonKeywords": [
    "transactions"
  ],
  "curriculumAreaIds": [
    "aqa-4-10",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-databases-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-databases",
  "topicTitle": "Advanced Databases",
  "subtopic": "Indexing",
  "specificationReferences": [
    "AQA 4.10",
    "OCR 1.3"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Evaluate adding an index to a database column that is searched frequently but updated very often.",
  "markPoints": [
    "Index can speed retrieval",
    "Avoids/full scan reduction",
    "Index consumes storage",
    "Updates must maintain index",
    "Write performance can fall",
    "Benefit depends on query/update pattern",
    "Justified conclusion"
  ],
  "modelAnswer": "Index can speed retrieval Avoids/full scan reduction Index consumes storage Updates must maintain index Write performance can fall Benefit depends on query/update pattern Justified conclusion",
  "lessonKeywords": [
    "indexing"
  ],
  "curriculumAreaIds": [
    "aqa-4-10",
    "ocr-1-3"
  ]
},
{
  "id": "al-advanced-databases-x06",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "advanced-databases",
  "topicTitle": "Advanced Databases",
  "subtopic": "Concurrency",
  "specificationReferences": [
    "AQA 4.10",
    "OCR 1.3"
  ],
  "questionType": "scenario",
  "difficulty": "advanced",
  "marks": 7,
  "question": "Two users attempt to reserve the final seat at the same time. Explain the concurrency problem and one database mechanism that can prevent double booking.",
  "markPoints": [
    "Race condition/concurrent access",
    "Both may read seat as available",
    "Both may attempt update",
    "Transaction/locking/isolation",
    "Only one commit succeeds or serialised access",
    "Maintains consistency",
    "Applied explanation"
  ],
  "modelAnswer": "Race condition/concurrent access Both may read seat as available Both may attempt update Transaction/locking/isolation Only one commit succeeds or serialised access Maintains consistency Applied explanation",
  "lessonKeywords": [
    "concurrency"
  ],
  "curriculumAreaIds": [
    "aqa-4-10",
    "ocr-1-3"
  ]
},
{
  "id": "al-big-data-x01",
  "boards": [
    "AQA"
  ],
  "topicId": "big-data",
  "topicTitle": "Big Data",
  "subtopic": "Three Vs",
  "specificationReferences": [
    "AQA 4.11"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A social-media platform receives millions of text posts, images and live events each minute. Explain how volume, velocity and variety apply.",
  "markPoints": [
    "Volume: very large quantity",
    "Velocity: rapid/streaming arrival",
    "Variety: text/images/events",
    "Each applied to scenario",
    "Processing challenge linked",
    "Storage/analysis challenge linked"
  ],
  "modelAnswer": "Volume: very large quantity Velocity: rapid/streaming arrival Variety: text/images/events Each applied to scenario Processing challenge linked Storage/analysis challenge linked",
  "lessonKeywords": [
    "three",
    "vs"
  ],
  "curriculumAreaIds": [
    "aqa-4-11"
  ]
},
{
  "id": "al-big-data-x02",
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
  "marks": 6,
  "question": "Explain why a very large dataset may be partitioned across several machines rather than stored on one server.",
  "markPoints": [
    "Capacity beyond one machine",
    "Work can be distributed",
    "Parallel access/processing",
    "Potential resilience/replication",
    "Network/coordination overhead",
    "Scalability"
  ],
  "modelAnswer": "Capacity beyond one machine Work can be distributed Parallel access/processing Potential resilience/replication Network/coordination overhead Scalability",
  "lessonKeywords": [
    "distributed",
    "storage"
  ],
  "curriculumAreaIds": [
    "aqa-4-11"
  ]
},
{
  "id": "al-big-data-x03",
  "boards": [
    "AQA"
  ],
  "topicId": "big-data",
  "topicTitle": "Big Data",
  "subtopic": "MapReduce",
  "specificationReferences": [
    "AQA 4.11"
  ],
  "questionType": "trace",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A word-count MapReduce job processes 'cat dog cat' and 'dog bird'. Describe the map outputs and the final reduce results.",
  "markPoints": [
    "Map emits cat,1 etc.",
    "First record produces cat twice/dog once",
    "Second produces dog/bird",
    "Shuffle groups identical keys",
    "Reduce sums cat=2 dog=2",
    "bird=1",
    "Correct final mapping"
  ],
  "modelAnswer": "Map emits cat,1 etc. First record produces cat twice/dog once Second produces dog/bird Shuffle groups identical keys Reduce sums cat=2 dog=2 bird=1 Correct final mapping",
  "lessonKeywords": [
    "mapreduce"
  ],
  "curriculumAreaIds": [
    "aqa-4-11"
  ]
},
{
  "id": "al-big-data-x04",
  "boards": [
    "AQA"
  ],
  "topicId": "big-data",
  "topicTitle": "Big Data",
  "subtopic": "Data quality",
  "specificationReferences": [
    "AQA 4.11"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A company has a huge dataset collected from many sources but many records are incomplete or duplicated. Evaluate the claim that its size alone guarantees useful insight.",
  "markPoints": [
    "Size alone not sufficient",
    "Missing data harms analysis",
    "Duplicates can bias counts",
    "Source reliability matters",
    "Cleaning/integration required",
    "Relevant representative data matters",
    "Rejects claim with justification"
  ],
  "modelAnswer": "Size alone not sufficient Missing data harms analysis Duplicates can bias counts Source reliability matters Cleaning/integration required Relevant representative data matters Rejects claim with justification",
  "lessonKeywords": [
    "data",
    "quality"
  ],
  "curriculumAreaIds": [
    "aqa-4-11"
  ]
},
{
  "id": "al-big-data-x05",
  "boards": [
    "AQA"
  ],
  "topicId": "big-data",
  "topicTitle": "Big Data",
  "subtopic": "Streaming",
  "specificationReferences": [
    "AQA 4.11"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A fraud-detection system must react to card transactions within milliseconds. Explain why velocity changes the system design.",
  "markPoints": [
    "Data arrives continuously/rapidly",
    "Low response latency required",
    "Batch processing may be too slow",
    "Stream/online processing appropriate",
    "Scalable processing needed",
    "Timely decisions linked to fraud prevention"
  ],
  "modelAnswer": "Data arrives continuously/rapidly Low response latency required Batch processing may be too slow Stream/online processing appropriate Scalable processing needed Timely decisions linked to fraud prevention",
  "lessonKeywords": [
    "streaming"
  ],
  "curriculumAreaIds": [
    "aqa-4-11"
  ]
},
{
  "id": "al-big-data-x06",
  "boards": [
    "AQA"
  ],
  "topicId": "big-data",
  "topicTitle": "Big Data",
  "subtopic": "Big Data ethics",
  "specificationReferences": [
    "AQA 4.11"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "A retailer combines purchase history, location data and social-media profiles to predict customer behaviour. Evaluate technical and ethical issues.",
  "markPoints": [
    "Variety/integration challenge",
    "Data quality/linkage issues",
    "Privacy concern",
    "Consent/transparency",
    "Bias/profiling risk",
    "Security risk",
    "Potential business benefit",
    "Balanced justified conclusion"
  ],
  "modelAnswer": "Variety/integration challenge Data quality/linkage issues Privacy concern Consent/transparency Bias/profiling risk Security risk Potential business benefit Balanced justified conclusion",
  "lessonKeywords": [
    "big",
    "data",
    "ethics"
  ],
  "curriculumAreaIds": [
    "aqa-4-11"
  ]
},
{
  "id": "al-legal-ethical-a-level-x01",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "legal-ethical-a-level",
  "topicTitle": "Legal, Ethical and Social Issues",
  "subtopic": "Data protection",
  "specificationReferences": [
    "AQA 4.8",
    "OCR 1.5"
  ],
  "questionType": "scenario",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A health app keeps precise location and medical data indefinitely because it 'might be useful later'. Evaluate the practice.",
  "markPoints": [
    "Sensitive personal data",
    "Purpose limitation",
    "Data minimisation",
    "Retention concern",
    "Security risk increases with retained data",
    "Transparency/lawful basis consideration",
    "Justified conclusion"
  ],
  "modelAnswer": "Sensitive personal data Purpose limitation Data minimisation Retention concern Security risk increases with retained data Transparency/lawful basis consideration Justified conclusion",
  "lessonKeywords": [
    "data",
    "protection"
  ],
  "curriculumAreaIds": [
    "aqa-4-8",
    "ocr-1-5"
  ]
},
{
  "id": "al-legal-ethical-a-level-x02",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "legal-ethical-a-level",
  "topicTitle": "Legal, Ethical and Social Issues",
  "subtopic": "Copyright",
  "specificationReferences": [
    "AQA 4.8",
    "OCR 1.5"
  ],
  "questionType": "scenario",
  "difficulty": "standard",
  "marks": 6,
  "question": "A developer copies a substantial section of proprietary source code into a commercial product because the code was visible online. Explain the legal and professional issues.",
  "markPoints": [
    "Online visibility does not remove copyright",
    "Permission/licence matters",
    "Substantial copying may infringe rights",
    "Commercial use does not legitimise copying",
    "Professional attribution/licence compliance",
    "Alternative original/licensed implementation"
  ],
  "modelAnswer": "Online visibility does not remove copyright Permission/licence matters Substantial copying may infringe rights Commercial use does not legitimise copying Professional attribution/licence compliance Alternative original/licensed implementation",
  "lessonKeywords": [
    "copyright"
  ],
  "curriculumAreaIds": [
    "aqa-4-8",
    "ocr-1-5"
  ]
},
{
  "id": "al-legal-ethical-a-level-x03",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "legal-ethical-a-level",
  "topicTitle": "Legal, Ethical and Social Issues",
  "subtopic": "Automation",
  "specificationReferences": [
    "AQA 4.8",
    "OCR 1.5"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "A council replaces some customer-service roles with an AI chatbot. Evaluate social and ethical consequences.",
  "markPoints": [
    "Efficiency/availability benefit",
    "Potential job displacement/change",
    "Accessibility issues",
    "Incorrect advice/accountability",
    "Bias or exclusion",
    "Need human escalation",
    "Transparency",
    "Balanced conclusion"
  ],
  "modelAnswer": "Efficiency/availability benefit Potential job displacement/change Accessibility issues Incorrect advice/accountability Bias or exclusion Need human escalation Transparency Balanced conclusion",
  "lessonKeywords": [
    "automation"
  ],
  "curriculumAreaIds": [
    "aqa-4-8",
    "ocr-1-5"
  ]
},
{
  "id": "al-legal-ethical-a-level-x04",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "legal-ethical-a-level",
  "topicTitle": "Legal, Ethical and Social Issues",
  "subtopic": "Surveillance",
  "specificationReferences": [
    "AQA 4.8",
    "OCR 1.5"
  ],
  "questionType": "evaluate",
  "difficulty": "advanced",
  "marks": 8,
  "question": "A school proposes software that records every keystroke on student laptops, including use at home. Evaluate the proposal.",
  "markPoints": [
    "Safeguarding/security rationale",
    "Major privacy intrusion",
    "Proportionality",
    "Scope beyond school context",
    "Sensitive data/security",
    "Transparency",
    "Less intrusive alternatives",
    "Justified conclusion"
  ],
  "modelAnswer": "Safeguarding/security rationale Major privacy intrusion Proportionality Scope beyond school context Sensitive data/security Transparency Less intrusive alternatives Justified conclusion",
  "lessonKeywords": [
    "surveillance"
  ],
  "curriculumAreaIds": [
    "aqa-4-8",
    "ocr-1-5"
  ]
},
{
  "id": "al-legal-ethical-a-level-x05",
  "boards": [
    "AQA",
    "OCR"
  ],
  "topicId": "legal-ethical-a-level",
  "topicTitle": "Legal, Ethical and Social Issues",
  "subtopic": "Algorithmic decision",
  "specificationReferences": [
    "AQA 4.8",
    "OCR 1.5"
  ],
  "questionType": "scenario",
  "difficulty": "advanced",
  "marks": 7,
  "question": "A university uses an automated model to shortlist applicants. Explain controls needed to reduce unfair or unaccountable decisions.",
  "markPoints": [
    "Representative/appropriate data",
    "Bias testing",
    "Explainability/audit",
    "Human oversight/appeal",
    "Data protection",
    "Ongoing outcome monitoring",
    "Accountability"
  ],
  "modelAnswer": "Representative/appropriate data Bias testing Explainability/audit Human oversight/appeal Data protection Ongoing outcome monitoring Accountability",
  "lessonKeywords": [
    "algorithmic",
    "decision"
  ],
  "curriculumAreaIds": [
    "aqa-4-8",
    "ocr-1-5"
  ]
},
{
  "id": "al-legal-ethical-a-level-x06",
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
  "difficulty": "advanced",
  "marks": 7,
  "question": "A company moves computation to a large cloud provider and claims this automatically makes its computing environmentally sustainable. Evaluate the claim.",
  "markPoints": [
    "Cloud may improve utilisation",
    "Provider may use efficient cooling/hardware",
    "Energy source matters",
    "Network/data-centre energy remains",
    "Workload growth/rebound effect",
    "Embodied hardware impacts",
    "Claim not automatic"
  ],
  "modelAnswer": "Cloud may improve utilisation Provider may use efficient cooling/hardware Energy source matters Network/data-centre energy remains Workload growth/rebound effect Embodied hardware impacts Claim not automatic",
  "lessonKeywords": [
    "environmental",
    "impact"
  ],
  "curriculumAreaIds": [
    "aqa-4-8",
    "ocr-1-5"
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