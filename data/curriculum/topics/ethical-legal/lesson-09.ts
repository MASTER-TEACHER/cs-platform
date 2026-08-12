import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson09: Lesson = {
  id: "ethical-legal-challenge",
  title: "Ethical, Legal and Environmental Exam Challenge",
  description:
    "Apply ethical, legal, privacy, cultural and environmental knowledge to unfamiliar technologies.",
  estimatedTime: "30 mins",
  xpReward: 150,

  objectives: [
    "Analyse multiple impacts of a new technology.",
    "Distinguish ethical concerns from legal requirements.",
    "Consider competing stakeholder viewpoints.",
    "Write balanced extended exam responses.",
  ],

  explanation:
    "Extended-response questions in this area usually reward developed reasoning rather than a list of isolated facts. Identify the stakeholders, explain benefits and risks, consider legal or privacy implications where relevant, and support your conclusion. AQA explicitly expects students to reason about current digital technologies and understand general principles rather than memorise detailed facts about individual examples.",

  workedExample:
    "An autonomous vehicle may reduce accidents caused by human error and improve mobility for some users. However, questions arise about responsibility when accidents occur, the collection of location data, job losses for professional drivers and the reliability of automated decision-making.",

  practiceQuestions: [
    {
      question:
        "Which law is relevant to unauthorised access to a computer system?",
      answer: "Computer Misuse Act 1990",
      acceptedAnswers: ["Computer Misuse Act"],
    },
    {
      question:
        "Which law is particularly relevant when an organisation processes personal information?",
      answer: "Data Protection Act 2018",
      acceptedAnswers: ["Data Protection Act"],
    },
    {
      question: "Which law protects software and other original digital works?",
      answer: "Copyright, Designs and Patents Act 1988",
      acceptedAnswers: ["Copyright Designs and Patents Act", "Copyright law"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why should an extended ethical-impact answer consider several stakeholders?",
      answer:
        "Different groups may experience different benefits and disadvantages",
      acceptedAnswers: [
        "Stakeholders can have different interests and viewpoints",
      ],
    },
  ],

  examQuestion: {
    question:
      "A city plans to install facial-recognition cameras in public areas to help identify wanted suspects. Discuss the ethical, legal and privacy issues associated with this technology.",
    marks: 10,
    answer:
      "Facial-recognition systems may help police identify suspects more quickly and could improve public safety. However, cameras may collect biometric information about large numbers of people who are not suspected of any crime. Citizens may be concerned about surveillance, privacy and how long data is stored or who can access it. Incorrect identification could also affect innocent people. The organisation operating the system must handle personal data lawfully and securely. Whether the system is justified depends on whether its security benefits are proportionate to the risks and whether appropriate safeguards are used.",
    markScheme: [
      "Identifies a public-safety or policing benefit.",
      "Develops the security benefit.",
      "Identifies surveillance or privacy concern.",
      "Develops the privacy concern.",
      "Recognises personal or biometric data issues.",
      "Considers incorrect identification or fairness.",
      "Recognises legal/data-handling responsibilities.",
      "Considers security or access to stored data.",
      "Considers multiple stakeholder viewpoints.",
      "Provides a supported overall judgement.",
    ],
    guidance: [
      "Reward coherent analysis and justified conclusions.",
      "Do not require a predetermined position for or against the technology.",
    ],
  },

  reflectionPrompt:
    "Write a short conclusion explaining when increased digital surveillance could be justified and what safeguards should exist.",
};
