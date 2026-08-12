import type { ExamTrainerQuestion } from "@/types/examTrainer";

export const examTrainerQuestionBank: ExamTrainerQuestion[] = [
  {
    id: "binary-1",
    topic: "Binary",
    difficulty: "foundation",
    type: "calculation",
    commandWord: "calculate",
    question: "Convert the binary number 101101 into denary.",
    marks: 2,
    correctAnswer: "45",
    acceptedAnswers: ["45", "45 denary"],
    modelAnswer: "32 + 8 + 4 + 1 = 45.",
    markScheme: [
      "Shows or uses the correct place values.",
      "Gives the correct answer of 45.",
    ],
  },
  {
    id: "hex-1",
    topic: "Hexadecimal",
    difficulty: "standard",
    type: "short-response",
    commandWord: "explain",
    question: "Explain one reason hexadecimal is used instead of binary.",
    marks: 2,
    modelAnswer:
      "Hexadecimal represents long binary values more compactly, making them easier for people to read and write.",
    markScheme: [
      "Hexadecimal is shorter or more compact than binary.",
      "It is easier for humans to read, write or identify errors.",
    ],
  },
  {
    id: "cpu-1",
    topic: "CPU Architecture",
    difficulty: "standard",
    type: "short-response",
    commandWord: "describe",
    question: "Describe the purpose of the program counter.",
    marks: 2,
    modelAnswer:
      "The program counter stores the address of the next instruction to be fetched.",
    markScheme: [
      "Stores an address.",
      "The address is for the next instruction to be fetched or executed.",
    ],
  },
  {
    id: "networks-1",
    topic: "Networks",
    difficulty: "standard",
    type: "multiple-choice",
    commandWord: "identify",
    question: "Which device forwards packets between different networks?",
    marks: 1,
    options: ["Switch", "Router", "NIC", "Wireless access point"],
    correctAnswer: "Router",
    modelAnswer: "Router",
    markScheme: ["Selects Router."],
  },
  {
    id: "cyber-1",
    topic: "Cyber Security",
    difficulty: "standard",
    type: "extended-response",
    commandWord: "explain",
    question:
      "Explain two ways an organisation can reduce the risk of phishing attacks.",
    marks: 4,
    modelAnswer:
      "The organisation can train staff to recognise suspicious messages and verify requests using a separate channel. It can also use multi-factor authentication so a stolen password alone is not enough to access an account.",
    markScheme: [
      "Identifies staff awareness training.",
      "Explains how training helps users recognise or report phishing.",
      "Identifies a second valid control such as MFA, filtering or verification procedures.",
      "Explains how the second control reduces risk.",
    ],
  },
  {
    id: "algorithms-1",
    topic: "Algorithms",
    difficulty: "standard",
    type: "code-tracing",
    commandWord: "trace",
    question:
      "Trace the algorithm and state the final value of total.\n\n total = 0\n FOR i = 1 TO 4\n   total = total + i\n NEXT i",
    marks: 2,
    correctAnswer: "10",
    acceptedAnswers: ["10", "total = 10"],
    modelAnswer:
      "The values added are 1, 2, 3 and 4, giving a final total of 10.",
    markScheme: [
      "Correctly follows all four iterations.",
      "Gives the final value 10.",
    ],
  },
  {
    id: "programming-1",
    topic: "Programming",
    difficulty: "higher",
    type: "extended-response",
    commandWord: "write",
    question:
      "Write Python code that inputs five integer scores, calculates the total and outputs the average.",
    marks: 6,
    modelAnswer:
      "total = 0\nfor count in range(5):\n    score = int(input('Score: '))\n    total = total + score\naverage = total / 5\nprint(average)",
    markScheme: [
      "Initialises a total.",
      "Uses repetition for five scores.",
      "Inputs a score on each iteration.",
      "Converts or treats the score as numeric.",
      "Adds each score and calculates the average.",
      "Outputs the average.",
    ],
  },
  {
    id: "database-1",
    topic: "Databases",
    difficulty: "standard",
    type: "short-response",
    commandWord: "write",
    question:
      "Write an SQL query to display Name and Score from Student where Score is at least 60.",
    marks: 4,
    modelAnswer: "SELECT Name, Score FROM Student WHERE Score >= 60;",
    markScheme: [
      "Uses SELECT.",
      "Selects Name and Score.",
      "Uses FROM Student.",
      "Uses WHERE Score >= 60.",
    ],
  },
  {
    id: "logic-1",
    topic: "Boolean Logic",
    difficulty: "foundation",
    type: "multiple-choice",
    commandWord: "identify",
    question: "What is the output of 1 XOR 1?",
    marks: 1,
    options: ["0", "1"],
    correctAnswer: "0",
    modelAnswer: "0",
    markScheme: ["Selects 0."],
  },
  {
    id: "storage-1",
    topic: "Memory and Storage",
    difficulty: "standard",
    type: "short-response",
    commandWord: "compare",
    question: "Compare RAM and ROM.",
    marks: 4,
    modelAnswer:
      "RAM is volatile and stores programs and data currently in use. ROM is non-volatile and stores fixed instructions such as firmware.",
    markScheme: [
      "RAM is volatile.",
      "RAM stores active programs or data.",
      "ROM is non-volatile.",
      "ROM stores fixed instructions or firmware.",
    ],
  },
];

export const examTrainerTopics = Array.from(
  new Set(examTrainerQuestionBank.map((question) => question.topic)),
).sort();
