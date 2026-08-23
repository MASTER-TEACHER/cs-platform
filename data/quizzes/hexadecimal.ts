import { Quiz } from "@/types/quiz";

export const hexadecimalQuiz: Quiz = {
  id: "hexadecimal-quiz",

  topicId: "hexadecimal",

  title: "Hexadecimal Quiz",

  description:
    "Test your understanding of hexadecimal values, conversion and binary representation.",

  estimatedTime: "8 mins",

  questions: [
    {
      id: "hex-q1",
      type: "multipleChoice",
      question: "What base is hexadecimal?",
      options: ["2", "8", "10", "16"],
      correctAnswer: "16",
      explanation:
        "Hexadecimal is a base-16 number system.",
      xpReward: 10,
    },

    {
      id: "hex-q2",
      type: "shortAnswer",
      question:
        "What hexadecimal digit represents denary 15?",
      correctAnswer: "F",
      explanation:
        "In hexadecimal, A=10, B=11, C=12, D=13, E=14 and F=15.",
      xpReward: 10,
    },

    {
      id: "hex-q3",
      type: "trueFalse",
      question:
        "One hexadecimal digit can represent four binary bits.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation:
        "Four binary bits can represent 16 values, from 0 to 15, which matches one hexadecimal digit.",
      xpReward: 10,
    },

    {
      id: "hex-q4",
      type: "multipleChoice",
      question:
        "Which hexadecimal digit represents denary 10?",
      options: ["A", "B", "E", "F"],
      correctAnswer: "A",
      explanation:
        "Hexadecimal uses A to represent the denary value 10.",
      xpReward: 10,
    },

    {
      id: "hex-q5",
      type: "shortAnswer",
      question:
        "Convert hexadecimal 1A to denary.",
      correctAnswer: "26",
      explanation:
        "1A means 1 × 16 + 10, which equals 26.",
      xpReward: 10,
    },

    {
      id: "hex-q6",
      type: "multipleChoice",
      question:
        "Which binary value is equivalent to hexadecimal F?",
      options: ["1010", "1100", "1110", "1111"],
      correctAnswer: "1111",
      explanation:
        "Hexadecimal F represents denary 15, which is 1111 in binary.",
      xpReward: 10,
    },

    {
      id: "hex-q7",
      type: "shortAnswer",
      question:
        "Convert binary 10101111 to hexadecimal.",
      correctAnswer: "AF",
      explanation:
        "Split the binary number into nibbles: 1010 is A and 1111 is F, giving AF.",
      xpReward: 10,
    },

    {
      id: "hex-q8",
      type: "multipleChoice",
      question:
        "Why is hexadecimal commonly used when working with binary data?",
      options: [
        "It provides a shorter representation of long binary values",
        "It increases the amount of data that can be stored",
        "It removes the need for binary",
        "It allows computers to use base 10 internally",
      ],
      correctAnswer:
        "It provides a shorter representation of long binary values",
      explanation:
        "One hexadecimal digit represents four binary bits, making long binary values easier for humans to read and write.",
      xpReward: 10,
    },
  ],
};