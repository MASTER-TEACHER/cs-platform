import { Quiz } from "@/types/quiz";

export const cpuQuiz: Quiz = {
  id: "cpu-quiz",
  topicId: "cpu",
  title: "Systems Architecture Quiz",
  description: "Test your understanding of the CPU, registers, buses, the fetch-decode-execute cycle and processor performance.",
  estimatedTime: "8 mins",
  questions: [
    { id: "cpu-q1", type: "multipleChoice", question: "What is the main purpose of the CPU?", options: ["To process instructions and data", "To store files permanently", "To print documents", "To provide internet access without hardware"], correctAnswer: "To process instructions and data", explanation: "The CPU executes instructions and performs calculations and control operations.", xpReward: 10 },
    { id: "cpu-q2", type: "multipleChoice", question: "Which CPU component performs arithmetic and logical operations?", options: ["ALU", "Control unit", "Program counter", "Cache"], correctAnswer: "ALU", explanation: "The arithmetic logic unit carries out arithmetic calculations and logical comparisons.", xpReward: 10 },
    { id: "cpu-q3", type: "multipleChoice", question: "What is the purpose of the program counter?", options: ["To hold the address of the next instruction", "To store final output permanently", "To count network users", "To calculate image resolution"], correctAnswer: "To hold the address of the next instruction", explanation: "The program counter tracks which instruction should be fetched next.", xpReward: 10 },
    { id: "cpu-q4", type: "multipleChoice", question: "What is the correct order of the instruction cycle?", options: ["Fetch, decode, execute", "Decode, execute, fetch", "Execute, fetch, decode", "Store, compress, execute"], correctAnswer: "Fetch, decode, execute", explanation: "The processor fetches an instruction, decodes it and then executes it.", xpReward: 10 },
    { id: "cpu-q5", type: "trueFalse", question: "Cache is normally faster to access than RAM.", options: ["True", "False"], correctAnswer: "True", explanation: "Cache is small, fast memory located close to or inside the CPU.", xpReward: 10 },
    { id: "cpu-q6", type: "multipleChoice", question: "Which factor can directly affect CPU performance?", options: ["Clock speed", "Monitor colour", "Keyboard layout", "File extension"], correctAnswer: "Clock speed", explanation: "Clock speed is one factor affecting how many processor cycles occur each second.", xpReward: 10 },
    { id: "cpu-q7", type: "multipleChoice", question: "What is an embedded system?", options: ["A computer system built into a larger device for a specific purpose", "A general-purpose desktop only", "A website stored in cache", "A type of optical disc"], correctAnswer: "A computer system built into a larger device for a specific purpose", explanation: "Embedded systems perform specific control or monitoring tasks within larger products.", xpReward: 10 },
    { id: "cpu-q8", type: "trueFalse", question: "Increasing the number of processor cores can allow more instructions to be processed in parallel.", options: ["True", "False"], correctAnswer: "True", explanation: "Multiple cores can execute separate instruction streams at the same time.", xpReward: 10 },
  ],
};
