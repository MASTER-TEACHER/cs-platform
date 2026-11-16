import type { BankQuestion } from "./bankUtilities";
import type {
  GeneratedExamQuestion,
  ExamQuestionDifficulty,
} from "@/types/examQuestion";

/**
 * CS Master authored catalogue — initial integration batch.
 *
 * Questions here are independent of teacher-saved papers.
 * Each question has a model answer and allocated marking points.
 *
 * This is NOT the completed 300+ questions-per-topic collection.
 * Expand using authored, reviewed content rather than duplicating
 * questions or changing only a number in the question stem.
 */

type Entry = {
  qualification: "GCSE" | "A Level";
  examBoard: "AQA" | "OCR" | "EDEXCEL";
  topic: string;
  question: string;
  answer: string;
  points: [string, string];
  difficulty?: ExamQuestionDifficulty;
};

const entries: Entry[] = [
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "CPU architecture",
    question:
      "Explain the purpose of the program counter in the fetch-decode-execute cycle.",
    answer:
      "The program counter holds the address of the next instruction to fetch. It normally advances after an instruction is fetched, but a branch can change its value.",
    points: [
      "Holds the memory address of the next instruction.",
      "Is updated as execution proceeds or changed by a branch.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Memory and storage",
    question:
      "Explain two differences between RAM and secondary storage.",
    answer:
      "RAM is normally volatile and provides fast access to data and instructions currently in use. Secondary storage is non-volatile and retains files when power is removed.",
    points: [
      "RAM is volatile whereas secondary storage retains data without power.",
      "RAM holds currently used data/instructions, whereas secondary storage provides longer-term storage.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Computer networks",
    question:
      "Explain why a switch is useful on a local area network.",
    answer:
      "A switch connects devices on a LAN and uses destination MAC addresses to forward Ethernet frames to the appropriate port.",
    points: [
      "Connects devices within a local area network.",
      "Uses MAC address information to forward frames towards the intended device.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Cybersecurity",
    question:
      "Explain how multi-factor authentication reduces the risk of unauthorised account access.",
    answer:
      "Multi-factor authentication requires evidence from more than one authentication factor. A stolen password alone is therefore usually insufficient to access the account.",
    points: [
      "Requires authentication using more than one distinct factor.",
      "A compromised password alone is insufficient when the additional factor remains secure.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Systems software",
    question:
      "Describe two responsibilities of an operating system.",
    answer:
      "An operating system manages memory allocation and schedules processor time among running processes.",
    points: [
      "Manages allocation and use of memory.",
      "Schedules processes or allocates processor time.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Ethical, legal and environmental impacts",
    question:
      "Explain one environmental problem caused by electronic waste and one way to reduce it.",
    answer:
      "Improper disposal can release harmful substances into the environment. Responsible collection and recycling can recover materials and reduce unsafe disposal.",
    points: [
      "Identifies an environmental harm from discarded electronics, such as toxic contamination.",
      "Explains an appropriate mitigation, such as certified recycling or reuse.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Algorithms",
    question:
      "Explain why binary search requires a sorted list.",
    answer:
      "Binary search compares the target with the middle item and eliminates half of the remaining search space. That decision is reliable only when items are ordered.",
    points: [
      "Binary search compares the target with a middle item.",
      "Ordering allows it to discard the half that cannot contain the target.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Programming",
    question:
      "Explain the difference between a local variable and a global variable.",
    answer:
      "A local variable is accessible within its defined scope, such as a function. A global variable is defined in a wider scope and can be accessed from other parts of the program, subject to the language's rules.",
    points: [
      "A local variable is limited to its defining scope.",
      "A global variable has wider program scope.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Boolean logic",
    question:
      "Explain the difference between the AND and OR Boolean operations.",
    answer:
      "AND produces true only when both inputs are true. OR produces true when at least one input is true.",
    points: [
      "AND is true only when both inputs are true.",
      "OR is true when one or both inputs are true.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Binary representation and arithmetic",
    question:
      "Calculate the decimal value of the unsigned 8-bit binary number 00101101. Show your working.",
    answer:
      "00101101 = 32 + 8 + 4 + 1 = 45.",
    points: [
      "Correctly identifies the contributing place values 32, 8, 4 and 1.",
      "Gives the correct decimal result of 45.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Hexadecimal",
    question:
      "Convert hexadecimal 3F to decimal. Show your working.",
    answer:
      "3F = (3 × 16) + 15 = 63.",
    points: [
      "Correctly evaluates the hexadecimal place values.",
      "Gives the correct decimal result of 63.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Image representation",
    question:
      "Explain how increasing the colour depth affects an uncompressed bitmap image.",
    answer:
      "Increasing colour depth allows more distinct colours to be represented, but increases the number of bits needed per pixel and therefore the uncompressed file size.",
    points: [
      "A greater colour depth permits more distinct colours.",
      "More bits per pixel increase uncompressed storage requirements.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Sound representation",
    question:
      "Explain how increasing the sampling rate affects digitally recorded sound.",
    answer:
      "More samples are taken each second, potentially improving the representation of higher-frequency detail, while increasing the amount of data stored.",
    points: [
      "A higher sampling rate captures more samples per second.",
      "It increases the amount of data required for the same recording duration and bit depth.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Character representation",
    question:
      "Explain one advantage of Unicode compared with ASCII.",
    answer:
      "Unicode supports a much wider range of characters and writing systems, allowing software to represent text from many languages.",
    points: [
      "Unicode supports a substantially larger character repertoire.",
      "This enables representation of more languages, scripts or symbols.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Data compression",
    question:
      "Explain the difference between lossy and lossless compression.",
    answer:
      "Lossless compression permits exact reconstruction of the original data. Lossy compression discards some information, so exact reconstruction is not possible.",
    points: [
      "Lossless compression allows exact reconstruction.",
      "Lossy compression permanently discards some information.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Databases and SQL",
    question:
      "Explain the purpose of a primary key in a relational database table.",
    answer:
      "A primary key uniquely identifies each record and must not contain a null value.",
    points: [
      "Uniquely identifies each record in a table.",
      "Does not permit null values.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Software development and testing",
    question:
      "Explain the difference between normal test data and boundary test data.",
    answer:
      "Normal data is valid and typical of expected input. Boundary data tests values at or near the limits of an accepted range.",
    points: [
      "Normal data is representative of valid expected inputs.",
      "Boundary data checks limits or values adjacent to those limits.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Programming languages and IDEs",
    question:
      "Explain one advantage of using a debugger in an integrated development environment.",
    answer:
      "A debugger allows execution to be paused and variables inspected, helping a programmer locate the cause of incorrect behaviour.",
    points: [
      "A debugger supports pausing or stepping through execution.",
      "Inspecting state helps identify the source of a programming error.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Defensive design",
    question:
      "Explain the difference between input validation and authentication.",
    answer:
      "Input validation checks whether supplied data meets rules such as type or range. Authentication verifies a user's claimed identity.",
    points: [
      "Validation checks whether input meets specified constraints.",
      "Authentication verifies a claimed identity.",
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "AQA",
    topic: "Data representation",
    question:
      "Explain why an unsigned 8-bit integer cannot represent the value 300.",
    answer:
      "Eight bits provide 256 distinct combinations, representing unsigned values from 0 to 255. Therefore 300 is outside the representable range.",
    points: [
      "Eight bits provide 256 possible combinations.",
      "The unsigned range is 0 to 255, so 300 is too large.",
    ],
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Data structures",
    question:
      "Explain the difference between a stack and a queue.",
    answer:
      "A stack uses last-in-first-out ordering, while a queue uses first-in-first-out ordering.",
    points: [
      "A stack operates on a last-in-first-out basis.",
      "A queue operates on a first-in-first-out basis.",
    ],
    difficulty: "standard",
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Computational complexity",
    question:
      "Explain why binary search has logarithmic time complexity in the worst case.",
    answer:
      "Each comparison reduces the remaining search space by approximately half. The number of halvings required grows in proportion to log base 2 of the input size.",
    points: [
      "Each iteration approximately halves the remaining search space.",
      "The number of iterations grows logarithmically with input size.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Recursion",
    question:
      "Explain why a recursive algorithm requires a base case.",
    answer:
      "The base case provides a stopping condition. Without a reachable base case, recursive calls may continue until resources such as call-stack space are exhausted.",
    points: [
      "A base case supplies the stopping condition for recursion.",
      "Without reaching it, recursive calls can continue and exhaust resources.",
    ],
    difficulty: "standard",
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Object-oriented programming",
    question:
      "Explain the difference between encapsulation and inheritance.",
    answer:
      "Encapsulation groups data and behaviour and controls access to internal state. Inheritance allows a class to derive behaviour or attributes from another class.",
    points: [
      "Encapsulation combines data and methods while controlling access to implementation details.",
      "Inheritance allows one class to derive or extend another class.",
    ],
    difficulty: "standard",
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Computer organisation",
    question:
      "Explain why pipelining can improve processor throughput.",
    answer:
      "Pipelining overlaps different stages of multiple instructions. This can increase the number of instructions completed per unit time, although hazards can reduce the benefit.",
    points: [
      "Different instruction stages can operate concurrently on different instructions.",
      "Overlapping execution can increase instruction throughput.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Boolean algebra",
    question:
      "Use De Morgan's law to rewrite NOT(A AND B) without a NOT applied to the entire expression.",
    answer:
      "(NOT A) OR (NOT B).",
    points: [
      "Correctly negates both A and B.",
      "Correctly combines the negated terms using OR.",
    ],
    difficulty: "standard",
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Databases",
    question:
      "Explain why database normalisation can reduce update anomalies.",
    answer:
      "Normalisation separates data into related tables to reduce unnecessary duplication. This reduces the risk of inconsistent values when the same fact is updated.",
    points: [
      "Normalisation reduces redundant storage of the same facts.",
      "Reduced redundancy helps prevent inconsistent updates.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    examBoard: "AQA",
    topic: "Theory of computation",
    question:
      "Explain the difference between a deterministic finite automaton and a nondeterministic finite automaton.",
    answer:
      "A DFA has exactly one transition for each state and input symbol. An NFA may allow multiple possible transitions for a state and symbol, and may permit epsilon transitions.",
    points: [
      "A DFA has exactly one next state for each state and input symbol.",
      "An NFA can have multiple possible transitions and may use epsilon transitions.",
    ],
    difficulty: "higher",
  },
];

export const catalogueQuestions: BankQuestion[] = entries.map(
  (entry, index) => {
    const id = `catalogue-v1-${String(index + 1).padStart(4, "0")}`;

    const question: GeneratedExamQuestion = {
      id,
      questionNumber: index + 1,
      topic: entry.topic,
      questionType: "explain",
      commandWord: "explain",
      question: entry.question,
      context: "",
      marks: 2,
      difficulty: entry.difficulty ?? "standard",
      assessmentObjective: "AO1",
      markScheme: entry.points.map((description, pointIndex) => ({
        id: `${id}-point-${pointIndex + 1}`,
        description,
        marks: 1,
      })),
      levelDescriptors: [],
      modelAnswer: entry.answer,
      examinerGuidance: [
        "Award one mark for each correct marking point.",
        "Accept technically equivalent wording.",
      ],
      commonMisconceptions: [],
    };

    return {
      key: id,
      sourceId: "cs-master-static-catalogue-v1",
      sourceTitle: "CS Master authored question catalogue",
      qualification: entry.qualification,
      examBoard: entry.examBoard,
      question,
    };
  },
);