import type { BankQuestion } from "./bankUtilities";
import type {
  GeneratedExamQuestion,
  AssessmentQuestionType,
  ExamQuestionCommandWord,
  AssessmentObjective,
  ExamQuestionDifficulty,
} from "@/types/examQuestion";

type Entry = {
  qualification: "GCSE" | "A Level";
  board: "AQA" | "OCR" | "EDEXCEL";
  topic: string;
  type: AssessmentQuestionType;
  command: ExamQuestionCommandWord;
  objective: AssessmentObjective;
  difficulty: ExamQuestionDifficulty;
  question: string;
  answer: string;
  points: string[];
};

const entries: Entry[] = [
  {
    qualification: "GCSE",
    board: "AQA",
    topic: "Binary representation and arithmetic",
    type: "worked-calculation",
    command: "calculate",
    objective: "AO2",
    difficulty: "standard",
    question: "Add the unsigned 8-bit binary numbers 00110110 and 00011101. Give the result in 8-bit binary.",
    answer: "00110110 + 00011101 = 01010011.",
    points: [
      "Correct addition or equivalent working.",
      "Correct 8-bit result: 01010011."
    ]
  },
  {
    qualification: "GCSE",
    board: "AQA",
    topic: "Algorithms",
    type: "code-tracing",
    command: "trace",
    objective: "AO2",
    difficulty: "standard",
    question: "Trace this pseudocode and state the final value of total:\ntotal = 0\nFOR n = 1 TO 4\n    total = total + n * 2\nENDFOR",
    answer: "The successive totals are 2, 6, 12 and 20. Final total = 20.",
    points: [
      "Correct intermediate progression or equivalent working.",
      "Final value 20."
    ]
  },
  {
    qualification: "GCSE",
    board: "AQA",
    topic: "Programming",
    type: "debugging",
    command: "debug",
    objective: "AO3",
    difficulty: "higher",
    question: "A Python function is intended to return the larger of two numbers:\ndef largest(a, b):\n    if a > b:\n        return b\n    return a\nIdentify the logic error and describe the correction.",
    answer: "The returned values are reversed. Return a when a > b; otherwise return b.",
    points: [
      "Identifies that the wrong argument is returned.",
      "Corrects the return values in both branches."
    ]
  },
  {
    qualification: "GCSE",
    board: "AQA",
    topic: "Computer networks",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "A school has computers in two buildings connected through a local network. Explain why switches are used to connect computers within each building.",
    answer: "Switches connect devices on a LAN and forward Ethernet frames using destination MAC addresses.",
    points: [
      "Switches provide connections between devices on a LAN.",
      "They forward frames based on destination MAC address information."
    ]
  },
  {
    qualification: "GCSE",
    board: "AQA",
    topic: "Cybersecurity",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "An employee receives an unexpected email requesting an urgent password reset through a supplied link. Explain two actions that reduce the risk of credential theft.",
    answer: "Avoid following the unverified link and verify the request using an independently obtained official contact or website.",
    points: [
      "Avoids using the unverified link or entering credentials.",
      "Verifies the request through a trusted independent channel."
    ]
  },
  {
    qualification: "GCSE",
    board: "OCR",
    topic: "Data representation",
    type: "calculation",
    command: "calculate",
    objective: "AO2",
    difficulty: "standard",
    question: "An uncompressed bitmap is 200 pixels wide and 100 pixels high, with a colour depth of 8 bits. Calculate the pixel data size in bytes. Ignore metadata.",
    answer: "200 x 100 x 8 = 160000 bits; 160000 / 8 = 20000 bytes.",
    points: [
      "Correct calculation of 160000 bits.",
      "Correct conversion to 20000 bytes."
    ]
  },
  {
    qualification: "GCSE",
    board: "OCR",
    topic: "Boolean logic",
    type: "truth-table",
    command: "complete",
    objective: "AO2",
    difficulty: "standard",
    question: "For the expression A AND (NOT B), state the output for inputs A=0, B=0 and A=1, B=0.",
    answer: "For 0,0 the output is 0. For 1,0 the output is 1.",
    points: [
      "Correct output 0 for A=0, B=0.",
      "Correct output 1 for A=1, B=0."
    ]
  },
  {
    qualification: "GCSE",
    board: "OCR",
    topic: "Systems software",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "A computer runs a web browser and a music player at the same time. Explain how operating system scheduling supports this.",
    answer: "The operating system allocates CPU time to processes, switching between them so both can make progress.",
    points: [
      "The operating system schedules processor time between processes.",
      "Switching between processes allows concurrent progress."
    ]
  },
  {
    qualification: "GCSE",
    board: "EDEXCEL",
    topic: "Algorithms",
    type: "code-tracing",
    command: "trace",
    objective: "AO2",
    difficulty: "standard",
    question: "Trace this pseudocode:\nvalue = 3\nFOR count = 1 TO 3\n    value = value * 2\nENDFOR\nWhat is the final value?",
    answer: "The values are 6, 12 and 24. Final value = 24.",
    points: [
      "Correct repeated doubling.",
      "Final value 24."
    ]
  },
  {
    qualification: "GCSE",
    board: "EDEXCEL",
    topic: "Data representation",
    type: "conversion",
    command: "calculate",
    objective: "AO2",
    difficulty: "standard",
    question: "Convert decimal 173 to an unsigned 8-bit binary number. Show the place values used.",
    answer: "173 = 128 + 32 + 8 + 4 + 1 = 10101101.",
    points: [
      "Correct decomposition into powers of two.",
      "Correct binary result 10101101."
    ]
  },
  {
    qualification: "GCSE",
    board: "EDEXCEL",
    topic: "Programming",
    type: "code-tracing",
    command: "trace",
    objective: "AO2",
    difficulty: "standard",
    question: "State the output of this Python code:\nvalues = [4, 7, 2]\nprint(values[1] + values[2])",
    answer: "9.",
    points: [
      "Identifies list elements 7 and 2.",
      "Correct output 9."
    ]
  },
  {
    qualification: "GCSE",
    board: "EDEXCEL",
    topic: "Computer networks",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "A user can access a website using its IP address but not its domain name. Explain why a DNS problem could cause this behaviour.",
    answer: "DNS translates domain names to IP addresses. If resolution fails, the domain name cannot be translated even though the server remains reachable by IP.",
    points: [
      "DNS resolves domain names to IP addresses.",
      "A resolution failure can prevent domain-name access while IP access works."
    ]
  },
  {
    qualification: "A Level",
    board: "AQA",
    topic: "Data structures",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "A text editor needs an undo feature. Explain why a stack is suitable for storing reversible actions.",
    answer: "A stack uses last-in-first-out ordering, allowing the most recent action to be undone first.",
    points: [
      "A stack operates using last-in-first-out ordering.",
      "The most recent action is retrieved first for undo."
    ]
  },
  {
    qualification: "A Level",
    board: "AQA",
    topic: "Computational complexity",
    type: "calculation",
    command: "calculate",
    objective: "AO2",
    difficulty: "higher",
    question: "An algorithm performs approximately 3n squared primitive operations. Estimate the operations when n=100 and when n=200.",
    answer: "For n=100: 30000. For n=200: 120000.",
    points: [
      "Correct result 30000 for n=100.",
      "Correct result 120000 for n=200."
    ]
  },
  {
    qualification: "A Level",
    board: "OCR",
    topic: "Data structures",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "A breadth-first traversal must visit graph vertices in the order they are discovered. Explain why a queue is appropriate.",
    answer: "A queue processes vertices in first-in-first-out order, allowing earlier discovered vertices to be explored before later ones.",
    points: [
      "A queue uses first-in-first-out ordering.",
      "Earlier discovered vertices are processed before later discovered vertices."
    ]
  },
  {
    qualification: "A Level",
    board: "OCR",
    topic: "Boolean algebra",
    type: "calculation",
    command: "complete",
    objective: "AO2",
    difficulty: "higher",
    question: "Simplify the Boolean expression (A AND B) OR (A AND NOT B).",
    answer: "A AND (B OR NOT B) = A AND 1 = A.",
    points: [
      "Correctly factors out A or applies equivalent identities.",
      "Obtains the simplified result A."
    ]
  },
  {
    qualification: "A Level",
    board: "EDEXCEL",
    topic: "Databases",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "A school database stores a student identifier in an Enrolments table to reference the Students table. Explain the role of the identifier as a foreign key.",
    answer: "The identifier references a student record in the Students table and supports relationships and referential integrity.",
    points: [
      "The foreign key references a key in the Students table.",
      "It links related records and supports referential integrity."
    ]
  },
  {
    qualification: "A Level",
    board: "EDEXCEL",
    topic: "Networking",
    type: "scenario-application",
    command: "explain",
    objective: "AO2",
    difficulty: "standard",
    question: "A network application requires reliable ordered delivery of a stream of bytes. Explain why TCP is appropriate.",
    answer: "TCP uses sequence information to reassemble data in order and acknowledgements and retransmission to recover from loss.",
    points: [
      "TCP provides ordered byte-stream delivery.",
      "Acknowledgements and retransmission help recover lost data."
    ]
  }
];

export const expandedCatalogueQuestions: BankQuestion[] =
  entries.map((entry, index) => {
    const id = `catalogue-expanded-${String(index + 1).padStart(4, "0")}`;

    const question: GeneratedExamQuestion = {
      id,
      questionNumber: index + 1,
      topic: entry.topic,
      questionType: entry.type,
      commandWord: entry.command,
      question: entry.question,
      context: "",
      marks: entry.points.length,
      difficulty: entry.difficulty,
      assessmentObjective: entry.objective,
      markScheme: entry.points.map((description, i) => ({
        id: `${id}-mark-${i + 1}`,
        description,
        marks: 1
      })),
      levelDescriptors: [],
      modelAnswer: entry.answer,
      examinerGuidance: [
        "Award one mark for each correct marking point.",
        "Accept technically equivalent responses."
      ],
      commonMisconceptions: []
    };

    return {
      key: id,
      sourceId: "cs-master-expanded-catalogue",
      sourceTitle: "CS Master expanded authored catalogue",
      qualification: entry.qualification,
      examBoard: entry.board,
      question
    };
  });

export function validateExpandedCatalogue(): void {
  const seen = new Set<string>();

  for (const item of expandedCatalogueQuestions) {
    const q = item.question;

    const fingerprint = [
      item.qualification,
      item.examBoard,
      q.question.trim().toLowerCase().replace(/\s+/g, " ")
    ].join("|");

    if (seen.has(fingerprint)) {
      throw new Error(`Duplicate catalogue question: ${q.id}`);
    }

    seen.add(fingerprint);

    const allocated = q.markScheme.reduce(
      (sum, point) => sum + point.marks,
      0
    );

    if (
      !q.question.trim() ||
      !q.modelAnswer.trim() ||
      !q.topic.trim() ||
      allocated !== q.marks ||
      q.marks <= 0
    ) {
      throw new Error(`Invalid catalogue question: ${q.id}`);
    }
  }
}

validateExpandedCatalogue();
