import { Quiz } from "@/types/quiz";

export const systemsSoftwareQuiz: Quiz = {
  id: "systems-software-quiz",
  topicId: "systems-software",
  title: "Systems Software Quiz",
  description: "Test your understanding of operating systems, utility software and the services provided by system software.",
  estimatedTime: "8 mins",
  questions: [
    { id: "systems-software-q1", type: "multipleChoice", question: "What is the main role of an operating system?", options: ["To manage hardware and provide services for applications and users", "To create only spreadsheets", "To act only as antivirus software", "To convert every file manually"], correctAnswer: "To manage hardware and provide services for applications and users", explanation: "The operating system manages hardware resources and provides services and interfaces.", xpReward: 10 },
    { id: "systems-software-q2", type: "multipleChoice", question: "Which is an operating-system function?", options: ["Memory management", "Creating every database record", "Designing cables", "Compressing all files automatically"], correctAnswer: "Memory management", explanation: "Operating systems allocate and manage memory for processes.", xpReward: 10 },
    { id: "systems-software-q3", type: "trueFalse", question: "An operating system can manage files and folders.", options: ["True", "False"], correctAnswer: "True", explanation: "File management is a standard operating-system responsibility.", xpReward: 10 },
    { id: "systems-software-q4", type: "multipleChoice", question: "What is utility software?", options: ["Software designed to maintain, protect or optimise a computer system", "A programming construct", "A CPU register", "A network topology"], correctAnswer: "Software designed to maintain, protect or optimise a computer system", explanation: "Utilities perform maintenance and support tasks.", xpReward: 10 },
    { id: "systems-software-q5", type: "multipleChoice", question: "Which is an example of utility software?", options: ["Backup software", "Word processor", "Presentation software", "Web page"], correctAnswer: "Backup software", explanation: "Backup software helps protect and maintain data.", xpReward: 10 },
    { id: "systems-software-q6", type: "trueFalse", question: "The operating system is responsible for providing a user interface.", options: ["True", "False"], correctAnswer: "True", explanation: "Operating systems provide graphical or command-line interfaces.", xpReward: 10 },
    { id: "systems-software-q7", type: "multipleChoice", question: "Why is multitasking important in an operating system?", options: ["It allows multiple processes to make progress during the same period", "It ensures only one program can run", "It permanently doubles storage", "It removes the need for RAM"], correctAnswer: "It allows multiple processes to make progress during the same period", explanation: "The operating system schedules processor time and resources among processes.", xpReward: 10 },
    { id: "systems-software-q8", type: "multipleChoice", question: "Which utility helps protect files by making their contents unreadable without the correct key?", options: ["Encryption software", "Defragmentation only", "File explorer", "Printer driver"], correctAnswer: "Encryption software", explanation: "Encryption transforms readable data into ciphertext.", xpReward: 10 },
  ],
};
