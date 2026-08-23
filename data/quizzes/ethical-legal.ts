import { Quiz } from "@/types/quiz";

export const ethicalLegalQuiz: Quiz = {
  id: "ethical-legal-quiz",
  topicId: "ethical-legal",
  title: "Ethical, Legal and Environmental Issues Quiz",
  description: "Test your understanding of privacy, computer legislation, intellectual property, environmental impact and wider digital issues.",
  estimatedTime: "8 mins",
  questions: [
    { id: "ethical-legal-q1", type: "multipleChoice", question: "What is meant by personal data?", options: ["Information that relates to an identifiable person", "Only data stored in binary", "Any file larger than 1 MB", "Only public-domain information"], correctAnswer: "Information that relates to an identifiable person", explanation: "Personal data relates to an identified or identifiable individual.", xpReward: 10 },
    { id: "ethical-legal-q2", type: "multipleChoice", question: "Which UK law makes unauthorised access to computer systems an offence?", options: ["Computer Misuse Act 1990", "Copyright, Designs and Patents Act 1988", "Freedom of Information Act 2000", "Equality Act 2010"], correctAnswer: "Computer Misuse Act 1990", explanation: "The Computer Misuse Act addresses offences such as unauthorised access.", xpReward: 10 },
    { id: "ethical-legal-q3", type: "multipleChoice", question: "What does copyright protect?", options: ["Original creative works from unauthorised copying or use", "Every password on a network", "Only computer hardware", "All public information forever"], correctAnswer: "Original creative works from unauthorised copying or use", explanation: "Copyright gives creators legal rights over original works such as software and media.", xpReward: 10 },
    { id: "ethical-legal-q4", type: "trueFalse", question: "Software licences can specify how software may legally be installed, copied or used.", options: ["True", "False"], correctAnswer: "True", explanation: "Licences define permissions and restrictions for software use.", xpReward: 10 },
    { id: "ethical-legal-q5", type: "multipleChoice", question: "Which is an environmental issue associated with computing?", options: ["Electronic waste and energy consumption", "The use of Boolean values", "The existence of local variables", "Binary addition"], correctAnswer: "Electronic waste and energy consumption", explanation: "Computing equipment uses resources and energy and can create electronic waste.", xpReward: 10 },
    { id: "ethical-legal-q6", type: "multipleChoice", question: "Which is an ethical concern involving algorithms?", options: ["Biased automated decisions that unfairly affect groups of people", "Using indentation consistently", "Choosing a variable name", "Converting denary to binary"], correctAnswer: "Biased automated decisions that unfairly affect groups of people", explanation: "Algorithmic bias can lead to unfair outcomes.", xpReward: 10 },
    { id: "ethical-legal-q7", type: "trueFalse", question: "Collecting more personal data than is necessary can create privacy risks.", options: ["True", "False"], correctAnswer: "True", explanation: "Excessive collection increases the amount of sensitive data that could be exposed or misused.", xpReward: 10 },
    { id: "ethical-legal-q8", type: "multipleChoice", question: "Why can digital technology create a cultural or social issue?", options: ["Access, automation and online systems can affect different groups in different ways", "Computers can only process English text", "Every program produces the same output", "Networks cannot cross national borders"], correctAnswer: "Access, automation and online systems can affect different groups in different ways", explanation: "Technology can influence employment, access, communication and inclusion.", xpReward: 10 },
  ],
};
