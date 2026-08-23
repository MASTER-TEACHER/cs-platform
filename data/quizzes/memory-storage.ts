import { Quiz } from "@/types/quiz";

export const memoryStorageQuiz: Quiz = {
  id: "memory-storage-quiz",
  topicId: "memory-storage",
  title: "Memory and Storage Quiz",
  description: "Test your understanding of RAM, ROM, virtual memory, secondary storage and storage technologies.",
  estimatedTime: "8 mins",
  questions: [
    { id: "memory-storage-q1", type: "multipleChoice", question: "What is RAM mainly used for?", options: ["Storing programs and data currently in use", "Permanently storing firmware only", "Storing printed documents", "Controlling network addresses"], correctAnswer: "Storing programs and data currently in use", explanation: "RAM is working memory for active programs and data.", xpReward: 10 },
    { id: "memory-storage-q2", type: "trueFalse", question: "RAM is volatile memory.", options: ["True", "False"], correctAnswer: "True", explanation: "RAM loses its contents when power is removed.", xpReward: 10 },
    { id: "memory-storage-q3", type: "multipleChoice", question: "What is ROM typically used to store?", options: ["Instructions that must remain when power is removed", "Temporary working data only", "Every user file", "Only internet history"], correctAnswer: "Instructions that must remain when power is removed", explanation: "ROM is non-volatile and can store boot instructions or firmware.", xpReward: 10 },
    { id: "memory-storage-q4", type: "multipleChoice", question: "What is virtual memory?", options: ["Secondary storage used temporarily when RAM is insufficient", "A faster type of cache", "A type of ROM", "A cloud-only backup system"], correctAnswer: "Secondary storage used temporarily when RAM is insufficient", explanation: "Part of secondary storage can be used as additional memory when RAM is full.", xpReward: 10 },
    { id: "memory-storage-q5", type: "trueFalse", question: "An SSD normally has no moving mechanical parts.", options: ["True", "False"], correctAnswer: "True", explanation: "SSDs use flash memory rather than spinning disks.", xpReward: 10 },
    { id: "memory-storage-q6", type: "multipleChoice", question: "Which storage medium uses magnetic technology?", options: ["Hard disk drive", "SSD", "Blu-ray disc", "USB flash drive"], correctAnswer: "Hard disk drive", explanation: "Hard drives store data magnetically on rotating platters.", xpReward: 10 },
    { id: "memory-storage-q7", type: "multipleChoice", question: "Which storage technology is commonly used for DVDs and Blu-ray discs?", options: ["Optical", "Magnetic", "Solid state", "Volatile"], correctAnswer: "Optical", explanation: "Optical media is read using lasers.", xpReward: 10 },
    { id: "memory-storage-q8", type: "multipleChoice", question: "Which factors matter when choosing secondary storage?", options: ["Capacity, speed, durability and cost", "Only case colour", "Only CPU instruction set", "Only number of users"], correctAnswer: "Capacity, speed, durability and cost", explanation: "Storage choices involve trade-offs between performance, capacity, reliability and price.", xpReward: 10 },
  ],
};
