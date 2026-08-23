import { Quiz } from "@/types/quiz";

export const programmingQuiz: Quiz = {
  id: "programming-quiz",
  topicId: "programming",
  title: "Programming Fundamentals Quiz",
  description: "Test your understanding of variables, data types, selection, iteration, arrays, procedures and validation.",
  estimatedTime: "8 mins",
  questions: [
    { id: "programming-q1", type: "multipleChoice", question: "What is a variable?", options: ["A named storage location whose value can change while a program runs", "A fixed network address", "A type of image compression", "A CPU register that can never change"], correctAnswer: "A named storage location whose value can change while a program runs", explanation: "Variables allow programs to store and update data while executing.", xpReward: 10 },
    { id: "programming-q2", type: "multipleChoice", question: "Which data type is most appropriate for storing True or False?", options: ["Boolean", "Integer", "String", "Real"], correctAnswer: "Boolean", explanation: "Boolean data stores one of two logical values: True or False.", xpReward: 10 },
    { id: "programming-q3", type: "trueFalse", question: "Selection allows a program to choose different paths depending on a condition.", options: ["True", "False"], correctAnswer: "True", explanation: "Selection uses constructs such as IF and ELSE.", xpReward: 10 },
    { id: "programming-q4", type: "multipleChoice", question: "Which programming construct repeats a block of code?", options: ["Iteration", "Selection", "Assignment", "Concatenation only"], correctAnswer: "Iteration", explanation: "Iteration uses loops to repeat instructions.", xpReward: 10 },
    { id: "programming-q5", type: "multipleChoice", question: "What is an array?", options: ["A data structure that stores multiple values under one name using indexes", "A network protocol", "A CPU core", "A compression method"], correctAnswer: "A data structure that stores multiple values under one name using indexes", explanation: "Arrays store collections of related values accessed by index.", xpReward: 10 },
    { id: "programming-q6", type: "trueFalse", question: "Validation checks whether input data meets specified rules.", options: ["True", "False"], correctAnswer: "True", explanation: "Validation checks input against rules such as range, type or length.", xpReward: 10 },
    { id: "programming-q7", type: "multipleChoice", question: "Why are procedures and functions useful?", options: ["They allow reusable blocks of code to be organised and called when needed", "They make all variables global", "They remove the need for testing", "They convert every program directly to machine code"], correctAnswer: "They allow reusable blocks of code to be organised and called when needed", explanation: "Subprograms improve reuse, modularity and maintainability.", xpReward: 10 },
    { id: "programming-q8", type: "multipleChoice", question: "What is syntax?", options: ["The rules that define how valid statements must be written in a programming language", "The output produced by a program", "The speed of a CPU", "The size of a network"], correctAnswer: "The rules that define how valid statements must be written in a programming language", explanation: "Syntax defines the grammatical structure required by a programming language.", xpReward: 10 },
  ],
};
