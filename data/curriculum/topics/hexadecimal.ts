import type { Topic } from "@/types/curriculum";

export const hexadecimalTopic: Topic = {
  id: "hexadecimal",
  title: "Hexadecimal",
  description: "Learn how hexadecimal represents binary data more compactly.",
  difficulty: "⭐⭐☆",
  estimatedTime: "35 mins",
  simulator: "hexadecimal",

  lessons: [
    {
      id: "hex-intro",
      title: "Introduction to Hexadecimal",
      description:
        "Learn what hexadecimal is, which digits it uses and why it is useful.",
      estimatedTime: "10 mins",
      xpReward: 50,

      objectives: [
        "Understand that hexadecimal is a base-16 number system.",
        "Identify the hexadecimal digits 0 to F.",
        "Explain why hexadecimal is useful in Computer Science.",
      ],

      explanation:
        "Hexadecimal is a base-16 number system. It uses the digits 0 to 9 and the letters A to F. The letters represent denary values 10 to 15. Hexadecimal is useful because one hexadecimal digit represents exactly four binary bits, making long binary values shorter and easier to read.",

      workedExample:
        "Binary 1111 represents denary 15. The hexadecimal digit for denary 15 is F, so binary 1111 is hexadecimal F.",

      practiceQuestions: [
        {
          question: "What base is hexadecimal?",
          answer: "16",
          acceptedAnswers: ["Base 16", "Base-16", "It is base 16"],
          hint: "Hexadecimal contains sixteen possible digit values.",
          feedback: "Hexadecimal is a base-16 number system.",
        },
        {
          question: "Which hexadecimal digit represents denary 15?",
          answer: "F",
          acceptedAnswers: ["f", "Hexadecimal F"],
          hint: "The hexadecimal letters A to F represent denary 10 to 15.",
          feedback: "F is the hexadecimal digit representing denary 15.",
        },
      ],

      checkpointQuestions: [
        {
          question: "Which hexadecimal digit represents denary 10?",
          answer: "A",
          acceptedAnswers: ["a", "Hexadecimal A"],
          hint: "A is the first letter used after the digits 0 to 9.",
          feedback: "A represents denary 10 in hexadecimal.",
        },
        {
          question:
            "How many binary bits are represented by one hexadecimal digit?",
          answer: "4",
          acceptedAnswers: ["Four", "4 bits", "Four bits"],
          feedback: "One hexadecimal digit represents four binary bits.",
        },
      ],

      examQuestion: {
        question:
          "Explain why programmers may use hexadecimal instead of binary.",
        marks: 2,
        answer:
          "Hexadecimal values are shorter and easier for people to read than long binary values. Each hexadecimal digit maps directly to four binary bits, so conversion between the two is straightforward.",
      },

      reflectionPrompt:
        "Explain how hexadecimal makes long binary values easier for people to use.",
    },

    {
      id: "hex-conversion",
      title: "Hexadecimal Conversion",
      description: "Convert accurately between binary, denary and hexadecimal.",
      estimatedTime: "15 mins",
      xpReward: 75,

      objectives: [
        "Convert binary values into hexadecimal.",
        "Convert hexadecimal values into binary.",
        "Use groups of four binary bits.",
      ],

      explanation:
        "To convert binary to hexadecimal, split the binary value into groups of four bits from the right. Convert each group into one hexadecimal digit. To convert hexadecimal to binary, replace each hexadecimal digit with its four-bit binary equivalent.",

      workedExample:
        "Binary 11110000 is split into 1111 and 0000. Binary 1111 is hexadecimal F and binary 0000 is hexadecimal 0. Therefore, 11110000 is hexadecimal F0.",

      practiceQuestions: [
        {
          question: "Convert binary 1010 into hexadecimal.",
          answer: "A",
          acceptedAnswers: ["a", "Hexadecimal A"],
          hint: "Binary 1010 represents denary 10.",
          feedback: "Binary 1010 is hexadecimal A.",
        },
        {
          question: "Convert hexadecimal C into four-bit binary.",
          answer: "1100",
          acceptedAnswers: ["1100₂", "Binary 1100"],
          hint: "Hexadecimal C represents denary 12.",
          feedback: "Hexadecimal C is binary 1100.",
        },
      ],

      checkpointQuestions: [
        {
          question: "Convert binary 11111111 into hexadecimal.",
          answer: "FF",
          acceptedAnswers: ["ff", "Hexadecimal FF"],
          hint: "Split the value into 1111 and 1111.",
          feedback: "Each group of 1111 is hexadecimal F, producing FF.",
        },
      ],

      examQuestion: {
        question:
          "Convert binary 10111100 into hexadecimal. Show how the binary value is grouped.",
        marks: 2,
        answer:
          "Split the binary value into 1011 and 1100. Binary 1011 is hexadecimal B and binary 1100 is hexadecimal C, so the answer is BC.",
      },

      reflectionPrompt:
        "Describe the steps used to convert a binary value into hexadecimal.",
    },
  ],
};
