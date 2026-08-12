import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson02: Lesson = {
  id: "privacy-data",
  title: "Privacy and Personal Data",
  description:
    "Explore privacy concerns created by the collection, storage and analysis of personal data.",
  estimatedTime: "22 mins",
  xpReward: 105,

  objectives: [
    "Define personal data and privacy.",
    "Explain why organisations collect personal data.",
    "Describe privacy risks associated with digital technology.",
    "Evaluate competing privacy and security arguments.",
  ],

  explanation:
    "Digital systems can collect large amounts of personal data, including names, locations, browsing activity, photographs, health information and purchasing behaviour. Organisations may use this data to provide services, personalise content, prevent crime or analyse behaviour. Privacy concerns arise when people do not understand what is collected, data is used for unexpected purposes or organisations gain excessive access to personal information.",

  workedExample:
    "A fitness watch records a user's location, heart rate and exercise patterns. This can help the user monitor health and fitness, but the information could reveal sensitive details if accessed or shared inappropriately.",

  practiceQuestions: [
    {
      question: "What is personal data?",
      answer: "Information relating to an identifiable person",
      acceptedAnswers: ["Information that can identify an individual"],
    },
    {
      question: "Give one reason an organisation might collect user data.",
      answer: "To provide or personalise a service",
      acceptedAnswers: ["For analytics", "To improve services", "For security"],
    },
  ],

  checkpointQuestions: [
    {
      question: "Why might location data create a privacy concern?",
      answer: "It can reveal where a person is or has been",
      acceptedAnswers: ["It can track someone's movements"],
    },
  ],

  examQuestion: {
    question:
      "A government proposes collecting more communication data to help prevent serious crime. Discuss the privacy implications.",
    marks: 8,
    answer:
      "Access to communication data may help security services identify criminal activity and protect citizens. However, citizens may be concerned that large amounts of private information could be monitored, misused or accessed without sufficient justification. A balance is therefore required between public safety and individual privacy.",
    markScheme: [
      "Identifies a security or crime-prevention benefit.",
      "Develops the security benefit.",
      "Identifies an individual privacy concern.",
      "Develops the privacy concern.",
      "Recognises the amount or sensitivity of collected information.",
      "Considers misuse or unauthorised access.",
      "Considers different stakeholder viewpoints.",
      "Provides a supported overall judgement.",
    ],
    guidance: [
      "Credit balanced arguments rather than requiring one predetermined conclusion.",
    ],
  },

  reflectionPrompt:
    "List three pieces of personal data your phone could potentially collect and explain which you consider most sensitive.",
};
