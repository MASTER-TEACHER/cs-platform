import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson06: Lesson = {
  id: "software-licensing",
  title: "Open Source and Proprietary Software",
  description:
    "Compare software licensing models and recommend an appropriate licence for different situations.",
  estimatedTime: "22 mins",
  xpReward: 110,

  objectives: [
    "Explain why software is licensed.",
    "Describe open-source software.",
    "Describe proprietary software.",
    "Recommend an appropriate licence for a scenario.",
  ],

  explanation:
    "A software licence defines how software may be used, modified or distributed. Open-source software makes its source code available under licence terms that permit specified forms of inspection, modification and redistribution. Proprietary software usually keeps source code controlled by its owner and grants users limited usage rights. Neither model is automatically better; suitability depends on the situation.",

  workedExample:
    "A school may choose open-source software where cost and customisation are priorities. A business may choose proprietary software where commercial vendor support, compatibility or specialised features are important.",

  practiceQuestions: [
    {
      question: "What access is normally available with open-source software?",
      answer: "Access to the source code",
      acceptedAnswers: ["The source code can be viewed"],
    },
    {
      question:
        "Who normally controls the source code of proprietary software?",
      answer: "The software owner or developer",
      acceptedAnswers: ["The company that owns the software"],
    },
  ],

  checkpointQuestions: [
    {
      question: "Give one possible advantage of open-source software.",
      answer: "It can be modified",
      acceptedAnswers: [
        "Source code is available",
        "It may have lower licence costs",
        "It can be customised",
      ],
    },
  ],

  examQuestion: {
    question:
      "A small school wants new software for managing its library. Compare open-source and proprietary software and recommend one approach.",
    marks: 8,
    answer:
      "Open-source software may allow the school to inspect or modify the source code and may reduce licence costs, but the school may need technical expertise to customise or support it. Proprietary software may provide dedicated vendor support and polished features, but can involve licence fees and does not normally provide access to the source code. The best choice depends on the school's budget and available technical support.",
    markScheme: [
      "Identifies an open-source feature.",
      "Develops an open-source advantage.",
      "Identifies an open-source disadvantage or consideration.",
      "Identifies a proprietary feature.",
      "Develops a proprietary advantage.",
      "Identifies a proprietary disadvantage or consideration.",
      "Applies comparison to the school scenario.",
      "Provides a supported recommendation.",
    ],
    guidance: ["Do not assume open-source software is always free."],
  },

  reflectionPrompt:
    "Recommend either open-source or proprietary software for a school computer lab and justify your choice.",
};
