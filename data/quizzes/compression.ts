import { Quiz } from "@/types/quiz";

export const compressionQuiz: Quiz = {
  id: "compression-quiz",
  topicId: "compression",
  title: "Compression Quiz",
  description: "Test your understanding of lossy and lossless compression, file-size reduction and run-length encoding.",
  estimatedTime: "8 mins",
  questions: [
    { id: "compression-q1", type: "multipleChoice", question: "What is the main purpose of data compression?", options: ["To reduce storage space or bandwidth required", "To increase processors", "To convert every file to text", "To make all files lossless"], correctAnswer: "To reduce storage space or bandwidth required", explanation: "Compression reduces the amount of data that must be stored or transmitted.", xpReward: 10 },
    { id: "compression-q2", type: "multipleChoice", question: "What is lossless compression?", options: ["Compression that allows the original data to be reconstructed exactly", "Compression that always removes data permanently", "Compression used only for sound", "Compression that makes files larger"], correctAnswer: "Compression that allows the original data to be reconstructed exactly", explanation: "Lossless methods preserve all original information.", xpReward: 10 },
    { id: "compression-q3", type: "trueFalse", question: "Lossy compression permanently removes some data.", options: ["True", "False"], correctAnswer: "True", explanation: "Lossy compression discards some information to reduce file size.", xpReward: 10 },
    { id: "compression-q4", type: "multipleChoice", question: "Which file is usually more suitable for lossless compression?", options: ["A text document", "A streamed music track where some loss is acceptable", "A social-media photograph", "A video where exact reconstruction is unnecessary"], correctAnswer: "A text document", explanation: "Text normally needs to be restored exactly.", xpReward: 10 },
    { id: "compression-q5", type: "multipleChoice", question: "What does run-length encoding store?", options: ["Repeated values together with how many times they repeat", "Only the first byte", "A list of passwords", "CPU clock speed"], correctAnswer: "Repeated values together with how many times they repeat", explanation: "RLE replaces repeated sequences with a value and repetition count.", xpReward: 10 },
    { id: "compression-q6", type: "shortAnswer", question: "In RLE, how many consecutive A characters are represented by 6A?", correctAnswer: "6", explanation: "The count 6 indicates six repeated A values.", xpReward: 10 },
    { id: "compression-q7", type: "trueFalse", question: "Lossless compression is guaranteed to reduce every possible file by a large amount.", options: ["True", "False"], correctAnswer: "False", explanation: "Compression effectiveness depends on the data.", xpReward: 10 },
    { id: "compression-q8", type: "multipleChoice", question: "Why might a user choose lossy compression for an image?", options: ["To get a much smaller file when some quality loss is acceptable", "To keep every pixel exactly unchanged", "To convert it to source code", "To increase colour depth automatically"], correctAnswer: "To get a much smaller file when some quality loss is acceptable", explanation: "Lossy techniques trade some quality for smaller files.", xpReward: 10 },
  ],
};
