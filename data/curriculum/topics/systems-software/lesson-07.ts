import type { Lesson } from "@/types/curriculum";

export const systemsSoftwareLesson07: Lesson = {
  id: "users-security",
  title: "User Management and Security",
  description:
    "Understand how operating systems manage accounts, authentication and permissions.",
  estimatedTime: "22 mins",
  xpReward: 105,
  simulator: "operating-system",

  objectives: [
    "Explain the purpose of user accounts.",
    "Describe authentication.",
    "Explain access rights and permissions.",
    "Explain why different users may receive different privileges.",
  ],

  explanation:
    "Operating systems can support multiple user accounts. Authentication checks that a user is who they claim to be, commonly using passwords or other credentials. Access rights determine which files, applications and system settings a user may access. Administrators normally receive greater privileges than standard users because they need to configure and maintain the computer.",

  workedExample:
    "On a school network, students may be allowed to use installed applications and save files but prevented from installing new software or changing security settings. Network administrators may have permission to perform these tasks.",

  practiceQuestions: [
    {
      question: "What is authentication?",
      answer: "Checking the identity of a user",
      acceptedAnswers: ["Verifying a user's identity"],
    },
    {
      question: "Why are administrator accounts given more privileges?",
      answer: "They need to configure and manage the system",
      acceptedAnswers: ["They need permission to change system settings"],
    },
  ],

  checkpointQuestions: [
    {
      question:
        "Why should ordinary users not normally have administrator permissions?",
      answer: "They could make dangerous or unauthorised system changes",
      acceptedAnswers: ["It reduces security risks"],
    },
  ],

  examQuestion: {
    question:
      "Explain how user accounts and permissions can improve security on a school network.",
    marks: 5,
    answer:
      "Each person can have a separate account and must authenticate before gaining access. Permissions can restrict which files and settings each account can use. Students can therefore be prevented from modifying system settings or accessing other users' private files.",
    markScheme: [
      "Users have separate accounts.",
      "Users authenticate before access.",
      "Permissions restrict access.",
      "Different users can receive different privileges.",
      "Links restrictions to protecting files or settings.",
    ],
    guidance: [
      "Credit appropriate references to passwords, roles or access rights.",
    ],
  },

  reflectionPrompt:
    "Explain why a school should use separate student and administrator account types.",
};
