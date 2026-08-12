import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson05: Lesson = {
  id: "copyright",
  title: "Copyright and Intellectual Property",
  description:
    "Understand how copyright protects software and other digital creative work.",
  estimatedTime: "20 mins",
  xpReward: 100,

  objectives: [
    "Explain the purpose of copyright.",
    "Identify examples of digital intellectual property.",
    "Explain how digital technology affects copying and distribution.",
  ],

  explanation:
    "Copyright protects original creative work, including software, music, images and written material. Digital technology makes copying and distributing content extremely easy, but technical ease does not mean copying is legally permitted. The Copyright, Designs and Patents Act 1988 provides legal protection for copyright works in the UK.",

  workedExample:
    "A programmer writes a commercial game. Another person copies the game's code and distributes it as their own product without permission. The original programmer's intellectual property rights may have been infringed.",

  practiceQuestions: [
    {
      question:
        "Give one type of digital work that can be protected by copyright.",
      answer: "Software",
      acceptedAnswers: ["Music", "Images", "Video", "Written work"],
    },
    {
      question:
        "Does being able to copy a file easily mean you have permission to distribute it?",
      answer: "No",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why can digital technology create challenges for copyright holders?",
      answer: "Digital files can be copied and distributed very easily",
      acceptedAnswers: ["Copies can be made quickly at little cost"],
    },
  ],

  examQuestion: {
    question:
      "Explain how copyright legislation affects the way computer software may be copied and distributed.",
    marks: 4,
    answer:
      "Software is protected as intellectual property. Users normally need permission or an appropriate licence to copy or distribute it. Unauthorised copying can therefore infringe the rights of the copyright owner.",
    markScheme: [
      "Software is protected by copyright.",
      "Copyright owner controls copying or distribution.",
      "Users require permission or an appropriate licence.",
      "Unauthorised copying or distribution may infringe copyright.",
    ],
    guidance: [
      "Credit reference to the Copyright, Designs and Patents Act 1988.",
    ],
  },

  reflectionPrompt:
    "Explain why software piracy can affect both software developers and consumers.",
};
