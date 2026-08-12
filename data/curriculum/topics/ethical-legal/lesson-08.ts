import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson08: Lesson = {
  id: "culture-digital-divide",
  title: "Cultural Impacts and the Digital Divide",
  description:
    "Explore how access to digital technology can affect communication, culture, opportunity and inequality.",
  estimatedTime: "22 mins",
  xpReward: 105,

  objectives: [
    "Explain the digital divide.",
    "Describe cultural impacts of digital technology.",
    "Explain how unequal access can affect individuals.",
    "Evaluate benefits and disadvantages of global connectivity.",
  ],

  explanation:
    "Digital technology has changed how people communicate, work, learn and consume media. Online services allow ideas and information to spread rapidly across national and cultural boundaries. However, not everyone has equal access to reliable devices, internet connections or digital skills. This difference in access is often described as the digital divide.",

  workedExample:
    "Online homework may allow students to access resources from home. A student without reliable internet access may find the same system creates a disadvantage compared with classmates who have fast broadband and several devices.",

  practiceQuestions: [
    {
      question: "What is the digital divide?",
      answer:
        "The difference between people who have effective access to digital technology and those who do not",
      acceptedAnswers: ["Unequal access to computers and the internet"],
    },
    {
      question: "Give one cultural impact of widespread digital communication.",
      answer: "People can communicate across countries and cultures",
      acceptedAnswers: [
        "Ideas spread globally",
        "People can access international media",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question: "How could lack of internet access disadvantage a student?",
      answer: "They may be unable to access online learning resources",
      acceptedAnswers: ["They may struggle to complete online homework"],
    },
  ],

  examQuestion: {
    question:
      "A college moves most learning resources and applications online. Discuss how this could affect students.",
    marks: 6,
    answer:
      "Students with reliable internet connections may benefit from being able to access learning materials anywhere and at any time. Students without suitable devices, reliable internet or digital skills may be disadvantaged. The college may therefore need to provide equipment or alternative ways to access resources.",
    markScheme: [
      "Identifies an accessibility or convenience benefit.",
      "Develops the benefit.",
      "Identifies unequal access as a concern.",
      "Develops the disadvantage.",
      "Recognises devices, connectivity or skills as possible factors.",
      "Provides a balanced conclusion or mitigation.",
    ],
    guidance: ["Credit relevant cultural and accessibility arguments."],
  },

  reflectionPrompt:
    "Suggest two practical steps a school could take to reduce the digital divide among its students.",
};
