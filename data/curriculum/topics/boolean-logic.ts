import type { Topic } from "@/types/curriculum";

export const booleanLogicTopic: Topic = {
  id: "boolean-logic",
  title: "Boolean Logic",
  description:
    "Use logic gates, Boolean expressions, truth tables and circuits.",
  difficulty: "⭐⭐☆",
  estimatedTime: "85 mins",
  status: "published",
  unit: "Boolean Logic",
  specificationReferences: ["AQA 3.4.3"],

  lessons: [
    {
      id: "and-or-not",
      title: "AND, OR and NOT Gates",
      description: "Understand and apply the three fundamental logic gates.",
      estimatedTime: "18 mins",
      xpReward: 80,
      simulator: "logic-gates",

      objectives: [
        "Describe AND, OR and NOT gates.",
        "Calculate outputs from given inputs.",
        "Recognise the behaviour of each fundamental gate.",
        "Write simple Boolean expressions.",
      ],

      explanation:
        "AND outputs 1 only when both inputs are 1. OR outputs 1 when at least one input is 1. NOT reverses a single input.",

      workedExample:
        "For A = 1 and B = 0: A AND B = 0, A OR B = 1 and NOT A = 0.",

      practiceQuestions: [
        {
          question: "What is 1 AND 1?",
          answer: "1",
        },
        {
          question: "What is 0 AND 1?",
          answer: "0",
        },
        {
          question: "What is 0 OR 1?",
          answer: "1",
        },
        {
          question: "What is 0 OR 0?",
          answer: "0",
        },
        {
          question: "What is NOT 1?",
          answer: "0",
        },
      ],

      checkpointQuestions: [
        {
          question: "What is NOT 0?",
          answer: "1",
        },
        {
          question: "When does an AND gate output 1?",
          answer: "When both inputs are 1",
          acceptedAnswers: ["Both inputs are 1", "When A and B are both 1"],
        },
      ],

      examQuestion: {
        question: "Describe when AND, OR and NOT gates output 1.",
        marks: 5,
        answer:
          "AND outputs 1 only when both inputs are 1. OR outputs 1 when at least one input is 1. NOT outputs 1 when its input is 0.",
        markScheme: [
          "AND requires both inputs to be 1.",
          "AND otherwise outputs 0.",
          "OR outputs 1 when at least one input is 1.",
          "NOT reverses its input.",
          "NOT outputs 1 when its input is 0.",
        ],
      },

      reflectionPrompt:
        "Give a real-world condition that could be modelled using an AND gate.",
    },

    {
      id: "compound-gates",
      title: "NAND, NOR and XOR Gates",
      description:
        "Investigate compound logic gates and compare their behaviour.",
      estimatedTime: "18 mins",
      xpReward: 90,
      simulator: "logic-gates",

      objectives: [
        "Describe NAND and NOR gates.",
        "Describe XOR.",
        "Calculate outputs for NAND, NOR and XOR.",
        "Compare compound gates with AND and OR.",
      ],

      explanation:
        "NAND is the opposite of AND. NOR is the opposite of OR. XOR outputs 1 when the two inputs are different.",

      workedExample: "For A = 1 and B = 0: NAND = 1, NOR = 0 and XOR = 1.",

      practiceQuestions: [
        {
          question: "What is 1 NAND 1?",
          answer: "0",
        },
        {
          question: "What is 0 NAND 0?",
          answer: "1",
        },
        {
          question: "What is 0 NOR 0?",
          answer: "1",
        },
        {
          question: "What is 1 NOR 0?",
          answer: "0",
        },
        {
          question: "What is 1 XOR 0?",
          answer: "1",
        },
        {
          question: "What is 1 XOR 1?",
          answer: "0",
        },
      ],

      checkpointQuestions: [
        {
          question: "When does XOR output 1?",
          answer: "When the inputs are different",
          acceptedAnswers: [
            "When both inputs are different",
            "When exactly one input is 1",
          ],
        },
        {
          question: "When does XOR output 0?",
          answer: "When both inputs are the same",
          acceptedAnswers: [
            "When the inputs match",
            "When both inputs are equal",
          ],
        },
      ],

      examQuestion: {
        question: "Compare OR and XOR.",
        marks: 4,
        answer:
          "OR outputs 1 when one or both inputs are 1. XOR outputs 1 only when exactly one input is 1.",
        markScheme: [
          "OR outputs 1 when at least one input is 1.",
          "OR outputs 1 when both inputs are 1.",
          "XOR outputs 1 when exactly one input is 1.",
          "XOR outputs 0 when the inputs are the same.",
        ],
      },

      reflectionPrompt:
        "Explain why XOR can be used to detect whether two binary inputs differ.",
    },

    {
      id: "truth-tables",
      title: "Truth Tables",
      description:
        "Construct and complete truth tables for Boolean expressions.",
      estimatedTime: "20 mins",
      xpReward: 95,
      simulator: "truth-table",

      objectives: [
        "List all possible input combinations.",
        "Calculate intermediate values.",
        "Complete output columns.",
        "Use truth tables to evaluate compound expressions.",
      ],

      explanation:
        "A truth table lists every possible input combination and its corresponding output. Two inputs create four combinations. Three inputs create eight combinations. Intermediate columns make compound expressions easier to evaluate accurately.",

      workedExample:
        "For Q = A AND NOT B, calculate NOT B first and then use that result with A in the AND operation.",

      practiceQuestions: [
        {
          question:
            "How many rows are needed for a truth table with two inputs?",
          answer: "4",
        },
        {
          question:
            "How many rows are needed for a truth table with three inputs?",
          answer: "8",
        },
        {
          question:
            "How many rows are needed for a truth table with four inputs?",
          answer: "16",
        },
      ],

      checkpointQuestions: [
        {
          question: "Why are intermediate columns useful in a truth table?",
          answer: "They break a compound expression into smaller calculations",
          acceptedAnswers: [
            "They make complex expressions easier to calculate",
            "They help reduce mistakes",
          ],
        },
      ],

      examQuestion: {
        question:
          "Give the outputs for Q = A AND NOT B for input rows 00, 01, 10 and 11.",
        marks: 4,
        answer: "0, 0, 1, 0",
        markScheme: [
          "Correct output for 00.",
          "Correct output for 01.",
          "Correct output for 10.",
          "Correct output for 11.",
        ],
      },

      reflectionPrompt:
        "Explain what happens to the number of truth-table rows each time another binary input is added.",
    },

    {
      id: "logic-circuits",
      title: "Logic Circuits",
      description: "Build, trace and evaluate connected logic-gate circuits.",
      estimatedTime: "29 mins",
      xpReward: 110,
      simulator: "logic-circuit",

      objectives: [
        "Build logic circuits using gates.",
        "Trace signals through connected gates.",
        "Calculate intermediate outputs.",
        "Translate circuits into Boolean expressions.",
        "Use multiple gates to create compound logic.",
      ],

      explanation:
        "Logic circuits combine gates to create more complex conditions. Work from the input side of the circuit towards the final output. Calculate each intermediate signal before moving to the next gate.",

      workedExample:
        "If X = A OR B and Q = X AND C, first calculate X. Then use X together with C to calculate Q.",

      practiceQuestions: [
        {
          question:
            "When tracing a logic circuit, which gates should normally be calculated first?",
          answer: "The gates nearest the inputs",
          acceptedAnswers: [
            "Input gates",
            "The first gates",
            "The gates closest to the inputs",
          ],
        },
        {
          question:
            "For X = A AND B and Q = X OR C, what is Q when A = 1, B = 1 and C = 0?",
          answer: "1",
        },
        {
          question:
            "For X = A OR B and Q = NOT X, what is Q when A = 0 and B = 0?",
          answer: "1",
        },
      ],

      checkpointQuestions: [
        {
          question:
            "Why should intermediate signals be labelled when tracing a circuit?",
          answer: "To make the circuit easier to trace",
          acceptedAnswers: [
            "To keep track of intermediate outputs",
            "To reduce errors",
          ],
        },
      ],

      examQuestion: {
        question:
          "For X = A OR B and Q = X AND C, calculate Q when A = 0, B = 1 and C = 1.",
        marks: 3,
        answer: "X = 1 and Q = 1.",
        markScheme: [
          "Calculates X as 1.",
          "Uses X and C with the AND gate.",
          "Calculates Q as 1.",
        ],
      },

      reflectionPrompt:
        "Design a Boolean expression for a security system that opens a door only when a valid card is detected AND the correct PIN is entered.",
    },
  ],
};
