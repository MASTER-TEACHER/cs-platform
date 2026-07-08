import { Quiz } from "@/types/quiz";

export const binaryQuiz: Quiz = {
  id: "binary-quiz",
  topicId: "binary",
  title: "Binary Numbers Quiz",
  description: "Test your understanding of binary numbers and conversion.",
  estimatedTime: "8 mins",

  questions: [
    {
      id: "binary-q1",
      type: "multipleChoice",
      question: "Which digits are used in binary?",
      options: ["0 and 1", "1 and 2", "0 to 9", "A to F"],
      correctAnswer: "0 and 1",
      explanation: "Binary is base 2, so it only uses the digits 0 and 1.",
      xpReward: 10,
    },
    {
      id: "binary-q2",
      type: "shortAnswer",
      question: "Convert binary 1010 to denary.",
      correctAnswer: "10",
      explanation: "1010 = 8 + 0 + 2 + 0 = 10.",
      xpReward: 10,
    },
    {
      id: "binary-q3",
      type: "trueFalse",
      question: "Binary is a base-10 number system.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation: "Binary is base 2, not base 10.",
      xpReward: 10,
    },
  ],
};