import type { Topic } from "@/types/curriculum";

export const functionalProgrammingTopic: Topic = {
  "id": "functional-programming",
  "title": "Functional Programming",
  "description": "Understand pure functions, immutability, higher-order functions and recursion.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "50 mins",
  "status": "published",
  "unit": "A-level Programming Paradigms",
  "specificationReferences": [
    "AQA 4.12",
    "OCR H446 1.2"
  ],
  "lessons": [
    {
      "id": "al-functional-core",
      "title": "Functional Programming Principles",
      "description": "Contrast functional and imperative approaches.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain pure functions.",
        "Explain immutability.",
        "Compare paradigms."
      ],
      "explanation": "Functional programming emphasises expressions, pure functions and immutable data. A pure function depends only on its inputs and avoids external side effects.",
      "workedExample": "square(x) returns x*x without modifying global state.",
      "practiceQuestions": [
        {
          "question": "What is a pure function?",
          "answer": "A function whose result depends only on its inputs and has no side effects"
        },
        {
          "question": "What is immutability?",
          "answer": "Data is not changed after creation"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why are pure functions easier to test?",
          "answer": "Same inputs produce the same outputs"
        }
      ],
      "examQuestion": {
        "question": "Compare functional and imperative programming.",
        "marks": 6,
        "answer": "Imperative programs change state through commands; functional programs emphasise expressions, pure functions and immutable data.",
        "markScheme": [
          "Imperative/state idea.",
          "Functional/expression idea.",
          "Immutability.",
          "Pure functions.",
          "Valid benefit.",
          "Balanced comparison."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Rewrite a state-changing calculation as a pure function."
    },
    {
      "id": "al-hof",
      "title": "Higher-Order Functions",
      "description": "Understand map, filter and reduce patterns.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Define higher-order function.",
        "Explain map/filter/reduce.",
        "Compose transformations."
      ],
      "explanation": "A higher-order function takes a function as an argument or returns one. Map transforms, filter selects and reduce combines.",
      "workedExample": "Filter positive scores, map them to percentages and reduce them to a total.",
      "practiceQuestions": [
        {
          "question": "What does map return?",
          "answer": "A transformed collection"
        },
        {
          "question": "What does filter do?",
          "answer": "Keeps items satisfying a condition"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "What does reduce produce?",
          "answer": "A combined accumulated result"
        }
      ],
      "examQuestion": {
        "question": "Explain how map, filter and reduce could process exam scores.",
        "marks": 5,
        "answer": "Filter selects relevant scores, map transforms each value and reduce combines values into a total or aggregate.",
        "markScheme": [
          "Filter role.",
          "Map role.",
          "Reduce role.",
          "Valid example.",
          "Coherent pipeline."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Design a three-stage functional pipeline."
    }
  ]
};
