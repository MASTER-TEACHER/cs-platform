import type { BankQuestion } from "./bankUtilities";
import type {
  GeneratedExamQuestion,
  ExamQuestionDifficulty,
} from "@/types/examQuestion";

type Qualification = "GCSE" | "A Level";

type Entry = {
  qualification: Qualification;
  topic: string;
  question: string;
  answer: string;
  points: readonly [string, string];
  difficulty?: ExamQuestionDifficulty;
};

const entries: Entry[] = [
  {
    qualification: "GCSE",
    topic: "CPU architecture",
    question:
      "Explain the roles of the memory address register and memory data register during a memory read.",
    answer:
      "The MAR holds the address of the memory location to read. The MDR holds the data retrieved from that location.",
    points: [
      "The MAR holds the address of the required memory location.",
      "The MDR holds the data read from memory.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Memory and storage",
    question:
      "Explain why a computer requires secondary storage even when it has RAM.",
    answer:
      "RAM normally loses its contents when power is removed. Secondary storage retains operating system files, applications and user data without power.",
    points: [
      "RAM is volatile and normally loses its contents without power.",
      "Secondary storage retains files and programs when the computer is switched off.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Computer networks",
    question:
      "Explain why a router is required to send data between different IP networks.",
    answer:
      "A router examines destination IP addresses and forwards packets towards other networks using routing information.",
    points: [
      "A router forwards packets between different networks.",
      "It uses destination IP addresses and routing information to select a path.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Cybersecurity",
    question:
      "Explain how a phishing attack could lead to an account being compromised.",
    answer:
      "An attacker impersonates a trusted organisation to trick a user into disclosing login credentials. Those credentials can then be used to attempt unauthorised access.",
    points: [
      "A deceptive message or website impersonates a trusted source.",
      "The victim may disclose credentials that the attacker can misuse.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Algorithms",
    question:
      "Explain why a linear search can be used on an unsorted list.",
    answer:
      "Linear search checks elements sequentially. It does not depend on the elements being in any particular order.",
    points: [
      "Linear search checks list elements one after another.",
      "It does not require the elements to be sorted.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Programming",
    question:
      "Explain why a programmer might use a function with parameters.",
    answer:
      "Parameters allow a function to receive different input values. This makes the same function reusable without duplicating code.",
    points: [
      "Parameters allow values to be passed into a function.",
      "The function can be reused with different inputs.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Boolean logic",
    question:
      "Explain what the XOR operation returns when its two Boolean inputs are different.",
    answer:
      "XOR returns true when exactly one of its two inputs is true. Therefore different Boolean inputs produce true.",
    points: [
      "XOR is true when exactly one input is true.",
      "Different Boolean inputs therefore produce a true result.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Binary representation and arithmetic",
    question:
      "Explain why adding two unsigned 8-bit integers can produce an overflow.",
    answer:
      "Unsigned 8-bit integers can represent values from 0 to 255. If an addition produces a value greater than 255, the result cannot fit within eight bits.",
    points: [
      "An unsigned 8-bit value has a maximum of 255.",
      "A result above 255 cannot be represented in eight bits.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Image representation",
    question:
      "Explain why doubling both the width and height of an uncompressed bitmap increases its storage requirement.",
    answer:
      "Doubling each dimension produces four times as many pixels. With the same colour depth, the pixel data requires four times as many bits.",
    points: [
      "Doubling both dimensions produces four times as many pixels.",
      "At unchanged colour depth, the pixel-data storage requirement is quadrupled.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Data compression",
    question:
      "Explain why run-length encoding works particularly well for images containing long sequences of identical pixel values.",
    answer:
      "Run-length encoding stores repeated values as a value and repetition count. Long runs can therefore be represented using fewer data items.",
    points: [
      "Repeated consecutive values are represented by a value and run length.",
      "Long runs can require less storage than listing every repeated value.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Databases and SQL",
    question:
      "Explain the difference between a database record and a database field.",
    answer:
      "A record contains a set of related values describing one entity or occurrence. A field stores one attribute or category of data within records.",
    points: [
      "A record contains related values for one entity or occurrence.",
      "A field represents one attribute or data category.",
    ],
  },
  {
    qualification: "GCSE",
    topic: "Software development and testing",
    question:
      "Explain why a programmer should test invalid inputs as well as valid inputs.",
    answer:
      "Invalid-input tests check whether the program rejects or handles data outside its permitted constraints. This helps reveal validation and error-handling faults.",
    points: [
      "Invalid tests check handling of data that violates input constraints.",
      "They help identify weaknesses in validation or error handling.",
    ],
  },
  {
    qualification: "A Level",
    topic: "Data structures",
    question:
      "Explain why a queue is appropriate for processing print jobs in arrival order.",
    answer:
      "A queue uses first-in-first-out ordering. The earliest enqueued job is removed and processed before later jobs.",
    points: [
      "A queue uses first-in-first-out ordering.",
      "Jobs are processed in the order they were added.",
    ],
  },
  {
    qualification: "A Level",
    topic: "Data structures",
    question:
      "Explain one advantage and one disadvantage of a linked list compared with an array.",
    answer:
      "A linked list can insert elements without shifting subsequent elements when the insertion position is known. However, accessing an arbitrary element usually requires traversal rather than constant-time indexing.",
    points: [
      "Insertion can avoid shifting all subsequent elements when the position is known.",
      "Random access generally requires traversal rather than direct indexing.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    topic: "Computational complexity",
    question:
      "Explain why an algorithm with time complexity O(n squared) may become impractical for large inputs.",
    answer:
      "Its operation count grows approximately in proportion to the square of the input size. Doubling n can therefore increase the dominant work by approximately four times.",
    points: [
      "The dominant work grows quadratically with input size.",
      "Doubling the input can approximately quadruple the dominant operation count.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    topic: "Recursion",
    question:
      "Explain why recursive implementations can consume more stack memory than equivalent iterative implementations.",
    answer:
      "Each active recursive call normally creates a stack frame holding return information and local state. Deep recursion can therefore require many simultaneously active frames.",
    points: [
      "Each active recursive call typically adds a call-stack frame.",
      "Deep recursion accumulates frames and increases stack-memory usage.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    topic: "Object-oriented programming",
    question:
      "Explain how polymorphism can improve the extensibility of an object-oriented program.",
    answer:
      "Objects of different classes can be used through a common interface. New implementations can be introduced without changing code that relies only on that interface.",
    points: [
      "Different object types can respond through a common interface.",
      "Code using the interface can work with additional implementations.",
    ],
  },
  {
    qualification: "A Level",
    topic: "Computer organisation",
    question:
      "Explain the difference between processor latency and throughput.",
    answer:
      "Latency is the time required to complete an individual operation. Throughput is the number of operations completed per unit time.",
    points: [
      "Latency measures the time taken by one operation.",
      "Throughput measures completed operations per unit time.",
    ],
  },
  {
    qualification: "A Level",
    topic: "Boolean algebra",
    question:
      "Explain why the expression A AND (A OR B) simplifies to A.",
    answer:
      "When A is false, the whole expression is false. When A is true, A OR B is true, so the expression is true. Its output therefore always equals A.",
    points: [
      "When A is false, the expression is false.",
      "When A is true, the expression is true regardless of B.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    topic: "Databases",
    question:
      "Explain why a foreign key is useful in a relational database.",
    answer:
      "A foreign key references a key in another table and establishes a relationship between records. Referential-integrity constraints can prevent references to nonexistent records.",
    points: [
      "A foreign key references a key in a related table.",
      "It supports relationships and referential-integrity enforcement.",
    ],
  },
  {
    qualification: "A Level",
    topic: "Theory of computation",
    question:
      "Explain what it means for a problem to be undecidable.",
    answer:
      "An undecidable decision problem has no algorithm that correctly returns a yes-or-no answer for every possible valid input and always terminates.",
    points: [
      "No algorithm can correctly decide every valid instance.",
      "The required algorithm would also have to terminate for every instance.",
    ],
    difficulty: "higher",
  },
  {
    qualification: "A Level",
    topic: "Operating systems",
    question:
      "Explain why an operating system uses process scheduling.",
    answer:
      "Scheduling determines which ready process receives processor time. It supports sharing the CPU among processes and can improve responsiveness.",
    points: [
      "Scheduling allocates processor time among ready processes.",
      "It supports CPU sharing or system responsiveness.",
    ],
  },
  {
    qualification: "A Level",
    topic: "Networking",
    question:
      "Explain why TCP uses acknowledgements and retransmission.",
    answer:
      "Acknowledgements indicate that data has been received. When expected acknowledgements are absent, data may be retransmitted to recover from loss.",
    points: [
      "Acknowledgements confirm receipt of transmitted data.",
      "Missing acknowledgements can trigger retransmission of lost data.",
    ],
  },
  {
    qualification: "A Level",
    topic: "Functional programming",
    question:
      "Explain why pure functions are easier to test than functions with hidden side effects.",
    answer:
      "A pure function produces the same output for the same inputs and does not alter external state. Tests can therefore focus on inputs and outputs without managing hidden dependencies.",
    points: [
      "Pure functions have predictable outputs for the same inputs.",
      "They do not change external state, reducing hidden test dependencies.",
    ],
    difficulty: "higher",
  },
];

const fingerprints = new Set<string>();

export const stageTwoQuestions: BankQuestion[] = entries.map(
  (entry, index) => {
    const fingerprint = [
      entry.qualification,
      entry.topic,
      entry.question.trim().toLowerCase(),
    ].join("|");

    if (fingerprints.has(fingerprint)) {
      throw new Error(`Duplicate Stage 2 question: ${index + 1}`);
    }

    fingerprints.add(fingerprint);

    if (
      !entry.question.trim() ||
      !entry.answer.trim() ||
      entry.points.length !== 2 ||
      entry.points.some((point) => !point.trim())
    ) {
      throw new Error(`Invalid Stage 2 question: ${index + 1}`);
    }

    const id = `catalogue-v2-${String(index + 1).padStart(4, "0")}`;

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
        "Accept technically equivalent answers.",
      ],
      commonMisconceptions: [],
    };

    return {
      key: id,
      sourceId: "cs-master-static-catalogue-v2",
      sourceTitle: "CS Master authored question catalogue",
      qualification: entry.qualification,
      examBoard: "AQA",
      question,
    };
  },
);