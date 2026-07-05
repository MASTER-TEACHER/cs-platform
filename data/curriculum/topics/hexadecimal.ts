import { Topic } from "@/types/curriculum";

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
      description: "Learn what hexadecimal is and why it is used.",
      estimatedTime: "10 mins",
      xpReward: 50,
      objectives: [
        "Understand that hexadecimal is a base-16 number system.",
        "Identify the hexadecimal digits 0 to F.",
        "Explain why hexadecimal is useful in Computer Science.",
      ],
      explanation:
        "Hexadecimal is a base-16 number system. It uses the digits 0 to 9 and the letters A to F. It is useful because it can represent long binary numbers in a shorter and easier-to-read form.",
      workedExample:
        "The binary number 1111 is equal to 15 in denary, which is F in hexadecimal.",
      practiceQuestions: [
        {
          question: "What base is hexadecimal?",
          answer: "Base 16",
        },
        {
          question: "What hexadecimal digit represents denary 15?",
          answer: "F",
        },
      ],
      examQuestion: {
        question: "Explain why programmers often use hexadecimal instead of binary.",
        marks: 2,
        answer:
          "Hexadecimal is shorter and easier to read than binary, while still being easy to convert to and from binary.",
      },
    },
    {
      id: "hex-conversion",
      title: "Hexadecimal Conversion",
      description: "Convert between denary, binary and hexadecimal.",
      estimatedTime: "15 mins",
      xpReward: 75,
      objectives: [
        "Convert binary numbers into hexadecimal.",
        "Convert hexadecimal numbers into binary.",
        "Recognise groups of four bits as hexadecimal digits.",
      ],
      explanation:
        "Each hexadecimal digit represents four binary bits. For example, 1010 in binary is A in hexadecimal. This makes hexadecimal useful for shortening binary values.",
      workedExample:
        "Binary 11110000 can be split into 1111 and 0000. 1111 is F and 0000 is 0, so the hexadecimal value is F0.",
      practiceQuestions: [
        {
          question: "Convert binary 1010 to hexadecimal.",
          answer: "A",
        },
        {
          question: "Convert hexadecimal C to binary.",
          answer: "1100",
        },
      ],
      examQuestion: {
        question: "Convert the binary number 10111100 into hexadecimal.",
        marks: 2,
        answer:
          "Split into groups of four: 1011 and 1100. 1011 is B and 1100 is C, so the answer is BC.",
      },
    },
  ],
};