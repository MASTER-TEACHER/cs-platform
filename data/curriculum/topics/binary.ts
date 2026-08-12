import type { Topic } from "@/types/curriculum";

export const binaryTopic: Topic = {
  id: "binary",
  title: "Binary Numbers",
  description:
    "Learn how computers represent and calculate numbers using binary.",
  difficulty: "⭐☆☆",
  estimatedTime: "45 mins",

  lessons: [
    {
      id: "binary-intro",
      title: "Introduction to Binary",
      description:
        "Understand why computers use binary and how binary place values work.",
      estimatedTime: "12 mins",
      xpReward: 50,

      objectives: [
        "Explain that binary is a base-2 number system.",
        "Identify the binary digits 0 and 1.",
        "Use binary place values.",
      ],

      explanation:
        "Binary is a base-2 number system using only the digits 0 and 1. Each position represents a power of two. Computers use binary because electronic circuits can represent two reliable states, such as on and off.",

      workedExample:
        "Binary 1011 uses the place values 8, 4, 2 and 1. The digits containing a 1 represent 8, 2 and 1. Therefore, binary 1011 equals denary 11.",

      practiceQuestions: [
        {
          question: "What base is binary?",
          answer: "2",
          acceptedAnswers: ["Base 2", "Base-2", "It is base 2"],
          hint: "Binary contains two possible digit values.",
          feedback: "Binary is a base-2 number system.",
        },
        {
          question: "Convert binary 101 into denary.",
          answer: "5",
          acceptedAnswers: ["Denary 5", "Five"],
          hint: "Use the place values 4, 2 and 1.",
          feedback: "Binary 101 represents 4 + 1, which equals denary 5.",
        },
      ],

      checkpointQuestions: [
        {
          question: "Which two digits are used in the binary number system?",
          answer: "0 and 1",
          acceptedAnswers: ["0, 1", "0 & 1", "1 and 0", "Zero and one"],
          feedback: "Binary uses only the digits 0 and 1.",
        },
      ],

      examQuestion: {
        question: "Explain why computers use binary to represent data.",
        marks: 2,
        answer:
          "Computer circuits contain electronic components that can reliably represent two physical states. These states can be represented using the binary digits 0 and 1.",
      },

      reflectionPrompt:
        "Explain how binary place values are used to calculate a denary value.",
    },

    {
      id: "binary-conversion",
      title: "Binary Conversion",
      description: "Convert accurately between binary and denary.",
      estimatedTime: "15 mins",
      xpReward: 75,

      objectives: [
        "Convert binary values into denary.",
        "Convert denary values into binary.",
        "Show conversion working clearly.",
      ],

      explanation:
        "To convert binary to denary, add the place values containing a 1. To convert denary to binary, select the powers of two that combine to create the denary value.",

      workedExample:
        "Denary 13 uses the place values 8, 4 and 1. Placing 1s in those columns gives binary 1101.",

      practiceQuestions: [
        {
          question: "Convert binary 1100 into denary.",
          answer: "12",
          acceptedAnswers: ["Denary 12", "Twelve"],
          hint: "Add the place values 8 and 4.",
          feedback: "Binary 1100 represents 8 + 4, which is denary 12.",
        },
        {
          question: "Convert denary 10 into four-bit binary.",
          answer: "1010",
          acceptedAnswers: ["Binary 1010", "1010₂"],
          hint: "Denary 10 is made from the place values 8 and 2.",
          feedback: "Using place values 8, 4, 2 and 1 gives binary 1010.",
        },
      ],

      checkpointQuestions: [
        {
          question: "Convert binary 1111 into denary.",
          answer: "15",
          acceptedAnswers: ["Denary 15", "Fifteen"],
          feedback: "Binary 1111 represents 8 + 4 + 2 + 1, which equals 15.",
        },
      ],

      examQuestion: {
        question: "Convert denary 27 into eight-bit binary. Show your working.",
        marks: 2,
        answer:
          "Denary 27 is 16 + 8 + 2 + 1. Using eight-bit place values gives 00011011.",
      },

      reflectionPrompt: "Describe how to convert a denary value into binary.",
    },

    {
      id: "binary-addition",
      title: "Binary Addition",
      description: "Add binary values and identify when overflow occurs.",
      estimatedTime: "18 mins",
      xpReward: 100,
      simulator: "binary-addition",

      objectives: [
        "Apply the rules of binary addition.",
        "Carry values between binary columns.",
        "Identify binary overflow.",
      ],

      explanation:
        "The binary addition rules are 0 + 0 = 0, 0 + 1 = 1, 1 + 0 = 1 and 1 + 1 = 10. When a column totals two, write 0 in that column and carry 1 to the next column.",

      workedExample:
        "Adding binary 0101 and 0011 gives 1000. From the right: 1 + 1 = 10, so write 0 and carry 1. Continue applying the carry through the remaining columns.",

      practiceQuestions: [
        {
          question: "Calculate the four-bit binary addition 0011 + 0010.",
          answer: "0101",
          acceptedAnswers: ["101", "Binary 0101"],
          feedback:
            "Binary 0011 represents 3 and binary 0010 represents 2. Their sum is binary 0101.",
        },
        {
          question: "What does overflow mean in binary addition?",
          answer: "The result requires more bits than are available",
          acceptedAnswers: [
            "When the result needs more bits than available",
            "The answer does not fit in the available bits",
            "The result is too large for the number of bits",
          ],
          hint: "Think about what happens when the answer cannot fit in the allocated bit pattern.",
          feedback:
            "Overflow occurs when a result requires more bits than the system has allocated.",
        },
      ],

      checkpointQuestions: [
        {
          question: "Calculate the four-bit binary addition 0111 + 0001.",
          answer: "1000",
          acceptedAnswers: ["Binary 1000"],
          feedback: "Binary 7 plus binary 1 equals binary 1000.",
        },
      ],

      examQuestion: {
        question:
          "Add the eight-bit binary values 01110110 and 00111101. State whether overflow occurs.",
        marks: 4,
        answer:
          "The result is 10110011. No overflow occurs because the result fits within eight bits.",
      },

      reflectionPrompt:
        "Explain how carrying works during binary addition and when overflow occurs.",
    },

    {
      id: "binary-shifts",
      title: "Binary Shifts",
      description:
        "Use left and right binary shifts and understand their effect on unsigned binary values.",
      estimatedTime: "22 mins",
      xpReward: 105,
      simulator: "binary-shift",

      objectives: [
        "Perform left binary shifts.",
        "Perform right binary shifts.",
        "Explain how binary shifts affect denary values.",
        "Identify when bits are lost during a shift.",
        "Explain overflow caused by a left shift.",
      ],

      explanation:
        "A binary shift moves every bit in a binary number to the left or right. For unsigned binary integers, shifting left by one place normally multiplies the value by 2, while shifting right by one place performs integer division by 2. Shifting by two places corresponds to multiplying or dividing by 4, and shifting by three places corresponds to multiplying or dividing by 8. Empty positions are filled with 0s. Bits that move beyond the fixed register width are lost, which can cause overflow during a left shift.",

      workedExample:
        "The 8-bit value 00101100 represents 44. Shifting it left by one place produces 01011000, which represents 88. This is equivalent to multiplying 44 by 2. Shifting 00101100 right by one place produces 00010110, representing 22, which is equivalent to integer division by 2.",

      practiceQuestions: [
        {
          question:
            "What is the result of shifting 00101100 left by one place?",
          answer: "01011000",
        },
        {
          question:
            "What mathematical operation is normally equivalent to an unsigned left shift by one place?",
          answer: "Multiply by 2",
          acceptedAnswers: ["Multiplication by 2", "Times 2", "×2"],
        },
        {
          question:
            "What mathematical operation is normally equivalent to an unsigned right shift by two places?",
          answer: "Divide by 4",
          acceptedAnswers: ["Division by 4", "Integer division by 4", "÷4"],
        },
        {
          question:
            "What fills the empty positions created by an unsigned binary shift?",
          answer: "0",
          acceptedAnswers: ["Zeros", "Zero bits"],
        },
      ],

      checkpointQuestions: [
        {
          question: "Shift 01100100 right by one place.",
          answer: "00110010",
        },
        {
          question:
            "An unsigned binary value is shifted left by three places. By what factor is its value normally multiplied?",
          answer: "8",
          acceptedAnswers: ["Multiply by 8", "×8"],
        },
        {
          question:
            "Why can a left shift cause overflow in a fixed-width register?",
          answer:
            "A significant bit may be shifted beyond the available number of bits",
          acceptedAnswers: [
            "Bits can be shifted out of the register",
            "The result may require more bits than the register can store",
          ],
        },
      ],

      examQuestion: {
        question:
          "The 8-bit unsigned binary number 00110110 is shifted left by two places. State the resulting binary value and explain the effect of the shift on its denary value.",
        marks: 4,
        answer:
          "The result is 11011000. A left shift by two places multiplies an unsigned binary value by 4, provided that significant bits are not lost through overflow.",
        markScheme: [
          "Correct result: 11011000.",
          "Recognises that it is a left shift by two places.",
          "States that this multiplies the value by 4.",
          "Recognises that this relationship assumes significant bits are not lost through overflow.",
        ],
        guidance: [
          "Credit equivalent explanations of multiplication by powers of two.",
        ],
      },

      reflectionPrompt:
        "Explain why binary shifts can be used by processors as an efficient way of multiplying or dividing unsigned integers by powers of two.",
    },
  ],
};
