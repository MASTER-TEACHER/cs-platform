import { Quiz } from "@/types/quiz";

export const binaryQuiz: Quiz = {
  id: "binary-quiz",

  topicId: "binary",

  title: "Binary Numbers Quiz",

  description:
    "Test your understanding of binary numbers, place values, conversion and binary arithmetic.",

  estimatedTime: "8 mins",

  questions: [
    {
      id: "binary-q1",
      type: "multipleChoice",
      question: "Which digits are used in binary?",
      options: ["0 and 1", "1 and 2", "0 to 9", "A to F"],
      correctAnswer: "0 and 1",
      explanation:
        "Binary is base 2, so it only uses the digits 0 and 1.",
      xpReward: 10,
    },

    {
      id: "binary-q2",
      type: "shortAnswer",
      question: "Convert binary 1010 to denary.",
      correctAnswer: "10",
      explanation:
        "1010 uses place values 8, 4, 2 and 1, so 8 + 2 = 10.",
      xpReward: 10,
    },

    {
      id: "binary-q3",
      type: "trueFalse",
      question: "Binary is a base-10 number system.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation:
        "Binary is base 2, not base 10.",
      xpReward: 10,
    },

    {
      id: "binary-q4",
      type: "multipleChoice",
      question:
        "What is the place value of the leftmost bit in an 8-bit binary number?",
      options: ["8", "32", "64", "128"],
      correctAnswer: "128",
      explanation:
        "The 8-bit place values are 128, 64, 32, 16, 8, 4, 2 and 1.",
      xpReward: 10,
    },

    {
      id: "binary-q5",
      type: "shortAnswer",
      question: "Convert denary 13 to binary.",
      correctAnswer: "1101",
      explanation:
        "13 = 8 + 4 + 1, so the binary representation is 1101.",
      xpReward: 10,
    },

    {
      id: "binary-q6",
      type: "multipleChoice",
      question:
        "What is the largest unsigned denary value that can be stored in 8 bits?",
      options: ["127", "128", "255", "256"],
      correctAnswer: "255",
      explanation:
        "Eight unsigned bits can represent values from 0 to 255.",
      xpReward: 10,
    },

    {
      id: "binary-q7",
      type: "shortAnswer",
      question:
        "Add the binary numbers 0101 and 0011. Give your answer as 4 bits.",
      correctAnswer: "1000",
      explanation:
        "0101 is 5 and 0011 is 3. 5 + 3 = 8, which is 1000 in binary.",
      xpReward: 10,
    },

    {
      id: "binary-q8",
      type: "multipleChoice",
      question:
        "What does overflow mean when adding two fixed-width binary numbers?",
      options: [
        "The result requires more bits than are available",
        "The result contains only zeros",
        "The computer converts the result to hexadecimal",
        "The binary number becomes negative automatically",
      ],
      correctAnswer:
        "The result requires more bits than are available",
      explanation:
        "Overflow occurs when the result is too large to fit within the available number of bits.",
      xpReward: 10,
    },
  ],
};