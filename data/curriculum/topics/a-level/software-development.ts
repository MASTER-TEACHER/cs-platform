import type { Topic } from "@/types/curriculum";

export const softwareDevelopmentTopic: Topic = {
  "id": "software-development",
  "title": "Software Development and Project Practice",
  "description": "Apply analysis, design, testing, version control, evaluation and documentation.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "status": "published",
  "unit": "A-level Software Development",
  "specificationReferences": [
    "AQA 4.13-4.14",
    "OCR H446 1.2/3"
  ],
  "lessons": [
    {
      "id": "al-analysis",
      "title": "Analysis and Design",
      "description": "Turn a problem into requirements and modular designs.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Identify stakeholders and requirements.",
        "Distinguish functional/non-functional requirements.",
        "Produce modular designs."
      ],
      "explanation": "Analysis establishes the problem, users, data and constraints. Design turns requirements into modules, algorithms and interfaces.",
      "workedExample": "A booking system can separate authentication, booking and reporting modules.",
      "practiceQuestions": [
        {
          "question": "What is a functional requirement?",
          "answer": "A service or behaviour the system must provide"
        },
        {
          "question": "What is a non-functional requirement?",
          "answer": "A quality or constraint such as performance or security"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why involve users?",
          "answer": "To establish accurate requirements"
        }
      ],
      "examQuestion": {
        "question": "Explain why analysis should happen before coding.",
        "marks": 5,
        "answer": "It clarifies the problem, stakeholders, requirements, data and constraints, reducing rework and supporting test criteria.",
        "markScheme": [
          "Problem definition.",
          "Stakeholders.",
          "Requirements.",
          "Data/constraints.",
          "Reduces rework/supports testing."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Write three functional and two non-functional requirements."
    },
    {
      "id": "al-testing",
      "title": "Testing Strategies",
      "description": "Design systematic testing across components and systems.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Use normal/boundary/erroneous data.",
        "Distinguish unit/integration/system testing.",
        "Explain regression testing."
      ],
      "explanation": "Unit tests target components, integration tests interactions, system tests the complete product, and regression tests detect new faults after changes.",
      "workedExample": "A validation routine can be tested just below, at and just above each boundary.",
      "practiceQuestions": [
        {
          "question": "What is boundary testing?",
          "answer": "Testing at the edges of valid ranges"
        },
        {
          "question": "What is regression testing?",
          "answer": "Retesting after changes to find newly introduced faults"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What does integration testing focus on?",
          "answer": "Interactions between components"
        }
      ],
      "examQuestion": {
        "question": "Design a test strategy for a login and booking system.",
        "marks": 6,
        "answer": "Include unit tests, boundary/error data, integration tests, system tests and regression after fixes.",
        "markScheme": [
          "Unit tests.",
          "Boundary/error data.",
          "Integration.",
          "System testing.",
          "Regression.",
          "Links tests to requirements."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain why passing unit tests is not enough."
    },
    {
      "id": "al-evaluation",
      "title": "Evaluation and Documentation",
      "description": "Judge a solution against requirements and communicate how it works.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Evaluate against criteria.",
        "Distinguish user/technical documentation.",
        "Identify justified improvements."
      ],
      "explanation": "Evaluation compares evidence with success criteria. Documentation helps users operate the system and developers maintain it.",
      "workedExample": "A project evaluation cites test evidence for each criterion, limitations and justified improvements.",
      "practiceQuestions": [
        {
          "question": "What should evaluation be compared against?",
          "answer": "Requirements or success criteria"
        },
        {
          "question": "Who is technical documentation for?",
          "answer": "Developers and maintainers"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What makes an improvement justified?",
          "answer": "It is linked to evidence, limitations or user needs"
        }
      ],
      "examQuestion": {
        "question": "Explain how a programming project should be evaluated.",
        "marks": 5,
        "answer": "Use testing and user feedback, compare results with success criteria, identify limitations and propose justified improvements.",
        "markScheme": [
          "Success criteria.",
          "Test evidence.",
          "Feedback.",
          "Limitation.",
          "Justified improvement."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Write an evidence-based evaluation paragraph."
    }
  ]
};
