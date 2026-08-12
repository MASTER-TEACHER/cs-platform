import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson03: Lesson = {
  id: "data-protection",
  title: "Data Protection",
  description:
    "Understand why personal data is protected by law and the responsibilities of organisations handling it.",
  estimatedTime: "22 mins",
  xpReward: 110,

  objectives: [
    "Explain the purpose of data-protection legislation.",
    "Describe responsible handling of personal data.",
    "Apply data-protection principles to scenarios.",
  ],

  explanation:
    "The Data Protection Act 2018 provides a legal framework for processing personal data in the UK. Organisations handling personal data must use it responsibly and securely. GCSE questions usually focus on why data-protection rules are needed and whether an organisation's handling of information is appropriate rather than requiring detailed legal expertise.",

  workedExample:
    "A school stores student names, addresses and examination results. This information should be protected from unauthorised access, kept accurate and used only for legitimate educational purposes.",

  practiceQuestions: [
    {
      question:
        "What type of information is protected by data-protection legislation?",
      answer: "Personal data",
      acceptedAnswers: ["Information about identifiable individuals"],
    },
    {
      question:
        "Give one responsibility of an organisation storing personal data.",
      answer: "Keep the data secure",
      acceptedAnswers: [
        "Keep it accurate",
        "Use it fairly",
        "Only use it for appropriate purposes",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question: "Why should an organisation correct inaccurate personal data?",
      answer: "Personal data should be accurate",
      acceptedAnswers: ["Incorrect data could harm the individual"],
    },
  ],

  examQuestion: {
    question:
      "A sports app collects users' names, dates of birth and location data. Explain two responsibilities the company has when handling this data.",
    marks: 4,
    answer:
      "The company should keep the personal data secure so unauthorised people cannot access it. It should also use the data fairly and only for legitimate purposes related to the service.",
    markScheme: [
      "Identifies a valid responsibility.",
      "Develops or applies the first responsibility.",
      "Identifies a second valid responsibility.",
      "Develops or applies the second responsibility.",
    ],
    guidance: [
      "Credit appropriate references to security, accuracy, fairness, lawful use or retention.",
    ],
  },

  reflectionPrompt:
    "Explain why a school must protect student records even if the information is useful to teachers.",
};
