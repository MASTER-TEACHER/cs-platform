import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson01: Lesson = {
  id: "technology-society",
  title: "Technology and Wider Society",
  description:
    "Explore how digital technology creates benefits, risks and competing viewpoints in society.",
  estimatedTime: "20 mins",
  xpReward: 90,

  objectives: [
    "Identify positive and negative impacts of digital technology.",
    "Distinguish ethical issues from technical issues.",
    "Explain how different stakeholders may hold different views.",
  ],

  explanation:
    "Digital technology affects individuals, organisations and society. New technologies can improve communication, healthcare, education, transport and productivity, but may also create concerns about privacy, employment, security, fairness and access. Ethical questions consider what is right, fair or responsible rather than simply what is technically possible. Strong exam answers recognise that different stakeholders may reasonably hold different views.",

  workedExample:
    "A company introduces an AI system that performs tasks previously completed by employees. The company may benefit from lower costs and faster processing, while employees may be concerned about job losses. Society may also benefit if services become cheaper, but there may be wider concerns about unemployment or inequality.",

  practiceQuestions: [
    {
      question: "What is an ethical issue?",
      answer: "An issue concerning what is right, fair or responsible",
      acceptedAnswers: ["A question about right and wrong", "A moral issue"],
    },
    {
      question: "Why might two groups view the same technology differently?",
      answer: "They may experience different benefits and disadvantages",
      acceptedAnswers: ["Different stakeholders have different interests"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Give one possible positive impact of digital technology on society.",
      answer: "Improved communication",
      acceptedAnswers: [
        "Better access to information",
        "Improved healthcare",
        "Greater productivity",
        "Remote working",
        "Online education",
      ],
    },
  ],

  examQuestion: {
    question:
      "A supermarket introduces automated checkout systems. Discuss one positive and one negative impact on society.",
    marks: 6,
    answer:
      "Automated checkouts may reduce waiting times and allow the supermarket to operate more efficiently. However, fewer checkout staff may be required, which could reduce employment opportunities. Customers and businesses may therefore experience different benefits and disadvantages.",
    markScheme: [
      "Identifies a relevant positive impact.",
      "Develops the positive impact.",
      "Applies the positive impact to the scenario.",
      "Identifies a relevant negative impact.",
      "Develops the negative impact.",
      "Applies the negative impact to the scenario.",
    ],
    guidance: ["Credit other reasonable stakeholder-based arguments."],
  },

  reflectionPrompt:
    "Choose one technology you use regularly and identify one benefit and one concern it creates for society.",
};
