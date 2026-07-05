import { Topic } from "@/types/curriculum";

export const binaryTopic: Topic = {
  id: "binary",
  title: "Binary Numbers",
  description: "Learn how computers represent data using binary numbers.",
  difficulty: "⭐☆☆",
  estimatedTime: "45 mins",
  simulator: "binary",

  lessons: [
    {
      id: "binary-intro",
      title: "Introduction to Binary",
      description: "Learn what binary numbers are.",
      estimatedTime: "10 mins",
      xpReward: 50,
      simulator: "binary",
      objectives: [
        "Understand that binary uses only 0 and 1.",
        "Explain why computers use binary.",
        "Identify binary place values.",
      ],
      explanation:
        "Binary is a base-2 number system. It only uses the digits 0 and 1. Computers use binary because electronic circuits can represent two states: on and off.",
      workedExample:
        "The binary number 1011 means 8 + 0 + 2 + 1, which equals 11 in denary.",
      practiceQuestions: [
        { question: "What two digits are used in binary?", answer: "0 and 1" },
        { question: "What is the denary value of binary 101?", answer: "5" },
      ],
      examQuestion: {
        question: "Explain why computers use binary.",
        marks: 2,
        answer:
          "Computers use binary because circuits can represent two states, such as on and off, using 1 and 0.",
      },
    },
    {
      id: "binary-conversion",
      title: "Binary Conversion",
      description: "Convert binary and denary numbers.",
      estimatedTime: "12 mins",
      xpReward: 50,
      simulator: "binary",
      objectives: [
        "Convert binary numbers into denary.",
        "Convert denary numbers into binary.",
        "Use binary place values accurately.",
      ],
      explanation:
        "To convert binary to denary, add the place values where the binary digit is 1. For example, 1011 uses 8, 2 and 1.",
      workedExample:
        "1011 = 8 + 0 + 2 + 1 = 11.",
      practiceQuestions: [
        { question: "Convert binary 1010 to denary.", answer: "10" },
        { question: "Convert denary 6 to binary.", answer: "110" },
      ],
      examQuestion: {
        question: "Convert the binary number 1101 into denary.",
        marks: 2,
        answer: "1101 = 8 + 4 + 0 + 1 = 13.",
      },
    },
    {
      id: "binary-addition",
      title: "Binary Addition",
      description: "Perform binary addition.",
      estimatedTime: "10 mins",
      xpReward: 75,
      simulator: "binary",
      objectives: [
        "Add binary numbers together.",
        "Understand carrying in binary addition.",
        "Apply binary addition rules correctly.",
      ],
      explanation:
        "Binary addition follows rules similar to denary addition, but only uses 0 and 1. For example, 1 + 1 gives 10 in binary.",
      workedExample:
        "101 + 011 = 1000.",
      practiceQuestions: [
        { question: "What is 1 + 1 in binary?", answer: "10" },
        { question: "Add 101 and 010.", answer: "111" },
      ],
      examQuestion: {
        question: "Add the binary numbers 0110 and 0011.",
        marks: 2,
        answer: "0110 + 0011 = 1001.",
      },
    },
  ],
};