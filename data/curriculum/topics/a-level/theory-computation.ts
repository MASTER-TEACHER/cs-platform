import type { Topic } from "@/types/curriculum";

export const theoryComputationTopic: Topic = {
  "id": "theory-computation",
  "title": "Theory of Computation",
  "description": "Explore finite-state machines, regular languages, Turing machines and complexity.",
  "difficulty": "⭐⭐⭐",
  "estimatedTime": "75 mins",
  "status": "published",
  "unit": "A-level Theory of Computation",
  "specificationReferences": [
    "AQA 4.4",
    "OCR H446 2.1/2.3"
  ],
  "lessons": [
    {
      "id": "al-fsm",
      "title": "Finite-State Machines",
      "description": "Model state-based systems using transitions and accepting states.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Interpret state-transition diagrams.",
        "Trace input strings.",
        "Design a simple FSM."
      ],
      "explanation": "A finite-state machine has states and transitions triggered by inputs. A deterministic machine has one defined next state for a given state/input pair.",
      "workedExample": "A machine accepting binary strings ending in 1 can track the most recent bit and accept only in the state representing 1.",
      "practiceQuestions": [
        {
          "question": "What triggers a state transition?",
          "answer": "An input symbol or event"
        },
        {
          "question": "What does an accepting state mean?",
          "answer": "The input satisfies the accepted language or condition"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Can a deterministic FSM have two next states for the same state/input pair?",
          "answer": "No"
        }
      ],
      "examQuestion": {
        "question": "Explain how an FSM can recognise strings ending in 01.",
        "marks": 5,
        "answer": "The machine tracks enough recent input to know whether the current suffix is 01 and accepts only in the matching state.",
        "markScheme": [
          "Uses multiple states.",
          "Transitions respond to symbols.",
          "Tracks suffix information.",
          "Identifies accepting state.",
          "Rejects non-matching endings."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Describe a real system that can be modelled as an FSM."
    },
    {
      "id": "al-turing",
      "title": "Turing Machines",
      "description": "Understand the conceptual model of general algorithmic computation.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Describe tape, head, states and transition rules.",
        "Trace a short computation.",
        "Explain why the model matters."
      ],
      "explanation": "A Turing machine has an unbounded tape, a read/write head, a finite state and transition rules. It is a mathematical model of computation.",
      "workedExample": "A transition reads a symbol, writes a symbol, moves left or right and changes state.",
      "practiceQuestions": [
        {
          "question": "What can the head do?",
          "answer": "Read and write a symbol and move"
        },
        {
          "question": "What determines the next action?",
          "answer": "The current state and current symbol"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why are Turing machines important?",
          "answer": "They provide a formal model of computation"
        }
      ],
      "examQuestion": {
        "question": "Describe the components of a Turing machine and one transition.",
        "marks": 5,
        "answer": "It has tape, a read/write head and states; a rule uses the current state and symbol to write, move and enter the next state.",
        "markScheme": [
          "Tape.",
          "Read/write head.",
          "Finite states.",
          "Uses current state/symbol.",
          "Writes/moves/changes state."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain how a simple abstract machine can model general computation."
    },
    {
      "id": "al-complexity",
      "title": "Algorithmic Complexity",
      "description": "Compare algorithms using growth rates and resource requirements.",
      "estimatedTime": "25 mins",
      "xpReward": 120,
      "objectives": [
        "Explain best and worst cases.",
        "Compare common growth rates.",
        "Relate input size to performance."
      ],
      "explanation": "Complexity describes how resource use grows with input size. Constant, logarithmic, linear, quadratic and exponential behaviours scale differently.",
      "workedExample": "Binary search repeatedly halves the search space while linear search may inspect every item.",
      "practiceQuestions": [
        {
          "question": "Which search is logarithmic on sorted data?",
          "answer": "Binary search"
        },
        {
          "question": "What does quadratic growth mean?",
          "answer": "Work grows roughly with the square of input size"
        }
      ],
      "checkpointQuestions": [
        {
          "question": "Why can growth rate dominate constants for large inputs?",
          "answer": "Input growth eventually outweighs constant factors"
        }
      ],
      "examQuestion": {
        "question": "Compare linear and binary search in terms of prerequisites and efficiency.",
        "marks": 6,
        "answer": "Linear search works on unsorted data and can inspect n items. Binary search requires sorted data and repeatedly halves the search space.",
        "markScheme": [
          "Linear works unsorted.",
          "Linear worst case proportional to n.",
          "Binary requires sorted data.",
          "Binary halves search space.",
          "Logarithmic idea.",
          "Reasoned comparison."
        ],
        "guidance": [
          "Credit accurate equivalent terminology and developed reasoning."
        ]
      },
      "reflectionPrompt": "Explain why an algorithm fast for 100 items may fail at 10 million."
    }
  ]
};
