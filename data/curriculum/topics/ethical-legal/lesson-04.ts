import type { Lesson } from "@/types/curriculum";

export const ethicalLegalLesson04: Lesson = {
  id: "computer-misuse-act",
  title: "Computer Misuse Act",
  description:
    "Understand why unauthorised access and modification of computer systems can be illegal.",
  estimatedTime: "20 mins",
  xpReward: 105,
  simulator: "cybersecurity",

  objectives: [
    "Explain the purpose of the Computer Misuse Act 1990.",
    "Recognise examples of unauthorised computer access.",
    "Apply the law to cybersecurity scenarios.",
  ],

  explanation:
    "The Computer Misuse Act 1990 addresses unauthorised access to computer systems and related offences. A person does not gain permission to access a system simply because they know how to bypass its security. Ethical security testing requires appropriate authorisation from the system owner.",

  workedExample:
    "A student discovers another student's password and logs into their account without permission. Even if no files are changed, the access itself is unauthorised.",

  practiceQuestions: [
    {
      question: "What is meant by unauthorised access?",
      answer: "Accessing a computer system without permission",
      acceptedAnswers: ["Using a computer or account without permission"],
    },
    {
      question:
        "Does knowing someone's password automatically give permission to use their account?",
      answer: "No",
    },
  ],

  checkpointQuestions: [
    {
      question:
        "What is required before a penetration tester legitimately attacks a company's system?",
      answer: "Authorisation",
      acceptedAnswers: ["Permission", "Permission from the owner"],
    },
  ],

  examQuestion: {
    question:
      "A cybersecurity student finds a vulnerability on a company's website and accesses private customer records without permission to prove the flaw exists. Explain the legal issue.",
    marks: 5,
    answer:
      "The student's intention may be to demonstrate a security problem, but accessing the system and customer records without permission is unauthorised. Security testing should only be performed with appropriate authorisation from the organisation.",
    markScheme: [
      "Recognises that the access is unauthorised.",
      "Links unauthorised access to the Computer Misuse Act.",
      "Recognises that good intentions do not automatically provide permission.",
      "Explains that customer data was accessed.",
      "States that authorised testing should be agreed with the organisation.",
    ],
    guidance: [
      "Credit accurate distinction between ethical hacking and unauthorised access.",
    ],
  },

  reflectionPrompt:
    "Explain why ethical hackers require written permission before testing an organisation's security.",
};
