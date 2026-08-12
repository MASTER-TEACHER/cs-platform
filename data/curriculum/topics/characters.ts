import type { Topic } from "@/types/curriculum";

export const charactersTopic: Topic = {
  id: "characters",
  title: "Character Encoding",
  description:
    "Understand how computers represent text using ASCII and Unicode.",
  difficulty: "⭐⭐☆",
  estimatedTime: "45 mins",
  simulator: "character-encoding",
  status: "published",
  unit: "Data Representation",
  specificationReferences: ["AQA 3.3.4"],
  lessons: [
    {
      id: "character-sets",
      title: "Character Sets",
      description:
        "Learn how binary codes represent letters, numbers and symbols.",
      estimatedTime: "14 mins",
      xpReward: 60,
      objectives: [
        "Define a character set.",
        "Explain how characters are represented using binary.",
        "Explain why each character needs a unique code.",
      ],
      explanation:
        "A character set is a collection of characters and the numerical codes assigned to them. A computer stores each numerical code in binary.",
      workedExample:
        "In ASCII, uppercase A has denary code 65. In eight-bit binary this is 01000001.",
      practiceQuestions: [
        {
          question: "What is a character set?",
          answer: "A collection of characters and their binary codes",
          acceptedAnswers: [
            "A set of characters and their codes",
            "A collection of characters with unique codes",
          ],
        },
        {
          question: "Why must each character have a unique code?",
          answer: "So the computer can distinguish one character from another",
          acceptedAnswers: [
            "So each character can be identified",
            "To avoid ambiguity",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "What does a computer store when it stores a character?",
          answer: "A binary code",
          acceptedAnswers: ["A numerical code stored in binary"],
        },
      ],
      examQuestion: {
        question: "Explain how a computer represents a character such as A.",
        marks: 3,
        answer:
          "The character is assigned a numerical code in a character set. The numerical code is stored as a binary pattern.",
        markScheme: [
          "The character is assigned a numerical code.",
          "The code comes from a character set.",
          "The code is stored in binary.",
        ],
        guidance: ["Award one mark for each distinct accurate point."],
      },
      reflectionPrompt:
        "Explain why two systems must use compatible character sets when exchanging text.",
    },
    {
      id: "ascii-unicode",
      title: "ASCII and Unicode",
      description: "Compare ASCII and Unicode.",
      estimatedTime: "16 mins",
      xpReward: 75,
      objectives: [
        "Describe ASCII.",
        "Describe Unicode.",
        "Explain why Unicode supports more languages and symbols.",
      ],
      explanation:
        "ASCII represents a limited range of characters. Unicode supports far more characters, languages, symbols and emoji.",
      workedExample:
        "ASCII can represent common English characters, while Unicode can also represent Ω, 日 and 😀.",
      practiceQuestions: [
        {
          question: "Which character set supports a wider range of languages?",
          answer: "Unicode",
        },
        {
          question: "Why was Unicode developed?",
          answer: "To represent more characters and languages than ASCII",
          acceptedAnswers: [
            "ASCII could not represent enough characters",
            "To support more languages and symbols",
          ],
        },
      ],
      checkpointQuestions: [
        {
          question: "Which is more limited: ASCII or Unicode?",
          answer: "ASCII",
        },
      ],
      examQuestion: {
        question: "Compare ASCII and Unicode.",
        marks: 4,
        answer:
          "Both assign numerical codes to characters. ASCII supports a limited range, while Unicode supports many more languages, characters and symbols.",
        markScheme: [
          "Both are character sets.",
          "Both assign numerical codes.",
          "ASCII supports a more limited range.",
          "Unicode supports more languages, characters or symbols.",
        ],
      },
      reflectionPrompt:
        "Explain why a global messaging service would use Unicode.",
    },
    {
      id: "character-storage",
      title: "Character Storage",
      description: "Calculate storage requirements for text.",
      estimatedTime: "15 mins",
      xpReward: 80,
      objectives: [
        "Calculate the number of codes available from a number of bits.",
        "Calculate text storage requirements.",
        "Convert between bits and bytes.",
      ],
      explanation:
        "Using n bits gives 2^n possible codes. Text size can be estimated by multiplying the number of characters by the bits or bytes used per character.",
      workedExample:
        "If each character uses 8 bits, 100 characters require 800 bits or 100 bytes.",
      practiceQuestions: [
        {
          question: "How many codes can be represented using 8 bits?",
          answer: "256",
          acceptedAnswers: ["2^8"],
        },
        {
          question:
            "A file has 200 characters using 1 byte each. What is its size?",
          answer: "200 bytes",
          acceptedAnswers: ["200"],
        },
      ],
      checkpointQuestions: [
        {
          question: "Convert denary 65 into eight-bit binary.",
          answer: "01000001",
        },
      ],
      examQuestion: {
        question:
          "A text file contains 500 characters using 16 bits each. Calculate its size in bytes.",
        marks: 3,
        answer: "500 × 16 = 8000 bits. 8000 ÷ 8 = 1000 bytes.",
        markScheme: [
          "Calculates 8000 bits.",
          "Divides by 8.",
          "Gives 1000 bytes.",
        ],
      },
      reflectionPrompt:
        "Explain why using more bits per character increases storage requirements.",
    },
  ],
};
