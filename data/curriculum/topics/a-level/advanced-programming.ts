import type { Topic } from "@/types/curriculum";

export const advancedProgrammingTopic: Topic = {
  "id": "advanced-programming",
  "title": "Advanced Programming",
  "description": "Develop A-level programming skills including object orientation, recursion, robustness and persistent data.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "simulator": "python",
  "status": "published",
  "unit": "A-level Programming",
  "specificationReferences": [
    "AQA 4.1",
    "OCR H446 1.2/2.2"
  ],
  "lessons": [
    {
      "id": "al-oop",
      "title": "Object-Oriented Programming",
      "description": "Use classes, objects, encapsulation, inheritance and polymorphism.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "simulator": "python",
      "objectives": [
        "Explain classes and objects.",
        "Apply encapsulation and inheritance.",
        "Explain polymorphism and overriding."
      ],
      "explanation": "A class defines attributes and methods. Objects are instances. Encapsulation controls access to state; inheritance reuses behaviour; polymorphism allows a common interface to invoke different implementations.",
      "workedExample": "A Shape base class can define area(); Circle and Rectangle subclasses override area().",
      "practiceQuestions": [
        {
          "question": "What is an object?",
          "answer": "An instance of a class"
        },
        {
          "question": "What does encapsulation protect?",
          "answer": "An object's internal state"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What does method overriding allow?",
          "answer": "A subclass to provide its own implementation of an inherited method"
        }
      ],
      "examQuestion": {
        "question": "Explain two benefits of object-oriented programming for a large project.",
        "marks": 6,
        "answer": "Encapsulation improves modularity, classes support reuse, inheritance can reduce duplication and polymorphism supports extensible designs.",
        "markScheme": [
          "Identifies encapsulation/modularity.",
          "Explains a maintainability benefit.",
          "Identifies reuse/inheritance/polymorphism.",
          "Explains a second benefit.",
          "Links to large projects.",
          "Uses appropriate OOP terminology."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Give a situation where composition would be preferable to inheritance."
    },
    {
      "id": "al-recursion",
      "title": "Recursion and Call Stacks",
      "description": "Trace recursive algorithms and identify base and recursive cases.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Identify base and recursive cases.",
        "Trace recursive calls.",
        "Compare recursive and iterative approaches."
      ],
      "explanation": "A recursive subroutine calls itself on a smaller problem. A base case terminates recursion and active calls are stored on the call stack.",
      "workedExample": "factorial(4) expands through smaller calls until factorial(1), then results return through the stack.",
      "practiceQuestions": [
        {
          "question": "What prevents infinite recursion?",
          "answer": "A base case"
        },
        {
          "question": "Which structure stores active function calls?",
          "answer": "The call stack",
          "acceptedAnswers": [
            "Stack"
          ]
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What can happen if recursion is too deep?",
          "answer": "Stack overflow"
        }
      ],
      "examQuestion": {
        "question": "Explain why a base case is essential in a recursive algorithm.",
        "marks": 4,
        "answer": "The base case provides a terminating condition; without it calls can continue until resources such as the call stack are exhausted.",
        "markScheme": [
          "Identifies termination.",
          "Explains smaller recursive calls.",
          "Explains failure without base case.",
          "Mentions stack/resource exhaustion."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain when iteration may be preferable to recursion."
    },
    {
      "id": "al-defensive-programming",
      "title": "Defensive Programming",
      "description": "Design software that handles invalid data and exceptional situations.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Use validation and verification appropriately.",
        "Explain exception handling.",
        "Design robust input and file logic."
      ],
      "explanation": "Defensive programming anticipates invalid input, unavailable resources and unexpected states. Validation checks acceptability and exception handling provides controlled recovery.",
      "workedExample": "A file routine can catch a file-not-found error and ask for another filename rather than crash.",
      "practiceQuestions": [
        {
          "question": "Does validation prove data is correct?",
          "answer": "No"
        },
        {
          "question": "What is exception handling for?",
          "answer": "Handling runtime errors in a controlled way"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Give one defensive-programming technique.",
          "answer": "Input validation",
          "acceptedAnswers": [
            "Exception handling",
            "Range checking"
          ]
        }
      ],
      "examQuestion": {
        "question": "Explain how defensive programming improves reliability.",
        "marks": 5,
        "answer": "Validation rejects unsuitable data, exception handling prevents uncontrolled termination, and explicit error paths preserve system state.",
        "markScheme": [
          "Validation.",
          "Relevant example.",
          "Exception handling.",
          "Controlled recovery.",
          "Links techniques to reliability."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Identify three failure cases a program should handle before release."
    }
  ]
};
