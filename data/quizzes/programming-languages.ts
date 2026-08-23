import { Quiz } from "@/types/quiz";

export const programmingLanguagesQuiz: Quiz = {
  id: "programming-languages-quiz",
  topicId: "programming-languages",
  title: "Programming Languages and IDEs Quiz",
  description: "Test your understanding of high-level and low-level languages, translators and IDE features.",
  estimatedTime: "8 mins",
  questions: [
    { id: "programming-languages-q1", type: "multipleChoice", question: "What is a high-level programming language?", options: ["A language designed to be easier for humans to read and write than machine code", "A language made only of binary digits", "A network protocol", "A database query language only"], correctAnswer: "A language designed to be easier for humans to read and write than machine code", explanation: "High-level languages use abstractions and readable syntax.", xpReward: 10 },
    { id: "programming-languages-q2", type: "multipleChoice", question: "What does a compiler do?", options: ["Translates an entire program into machine code before execution", "Executes one source line at a time without translation", "Stores image pixels", "Routes packets"], correctAnswer: "Translates an entire program into machine code before execution", explanation: "A compiler translates the whole source program before it runs.", xpReward: 10 },
    { id: "programming-languages-q3", type: "multipleChoice", question: "What does an interpreter do?", options: ["Translates and executes source code instruction by instruction", "Always creates a standalone executable first", "Only compresses files", "Controls CPU cache directly"], correctAnswer: "Translates and executes source code instruction by instruction", explanation: "An interpreter processes source code as the program runs.", xpReward: 10 },
    { id: "programming-languages-q4", type: "trueFalse", question: "Assembly language uses mnemonic instructions rather than only raw binary.", options: ["True", "False"], correctAnswer: "True", explanation: "Assembly uses mnemonics such as MOV or ADD.", xpReward: 10 },
    { id: "programming-languages-q5", type: "multipleChoice", question: "What does an assembler translate?", options: ["Assembly language into machine code", "Machine code into English", "Images into sound", "SQL into HTML"], correctAnswer: "Assembly language into machine code", explanation: "An assembler converts assembly instructions into machine instructions.", xpReward: 10 },
    { id: "programming-languages-q6", type: "multipleChoice", question: "Which is a common IDE feature?", options: ["Syntax highlighting", "CPU manufacturing", "Network cabling", "Hard-disk defragmentation only"], correctAnswer: "Syntax highlighting", explanation: "IDEs commonly provide syntax highlighting, auto-completion and diagnostics.", xpReward: 10 },
    { id: "programming-languages-q7", type: "multipleChoice", question: "What is a breakpoint used for when debugging?", options: ["Pausing program execution at a selected line", "Deleting the program permanently", "Increasing network speed", "Changing the operating system"], correctAnswer: "Pausing program execution at a selected line", explanation: "Breakpoints allow inspection of program state while debugging.", xpReward: 10 },
    { id: "programming-languages-q8", type: "trueFalse", question: "Low-level languages generally provide more direct control over hardware than high-level languages.", options: ["True", "False"], correctAnswer: "True", explanation: "Low-level languages are closer to machine instructions and hardware architecture.", xpReward: 10 },
  ],
};
