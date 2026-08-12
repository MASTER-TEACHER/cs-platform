import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson07: Lesson = {
  id: "environment",
  title: "Environmental Impacts of Technology",
  description:
    "Explore energy use, electronic waste, manufacturing and the environmental costs of digital technology.",
  estimatedTime: "22 mins",
  xpReward: 105,

  objectives: [
    "Identify environmental impacts of computer technology.",
    "Explain electronic waste.",
    "Explain how data centres consume resources.",
    "Evaluate ways environmental impact can be reduced.",
  ],

  explanation:
    "Computer technology has environmental impacts throughout its life cycle. Manufacturing electronic devices requires raw materials and energy. Devices consume electricity during use, while data centres require significant electrical power and cooling. Replacing equipment creates electronic waste, which can contain useful materials as well as substances that require careful disposal.",

  workedExample:
    "A company replaces thousands of laptops every two years. New devices may improve energy efficiency, but manufacturing replacements and disposing of old equipment also create environmental costs.",

  practiceQuestions: [
    {
      question: "What is electronic waste?",
      answer: "Discarded electrical or electronic equipment",
      acceptedAnswers: [
        "Old electronic devices that have been thrown away",
        "E-waste",
      ],
    },
    {
      question: "Give one environmental impact of data centres.",
      answer: "High electricity consumption",
      acceptedAnswers: [
        "Energy use",
        "Cooling requirements",
        "Carbon emissions",
      ],
    },
  ],

  checkpointQuestions: [
    {
      question: "Give one way an organisation could reduce electronic waste.",
      answer: "Keep devices in use for longer",
      acceptedAnswers: [
        "Repair devices",
        "Reuse equipment",
        "Recycle equipment",
      ],
    },
  ],

  examQuestion: {
    question:
      "A company plans to replace all employee computers every two years. Discuss the environmental impact of this policy.",
    marks: 6,
    answer:
      "New computers may be more energy efficient, reducing electricity use during operation. However, frequent replacement requires additional manufacturing and raw materials and creates more electronic waste. Extending the useful life of suitable devices or recycling them could reduce some of these impacts.",
    markScheme: [
      "Identifies a possible energy-efficiency benefit.",
      "Develops the energy argument.",
      "Identifies manufacturing impact.",
      "Identifies increased electronic waste.",
      "Suggests a reasonable mitigation.",
      "Provides a balanced judgement.",
    ],
    guidance: ["Credit other relevant environmental considerations."],
  },

  reflectionPrompt:
    "Decide whether replacing a working computer with a more energy-efficient model is always environmentally beneficial.",
};
