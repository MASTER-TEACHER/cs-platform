import { Quiz } from "@/types/quiz";

export const algorithmsQuiz: Quiz = {
  id: "algorithms-quiz",
  topicId: "algorithms",
  title: "Algorithms Quiz",
  description: "Test your understanding of computational thinking, searching, sorting, pseudocode and trace-table reasoning.",
  estimatedTime: "8 mins",
  questions: [
    { id: "algorithms-q1", type: "multipleChoice", question: "What is decomposition?", options: ["Breaking a problem into smaller, more manageable parts", "Removing all variables", "Sorting data in reverse", "Encrypting a file"], correctAnswer: "Breaking a problem into smaller, more manageable parts", explanation: "Decomposition splits complex problems into smaller sub-problems.", xpReward: 10 },
    { id: "algorithms-q2", type: "multipleChoice", question: "What is abstraction?", options: ["Removing unnecessary detail so important features can be focused on", "Adding every possible detail", "Converting text to hexadecimal", "Duplicating a program"], correctAnswer: "Removing unnecessary detail so important features can be focused on", explanation: "Abstraction simplifies problems by focusing on relevant information.", xpReward: 10 },
    { id: "algorithms-q3", type: "trueFalse", question: "Binary search requires the data to be ordered.", options: ["True", "False"], correctAnswer: "True", explanation: "Binary search repeatedly halves an ordered search space.", xpReward: 10 },
    { id: "algorithms-q4", type: "multipleChoice", question: "Which search checks items one by one from the beginning until a match is found?", options: ["Linear search", "Binary search", "Merge sort", "Insertion sort"], correctAnswer: "Linear search", explanation: "Linear search examines values sequentially.", xpReward: 10 },
    { id: "algorithms-q5", type: "multipleChoice", question: "What does a trace table help a programmer do?", options: ["Track how variable values change as an algorithm executes", "Increase bandwidth", "Encrypt a database", "Change colour depth"], correctAnswer: "Track how variable values change as an algorithm executes", explanation: "Trace tables record variable values step by step.", xpReward: 10 },
    { id: "algorithms-q6", type: "trueFalse", question: "Bubble sort repeatedly compares neighbouring values and swaps them when they are in the wrong order.", options: ["True", "False"], correctAnswer: "True", explanation: "Bubble sort makes repeated passes through a list, swapping adjacent out-of-order values.", xpReward: 10 },
    { id: "algorithms-q7", type: "multipleChoice", question: "Which statement best describes an algorithm?", options: ["A finite sequence of steps used to solve a problem", "A storage device", "A network cable", "A character set"], correctAnswer: "A finite sequence of steps used to solve a problem", explanation: "An algorithm is a clear sequence of instructions for completing a task.", xpReward: 10 },
    { id: "algorithms-q8", type: "multipleChoice", question: "What is the main advantage of pseudocode?", options: ["It expresses logic clearly without exact programming-language syntax", "It automatically executes on every CPU", "It stores user data permanently", "It encrypts the algorithm"], correctAnswer: "It expresses logic clearly without exact programming-language syntax", explanation: "Pseudocode communicates logic independently of a specific language.", xpReward: 10 },
  ],
};
