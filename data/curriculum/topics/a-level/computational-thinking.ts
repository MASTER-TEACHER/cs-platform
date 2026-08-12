import type { Topic } from "@/types/curriculum";

export const computationalThinkingTopic: Topic = {
  "id": "computational-thinking",
  "title": "Advanced Computational Thinking",
  "description": "Apply abstraction, decomposition, modelling and algorithm-choice reasoning to unfamiliar problems.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "50 mins",
  "status": "published",
  "unit": "A-level Algorithms and Problem Solving",
  "specificationReferences": [
    "AQA 4.3/4.13",
    "OCR H446 2.1"
  ],
  "lessons": [
    {
      "id": "al-abstraction",
      "title": "Abstraction and Modelling",
      "description": "Choose representations that preserve relevant detail.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain abstraction.",
        "Construct useful models.",
        "Evaluate model limitations."
      ],
      "explanation": "Abstraction focuses on information relevant to a purpose while hiding unnecessary detail. Models rely on assumptions.",
      "workedExample": "A route graph can model junctions and travel costs while ignoring building colours.",
      "practiceQuestions": [
        {
          "question": "What is abstraction?",
          "answer": "Removing or hiding irrelevant detail while retaining what matters"
        },
        {
          "question": "Why are models imperfect?",
          "answer": "They simplify reality and rely on assumptions"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can a detail be irrelevant in one model but important in another?",
          "answer": "Yes"
        }
      ],
      "examQuestion": {
        "question": "Explain abstraction in a route-planning system.",
        "marks": 5,
        "answer": "Represent locations/connections, retain relevant costs, omit irrelevant physical detail and recognise assumptions.",
        "markScheme": [
          "Relevant entities.",
          "Connections/costs.",
          "Removes irrelevant detail.",
          "Explains purpose.",
          "Recognises limitation."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Describe two different abstractions of the same system."
    },
    {
      "id": "al-decomposition",
      "title": "Decomposition and Interfaces",
      "description": "Break systems into cohesive modules with clear responsibilities.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Decompose a problem.",
        "Define module responsibilities.",
        "Explain interfaces and coupling."
      ],
      "explanation": "Decomposition divides complexity into manageable parts. Good modules communicate through defined interfaces and minimise unnecessary dependencies.",
      "workedExample": "A school system can separate authentication, student records, assessment and reporting.",
      "practiceQuestions": [
        {
          "question": "What is decomposition?",
          "answer": "Breaking a complex problem into smaller parts"
        },
        {
          "question": "What is a module interface?",
          "answer": "A defined way for components to communicate"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why reduce coupling?",
          "answer": "Changes in one module are less likely to break others"
        }
      ],
      "examQuestion": {
        "question": "Explain two benefits of modular decomposition.",
        "marks": 4,
        "answer": "It reduces complexity and supports independent development/testing; clear interfaces improve maintainability and reuse.",
        "markScheme": [
          "Reduces complexity.",
          "Developed benefit.",
          "Independent testing/development.",
          "Maintainability/reuse/interface benefit."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Decompose an exam platform into five modules."
    }
  ]
};
