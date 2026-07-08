import { Quiz } from "@/types/quiz";

export const hexadecimalQuiz: Quiz = {
  id: "hexadecimal-quiz",
  topicId: "hexadecimal",
  title: "Hexadecimal Quiz",
  description: "Test your understanding of hexadecimal numbers.",
  estimatedTime: "8 mins",

  questions: [
    {
      id: "hex-q1",
      type: "multipleChoice",
      question: "What base is hexadecimal?",
      options: ["2", "8", "10", "16"],
      correctAnswer: "16",
      explanation: "Hexadecimal is base 16.",
      xpReward: 10,
    },
    {
      id: "hex-q2",
      type: "shortAnswer",
      question: "What hexadecimal digit represents denary 15?",
      correctAnswer: "F",
      explanation: "In hexadecimal, A=10, B=11, C=12, D=13, E=14 and F=15.",
      xpReward: 10,
    },
    {
      id: "hex-q3",
      type: "trueFalse",
      question: "One hexadecimal digit can represent four binary bits.",
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: "Each hexadecimal digit maps to a group of four bits.",
      xpReward: 10,
    },
  ],
};