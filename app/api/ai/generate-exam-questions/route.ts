import OpenAI from "openai";
import { NextResponse } from "next/server";

import type {
  AssessmentBlueprintItem,
  AssessmentGenerationMode,
  AssessmentObjective,
  AssessmentQuestionType,
  ExamQuestionCommandWord,
  ExamQuestionDifficulty,
  ExamQuestionLevelDescriptor,
  ExamQuestionMarkPoint,
  GeneratedExamQuestion,
  GeneratedExamQuestionSet,
} from "@/types/examQuestion";

type RequestBody = {
  topic: string;
  qualification: string;
  examBoard: string;
  difficulty: ExamQuestionDifficulty;
  generationMode: AssessmentGenerationMode;
  blueprint: AssessmentBlueprintItem[];
  useDemo?: boolean;
};

type ParsedQuestion = {
  question: string;
  context: string;
  markScheme: Array<{
    description: string;
    marks: number;
  }>;
  levelDescriptors: Array<{
    level: number;
    markRange: string;
    description: string;
  }>;
  modelAnswer: string;
  examinerGuidance: string[];
  commonMisconceptions: string[];
};

const QUESTION_TYPES: AssessmentQuestionType[] = [
  "multiple-choice",
  "state-identify",
  "short-response",
  "definition",
  "conversion",
  "calculation",
  "worked-calculation",
  "complete-table",
  "trace-table",
  "truth-table",
  "code-completion",
  "code-tracing",
  "debugging",
  "algorithm-design",
  "compare",
  "explain",
  "scenario-application",
  "extended-response",
  "discuss",
  "evaluate",
];

const COMMAND_WORDS: ExamQuestionCommandWord[] = [
  "state",
  "identify",
  "define",
  "describe",
  "explain",
  "compare",
  "calculate",
  "complete",
  "write",
  "trace",
  "debug",
  "design",
  "evaluate",
  "discuss",
];

function isDifficulty(value: unknown): value is ExamQuestionDifficulty {
  return value === "foundation" || value === "standard" || value === "higher";
}

function isObjective(value: unknown): value is AssessmentObjective {
  return value === "AO1" || value === "AO2" || value === "AO3";
}

function isQuestionType(value: unknown): value is AssessmentQuestionType {
  return (
    typeof value === "string" &&
    QUESTION_TYPES.includes(value as AssessmentQuestionType)
  );
}

function isCommandWord(value: unknown): value is ExamQuestionCommandWord {
  return (
    typeof value === "string" &&
    COMMAND_WORDS.includes(value as ExamQuestionCommandWord)
  );
}

function isBlueprintItem(value: unknown): value is AssessmentBlueprintItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<AssessmentBlueprintItem>;

  return (
    typeof item.id === "string" &&
    typeof item.questionNumber === "number" &&
    Number.isInteger(item.questionNumber) &&
    item.questionNumber >= 1 &&
    isObjective(item.assessmentObjective) &&
    isQuestionType(item.questionType) &&
    isCommandWord(item.commandWord) &&
    typeof item.marks === "number" &&
    Number.isInteger(item.marks) &&
    item.marks >= 1 &&
    item.marks <= 12 &&
    isDifficulty(item.difficulty) &&
    typeof item.topicFocus === "string" &&
    item.topicFocus.trim().length > 0
  );
}

function isValidRequest(value: unknown): value is RequestBody {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Partial<RequestBody>;

  return (
    typeof request.topic === "string" &&
    request.topic.trim().length > 0 &&
    typeof request.qualification === "string" &&
    request.qualification.trim().length > 0 &&
    typeof request.examBoard === "string" &&
    request.examBoard.trim().length > 0 &&
    isDifficulty(request.difficulty) &&
    (request.generationMode === "automatic" ||
      request.generationMode === "manual") &&
    Array.isArray(request.blueprint) &&
    request.blueprint.length >= 1 &&
    request.blueprint.length <= 20 &&
    request.blueprint.every(isBlueprintItem) &&
    (request.useDemo === undefined || typeof request.useDemo === "boolean")
  );
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function createLevelDescriptors(marks: number): ExamQuestionLevelDescriptor[] {
  if (marks < 6) {
    return [];
  }

  if (marks <= 8) {
    return [
      {
        level: 3,
        markRange: `${Math.max(6, marks - 2)}–${marks}`,
        description:
          "A detailed, accurate and well-developed response with clear application or evaluation and a supported conclusion where required.",
      },
      {
        level: 2,
        markRange: `3–${Math.max(4, marks - 3)}`,
        description:
          "A mostly accurate response with some developed reasoning, although coverage or evaluation may be uneven.",
      },
      {
        level: 1,
        markRange: "1–2",
        description:
          "Basic relevant statements with limited development, application or technical precision.",
      },
    ];
  }

  return [
    {
      level: 4,
      markRange: `${Math.max(10, marks - 2)}–${marks}`,
      description:
        "A comprehensive, technically accurate and balanced response with sustained reasoning, effective use of examples and a justified conclusion.",
    },
    {
      level: 3,
      markRange: `7–${Math.max(9, marks - 3)}`,
      description:
        "A mostly accurate and developed response with relevant analysis or evaluation, though balance or depth may be inconsistent.",
    },
    {
      level: 2,
      markRange: "4–6",
      description:
        "Some accurate knowledge and application, but development is limited and reasoning may be incomplete or one-sided.",
    },
    {
      level: 1,
      markRange: "1–3",
      description:
        "Basic relevant statements with little explanation, application or evaluation.",
    },
  ];
}

function createSpecificMarkScheme(
  item: AssessmentBlueprintItem,
  points: string[],
): ExamQuestionMarkPoint[] {
  if (item.marks >= 6) {
    return points
      .slice(0, Math.min(points.length, item.marks))
      .map((description, index) => ({
        id: `${item.id}-mark-${index + 1}`,
        description,
        marks: 1,
      }));
  }

  const selected = points.slice(0, item.marks);

  while (selected.length < item.marks) {
    selected.push(
      `Credit a further accurate, relevant and distinct point about ${item.topicFocus}.`,
    );
  }

  return selected.map((description, index) => ({
    id: `${item.id}-mark-${index + 1}`,
    description,
    marks: 1,
  }));
}

function demoContentForType(
  item: AssessmentBlueprintItem,
  index: number,
): {
  question: string;
  context: string;
  markPoints: string[];
  modelAnswer: string;
  examinerGuidance: string[];
  misconceptions: string[];
} {
  const topic = item.topicFocus.trim();

  const variant = index + 1;

  switch (item.questionType) {
    case "multiple-choice":
      return {
        question: `Which option gives the most accurate statement about ${topic}?\n\nA. ${topic} is used only for storing images.\nB. ${topic} is a Computer Science concept that can be applied to solve or represent problems.\nC. ${topic} removes the need for algorithms.\nD. ${topic} prevents computers from processing data.`,
        context: "Select one answer.",
        markPoints: [
          `Award 1 mark for selecting option B: ${topic} is a Computer Science concept that can be applied to solve or represent problems.`,
        ],
        modelAnswer: "B",
        examinerGuidance: [
          "Award the mark only for the correct option.",
          "Do not award multiple selections unless the final answer is clearly indicated.",
        ],
        misconceptions: [
          `Believing that ${topic} has only one narrow use.`,
          "Selecting an option because it contains familiar terminology rather than checking its accuracy.",
        ],
      };

    case "conversion":
      return {
        question: `Convert the value connected to ${topic} from one appropriate representation to another. Show each stage of your working.`,
        context: `Use the value ${variant * 7 + 18} as the source value. The teacher may edit the representations before publishing.`,
        markPoints: [
          "Correctly identifies the place values or conversion method.",
          "Shows an accurate intermediate stage.",
          "Produces the correct final representation.",
          "Uses the correct base, units or notation.",
        ],
        modelAnswer: `A complete answer should show the place values or repeated-division method, record the intermediate values accurately and give the final converted value with the correct notation.`,
        examinerGuidance: [
          "Award method marks where the process is correct but a later arithmetic slip occurs.",
          "Require the final answer to use unambiguous notation.",
        ],
        misconceptions: [
          "Reading a representation as if it were denary without considering its base.",
          "Omitting leading zeros or notation when these are required by the question.",
        ],
      };

    case "calculation":
    case "worked-calculation":
      return {
        question: `${titleCase(
          item.commandWord,
        )} a calculation involving ${topic}. Show all working and identify any important condition or error that could occur.`,
        context: `Use two original values suitable for ${item.difficulty} difficulty. This is demo content, so the teacher should insert or edit the final numerical values.`,
        markPoints: [
          "Uses the correct method or operation.",
          "Shows the first accurate stage of working.",
          "Completes the remaining working accurately.",
          "States the correct final answer.",
          "Identifies a relevant condition such as overflow, range or validation where applicable.",
          "Explains the effect of the identified condition.",
        ],
        modelAnswer: `The response should show the chosen values, apply the correct operation step by step, state the final result and explain any relevant limitation such as range or overflow.`,
        examinerGuidance: [
          "Credit correct working even if the final answer contains a single arithmetic slip.",
          "Do not award a method mark for an unexplained guess.",
        ],
        misconceptions: [
          "Applying a denary method without adapting it to the representation being used.",
          "Ignoring carry, borrow, range or overflow conditions.",
        ],
      };

    case "complete-table":
    case "truth-table":
      return {
        question: `Complete the missing entries in a table that assesses ${topic}.`,
        context: `The final published version should contain ${Math.max(
          2,
          Math.min(8, item.marks),
        )} missing cells and enough headings to make every required output clear.`,
        markPoints: [
          "Completes the first required row or cell accurately.",
          "Completes the second required row or cell accurately.",
          "Completes the third required row or cell accurately.",
          "Completes the fourth required row or cell accurately.",
          "Uses consistent notation throughout the table.",
          "Derives the final output from the correct preceding values.",
        ],
        modelAnswer:
          "The model answer should reproduce the completed table and briefly show how each output was obtained.",
        examinerGuidance: [
          "Award marks independently for each correct cell unless one error is carried forward consistently.",
          "Accept equivalent Boolean notation where it is unambiguous.",
        ],
        misconceptions: [
          "Treating AND and OR as if they produce the same output.",
          "Changing an earlier input while calculating a later row.",
        ],
      };

    case "trace-table":
    case "code-tracing":
      return {
        question: `Trace the supplied algorithm or code connected to ${topic} and record the value of each variable after every iteration.`,
        context: `Use an original short algorithm with ${Math.max(
          2,
          Math.min(6, item.marks),
        )} meaningful state changes.`,
        markPoints: [
          "Records the correct initial variable values.",
          "Records the correct values after the first iteration.",
          "Records the correct values after the second iteration.",
          "Continues the trace accurately for the remaining iterations.",
          "States the correct final output.",
          "Uses a clear and consistent trace-table layout.",
        ],
        modelAnswer:
          "The model answer should contain a fully completed trace table with one row per iteration and the correct final output.",
        examinerGuidance: [
          "Award follow-through marks when one early error is applied consistently.",
          "Do not credit a final output with no supporting trace when the question requires working.",
        ],
        misconceptions: [
          "Updating variables in the wrong order.",
          "Forgetting that a loop condition is checked before or after an iteration.",
        ],
      };

    case "code-completion":
      return {
        question: `Complete the missing lines in an original program that uses ${topic}.`,
        context:
          "The code should use clear variable names and contain only the number of gaps justified by the mark allocation.",
        markPoints: [
          "Uses a correct statement or expression in the first gap.",
          "Uses a correct statement or expression in the second gap.",
          "Uses appropriate syntax for the selected programming language.",
          "Preserves the intended control flow.",
          "Produces the required output for the stated test data.",
        ],
        modelAnswer:
          "The model answer should provide the completed code and a short explanation of how the inserted statements satisfy the requirements.",
        examinerGuidance: [
          "Accept logically equivalent code.",
          "Ignore minor syntax errors only where the intended logic remains completely clear and the mark scheme permits it.",
        ],
        misconceptions: [
          "Using assignment where comparison is required.",
          "Placing a statement outside the required loop or selection block.",
        ],
      };

    case "debugging":
      return {
        question: `An original solution involving ${topic} contains errors. Identify the errors, correct them and explain why each correction is needed.`,
        context: `Include at least ${Math.max(
          1,
          Math.min(4, Math.floor(item.marks / 2)),
        )} distinct logical or syntax errors.`,
        markPoints: [
          "Correctly identifies the first error.",
          "Provides a valid correction for the first error.",
          "Correctly identifies the second error.",
          "Provides a valid correction for the second error.",
          "Explains how the corrected solution now meets the requirement.",
          "Uses appropriate technical terminology.",
        ],
        modelAnswer:
          "The model answer should quote or identify each faulty line, provide corrected code or logic and explain the effect of every correction.",
        examinerGuidance: [
          "Do not award a correction mark when the replacement creates a different error.",
          "Accept alternative corrections that preserve the required behaviour.",
        ],
        misconceptions: [
          "Changing code without explaining the original error.",
          "Correcting syntax while leaving the underlying logic incorrect.",
        ],
      };

    case "algorithm-design":
      return {
        question: `Design an algorithm that applies ${topic} to solve the stated problem. Use pseudocode, structured English or a flowchart.`,
        context: `Create an original scenario requiring input, processing, validation and output appropriate to ${item.difficulty} difficulty.`,
        markPoints: [
          "Identifies or accepts the required input.",
          "Uses an appropriate process connected to the topic.",
          "Uses correct sequencing.",
          "Uses suitable selection or iteration where required.",
          "Produces the required output.",
          "Handles an important boundary or invalid case.",
          "Uses clear variable names and unambiguous logic.",
          "Provides a complete solution that meets the scenario.",
        ],
        modelAnswer:
          "The model answer should provide a complete algorithm with clear inputs, ordered processing, any required selection or iteration, validation and the specified output.",
        examinerGuidance: [
          "Credit any logically correct algorithmic representation.",
          "For higher bands, require a complete and robust solution rather than isolated fragments.",
        ],
        misconceptions: [
          "Describing the desired result without giving an executable sequence of steps.",
          "Using a loop or condition that can never terminate or be satisfied.",
        ],
      };

    case "compare":
      return {
        question: `Compare two appropriate approaches, representations or technologies connected to ${topic}.`,
        context:
          "The response must include similarities, differences and a judgement linked to a stated use case.",
        markPoints: [
          "States one accurate similarity.",
          "States one accurate difference.",
          "Develops the first comparison using technical reasoning.",
          "Develops a second comparison using technical reasoning.",
          "Links the comparison to the stated context.",
          "Reaches a justified conclusion.",
        ],
        modelAnswer: `A complete answer should compare both options directly, explain at least two technically accurate similarities or differences, apply them to the scenario and justify which option is more suitable.`,
        examinerGuidance: [
          "Do not award full marks for two separate descriptions with no direct comparison.",
          "A conclusion must follow from the evidence given.",
        ],
        misconceptions: [
          "Describing only one option.",
          "Giving a preference without technical justification.",
        ],
      };

    case "scenario-application":
      return {
        question: `Apply your knowledge of ${topic} to the original scenario provided. Explain the most suitable solution and its likely effect.`,
        context: `A fictional organisation must make a decision involving ${topic}. Include constraints such as cost, performance, security or usability.`,
        markPoints: [
          "Identifies a relevant feature of the scenario.",
          "Selects an appropriate concept or solution.",
          "Explains how the solution applies to the scenario.",
          "Explains one likely benefit.",
          "Explains one limitation or risk.",
          "Reaches a justified recommendation.",
        ],
        modelAnswer: `The model answer should select a suitable solution, connect each point explicitly to the scenario, explain benefits and limitations and finish with a justified recommendation.`,
        examinerGuidance: [
          "Generic textbook statements must be applied to the scenario to gain application marks.",
          "Accept different recommendations when they are technically accurate and justified.",
        ],
        misconceptions: [
          "Repeating information from the scenario without applying Computer Science knowledge.",
          "Assuming that the most powerful or expensive option is always the most suitable.",
        ],
      };

    case "extended-response":
    case "discuss":
    case "evaluate":
      return {
        question: `${titleCase(
          item.commandWord,
        )} the role, benefits and limitations of ${topic} in the stated computing context. Reach a justified conclusion.`,
        context: `Use an original scenario containing at least two competing considerations relevant to ${topic}.`,
        markPoints: [
          "Demonstrates accurate knowledge of the topic.",
          "Explains a relevant benefit.",
          "Develops the benefit using the scenario.",
          "Explains a relevant limitation or risk.",
          "Develops the limitation using the scenario.",
          "Considers an alternative viewpoint or solution.",
          "Uses accurate technical terminology.",
          "Organises the response into a clear line of reasoning.",
          "Makes a judgement based on the evidence.",
          "Provides a justified conclusion linked to the scenario.",
          "Maintains balance across the response.",
          "Shows sustained analysis or evaluation.",
        ],
        modelAnswer: `A high-level response should explain the relevant principles of ${topic}, apply benefits and limitations to the scenario, consider alternatives and reach a balanced, technically justified conclusion.`,
        examinerGuidance: [
          "Use the level descriptors rather than counting isolated points for the final mark.",
          "A one-sided response cannot access the highest level where balance is required.",
          "Reward sustained reasoning, accurate terminology and scenario-specific judgement.",
        ],
        misconceptions: [
          "Listing advantages and disadvantages without explaining their significance.",
          "Giving a conclusion that is not supported by the preceding discussion.",
        ],
      };

    case "definition":
      return {
        question: `Define the term ${topic}.`,
        context: "Use precise Computer Science terminology.",
        markPoints: [
          `States the essential meaning of ${topic}.`,
          "Includes a second defining characteristic or accurate technical detail.",
        ],
        modelAnswer: `A complete definition should state what ${topic} is and include the technical characteristic that distinguishes it from related concepts.`,
        examinerGuidance: [
          "Do not credit an example on its own unless it demonstrates the defining meaning.",
          "Accept equivalent technical wording.",
        ],
        misconceptions: [
          "Giving an example instead of a definition.",
          "Using the term itself within the definition without explaining it.",
        ],
      };

    case "explain":
    case "short-response":
    case "state-identify":
    default:
      return {
        question: `${titleCase(
          item.commandWord,
        )} ${item.marks === 1 ? "one accurate feature" : "the key principles"} of ${topic}.`,
        context: `Answer using accurate terminology and an example where appropriate. Variant ${variant} uses a distinct focus within the topic.`,
        markPoints: [
          `States an accurate point about ${topic}.`,
          "Develops the point with a technically accurate explanation.",
          "Provides a relevant example.",
          "Explains how the example demonstrates the concept.",
          "Links the explanation to a computing context.",
          "Uses precise technical terminology.",
        ],
        modelAnswer: `A complete answer should state an accurate principle of ${topic}, explain why or how it works and use a relevant example to demonstrate understanding.`,
        examinerGuidance: [
          "Award separate marks only for distinct ideas.",
          "A repeated point expressed differently should not be credited twice.",
        ],
        misconceptions: [
          "Giving a vague statement without technical explanation.",
          "Providing an example that is unrelated to the stated principle.",
        ],
      };
  }
}

type TopicProfile = {
  id: string;
  patterns: RegExp[];
  displayName: string;
  definition: string;
  explanation: string;
  examples: string[];
  benefits: string[];
  limitations: string[];
  misconceptions: string[];
  keywords: string[];
};

const TOPIC_PROFILES: TopicProfile[] = [
  {
    id: "binary-arithmetic",
    patterns: [
      /\bbinary\b/i,
      /\boverflow\b/i,
      /\btwo'?s complement\b/i,
      /\bbit shift\b/i,
    ],
    displayName: "binary representation and arithmetic",
    definition:
      "Binary is a base-2 number system that represents values using only 0 and 1. Binary arithmetic applies operations such as addition, subtraction and shifts to those bit patterns.",
    explanation:
      "Computers use binary because electronic circuits can reliably distinguish between two voltage states. Binary addition uses the rules 0 + 0 = 0, 0 + 1 = 1 and 1 + 1 = 10, with carries passed to the next column. A fixed-width register can overflow when a result needs more bits than are available.",
    examples: [
      "0101₂ + 0011₂ = 1000₂",
      "00101101₂ represents 45₁₀",
      "An unsigned 8-bit value has the range 0 to 255",
    ],
    benefits: [
      "maps directly to two-state electronic circuits",
      "supports reliable storage and processing",
      "provides a consistent representation for all data",
    ],
    limitations: [
      "long bit patterns are difficult for people to read",
      "fixed-width values can overflow",
      "signed values require an agreed representation",
    ],
    misconceptions: [
      "treating a binary value as if it were denary",
      "forgetting carries or borrows",
      "assuming every 8-bit pattern is unsigned",
    ],
    keywords: ["bit", "base 2", "place value", "carry", "overflow", "range"],
  },
  {
    id: "hexadecimal",
    patterns: [/\bhexadecimal\b/i, /\bhex\b/i],
    displayName: "hexadecimal",
    definition:
      "Hexadecimal is a base-16 number system that uses the symbols 0–9 and A–F. One hexadecimal digit represents exactly four binary bits.",
    explanation:
      "Hexadecimal is used as a compact, human-readable shorthand for binary. Converting between binary and hexadecimal can be done by grouping binary digits into sets of four and replacing each group with the equivalent hexadecimal digit.",
    examples: [
      "1111₂ = F₁₆",
      "2D₁₆ = 00101101₂",
      "Hexadecimal is often used for memory addresses and colour values",
    ],
    benefits: [
      "shorter and easier to read than long binary strings",
      "converts directly to groups of four bits",
      "reduces transcription errors for humans",
    ],
    limitations: [
      "computer hardware still stores the underlying value in binary",
      "learners must remember values A–F",
      "base confusion can cause incorrect conversions",
    ],
    misconceptions: [
      "reading 10₁₆ as ten rather than sixteen",
      "grouping binary digits from the wrong end",
      "assuming hexadecimal is a different stored data type",
    ],
    keywords: ["base 16", "nibble", "A to F", "binary shorthand", "conversion"],
  },
  {
    id: "boolean-logic",
    patterns: [
      /\bboolean\b/i,
      /\blogic gate\b/i,
      /\btruth table\b/i,
      /\bAND\b/i,
      /\bOR\b/i,
      /\bNOT\b/i,
    ],
    displayName: "Boolean logic and logic gates",
    definition:
      "Boolean logic represents conditions using two values, true and false, often written as 1 and 0. Logic gates implement Boolean operations such as AND, OR and NOT.",
    explanation:
      "An AND operation is true only when both inputs are true. OR is true when at least one input is true. NOT reverses its input. Truth tables show every possible input combination and the corresponding output.",
    examples: ["1 AND 1 = 1", "0 OR 1 = 1", "NOT 1 = 0"],
    benefits: [
      "provides precise rules for decision-making",
      "underpins digital circuits and program conditions",
      "allows complex expressions to be tested systematically",
    ],
    limitations: [
      "complex expressions can be difficult to simplify",
      "operator precedence can be misunderstood",
      "a truth table grows quickly as the number of inputs increases",
    ],
    misconceptions: [
      "treating OR as exclusive OR",
      "forgetting that NOT applies only to the specified input or expression",
      "assuming AND is true when only one input is true",
    ],
    keywords: ["true", "false", "AND", "OR", "NOT", "truth table"],
  },
  {
    id: "cpu-architecture",
    patterns: [
      /\bcpu\b/i,
      /\bprocessor\b/i,
      /\bfetch[- ]decode[- ]execute\b/i,
      /\bregister\b/i,
      /\bvon neumann\b/i,
      /\bclock speed\b/i,
      /\bcache\b/i,
      /\bcore\b/i,
    ],
    displayName: "CPU architecture and the fetch-decode-execute cycle",
    definition:
      "The central processing unit is the part of a computer that executes instructions, performs calculations and coordinates the operation of other components.",
    explanation:
      "During the fetch-decode-execute cycle, the CPU fetches an instruction from memory, decodes what the instruction requires and executes it. Registers hold small values and addresses currently needed by the processor. Performance is influenced by factors including clock speed, cache size and the number of cores.",
    examples: [
      "The program counter stores the address of the next instruction",
      "The memory data register holds data transferred to or from memory",
      "Cache stores frequently used instructions and data close to the CPU",
    ],
    benefits: [
      "executes instructions rapidly",
      "coordinates processing across the computer",
      "registers and cache reduce repeated access to slower main memory",
    ],
    limitations: [
      "higher clock speeds can increase heat and energy use",
      "additional cores do not speed up every program",
      "performance depends on software as well as hardware",
    ],
    misconceptions: [
      "assuming clock speed alone determines performance",
      "confusing a register with RAM",
      "placing decode before fetch",
    ],
    keywords: [
      "ALU",
      "control unit",
      "register",
      "program counter",
      "cache",
      "clock",
    ],
  },
  {
    id: "memory-storage",
    patterns: [
      /\bram\b/i,
      /\brom\b/i,
      /\bmemory\b/i,
      /\bstorage\b/i,
      /\bssd\b/i,
      /\bhdd\b/i,
      /\boptical\b/i,
      /\bvirtual memory\b/i,
    ],
    displayName: "memory and secondary storage",
    definition:
      "Primary memory stores data and instructions currently required by the computer, while secondary storage retains files and programs when power is removed.",
    explanation:
      "RAM is volatile working memory used by active programs. ROM is non-volatile and commonly stores fixed instructions such as firmware. Secondary storage technologies include magnetic hard drives, solid-state drives and optical media, each with different capacity, speed, durability and cost characteristics.",
    examples: [
      "RAM stores instructions for programs that are currently running",
      "An SSD has no moving parts",
      "Virtual memory uses secondary storage when available RAM is insufficient",
    ],
    benefits: [
      "RAM gives the CPU relatively fast access to active data",
      "secondary storage preserves data without power",
      "different technologies allow trade-offs between cost, capacity and speed",
    ],
    limitations: [
      "RAM is volatile",
      "virtual memory is slower than physical RAM",
      "storage devices can fail and require backups",
    ],
    misconceptions: [
      "calling all storage memory",
      "assuming ROM can never be updated in any device",
      "believing virtual memory increases the physical amount of RAM",
    ],
    keywords: [
      "volatile",
      "non-volatile",
      "capacity",
      "access speed",
      "durability",
      "virtual memory",
    ],
  },
  {
    id: "networks",
    patterns: [
      /\bnetworks?\b/i,
      /\bprotocol\b/i,
      /\btopology\b/i,
      /\bip address\b/i,
      /\bmac address\b/i,
      /\bpacket\b/i,
      /\btcp\b/i,
      /\brouter\b/i,
      /\bswitch\b/i,
      /\bdns\b/i,
    ],
    displayName: "computer networks and protocols",
    definition:
      "A computer network is a group of connected devices that communicate and share data, resources or services.",
    explanation:
      "Data is commonly divided into packets for transmission. Protocols define rules for communication, including addressing, error handling and how data is formatted. Switches connect devices within a local network, while routers forward packets between different networks.",
    examples: [
      "TCP checks that packets arrive reliably and in the correct order",
      "IP provides addressing and routing",
      "DNS translates domain names into IP addresses",
    ],
    benefits: [
      "allows resource and file sharing",
      "supports communication and centralised services",
      "can simplify backups and administration",
    ],
    limitations: [
      "network failure can affect many users",
      "connected systems face security risks",
      "hardware, maintenance and administration have costs",
    ],
    misconceptions: [
      "confusing an IP address with a MAC address",
      "assuming packets always follow the same route",
      "treating the internet and the World Wide Web as identical",
    ],
    keywords: ["packet", "protocol", "IP", "MAC", "router", "switch", "DNS"],
  },
  {
    id: "cybersecurity",
    patterns: [
      /\bcyber(?:security|\s+security)?\b/i,
      /\bmalware\b/i,
      /\bphishing\b/i,
      /\bsocial engineering\b/i,
      /\bencryption\b/i,
      /\bfirewall\b/i,
      /\bauthentication\b/i,
      /\bbrute force\b/i,
      /\bddos\b/i,
    ],
    displayName: "cybersecurity",
    definition:
      "Cybersecurity is the protection of computer systems, networks and data from unauthorised access, damage, disruption or theft.",
    explanation:
      "Security controls reduce threats by preventing, detecting and responding to attacks. Examples include authentication, access control, encryption, firewalls, software updates, backups and user education. No single control removes every risk, so organisations use defence in depth.",
    examples: [
      "Phishing attempts to trick users into revealing information",
      "Encryption converts plaintext into ciphertext using a key",
      "Multi-factor authentication requires more than one form of evidence",
    ],
    benefits: [
      "protects confidentiality, integrity and availability",
      "reduces financial and operational harm",
      "supports legal and organisational responsibilities",
    ],
    limitations: [
      "controls can be costly or inconvenient",
      "human error can bypass technical measures",
      "new vulnerabilities and attacks continue to emerge",
    ],
    misconceptions: [
      "assuming a firewall blocks every attack",
      "confusing encryption with hashing",
      "believing strong technology removes the need for user training",
    ],
    keywords: [
      "confidentiality",
      "integrity",
      "availability",
      "authentication",
      "encryption",
      "malware",
    ],
  },
  {
    id: "algorithms",
    patterns: [
      /\balgorithms?\b/i,
      /\blinear search\b/i,
      /\bbinary search\b/i,
      /\bbubble sort\b/i,
      /\bmerge sort\b/i,
      /\binsertion sort\b/i,
      /\bsearch\b/i,
      /\bsort\b/i,
      /\bcomplexity\b/i,
    ],
    displayName: "algorithms, searching and sorting",
    definition:
      "An algorithm is a finite, ordered sequence of unambiguous steps used to solve a problem or complete a task.",
    explanation:
      "Algorithms can be represented using pseudocode, flowcharts or program code. Searching algorithms locate values, while sorting algorithms arrange data into an order. Their suitability depends on factors such as data size, whether data is already sorted, memory use and time complexity.",
    examples: [
      "Linear search checks values one at a time",
      "Binary search repeatedly halves a sorted search area",
      "Bubble sort swaps adjacent values that are in the wrong order",
    ],
    benefits: [
      "provides repeatable problem-solving methods",
      "can be analysed and compared before implementation",
      "allows solutions to be automated",
    ],
    limitations: [
      "an inefficient algorithm may scale poorly",
      "some algorithms require sorted data or extra memory",
      "a correct algorithm can still be implemented incorrectly",
    ],
    misconceptions: [
      "using binary search on unsorted data",
      "assuming every sorting algorithm has the same efficiency",
      "describing output without specifying the steps",
    ],
    keywords: [
      "sequence",
      "selection",
      "iteration",
      "search",
      "sort",
      "efficiency",
    ],
  },
  {
    id: "programming",
    patterns: [
      /\bprogramming\b/i,
      /\bpython\b/i,
      /\bvariable\b/i,
      /\bdata type\b/i,
      /\bselection\b/i,
      /\biteration\b/i,
      /\bfunction\b/i,
      /\bprocedure\b/i,
      /\barray\b/i,
      /\blist\b/i,
      /\boop\b/i,
      /\bclass\b/i,
      /\bobject\b/i,
    ],
    displayName: "programming concepts",
    definition:
      "Programming is the process of designing and writing instructions that a computer can execute to solve a problem.",
    explanation:
      "Programs use variables and data types to store values, sequence to order instructions, selection to make decisions and iteration to repeat actions. Functions and procedures decompose a program into reusable parts. Testing helps identify syntax, logic and runtime errors.",
    examples: [
      "An if statement performs selection",
      "A for or while loop performs iteration",
      "A function can receive parameters and return a result",
    ],
    benefits: [
      "automates repeatable tasks",
      "supports decomposition and reuse",
      "allows solutions to be tested and improved",
    ],
    limitations: [
      "programs can contain syntax, logic or runtime errors",
      "poorly structured code is difficult to maintain",
      "incorrect assumptions can produce incorrect outputs",
    ],
    misconceptions: [
      "using assignment when comparison is required",
      "assuming a loop updates variables automatically",
      "confusing a parameter with an argument",
    ],
    keywords: [
      "variable",
      "data type",
      "selection",
      "iteration",
      "function",
      "testing",
    ],
  },
  {
    id: "databases",
    patterns: [
      /\bdatabases?\b/i,
      /\bsql\b/i,
      /\btable\b/i,
      /\bprimary key\b/i,
      /\bforeign key\b/i,
      /\bnormalisation\b/i,
      /\bquery\b/i,
    ],
    displayName: "databases and SQL",
    definition:
      "A database is an organised collection of related data that can be stored, searched, updated and managed efficiently.",
    explanation:
      "Relational databases organise data into tables made from records and fields. A primary key uniquely identifies each record, while a foreign key links related tables. SQL commands such as SELECT, INSERT, UPDATE and DELETE are used to work with the data.",
    examples: [
      "SELECT name FROM Student WHERE yearGroup = 10;",
      "A studentId field can be used as a primary key",
      "A classId foreign key can link a student to a class table",
    ],
    benefits: [
      "supports efficient searching and updating",
      "reduces unnecessary duplication through good design",
      "can enforce integrity and access controls",
    ],
    limitations: [
      "poor design can cause redundancy and anomalies",
      "incorrect queries can expose or alter data",
      "database systems require security, backups and maintenance",
    ],
    misconceptions: [
      "assuming a primary key can contain duplicate values",
      "confusing a record with a field",
      "omitting a WHERE clause from an update or delete query",
    ],
    keywords: ["table", "record", "field", "primary key", "foreign key", "SQL"],
  },
  {
    id: "image-representation",
    patterns: [
      /\bimage representation\b/i,
      /\bbitmap\b/i,
      /\bimage\b/i,
      /\bpixel\b/i,
      /\bresolution\b/i,
      /\bcolour depth\b/i,
      /\bcolor depth\b/i,
    ],
    displayName: "bitmap image representation",
    definition:
      "A bitmap image is represented as a grid of pixels. Its resolution is the number of pixels in the image and its colour depth is the number of bits used to represent the colour of each pixel.",
    explanation:
      "Increasing image resolution increases the number of pixels and can improve detail, while increasing colour depth increases the number of colours that can be represented. Both normally increase the uncompressed file size. An uncompressed bitmap file size can be estimated as width × height × colour depth, with the result first calculated in bits.",
    examples: [
      "An 800 × 600 image contains 480,000 pixels",
      "8-bit colour depth can represent up to 256 different colour values",
      "Uncompressed bitmap size in bits = width × height × colour depth",
    ],
    benefits: [
      "higher resolution can preserve more spatial detail",
      "higher colour depth can represent a wider range of colours",
      "bitmap images allow direct control of individual pixels",
    ],
    limitations: [
      "higher resolution normally increases file size",
      "higher colour depth normally increases file size",
      "large uncompressed images require more storage and bandwidth",
    ],
    misconceptions: [
      "confusing resolution with colour depth",
      "forgetting to convert bits to bytes when calculating file size",
      "assuming increasing resolution always improves a poor-quality source image",
    ],
    keywords: [
      "pixel",
      "resolution",
      "colour depth",
      "bitmap",
      "file size",
      "bits",
    ],
  },
  {
    id: "sound-representation",
    patterns: [
      /\bsound representation\b/i,
      /\baudio\b/i,
      /\bsound\b/i,
      /\bsampling\b/i,
      /\bsample rate\b/i,
      /\bsampling rate\b/i,
      /\bbit depth\b/i,
      /\bsample resolution\b/i,
    ],
    displayName: "digital sound representation",
    definition:
      "Digital sound is created by sampling an analogue sound wave at regular intervals and storing each sample as a binary value.",
    explanation:
      "Sample rate is the number of samples recorded each second. Bit depth is the number of bits used to store each sample. Increasing either value can improve the accuracy of the digital representation, but also increases file size. For uncompressed mono audio, file size in bits can be estimated as sample rate × bit depth × duration in seconds.",
    examples: [
      "A sample rate of 44,100 Hz records 44,100 samples each second",
      "A larger bit depth allows more possible amplitude values",
      "Uncompressed mono audio size in bits = sample rate × bit depth × duration",
    ],
    benefits: [
      "a higher sample rate can represent changes in the waveform more frequently",
      "a higher bit depth can represent amplitude more precisely",
      "digital audio can be stored, copied and processed by computer systems",
    ],
    limitations: [
      "higher sample rates increase file size",
      "higher bit depths increase file size",
      "low sampling settings can reduce the accuracy of the representation",
    ],
    misconceptions: [
      "confusing sample rate with bit depth",
      "assuming a higher sample rate changes the number of amplitude levels",
      "forgetting duration when calculating uncompressed audio file size",
    ],
    keywords: [
      "sample",
      "sample rate",
      "bit depth",
      "amplitude",
      "analogue",
      "file size",
    ],
  },
  {
    id: "character-representation",
    patterns: [
      /\bcharacter representation\b/i,
      /\bcharacter set\b/i,
      /\bascii\b/i,
      /\bunicode\b/i,
      /\btext representation\b/i,
    ],
    displayName: "character representation and character sets",
    definition:
      "A character set assigns a numeric code to each character so that text can be represented and stored in binary.",
    explanation:
      "ASCII provides codes for a limited set of characters, while Unicode supports a much larger range of characters and writing systems. The numeric code assigned to a character is ultimately stored as binary.",
    examples: [
      "The letter A has a numeric character code that can be stored in binary",
      "Unicode can represent characters from many languages",
      "ASCII contains a much smaller character repertoire than Unicode",
    ],
    benefits: [
      "standard character codes allow text to be exchanged consistently",
      "Unicode supports a very large range of languages and symbols",
      "numeric codes allow characters to be stored and processed in binary",
    ],
    limitations: [
      "different encodings can use different numbers of bytes",
      "ASCII cannot represent the full range of world writing systems",
      "using the wrong encoding can display incorrect characters",
    ],
    misconceptions: [
      "assuming ASCII and Unicode contain exactly the same character range",
      "confusing the displayed character with the numeric code used to represent it",
      "assuming all Unicode characters always require the same number of bytes",
    ],
    keywords: [
      "character set",
      "code point",
      "ASCII",
      "Unicode",
      "encoding",
      "binary",
    ],
  },
  {
    id: "compression",
    patterns: [
      /\bcompression\b/i,
      /\blossy\b/i,
      /\blossless\b/i,
      /\bcompressed\b/i,
    ],
    displayName: "data compression",
    definition:
      "Compression reduces the number of bits required to store or transmit data. Lossless compression preserves all original data, while lossy compression permanently removes some data.",
    explanation:
      "Lossless compression is suitable when the original data must be reconstructed exactly. Lossy compression can achieve greater reductions for media such as images, audio or video by discarding detail judged less important, but the discarded data cannot be restored.",
    examples: [
      "Lossless compression can reduce a text file while preserving every character",
      "Lossy image compression may remove visual detail to reduce file size",
      "Compressed files can require less storage space and transmission time",
    ],
    benefits: [
      "reduces storage requirements",
      "reduces the amount of data that must be transmitted",
      "can reduce download or upload times",
    ],
    limitations: [
      "lossy compression permanently removes some data",
      "compressed data may require processing to encode and decode",
      "excessive lossy compression can noticeably reduce quality",
    ],
    misconceptions: [
      "believing lossless compression reduces quality",
      "assuming deleted lossy data can later be restored",
      "assuming every data type should use lossy compression",
    ],
    keywords: [
      "lossy",
      "lossless",
      "file size",
      "quality",
      "storage",
      "transmission",
    ],
  },
  {
    id: "data-representation",
    patterns: [
      /\bdata representation\b/i,
      /\bdata encoding\b/i,
      /\brepresenting data\b/i,
    ],
    displayName: "data representation",
    definition:
      "Data representation is the use of binary patterns to encode information so that it can be stored and processed by computer systems.",
    explanation:
      "Different kinds of data use agreed representations and metadata. Numbers, text, images and sound are all ultimately represented using binary patterns, with choices about precision or quality often affecting storage requirements.",
    examples: [
      "binary patterns can represent numbers",
      "character sets map characters to numeric codes",
      "images and sound use metadata to describe how their binary data should be interpreted",
    ],
    benefits: [
      "provides consistent machine-readable representations",
      "allows many data types to be stored and processed digitally",
      "supports transmission between compatible systems",
    ],
    limitations: [
      "higher precision or quality often requires more storage",
      "metadata is needed to interpret some binary data correctly",
      "different formats and encodings can create compatibility issues",
    ],
    misconceptions: [
      "assuming all data uses the same representation rules",
      "ignoring metadata when interpreting a binary file",
      "treating representation and compression as the same concept",
    ],
    keywords: [
      "binary",
      "encoding",
      "metadata",
      "representation",
      "storage",
      "format",
    ],
  },
  {
    id: "software-development",
    patterns: [
      /\bsoftware development\b/i,
      /\btesting\b/i,
      /\btest data\b/i,
      /\bsyntax error\b/i,
      /\blogic error\b/i,
      /\bruntime error\b/i,
      /\bvalidation\b/i,
      /\bverification\b/i,
      /\bide\b/i,
    ],
    displayName: "software development and testing",
    definition:
      "Software development is the structured process of analysing requirements, designing, implementing, testing and maintaining a software solution.",
    explanation:
      "Testing uses normal, boundary and invalid data to check whether software behaves as expected. Syntax errors break language rules, logic errors produce an incorrect result and runtime errors occur while the program is executing. Validation checks whether input is sensible, while verification checks whether it was copied accurately.",
    examples: [
      "A range check can restrict an age to permitted values",
      "Boundary tests use values at and around a limit",
      "A debugger can pause execution and inspect variables",
    ],
    benefits: [
      "structured development reduces avoidable defects",
      "testing provides evidence that requirements are met",
      "maintenance allows software to adapt after release",
    ],
    limitations: [
      "testing cannot prove that every possible defect is absent",
      "requirements can change during development",
      "late fixes can be costly",
    ],
    misconceptions: [
      "treating validation and verification as the same process",
      "using only normal test data",
      "assuming a program is correct because it runs",
    ],
    keywords: [
      "requirements",
      "design",
      "implementation",
      "testing",
      "validation",
      "verification",
    ],
  },
  {
    id: "ethical-legal-environmental",
    patterns: [
      /\bethical\b/i,
      /\blegal\b/i,
      /\benvironmental\b/i,
      /\bprivacy\b/i,
      /\bdata protection\b/i,
      /\bcopyright\b/i,
      /\bcomputer misuse\b/i,
      /\bdigital divide\b/i,
    ],
    displayName: "ethical, legal and environmental impacts of computing",
    definition:
      "The impacts of computing are the effects that digital technologies have on individuals, organisations, society and the environment.",
    explanation:
      "Computing decisions can affect privacy, employment, accessibility, fairness, intellectual property, security and energy use. Laws set some minimum requirements, while ethical evaluation considers what ought to be done even when an action may be legal.",
    examples: [
      "Personal data should be collected and processed fairly",
      "Copyright protects original creative works",
      "Electronic waste can cause environmental harm",
    ],
    benefits: [
      "technology can improve access, communication and productivity",
      "data can support better decisions",
      "automation can remove repetitive or dangerous work",
    ],
    limitations: [
      "systems can reduce privacy or reinforce bias",
      "automation can change employment",
      "devices and data centres consume resources and energy",
    ],
    misconceptions: [
      "assuming legal automatically means ethical",
      "treating all personal data as public",
      "ignoring indirect environmental costs",
    ],
    keywords: [
      "privacy",
      "consent",
      "copyright",
      "bias",
      "accessibility",
      "sustainability",
    ],
  },
  {
    id: "ai-machine-learning",
    patterns: [
      /\bartificial intelligence\b/i,
      /\bmachine learning\b/i,
      /\bneural network\b/i,
      /\btraining data\b/i,
      /\bbias\b/i,
    ],
    displayName: "artificial intelligence and machine learning",
    definition:
      "Artificial intelligence refers to computer systems designed to perform tasks that normally require human intelligence. Machine learning is an approach in which a model learns patterns from data.",
    explanation:
      "A machine-learning model is trained using examples and then used to make predictions or classifications on new data. Its performance depends on the quality, relevance and representativeness of the training data, the selected model and how results are evaluated.",
    examples: [
      "A classifier can identify whether an email is spam",
      "A recommendation system can predict items a user may prefer",
      "Biased training data can produce unfair predictions",
    ],
    benefits: [
      "can process large amounts of data",
      "can identify patterns that are difficult to specify manually",
      "can support automation and decision-making",
    ],
    limitations: [
      "outputs can be biased or incorrect",
      "complex models may be difficult to explain",
      "training can require substantial data and computing resources",
    ],
    misconceptions: [
      "assuming AI understands information in the same way as a person",
      "believing a high accuracy score guarantees fairness",
      "treating predictions as certain facts",
    ],
    keywords: [
      "model",
      "training data",
      "prediction",
      "classification",
      "bias",
      "evaluation",
    ],
  },
];

const TOPIC_PROFILE_ALIASES: Record<string, string> = {
  "cpu architecture": "cpu-architecture",
  "computer systems": "cpu-architecture",
  "memory storage": "memory-storage",
  "memory and storage": "memory-storage",
  "networks": "networks",
  "computer networks": "networks",
  "computer networks and protocols": "networks",
  "cybersecurity": "cybersecurity",
  "cyber security": "cybersecurity",
  "algorithms": "algorithms",
  "algorithms searching and sorting": "algorithms",
  "programming": "programming",
  "programming concepts": "programming",
  "databases": "databases",
  "databases and sql": "databases",
  "software development testing": "software-development",
  "software development and testing": "software-development",
  "ethical legal environmental": "ethical-legal-environmental",
  "ethical legal and environmental": "ethical-legal-environmental",
  "ethical legal and environmental impacts": "ethical-legal-environmental",
  "ai machine learning": "ai-machine-learning",
  "ai and machine learning": "ai-machine-learning",
  "artificial intelligence and machine learning": "ai-machine-learning",
  "data representation": "data-representation",
};

function normaliseTopicProfileLabel(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveTopicProfile(topic: string): TopicProfile {
  const normalisedTopic = normaliseTopicProfileLabel(topic);
  const aliasId = TOPIC_PROFILE_ALIASES[normalisedTopic];

  if (aliasId) {
    const aliasedProfile = TOPIC_PROFILES.find((profile) => profile.id === aliasId);

    if (aliasedProfile) {
      return aliasedProfile;
    }
  }

  const matched = TOPIC_PROFILES.find((profile) =>
    profile.patterns.some((pattern) => pattern.test(topic)),
  );

  if (matched) {
    return matched;
  }

  return {
    id: "generic-computing",
    patterns: [],
    displayName: topic,
    definition: `${topic} is a Computer Science concept that should be defined using its purpose, main characteristics and relationship to a computing system or problem.`,
    explanation: `${topic} should be explained by identifying what it does, how it works, where it is used and the effect it has on data, software, hardware, users or a wider computing system.`,
    examples: [
      `a practical computing use of ${topic}`,
      `a scenario in which ${topic} solves or influences a problem`,
      `a comparison between ${topic} and an alternative approach`,
    ],
    benefits: [
      `a relevant advantage of ${topic} in the stated context`,
      "improved efficiency, accuracy, reliability, security or usability where technically appropriate",
      "support for solving the identified computing problem",
    ],
    limitations: [
      `a relevant technical or practical limitation of ${topic}`,
      "cost, complexity, security, reliability or usability constraints where appropriate",
      "dependence on correct design, implementation and testing",
    ],
    misconceptions: [
      `using the name ${topic} without explaining its technical meaning`,
      "giving a generic benefit without applying it to the question",
      "describing an example that does not demonstrate the concept",
    ],
    keywords: [
      "purpose",
      "process",
      "input",
      "output",
      "benefit",
      "limitation",
    ],
  };
}

function specificDefinition(topic: string): string {
  return resolveTopicProfile(topic).definition;
}

function specificExtendedAnswer(topic: string, contextLabel: string): string {
  const profile = resolveTopicProfile(topic);

  const benefitOne = profile.benefits[0];

  const benefitTwo = profile.benefits[1];

  const limitationOne = profile.limitations[0];

  const limitationTwo = profile.limitations[1];

  return `${topic} could be useful in ${contextLabel} because it can provide ${benefitOne}. It may also support ${benefitTwo}. For example, ${profile.examples[0]}.

However, ${limitationOne}. In addition, ${limitationTwo}. These limitations mean that the organisation should not adopt the approach without controls, testing and review.

A suitable alternative or safeguard is to introduce the system gradually, restrict access where appropriate, test it using representative data and maintain a fallback process. Staff or users should also receive guidance so that the technology is used correctly.

Overall, ${topic} should be used when its benefits clearly match the needs of ${contextLabel} and when the organisation can manage the identified risks. A controlled implementation with monitoring and regular review is more appropriate than unrestricted adoption.`;
}

function definitionForTopic(topic: string): string {
  return specificDefinition(topic);
}


type DemoQuestionContent = {
  question: string;
  context: string;
  markPoints: string[];
  modelAnswer: string;
  examinerGuidance: string[];
  misconceptions: string[];
};

function createDataRepresentationDemoContent(
  item: AssessmentBlueprintItem,
  index: number,
): DemoQuestionContent | null {
  const profile = resolveTopicProfile(item.topicFocus);
  const variant = index + 1;

  // The parent Data Representation topic must never fall through to the
  // generic computing fallback. Instead, map each blueprint question type
  // to a concrete GCSE Data Representation task.
  if (profile.id === "data-representation") {
    if (item.questionType === "multiple-choice") {
      return {
        question:
          "Which statement about data representation is correct?\n\nA. Every type of data is interpreted using the same binary encoding.\nB. Binary patterns can encode different types of information using agreed representation rules.\nC. Data representation always reduces the amount of storage required.\nD. Metadata replaces the binary data stored in a file.",
        context:
          "Computer systems store numbers, text, images and sound as binary patterns. Select one answer.",
        markPoints: [
          "Award 1 mark for option B: binary patterns can encode different types of information using agreed representation rules.",
        ],
        modelAnswer: "B",
        examinerGuidance: [
          "Award the mark only for option B.",
          "Do not award a mark for selecting more than one option unless B is clearly identified as the final answer.",
        ],
        misconceptions: [
          "Assuming every data type uses the same encoding rules.",
          "Confusing data representation with compression.",
        ],
      };
    }

    // Command-word enforcement: a blueprint row labelled COMPLETE must
    // present an actual completion task, even if its underlying question
    // type was automatically classified as a calculation-style item.
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the missing entries in the table.\n\nDenary | 8-bit binary | Hexadecimal\n10     | 00001010     | ____\n____   | 00101101     | 2D\n64     | ____         | 40\n255    | 11111111     | ____",
        context:
          "Each hexadecimal digit represents four binary bits. Complete all four missing cells.",
        markPoints: [
          "Completes the first hexadecimal value as 0A (or A where leading zero is not required).",
          "Completes the second denary value as 45.",
          "Completes the third binary value as 01000000.",
          "Completes the fourth hexadecimal value as FF.",
        ],
        modelAnswer:
          "Denary | 8-bit binary | Hexadecimal\n10     | 00001010     | 0A\n45     | 00101101     | 2D\n64     | 01000000     | 40\n255    | 11111111     | FF",
        examinerGuidance: [
          "Award each missing cell independently.",
          "Accept A for 0A if the interface does not require two hexadecimal digits.",
        ],
        misconceptions: [
          "Grouping binary digits from the wrong end when converting to hexadecimal.",
          "Treating hexadecimal digits as denary place values.",
        ],
      };
    }

    if (item.questionType === "conversion") {
      const denaryValue = 45 + variant * 3;
      const binaryValue = denaryValue.toString(2).padStart(8, "0");
      return {
        question: `Convert the denary value ${denaryValue} into 8-bit binary. Show your working.`,
        context:
          "Use the place values 128, 64, 32, 16, 8, 4, 2 and 1.",
        markPoints: [
          "Uses the correct 8-bit binary place values.",
          `Selects place values that total ${denaryValue}.`,
          `Gives the correct binary value ${binaryValue}.`,
          "Shows clear working and uses unambiguous notation.",
        ],
        modelAnswer: `${denaryValue}₁₀ = ${binaryValue}₂.`,
        examinerGuidance: [
          "Award method credit where the correct place-value method is shown even if one later digit is incorrect.",
          "Require an 8-bit answer, including leading zeroes where needed.",
        ],
        misconceptions: [
          "Reading the binary digits as a denary number.",
          "Writing too few bits when an 8-bit result is required.",
        ],
      };
    }

    if (
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const width = 320 + variant * 80;
      const height = 240;
      const colourDepth = 4;
      const pixels = width * height;
      const bits = pixels * colourDepth;
      const bytes = bits / 8;
      const kib = bytes / 1024;
      return {
        question: `Calculate the uncompressed storage required for a bitmap image that is ${width} × ${height} pixels with a colour depth of ${colourDepth} bits. Give your final answer in KiB and show your working.`,
        context:
          "Ignore metadata and compression. Use 8 bits = 1 byte and 1024 bytes = 1 KiB.",
        markPoints: [
          `Calculates the number of pixels: ${width} × ${height} = ${pixels}.`,
          `Calculates the file size in bits: ${pixels} × ${colourDepth} = ${bits} bits.`,
          `Converts to bytes: ${bits} ÷ 8 = ${bytes} bytes.`,
          `Converts to KiB: ${bytes} ÷ 1024 = ${kib} KiB.`,
          "Uses the correct file-size method.",
          "Uses the correct final unit.",
        ],
        modelAnswer: `Number of pixels = ${width} × ${height} = ${pixels}.\nFile size in bits = ${pixels} × ${colourDepth} = ${bits} bits.\nFile size in bytes = ${bits} ÷ 8 = ${bytes} bytes.\nFile size in KiB = ${bytes} ÷ 1024 = ${kib} KiB.`,
        examinerGuidance: [
          "Award each correct stage independently where the candidate's method is clear.",
          "Apply error carried forward when a previous numerical error is used correctly in a later conversion.",
        ],
        misconceptions: [
          "Adding image dimensions instead of multiplying them.",
          "Forgetting to convert bits to bytes and then bytes to KiB.",
        ],
      };
    }

    if (item.questionType === "compare") {
      return {
        question:
          "Compare ASCII and Unicode as character sets used to represent text.",
        context:
          "Your answer should refer to the range of characters that can be represented and compatibility with different languages.",
        markPoints: [
          "States that both assign numeric codes to characters.",
          "States that ASCII represents a much smaller character repertoire than Unicode.",
          "Explains that Unicode supports characters from many more languages and writing systems.",
          "Explains that character codes are ultimately stored in binary.",
          "Links Unicode to multilingual text compatibility.",
          "Makes a direct comparison rather than two isolated descriptions.",
        ],
        modelAnswer:
          "ASCII and Unicode both assign numeric codes to characters so that text can be stored in binary. ASCII supports a relatively small character set, whereas Unicode provides codes for a far larger range of languages and symbols. Unicode is therefore more suitable for multilingual systems, although the exact storage used depends on the encoding chosen.",
        examinerGuidance: [
          "Credit direct comparative statements about character range and use.",
          "Do not credit the claim that ASCII and Unicode always use exactly the same number of bits per character.",
        ],
        misconceptions: [
          "Assuming ASCII and Unicode contain the same range of characters.",
          "Assuming every Unicode character always uses the same number of bytes.",
        ],
      };
    }

    if (
      item.questionType === "extended-response" ||
      item.questionType === "discuss" ||
      item.questionType === "evaluate" ||
      item.questionType === "scenario-application"
    ) {
      return {
        question:
          "Evaluate the suitability of the proposed data representations for the digital exhibition guide. You should consider quality, storage, interpretation and compatibility. Give a justified conclusion.",
        context:
          "A museum is developing a digital exhibition guide. Labels must include English, Welsh, Arabic and Japanese characters. The guide contains simple black-and-white access symbols, detailed colour photographs and spoken interviews. A developer proposes using 8-bit ASCII for every label, representing every image at 800 × 600 pixels with a colour depth of 1 bit, and sampling every interview at 8,000 samples per second with a bit depth of 8 bits.",
        markPoints: [
          "Explains that ASCII is unsuitable for the full range of Arabic and Japanese characters and identifies Unicode as a suitable alternative.",
          "Judges that 1-bit colour depth is suitable for genuinely black-and-white symbols because each pixel needs only two possible values.",
          "Explains that 1-bit colour depth is unsuitable for detailed colour photographs because it cannot represent the required range of colours.",
          "Explains that an 8,000 Hz sample rate and 8-bit depth may reduce speech quality and that increasing either setting increases file size.",
          "Explains that metadata or an agreed file format is required to interpret stored binary correctly.",
          "Explains that different data types require different representation choices.",
          "Considers the trade-off between quality and storage requirements.",
          "Considers compatibility between devices or software.",
          "Uses accurate terminology such as Unicode, colour depth, sample rate and bit depth.",
          "Applies technical points directly to the museum scenario.",
          "Makes a balanced judgement.",
          "Reaches a justified conclusion.",
        ],
        modelAnswer:
          "The proposal is not suitable overall because different types of data require different representation rules. ASCII cannot represent the full range of Arabic and Japanese characters, so a Unicode-based encoding is more appropriate for the labels. A 1-bit colour depth is suitable for truly black-and-white access symbols because only two colour values are required, but it is unsuitable for detailed colour photographs, which require a greater colour depth. For the interviews, an 8,000 Hz sample rate and 8-bit depth may be adequate for basic speech but will represent the original waveform less accurately than higher settings; increasing either value improves representation accuracy but increases file size. The guide must also store enough metadata or use agreed file formats so devices know how to interpret the binary. The museum should therefore choose representation settings separately for text, symbols, photographs and audio, balancing quality, storage and compatibility.",
        examinerGuidance: [
          "Highest-level responses must evaluate more than one data type and connect technical choices to the museum requirements.",
          "A response that simply states that higher settings are better without considering storage cannot access the highest level.",
        ],
        misconceptions: [
          "Assuming one representation setting is suitable for every data type.",
          "Assuming metadata is the same thing as the binary content itself.",
        ],
      };
    }

    if (item.questionType === "definition") {
      return {
        question: "Define the term data representation.",
        context: "Use precise Computer Science terminology.",
        markPoints: [
          "States that data representation uses binary patterns to encode information.",
          "Explains that agreed rules allow the binary to be interpreted as a particular data type.",
        ],
        modelAnswer:
          "Data representation is the use of binary patterns to encode information so that it can be stored, processed and interpreted by computer systems according to agreed rules.",
        examinerGuidance: [
          "Accept equivalent wording that clearly links binary encoding to the representation of information.",
          "An example alone is not sufficient for a definition mark unless the meaning is also stated.",
        ],
        misconceptions: [
          "Confusing representation with compression.",
          "Assuming all binary patterns are interpreted in the same way.",
        ],
      };
    }

    return {
      question:
        item.marks === 1
          ? "Identify one reason why computer systems use agreed data representation rules."
          : "Explain how binary patterns can be used to represent different types of data in a computer system.",
      context:
        "Refer to at least two of numbers, text, images or sound where appropriate.",
      markPoints: [
        "States that computers store and process data using binary patterns.",
        "Explains that agreed representation rules determine how a bit pattern is interpreted.",
        "Gives an accurate number-representation example.",
        "Gives an accurate text, image or sound representation example.",
        "Explains the role of relevant metadata where appropriate.",
        "Uses precise Computer Science terminology.",
      ],
      modelAnswer:
        item.marks === 1
          ? "Agreed representation rules allow a computer to interpret a binary pattern as the intended type of information."
          : "Computer systems store and process information as binary patterns. The same underlying bits only have meaning when agreed representation rules describe how they should be interpreted. For example, place values can represent a binary number, character sets map characters to numeric codes, bitmap images use pixel values together with information such as dimensions and colour depth, and digital sound stores sampled amplitude values together with sampling settings.",
      examinerGuidance: [
        "Award marks for distinct, technically accurate representation points.",
        "Do not award repeated statements that merely say that computers use binary without explaining how meaning is assigned.",
      ],
      misconceptions: [
        "Assuming all data types use identical representation rules.",
        "Treating compression as the definition of data representation.",
      ],
    };
  }

  if (profile.id === "image-representation") {
    const width = 480 + variant * 160;
    const height = 320 + variant * 80;
    const colourDepth = variant % 2 === 0 ? 24 : 8;
    const pixels = width * height;
    const bits = pixels * colourDepth;
    const bytes = bits / 8;

    if (
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation" ||
      item.questionType === "conversion"
    ) {
      return {
        question: `A bitmap image is ${width} pixels wide and ${height} pixels high. It uses a colour depth of ${colourDepth} bits. Calculate the uncompressed file size in bytes. Show your working.`,
        context:
          "Ignore file headers, metadata and compression. Use 8 bits = 1 byte.",
        markPoints: [
          `Calculates the number of pixels as ${width} × ${height} = ${pixels}.`,
          `Multiplies by the colour depth: ${pixels} × ${colourDepth} = ${bits} bits.`,
          `Divides by 8 to convert bits to bytes.`,
          `Gives the final answer as ${bytes} bytes.`,
          "Shows a correct file-size method.",
          "Uses the correct unit.",
        ],
        modelAnswer: `${width} × ${height} = ${pixels} pixels.\n${pixels} × ${colourDepth} = ${bits} bits.\n${bits} ÷ 8 = ${bytes} bytes.\n\nThe uncompressed file size is ${bytes} bytes.`,
        examinerGuidance: [
          "Award method marks when the candidate uses width × height × colour depth even if a later arithmetic error occurs.",
          "Do not award the final conversion mark if a value in bits is labelled as bytes.",
        ],
        misconceptions: [
          "Adding width and height instead of multiplying them to find the number of pixels.",
          "Forgetting to divide by 8 when converting the file size from bits to bytes.",
        ],
      };
    }

    if (item.questionType === "multiple-choice") {
      return {
        question:
          "Which statement about bitmap image representation is correct?\n\nA. Resolution is the number of bits used for each pixel.\nB. Colour depth is the total number of pixels in the image.\nC. Increasing resolution usually increases the number of pixels stored.\nD. Increasing colour depth always reduces the file size.",
        context: "Select one answer.",
        markPoints: [
          "Award 1 mark for option C: increasing resolution usually increases the number of pixels stored.",
        ],
        modelAnswer: "C",
        examinerGuidance: [
          "Award the mark only for option C.",
          "Do not award a mark for multiple selected options unless C is clearly identified as the final answer.",
        ],
        misconceptions: [
          "Confusing resolution with colour depth.",
          "Assuming that increasing image quality settings reduces storage requirements.",
        ],
      };
    }

    if (
      item.questionType === "extended-response" ||
      item.questionType === "discuss" ||
      item.questionType === "evaluate" ||
      item.questionType === "scenario-application"
    ) {
      return {
        question:
          "A school is preparing photographs for its website. Evaluate how resolution, colour depth and compression should be chosen to balance image quality, file size and download speed. Reach a justified recommendation.",
        context:
          "The website will be viewed on phones and laptops, and some users have slow internet connections.",
        markPoints: [
          "Explains that increasing resolution can increase detail but normally increases file size.",
          "Explains that increasing colour depth can represent more colours but normally increases file size.",
          "Explains that compression reduces storage and transmission requirements.",
          "Distinguishes an appropriate use of lossy or lossless compression.",
          "Applies the discussion to website download speed or bandwidth.",
          "Recognises that unnecessarily high settings provide limited benefit for the intended display size.",
          "Uses accurate terminology including pixels, resolution and colour depth.",
          "Develops a balanced recommendation.",
          "Links the recommendation to the needs of phone and laptop users.",
          "Reaches a justified conclusion.",
          "Considers image quality as well as storage/transmission.",
          "Maintains a clear line of reasoning.",
        ],
        modelAnswer:
          "The school should use a resolution high enough for the largest display size required, but it should avoid storing far more pixels than the website can use because this increases file size without a visible benefit for most users. A suitable colour depth should preserve realistic colours, but increasing colour depth also increases the number of bits needed for every pixel. For photographic website images, moderate lossy compression is usually appropriate because it can substantially reduce file size and download time while keeping visible quality acceptable. This is particularly important for users on slower connections. The school should therefore resize photographs to their intended display dimensions, use sufficient colour depth for the content and apply controlled compression after checking the visual result.",
        examinerGuidance: [
          "Highest-level responses must connect technical choices directly to both image quality and transmission/storage constraints.",
          "A response that simply states that higher resolution and colour depth are 'better' without considering file size cannot access the highest level.",
        ],
        misconceptions: [
          "Treating resolution and colour depth as the same property.",
          "Assuming that lossy compression can always reconstruct every discarded detail.",
        ],
      };
    }

    if (item.questionType === "compare") {
      return {
        question:
          "Compare resolution and colour depth as properties of a bitmap image.",
        context:
          "Your answer should explain what each property controls and how changing it can affect file size.",
        markPoints: [
          "States that resolution relates to the number of pixels in the image.",
          "States that colour depth is the number of bits used to represent each pixel's colour.",
          "Explains that increasing resolution normally increases file size.",
          "Explains that increasing colour depth normally increases file size.",
          "Explains that resolution mainly affects spatial detail.",
          "Explains that colour depth affects the range of colours that can be represented.",
        ],
        modelAnswer:
          "Resolution describes the number of pixels used to represent the image, so a higher resolution can preserve more spatial detail. Colour depth describes the number of bits used for each pixel, so a greater colour depth allows more possible colours. Increasing either property normally increases the uncompressed file size, but they affect different aspects of image quality.",
        examinerGuidance: [
          "Award comparison credit only when the response distinguishes what resolution and colour depth represent.",
          "Do not credit a statement that treats colour depth as the number of pixels.",
        ],
        misconceptions: [
          "Saying that colour depth controls the width and height of an image.",
          "Saying that resolution is the number of colours available.",
        ],
      };
    }

    return {
      question:
        item.marks === 1
          ? "State what is meant by the resolution of a bitmap image."
          : "Explain how resolution and colour depth affect a bitmap image and its uncompressed file size.",
      context:
        item.marks === 1
          ? "Use precise Computer Science terminology."
          : "Refer to pixels and bits in your answer.",
      markPoints: [
        "States that image resolution is the number of pixels used to represent the image.",
        "States that colour depth is the number of bits used to represent each pixel's colour.",
        "Explains that increasing resolution normally increases the number of stored pixels.",
        "Explains that increasing colour depth increases the bits stored for each pixel.",
        "Links either change to an increase in uncompressed file size.",
        "Uses accurate terminology.",
      ],
      modelAnswer:
        item.marks === 1
          ? "Resolution is the number of pixels used to represent an image, commonly described by its width and height in pixels."
          : "Resolution determines how many pixels are used to represent the image, while colour depth determines how many bits are used for each pixel's colour. Increasing the resolution normally stores more pixels, and increasing the colour depth stores more bits per pixel. Therefore, either change normally increases the uncompressed file size.",
      examinerGuidance: [
        "Credit width × height as a valid way to describe image resolution.",
        "Do not treat resolution and colour depth as interchangeable terms.",
      ],
      misconceptions: [
        "Confusing the number of pixels with the number of bits per pixel.",
        "Claiming that higher image settings always reduce file size.",
      ],
    };
  }

  if (profile.id === "sound-representation") {
    const sampleRate = variant % 2 === 0 ? 22050 : 44100;
    const bitDepth = variant % 2 === 0 ? 16 : 8;
    const duration = 5 + variant;
    const bits = sampleRate * bitDepth * duration;
    const bytes = bits / 8;

    if (
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      return {
        question: `An uncompressed mono sound recording uses a sample rate of ${sampleRate} Hz and a bit depth of ${bitDepth} bits. The recording lasts ${duration} seconds. Calculate the file size in bytes. Show your working.`,
        context: "Use 8 bits = 1 byte. Ignore file headers and compression.",
        markPoints: [
          `Uses ${sampleRate} samples per second.`,
          `Multiplies sample rate × bit depth × duration to obtain ${bits} bits.`,
          "Divides by 8 to convert bits to bytes.",
          `Gives the final answer as ${bytes} bytes.`,
          "Shows a correct file-size method.",
          "Uses the correct unit.",
        ],
        modelAnswer: `${sampleRate} × ${bitDepth} × ${duration} = ${bits} bits.\n${bits} ÷ 8 = ${bytes} bytes.\n\nThe file size is ${bytes} bytes.`,
        examinerGuidance: [
          "Award method credit for sample rate × bit depth × duration even if a later arithmetic error occurs.",
          "Do not award the byte-conversion mark if the candidate leaves the answer in bits.",
        ],
        misconceptions: [
          "Adding sample rate and bit depth instead of multiplying them.",
          "Forgetting to include the duration of the recording.",
        ],
      };
    }

    if (item.questionType === "multiple-choice") {
      return {
        question:
          "Which statement about digital sound is correct?\n\nA. Sample rate is the number of bits used for each sample.\nB. Bit depth controls how many samples are taken each second.\nC. A higher sample rate records the waveform more frequently.\nD. Increasing bit depth always decreases file size.",
        context: "Select one answer.",
        markPoints: [
          "Award 1 mark for option C: a higher sample rate records the waveform more frequently.",
        ],
        modelAnswer: "C",
        examinerGuidance: [
          "Award the mark only for option C.",
          "Do not award multiple selections unless C is clearly indicated as the final answer.",
        ],
        misconceptions: [
          "Confusing sample rate with bit depth.",
          "Assuming higher-quality sampling settings reduce file size.",
        ],
      };
    }

    if (
      item.questionType === "extended-response" ||
      item.questionType === "discuss" ||
      item.questionType === "evaluate" ||
      item.questionType === "scenario-application"
    ) {
      return {
        question:
          "A school is recording speech for an online learning platform. Evaluate how sample rate, bit depth and compression should be chosen to balance sound quality, file size and streaming performance. Reach a justified recommendation.",
        context:
          "The recordings contain spoken explanations rather than music, and some students have limited bandwidth.",
        markPoints: [
          "Explains the effect of sample rate on how frequently the waveform is measured.",
          "Explains the effect of bit depth on the precision of stored sample values.",
          "Links higher sample rate to larger file size.",
          "Links higher bit depth to larger file size.",
          "Explains how compression can reduce storage or transmission requirements.",
          "Applies the discussion to spoken audio rather than music.",
          "Applies the discussion to students with limited bandwidth.",
          "Uses accurate terminology.",
          "Balances quality against file size.",
          "Reaches a justified recommendation.",
          "Considers an appropriate compression approach.",
          "Maintains a clear line of reasoning.",
        ],
        modelAnswer:
          "Because the recordings contain speech, the school does not need unnecessarily high sampling settings intended for high-fidelity music. The sample rate should be high enough to represent speech clearly, and the bit depth should provide sufficient amplitude precision without creating excessive file sizes. Increasing either value increases the amount of data stored. Compression should therefore be used to reduce storage and streaming bandwidth, with settings tested to ensure speech remains clear. A moderate sample rate and bit depth with controlled audio compression would provide a sensible balance for students with slower connections.",
        examinerGuidance: [
          "Highest-level responses must connect sampling choices to both sound quality and bandwidth/file-size constraints.",
          "Do not reward claims that sample rate and bit depth are the same property.",
        ],
        misconceptions: [
          "Saying that bit depth controls the number of samples per second.",
          "Assuming maximum sampling settings are always the most suitable choice.",
        ],
      };
    }

    return {
      question:
        item.marks === 1
          ? "State what is meant by the sample rate of a digital sound recording."
          : "Explain how sample rate and bit depth affect the representation and file size of digital sound.",
      context: "Use accurate Computer Science terminology.",
      markPoints: [
        "States that sample rate is the number of samples taken each second.",
        "States that bit depth is the number of bits used to store each sample.",
        "Explains that increasing sample rate records the waveform more frequently.",
        "Explains that increasing bit depth allows more possible sample values.",
        "Links higher sampling settings to increased file size.",
        "Uses accurate terminology.",
      ],
      modelAnswer:
        item.marks === 1
          ? "Sample rate is the number of samples taken from the analogue sound wave each second."
          : "Sample rate is the number of samples taken each second, while bit depth is the number of bits used to store each sample. A higher sample rate measures the waveform more frequently and a higher bit depth allows more precise amplitude values. Increasing either setting normally increases the uncompressed file size.",
      examinerGuidance: [
        "Accept sampling frequency as an alternative term for sample rate.",
        "Do not credit an answer that reverses sample rate and bit depth.",
      ],
      misconceptions: [
        "Confusing samples per second with bits per sample.",
        "Claiming that increasing sample rate decreases file size.",
      ],
    };
  }

  if (profile.id === "character-representation") {
    if (item.questionType === "compare" || item.marks >= 4) {
      return {
        question:
          "Compare ASCII and Unicode as character sets. Explain why Unicode is needed even though ASCII is still widely recognised.",
        context:
          "Your answer should refer to the range of characters that can be represented.",
        markPoints: [
          "States that both character sets map characters to numeric codes.",
          "Explains that ASCII represents a relatively limited character set.",
          "Explains that Unicode represents a much larger range of characters.",
          "Links Unicode to multiple languages or writing systems.",
          "Recognises that character codes are stored in binary.",
          "Makes a clear comparison.",
        ],
        modelAnswer:
          "ASCII and Unicode both assign numeric codes to characters so that text can be stored and processed by computers. ASCII supports a relatively limited range of characters, which is sufficient for basic English letters, digits and symbols. Unicode provides codes for a far larger range of characters and writing systems, allowing software to represent text from many languages consistently. The numeric codes are ultimately stored using binary.",
        examinerGuidance: [
          "Credit answers that accurately distinguish the character ranges even if they do not quote specific code-space sizes.",
          "Do not award comparison marks for saying only that Unicode is 'newer' or 'better'.",
        ],
        misconceptions: [
          "Assuming ASCII and Unicode can represent exactly the same character range.",
          "Treating a character's visible symbol as the same thing as its stored numeric code.",
        ],
      };
    }

    return {
      question: "Explain how a character set allows text to be represented by a computer.",
      context: "You may refer to ASCII or Unicode.",
      markPoints: [
        "States that each character is assigned a numeric code.",
        "Explains that the numeric code can be represented in binary.",
        "Gives ASCII or Unicode as an example of a character set.",
        "Explains that systems must use an agreed encoding to interpret the stored value.",
      ],
      modelAnswer:
        "A character set assigns a numeric code to each character. That numeric value is stored as binary, allowing the computer to store and process text. ASCII and Unicode are examples of character sets, with Unicode supporting a much larger range of characters.",
      examinerGuidance: [
        "Accept code point as an appropriate term for the numeric value associated with a character.",
        "Do not award full credit for naming ASCII or Unicode without explaining the mapping to numeric codes.",
      ],
      misconceptions: [
        "Saying that characters are stored directly as shapes rather than encoded values.",
        "Assuming every character set contains the same characters.",
      ],
    };
  }

  if (profile.id === "compression") {
    if (
      item.questionType === "compare" ||
      item.questionType === "extended-response" ||
      item.questionType === "discuss" ||
      item.questionType === "evaluate" ||
      item.questionType === "scenario-application"
    ) {
      return {
        question:
          "A school needs to compress two files: a database backup and a set of photographs for its website. Compare lossy and lossless compression and recommend an appropriate method for each file.",
        context:
          "The database backup must be restored exactly. The photographs should download quickly while remaining visually acceptable.",
        markPoints: [
          "States that lossless compression preserves all original data.",
          "States that lossy compression permanently removes some data.",
          "Explains why lossless compression is appropriate for the database backup.",
          "Explains why lossy compression may be appropriate for website photographs.",
          "Links compression to reduced file size.",
          "Links smaller files to storage or transmission benefits.",
          "Recognises that excessive lossy compression can reduce quality.",
          "Applies the answer to both file types.",
          "Uses accurate terminology.",
          "Reaches a justified recommendation.",
          "Maintains a direct comparison.",
          "Explains why one method is not suitable for every file.",
        ],
        modelAnswer:
          "The database backup should use lossless compression because every original value must be reconstructed exactly when the backup is restored. Lossless compression reduces file size without permanently removing information. The website photographs can use controlled lossy compression because some visual detail can be discarded to achieve a greater reduction in file size, helping pages download more quickly. The school should test the compression level so that the photographs remain visually acceptable. Therefore, lossless compression is appropriate for the database backup, while moderate lossy compression is appropriate for the website photographs.",
        examinerGuidance: [
          "Highest-level responses must justify different compression methods for the two different requirements.",
          "Do not award full marks for saying simply that lossy is 'smaller' and lossless is 'better quality' without explaining data preservation.",
        ],
        misconceptions: [
          "Believing lossless compression permanently removes data.",
          "Assuming lossy compression is appropriate for a backup that must be restored exactly.",
        ],
      };
    }

    return {
      question:
        "Explain the difference between lossy and lossless compression.",
      context:
        "Refer to what happens to the original data and give one suitable use.",
      markPoints: [
        "States that lossless compression preserves all original data.",
        "States that lossy compression permanently removes some data.",
        "Explains that both are used to reduce file size.",
        "Gives a suitable example or use for either method.",
      ],
      modelAnswer:
        "Lossless compression reduces file size while allowing the original data to be reconstructed exactly. Lossy compression reduces file size by permanently discarding some data, so the original cannot be recovered perfectly. Lossless compression is suitable for data such as documents or backups, while lossy compression can be suitable for media such as photographs or audio when some quality reduction is acceptable.",
      examinerGuidance: [
        "Credit equivalent wording that clearly distinguishes whether all original data can be reconstructed.",
        "Do not accept the claim that lossless compression always produces a smaller file than lossy compression.",
      ],
      misconceptions: [
        "Saying that lossless compression reduces quality.",
        "Saying that data removed by lossy compression can always be recovered later.",
      ],
    };
  }

  return null;
}


function createCoreCurriculumDemoContent(
  item: AssessmentBlueprintItem,
): DemoQuestionContent | null {
  const profile = resolveTopicProfile(item.topicFocus);

  const coreProfiles: Record<
    string,
    {
      shortQuestion: string;
      shortContext: string;
      shortPoints: string[];
      shortAnswer: string;
      compareQuestion: string;
      compareContext: string;
      comparePoints: string[];
      compareAnswer: string;
      scenarioQuestion: string;
      scenarioContext: string;
      scenarioPoints: string[];
      scenarioAnswer: string;
      mcq: [string, string, string, string];
      mcqCorrect: "A" | "B" | "C" | "D";
    }
  > = {
    "cpu-architecture": {
      shortQuestion: "Explain the purpose of the program counter and memory data register during the fetch-decode-execute cycle.",
      shortContext: "Refer to the movement of instructions and data between the CPU and main memory.",
      shortPoints: [
        "States that the program counter stores the address of the next instruction to be fetched.",
        "Explains that the program counter is updated as execution proceeds.",
        "States that the memory data register holds data or an instruction being transferred to or from memory.",
        "Links both registers to the fetch stage of the cycle.",
        "Uses accurate register terminology.",
        "Distinguishes an address from the data stored at that address.",
      ],
      shortAnswer: "The program counter stores the address of the next instruction that the CPU must fetch. During the fetch stage, that address is used to access memory and the fetched instruction is transferred through the memory data register. The program counter is then updated so that execution can continue with the next instruction.",
      compareQuestion: "Compare clock speed and cache size as factors that can affect CPU performance.",
      compareContext: "Explain why increasing either factor does not guarantee the same performance improvement for every program.",
      comparePoints: [
        "Explains that clock speed affects how many clock cycles can occur per second.",
        "Explains that cache stores frequently used instructions or data close to the CPU.",
        "Explains how a higher clock speed can increase processing throughput.",
        "Explains how a larger or effective cache can reduce slower main-memory access.",
        "Recognises that software workload affects the benefit of each factor.",
        "Makes a direct comparison rather than two isolated descriptions.",
      ],
      compareAnswer: "Clock speed measures how many clock cycles a processor can perform each second, so a higher clock speed can allow instructions to be processed more quickly. Cache is fast memory close to the CPU that stores frequently used instructions and data, reducing the need to access slower RAM. A program that repeatedly uses the same data may benefit strongly from cache, while another workload may benefit more from faster execution cycles. Therefore neither factor alone determines overall CPU performance.",
      scenarioQuestion: "A school is replacing desktop computers used for programming, video editing and ordinary web-based work. Evaluate whether it should prioritise higher clock speed, more CPU cores or a larger cache when choosing processors.",
      scenarioContext: "The school wants good performance but has a fixed hardware budget and will run a mixture of single-threaded and multi-threaded software.",
      scenarioPoints: [
        "Explains the effect of clock speed on instruction processing.",
        "Explains that additional cores can execute multiple instruction streams when software supports parallelism.",
        "Explains that cache can reduce access to slower main memory.",
        "Applies the benefit of multiple cores to video editing or similar parallel workloads.",
        "Recognises that some programs cannot fully use many cores.",
        "Applies cost or budget constraints.",
        "Uses accurate CPU terminology.",
        "Considers more than one processor characteristic.",
        "Makes a justified recommendation for the mixed workload.",
        "Explains why one specification number should not be used in isolation.",
        "Maintains balance across performance and cost.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "The school should choose a balanced processor rather than selecting the model with the highest single specification. Higher clock speed can improve workloads that depend heavily on fast sequential execution. More cores can improve video editing and other software that divides work across threads, but ordinary applications may not use every core effectively. A useful cache can reduce repeated access to slower RAM. Because the machines must support mixed workloads and the budget is fixed, a mid-to-high clock speed with several cores and adequate cache is likely to give better value than maximising only one feature.",
      mcq: [
        "The program counter stores the address of the next instruction to be fetched.",
        "The program counter permanently stores every instruction in a program.",
        "The memory data register stores only the result of arithmetic operations.",
        "Cache is a form of secondary storage used for backups.",
      ],
      mcqCorrect: "A",
    },
    "memory-storage": {
      shortQuestion: "Explain why a computer uses both RAM and secondary storage.",
      shortContext: "Your answer should refer to volatility, speed and long-term storage.",
      shortPoints: [
        "States that RAM stores data and instructions currently in use.",
        "States that RAM is volatile.",
        "States that secondary storage retains data without power.",
        "Explains that RAM provides faster access for active programs than typical secondary storage.",
        "Explains that secondary storage provides long-term capacity for files and programs.",
        "Uses accurate terminology.",
      ],
      shortAnswer: "RAM stores the instructions and data that running programs currently need and provides relatively fast access for the CPU, but it is volatile and loses its contents when power is removed. Secondary storage is non-volatile, so it is used to keep programs and files long term even when the computer is switched off.",
      compareQuestion: "Compare a solid-state drive and a magnetic hard disk as secondary storage devices for school laptops.",
      compareContext: "Refer to speed, durability, capacity and cost.",
      comparePoints: [
        "States that an SSD has no moving parts.",
        "Explains that SSDs generally provide faster access than magnetic hard disks.",
        "Explains that SSDs are generally more resistant to physical shock.",
        "Recognises that hard disks can offer high capacity at lower cost per unit of storage.",
        "Applies the comparison to portable school laptops.",
        "Reaches a justified choice.",
      ],
      compareAnswer: "An SSD has no moving parts and normally provides faster access than a magnetic hard disk, so applications can load more quickly and the device is more resistant to knocks. A hard disk can provide a large capacity at a lower cost per gigabyte, but its moving parts make it more vulnerable in a portable laptop. For school laptops that are carried between lessons, an SSD is usually the more suitable choice if the required capacity is affordable.",
      scenarioQuestion: "A school computer has 8 GB of RAM and begins using virtual memory when several large applications are open. Evaluate whether increasing virtual memory is an adequate substitute for installing more RAM.",
      scenarioContext: "The computer must remain responsive while students use an IDE, a browser and image-editing software at the same time.",
      scenarioPoints: [
        "Explains that virtual memory uses secondary storage when RAM is insufficient.",
        "Explains that secondary storage is slower than RAM.",
        "Links heavy virtual-memory use to reduced responsiveness.",
        "Explains that more physical RAM can keep more active data in faster memory.",
        "Recognises that virtual memory is still useful as a fallback.",
        "Applies the answer to simultaneous large applications.",
        "Considers cost or upgrade practicality.",
        "Uses accurate terminology.",
        "Makes a justified recommendation.",
        "Distinguishes physical RAM from disk capacity.",
        "Maintains balanced reasoning.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "Virtual memory is useful because it allows the operating system to move less frequently used data out of RAM when physical memory is full. However, it uses secondary storage, which is much slower than RAM, so frequent swapping can make the computer noticeably less responsive. For a machine regularly running several large applications, installing more RAM is the better long-term solution if the hardware supports it. Virtual memory should remain enabled as a fallback, but it is not an equivalent replacement for adequate physical RAM.",
      mcq: [
        "RAM is volatile working memory used by active programs.",
        "RAM permanently stores files when power is removed.",
        "Virtual memory increases the physical amount of RAM installed.",
        "An SSD must contain moving magnetic platters.",
      ],
      mcqCorrect: "A",
    },
    networks: {
      shortQuestion: "Explain the different roles of a network switch and a router.",
      shortContext: "Refer to communication within a local network and between different networks.",
      shortPoints: [
        "States that a switch connects devices within a local network.",
        "Explains that a switch forwards frames to the appropriate local device.",
        "States that a router forwards packets between different networks.",
        "Links routing decisions to IP addressing.",
        "Distinguishes local-network communication from inter-network communication.",
        "Uses accurate terminology.",
      ],
      shortAnswer: "A switch connects devices on the same local network and forwards frames to the appropriate destination device. A router connects different networks and forwards packets between them using network addressing information such as IP addresses. A school LAN therefore uses switches for local connections and a router to reach other networks, including the internet.",
      compareQuestion: "Compare an IP address and a MAC address.",
      compareContext: "Explain how each address is used when data is transmitted across a network.",
      comparePoints: [
        "States that an IP address identifies a device or interface for network-layer communication.",
        "States that a MAC address identifies a network interface on a local network.",
        "Explains that routers use IP addresses when forwarding packets between networks.",
        "Explains that MAC addresses are used for local frame delivery.",
        "Recognises that the two addresses operate at different stages or layers of communication.",
        "Makes a direct comparison.",
      ],
      compareAnswer: "An IP address is used for logical addressing so that packets can be routed between networks. A MAC address identifies a network interface for local delivery on a LAN. When a packet travels across the internet, routers use IP addressing to decide where it should go, while each local network uses link-layer addressing such as MAC addresses to deliver the frame to the next device on that network.",
      scenarioQuestion: "A secondary school is expanding its network to a new building. Evaluate the main network design decisions needed to provide reliable wired and wireless access for classrooms while protecting school systems.",
      scenarioContext: "The new building will contain 180 student devices, staff laptops, printers and wireless access points connected to the existing school network.",
      scenarioPoints: [
        "Explains the role of switches for wired local connections.",
        "Explains the role of a router or gateway between networks.",
        "Considers sufficient bandwidth or network capacity.",
        "Considers wireless access-point coverage and interference.",
        "Considers authentication or access control.",
        "Considers network segmentation or restricted access for different users/devices.",
        "Considers reliability or redundancy.",
        "Applies points to the number and type of school devices.",
        "Uses accurate protocol/network terminology.",
        "Makes a justified design recommendation.",
        "Balances performance, security and cost.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "The new building should use managed switches with enough ports and uplink capacity for fixed devices, together with sufficient wireless access points to provide coverage without excessive contention. The existing router or gateway can route traffic between the new building and other networks. The school should separate student, staff and infrastructure traffic where appropriate and require secure authentication. Capacity should be planned for simultaneous classroom use rather than just the number of devices. A design that combines adequate switching capacity, planned wireless coverage and access controls will provide better reliability and security than simply adding unmanaged devices to the existing network.",
      mcq: [
        "A router forwards packets between different networks.",
        "A switch translates every domain name into an IP address.",
        "DNS is used to encrypt all data transmitted across a LAN.",
        "A MAC address is the same as a website domain name.",
      ],
      mcqCorrect: "A",
    },
    cybersecurity: {
      shortQuestion: "Explain how multi-factor authentication can reduce the risk of an account being compromised after a password is stolen.",
      shortContext: "The account requires a password and a one-time code generated on a separate device.",
      shortPoints: [
        "States that authentication checks evidence of identity.",
        "Explains that multi-factor authentication requires more than one independent factor.",
        "Explains that the stolen password supplies only one factor.",
        "Explains that the attacker also needs access to the second factor or one-time code.",
        "Links this to reduced risk of unauthorised access.",
        "Uses accurate security terminology.",
      ],
      shortAnswer: "Multi-factor authentication requires evidence from more than one authentication factor. A stolen password gives an attacker only the knowledge factor. Without access to the separate device that generates the one-time code, the attacker cannot normally complete authentication, so the stolen password alone is less likely to result in unauthorised access.",
      compareQuestion: "Compare encryption and hashing as techniques used to protect data.",
      compareContext: "Refer to whether the original value is intended to be recovered.",
      comparePoints: [
        "Explains that encryption transforms plaintext into ciphertext using a key.",
        "Explains that authorised users can decrypt ciphertext with the appropriate key.",
        "Explains that hashing produces a fixed or derived digest intended to be one-way.",
        "Explains that passwords can be checked by comparing hashes rather than decrypting stored passwords.",
        "Distinguishes confidentiality from integrity/password verification uses.",
        "Makes a direct comparison.",
      ],
      compareAnswer: "Encryption converts readable data into ciphertext using a key and is designed so that an authorised party can recover the original plaintext by decrypting it. Hashing produces a digest and is intended to be one-way, so the original value is not recovered from the hash. Encryption is therefore suitable for confidential data that must later be read, while hashing is suitable for tasks such as password verification or checking whether data has changed.",
      scenarioQuestion: "A school has experienced repeated phishing attempts against staff accounts. Evaluate a layered security response that reduces the likelihood and impact of a successful phishing attack.",
      scenarioContext: "Staff access email, cloud storage and student information systems using school accounts.",
      scenarioPoints: [
        "Explains user training to recognise phishing indicators.",
        "Explains the value of multi-factor authentication.",
        "Considers filtering or blocking malicious email/content.",
        "Considers least-privilege access or restricted permissions.",
        "Considers secure password policy or password-manager use.",
        "Considers software updates or endpoint protection.",
        "Explains why no single control removes all risk.",
        "Applies controls to staff/cloud/student-data access.",
        "Uses accurate cybersecurity terminology.",
        "Makes a justified recommendation.",
        "Balances security with usability.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "The school should use defence in depth. Staff training can reduce the chance that a user follows a malicious link, while email filtering can block many known phishing messages before they are seen. Multi-factor authentication is particularly important because a stolen password alone should not be enough to access an account. Accounts should also have only the permissions users need, and devices and software should be kept updated. These controls work together: training reduces successful deception, authentication limits stolen credentials, and restricted permissions reduce the damage if an account is compromised.",
      mcq: [
        "Multi-factor authentication requires more than one form of authentication evidence.",
        "A firewall guarantees that phishing emails can never reach a user.",
        "Encryption and hashing are identical reversible processes.",
        "User training is unnecessary when antivirus software is installed.",
      ],
      mcqCorrect: "A",
    },
    algorithms: {
      shortQuestion: "Explain why binary search requires the data being searched to be ordered.",
      shortContext: "Refer to how the search area is reduced after each comparison.",
      shortPoints: [
        "States that binary search compares the target with a middle value.",
        "Explains that the comparison determines which half can be discarded.",
        "Explains that this decision depends on the data being ordered.",
        "Explains that the remaining search area is repeatedly halved.",
        "Distinguishes binary search from checking values one at a time.",
        "Uses accurate algorithmic terminology.",
      ],
      shortAnswer: "Binary search compares the target with the middle value of an ordered list. If the target is smaller, the upper half can be discarded; if it is larger, the lower half can be discarded. This only works when the values are ordered, because their position then tells the algorithm which half cannot contain the target.",
      compareQuestion: "Compare linear search and binary search for locating a value in a list.",
      compareContext: "Consider both an unsorted list and a large sorted list.",
      comparePoints: [
        "Explains that linear search checks values sequentially.",
        "Explains that binary search repeatedly halves the search area.",
        "States that linear search can operate on unsorted data.",
        "States that binary search requires ordered data.",
        "Explains why binary search is generally more efficient on a large sorted list.",
        "Reaches a justified choice for each stated situation.",
      ],
      compareAnswer: "Linear search checks items one at a time until the target is found or the list ends, so it can be used on unsorted data. Binary search compares the target with a middle item and repeatedly discards half of the remaining ordered list. On a large sorted list, binary search normally requires far fewer comparisons. On an unsorted list, linear search can be used immediately, whereas binary search cannot be applied correctly unless the data is first ordered.",
      scenarioQuestion: "A school library application must search a catalogue containing 120,000 book records. Evaluate whether the program should use linear search or binary search for repeated searches by book ID.",
      scenarioContext: "Book IDs can be kept in sorted order, and users perform thousands of searches each day.",
      scenarioPoints: [
        "Explains how linear search operates.",
        "Explains how binary search operates.",
        "Recognises that binary search requires sorted data.",
        "Links the large dataset to efficiency considerations.",
        "Links repeated searches to the benefit of maintaining order.",
        "Explains that binary search reduces the search area by half each step.",
        "Considers the cost of keeping or creating sorted data.",
        "Uses accurate algorithmic terminology.",
        "Makes a justified recommendation.",
        "Applies the recommendation to searching by book ID.",
        "Maintains balanced reasoning.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "Because the catalogue contains 120,000 records and book IDs can be kept in sorted order, binary search is the better method for repeated ID lookups. Linear search may need to inspect a very large number of records before finding the target, while binary search repeatedly halves the remaining search area. Maintaining sorted IDs has a cost when records are inserted or updated, but that cost is justified when thousands of searches are performed each day. The application should therefore keep the searchable IDs ordered and use binary search for these repeated lookups.",
      mcq: [
        "Binary search requires the searchable data to be ordered.",
        "Binary search always checks every item in the list.",
        "Linear search can only be used on sorted data.",
        "Bubble sort finds a target by repeatedly halving a search area.",
      ],
      mcqCorrect: "A",
    },
    programming: {
      shortQuestion: "Explain the difference between a parameter and an argument when a function is used.",
      shortContext: "You may use a short Python example to support your answer.",
      shortPoints: [
        "States that a parameter is a named variable in a function definition.",
        "States that an argument is a value or expression supplied when the function is called.",
        "Explains that the argument's value is associated with the parameter for that call.",
        "Gives a correct example.",
        "Distinguishes definition from invocation.",
        "Uses accurate programming terminology.",
      ],
      shortAnswer: "A parameter is a name used in a function definition to receive a value, while an argument is the actual value or expression supplied when the function is called. For example, in `def double(number):`, `number` is a parameter. In `double(7)`, `7` is the argument passed to that parameter.",
      compareQuestion: "Compare a for loop and a while loop.",
      compareContext: "Explain when each type of iteration is more suitable.",
      comparePoints: [
        "Explains that both repeat a block of instructions.",
        "Explains that a for loop is suitable when iterating over a sequence or known range.",
        "Explains that a while loop repeats while a Boolean condition remains true.",
        "Recognises the risk of a non-terminating while loop if its condition never becomes false.",
        "Gives a suitable use for each loop type.",
        "Makes a direct comparison.",
      ],
      compareAnswer: "Both for and while loops perform iteration. A for loop is useful when processing each item in a collection or repeating over a known range. A while loop is useful when repetition must continue until a condition changes, such as repeatedly asking for valid input. A while loop must update the state used by its condition or it may never terminate.",
      scenarioQuestion: "A school is developing a Python program that imports assessment scores, validates them, calculates statistics and produces a report. Evaluate how decomposition into functions could improve the program.",
      scenarioContext: "The program will be maintained by several teachers and may later support additional report formats.",
      scenarioPoints: [
        "Explains decomposition into smaller functions or procedures.",
        "Explains reuse of common operations such as validation or calculation.",
        "Explains how clear parameters and return values reduce coupling.",
        "Explains how functions can make testing more focused.",
        "Explains how decomposition can improve readability or maintenance.",
        "Applies the answer to multiple maintainers.",
        "Applies the answer to future report formats.",
        "Recognises that poor decomposition or unclear interfaces can add complexity.",
        "Uses accurate programming terminology.",
        "Makes a justified recommendation.",
        "Maintains balanced reasoning.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "The program should be decomposed into functions such as `load_scores`, `validate_score`, `calculate_statistics` and `format_report`. Each function would have one clear responsibility, making it easier to test and change without affecting unrelated code. Reusable validation and calculation functions would avoid duplication, and parameters and return values would make the data flow explicit. This structure is especially useful when several teachers maintain the code and new report formats are added. The functions should remain cohesive and have clear interfaces so that decomposition does not simply split the program into unnecessarily small fragments.",
      mcq: [
        "A parameter is a named value in a function definition that can receive an argument.",
        "A while loop always executes a fixed number of times known before execution.",
        "Assignment and comparison use exactly the same operator in Python.",
        "A function cannot return a value to the calling code.",
      ],
      mcqCorrect: "A",
    },
    databases: {
      shortQuestion: "Explain the purpose of a primary key and a foreign key in a relational database.",
      shortContext: "Use an example involving Student and Class tables.",
      shortPoints: [
        "States that a primary key uniquely identifies each record in a table.",
        "States that primary-key values must not be duplicated for different records.",
        "States that a foreign key stores a value that refers to a key in another table.",
        "Explains that a foreign key creates a relationship between tables.",
        "Applies the explanation to Student and Class records.",
        "Uses accurate database terminology.",
      ],
      shortAnswer: "A primary key uniquely identifies each record in its table, for example `studentId` in a Student table. A foreign key stores the key value of a related record in another table, for example `classId` in Student referring to `classId` in a Class table. This allows related data to be linked without repeating all class details in every student record.",
      compareQuestion: "Compare a database field and a database record.",
      compareContext: "Use a Student table as your example.",
      comparePoints: [
        "Explains that a field stores one attribute or data item.",
        "Explains that a record contains the related fields for one entity instance.",
        "Gives an appropriate field example such as surname or dateOfBirth.",
        "Gives an appropriate record example for one student.",
        "Explains how fields form the structure of each record.",
        "Makes a direct comparison.",
      ],
      compareAnswer: "A field is one attribute in a table, such as `surname` or `dateOfBirth`. A record is the complete set of field values describing one entity instance, such as one student's ID, name and date of birth. The fields define what information is stored, while each record contains the values for one student.",
      scenarioQuestion: "A school database currently stores student name, tutor group, tutor email and tutor room in one large Student table. Evaluate whether the design should be split into related Student and Tutor tables.",
      scenarioContext: "Many students share the same tutor, and tutor details are changed several times each year.",
      scenarioPoints: [
        "Identifies repeated tutor data as duplication.",
        "Explains how duplication can lead to update inconsistencies.",
        "Proposes a separate Tutor table with a primary key.",
        "Proposes a foreign key in Student linking to Tutor.",
        "Explains how the relationship reduces repeated tutor details.",
        "Explains how updates become more consistent.",
        "Considers query/join requirements after decomposition.",
        "Uses accurate relational-database terminology.",
        "Applies the design to the school scenario.",
        "Makes a justified recommendation.",
        "Maintains balanced reasoning.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "The tutor details should be moved to a separate Tutor table because the same tutor email and room are currently duplicated for many students. Repetition increases the risk of inconsistent data if one copy is updated and another is missed. The Tutor table should use a tutor ID as its primary key, and Student should store that ID as a foreign key. Tutor details then need to be changed only once. Queries may need to join the two tables when displaying full student and tutor information, but the improved consistency and reduced duplication make the related-table design more suitable.",
      mcq: [
        "A primary key uniquely identifies each record in a table.",
        "A foreign key must contain a different value in every record.",
        "A record is the name of a single column in a table.",
        "A SELECT query always permanently deletes the rows it returns.",
      ],
      mcqCorrect: "A",
    },
    "software-development": {
      shortQuestion: "Explain the difference between validation and verification.",
      shortContext: "Use one example of each technique.",
      shortPoints: [
        "States that validation checks whether input satisfies defined rules or is sensible.",
        "Gives a valid validation example such as a range check.",
        "States that verification checks whether data has been copied or entered accurately.",
        "Gives a valid verification example such as double entry or visual checking.",
        "Explains that valid data can still be incorrect for the real-world situation.",
        "Uses accurate terminology.",
      ],
      shortAnswer: "Validation checks whether data meets specified rules, for example using a range check to ensure an exam score is from 0 to 100. Verification checks whether data has been entered or copied accurately, for example by entering it twice and comparing the results. Validation therefore does not prove that a value is factually correct; it only checks that it is acceptable according to the rule.",
      compareQuestion: "Compare normal, boundary and invalid test data.",
      compareContext: "A program accepts an integer from 1 to 100 inclusive.",
      comparePoints: [
        "Explains that normal data is valid and not at an extreme boundary.",
        "Gives an appropriate normal example such as 50.",
        "Explains that boundary data tests values at or immediately around limits.",
        "Gives appropriate boundary examples such as 1, 100, 0 or 101.",
        "Explains that invalid data should be rejected by the program.",
        "Makes a direct comparison between the purposes of the test categories.",
      ],
      compareAnswer: "Normal test data checks typical valid inputs, such as 50. Boundary testing checks the limits and values immediately around them, such as 1, 100, 0 and 101, because off-by-one errors often occur there. Invalid test data deliberately breaks the input rules and should be rejected. Together these categories test both expected behaviour and the program's response to edge cases and unacceptable input.",
      scenarioQuestion: "A school is about to release a program that calculates student grades from assessment scores. Evaluate a testing strategy that should be completed before release.",
      scenarioContext: "Scores must be integers from 0 to 100, and grade boundaries must be applied accurately.",
      scenarioPoints: [
        "Proposes normal test data.",
        "Proposes boundary test data around 0, 100 and grade thresholds.",
        "Proposes invalid data such as out-of-range or incorrect-type input.",
        "Explains expected results for test cases.",
        "Considers testing grade-boundary logic.",
        "Considers validation behaviour.",
        "Considers retesting after defects are fixed.",
        "Applies the strategy to score and grade requirements.",
        "Uses accurate testing terminology.",
        "Explains why successful execution alone is insufficient evidence.",
        "Makes a justified release recommendation.",
        "Reaches a supported conclusion.",
      ],
      scenarioAnswer: "The school should create test cases with expected outcomes before release. Normal values such as 50 should confirm ordinary calculations, while boundary values should include 0, 100 and values immediately below, at and above each grade threshold. Invalid inputs such as -1, 101 and non-numeric data should be rejected. Any defect found should be corrected and the affected tests repeated, together with relevant regression tests. The program should only be released once score validation and every grade boundary produce the expected results across these test categories.",
      mcq: [
        "A boundary test checks values at or immediately around an allowed limit.",
        "Validation proves that entered data is factually true.",
        "A logic error always prevents a program from starting.",
        "Testing only one normal value is sufficient to prove a program is correct.",
      ],
      mcqCorrect: "A",
    },
    "ethical-legal-environmental": {
      shortQuestion: "Explain why an action can be legal but still raise ethical concerns in computing.",
      shortContext: "Use an example involving collection or use of personal data.",
      shortPoints: [
        "Distinguishes legal requirements from ethical judgement.",
        "Explains that law sets enforceable rules or minimum requirements.",
        "Explains that ethics considers whether an action is fair, responsible or appropriate.",
        "Gives a relevant personal-data example.",
        "Explains a possible effect on individuals such as privacy or fairness.",
        "Uses accurate terminology.",
      ],
      shortAnswer: "Law defines enforceable requirements, while ethics considers whether an action is fair and responsible even when it is permitted by law. For example, an organisation might legally collect detailed usage data after obtaining the required permission, but using far more personal data than users reasonably expect could still create ethical concerns about privacy, transparency and fairness.",
      compareQuestion: "Compare an ethical issue and an environmental issue caused by increased use of computing technology.",
      compareContext: "Your answer should use one specific example of each and explain the impact.",
      comparePoints: [
        "Identifies a valid ethical issue such as privacy, bias or digital exclusion.",
        "Explains the effect of the ethical issue on people or society.",
        "Identifies a valid environmental issue such as energy use or electronic waste.",
        "Explains the environmental impact.",
        "Recognises that one technology can create both kinds of impact.",
        "Makes a direct comparison.",
      ],
      compareAnswer: "An ethical issue concerns how technology affects people and what ought to be done, for example a biased automated decision system treating groups unfairly. An environmental issue concerns effects on natural resources and ecosystems, such as energy consumed by data centres or electronic waste from discarded devices. The same computing service can create both types of impact, so organisations should consider social fairness as well as resource use when making technology decisions.",
      scenarioQuestion: "A school wants to introduce an AI-based monitoring system that analyses student device activity to identify possible safeguarding concerns. Evaluate the ethical, legal and environmental considerations before deployment.",
      scenarioContext: "The system would process large amounts of student activity data and run continuously on cloud infrastructure.",
      scenarioPoints: [
        "Considers privacy and proportionality of monitoring.",
        "Considers lawful handling and protection of personal data.",
        "Considers accuracy, false positives or bias.",
        "Considers human review of automated flags.",
        "Considers computing/energy use of continuous cloud processing and its environmental impact.",
        "Applies the discussion to safeguarding benefits and reaches a proportionate judgement.",
        "Considers transparency to students and parents where appropriate.",
        "Considers access controls and data retention.",
        "Uses accurate ethical/legal/environmental terminology.",
        "Considers safeguards or a less intrusive alternative.",
        "Makes a justified recommendation.",
        "Reaches a balanced conclusion.",
      ],
      scenarioAnswer: "The school has a legitimate safeguarding aim, but continuous monitoring of student activity would process sensitive behavioural data and could affect privacy. The school should collect only data needed for the stated purpose, secure it, limit retention and restrict access. Automated flags must be reviewed by trained staff because false positives or biased patterns could lead to unfair treatment. The school should also consider the energy and computing resources required for continuous cloud analysis. Deployment is only justified if the safeguarding benefit is proportionate, legal requirements are met, students are treated fairly and strong human-review and data-governance controls are in place.",
      mcq: [
        "An action can comply with the law and still raise ethical concerns.",
        "Anything that is legal is automatically ethical.",
        "Electronic waste has no environmental impact once data is deleted from a device.",
        "Personal data is automatically public when it is stored digitally.",
      ],
      mcqCorrect: "A",
    },
    "ai-machine-learning": {
      shortQuestion: "Explain why the quality and representativeness of training data can affect a machine-learning model's predictions.",
      shortContext: "Refer to patterns learned during training and performance on new data.",
      shortPoints: [
        "States that a machine-learning model learns patterns from training data.",
        "Explains that inaccurate or poor-quality data can teach incorrect relationships.",
        "Explains that unrepresentative data can underrepresent relevant cases or groups.",
        "Links this to biased or less accurate predictions on new data.",
        "Explains the need for evaluation on suitable unseen data.",
        "Uses accurate machine-learning terminology.",
      ],
      shortAnswer: "A machine-learning model learns statistical patterns from the examples used during training. If the training data contains errors or does not represent the situations and groups the model will encounter later, the learned patterns may be misleading. The model can then make inaccurate or systematically biased predictions on new data, so performance should be evaluated using suitable unseen data rather than assuming training accuracy is sufficient.",
      compareQuestion: "Compare a rule-based program with a machine-learning classifier.",
      compareContext: "Use spam-email detection as your example.",
      comparePoints: [
        "Explains that a rule-based system follows explicitly programmed conditions.",
        "Explains that a machine-learning classifier learns patterns from labelled examples.",
        "Explains that rule-based decisions can be easier to trace to specific rules.",
        "Explains that machine learning can identify complex patterns that are difficult to specify manually.",
        "Recognises that machine-learning performance depends on training data and evaluation.",
        "Makes a direct comparison using spam detection.",
      ],
      compareAnswer: "A rule-based spam filter uses conditions written by programmers, such as blocking messages containing specified patterns. Its decisions are usually easier to relate to explicit rules, but maintaining many rules can become difficult. A machine-learning classifier learns patterns from labelled spam and non-spam examples and can capture combinations that were not manually programmed. However, its performance depends on representative training data and it can still make incorrect classifications.",
      scenarioQuestion: "A school is considering a machine-learning model that predicts which students may need additional academic support. Evaluate how the school should develop and use the system responsibly.",
      scenarioContext: "The model would use attendance, assessment and engagement data to produce a risk score for staff.",
      scenarioPoints: [
        "Considers data quality and relevance.",
        "Considers representativeness and bias.",
        "Explains the need to evaluate predictions on unseen data.",
        "Considers false positives and false negatives.",
        "Explains that a prediction is not a certain fact.",
        "Considers privacy and restricted access to student data.",
        "Requires human review before interventions or decisions.",
        "Considers monitoring performance after deployment.",
        "Uses accurate AI/ML terminology.",
        "Applies the discussion to academic-support decisions.",
        "Makes a justified recommendation.",
        "Reaches a balanced conclusion.",
      ],
      scenarioAnswer: "The school should train and evaluate the model using accurate, relevant and representative data. It should test performance on unseen records and examine errors such as false positives and false negatives rather than relying on one overall accuracy figure. A risk score should be treated as evidence for staff review, not as proof that a student will struggle. Access to the underlying data and predictions should be restricted, and performance should be monitored for bias or deterioration after deployment. The model is most appropriate as a decision-support tool that helps staff identify cases for further review, not as an automatic decision maker.",
      mcq: [
        "A machine-learning model can produce biased predictions if its training data is unrepresentative.",
        "A high accuracy score proves that a model is fair for every group.",
        "Machine learning means the system understands information exactly as a human does.",
        "A prediction produced by a model is always a certain fact.",
      ],
      mcqCorrect: "A",
    },
  };

  const core = coreProfiles[profile.id];

  if (!core) {
    return null;
  }

  // CPU Architecture needs concrete task-type handling before the generic
  // core-curriculum short-response fallback. This prevents CALCULATE and
  // COMPLETE blueprint rows from silently becoming duplicate EXPLAIN tasks.
  if (profile.id === "cpu-architecture") {
    if (
      item.commandWord === "complete" ||
      item.questionType === "complete-table"
    ) {
      return {
        question:
          "Complete the four missing entries in the fetch-decode-execute table.\n\nStage | Register / component | Action\nFetch | ______ | Stores the address of the next instruction\nFetch | MAR | Receives the address copied from the ______\nFetch | ______ | Holds the instruction transferred from main memory\nFetch | CIR | Receives the instruction from the ______",
        context:
          "Use the register names PC, MAR, MDR and CIR. Each missing entry is worth 1 mark.",
        markPoints: [
          "Completes the first missing entry as PC (program counter).",
          "Completes the second missing entry as PC (program counter).",
          "Completes the third missing entry as MDR (memory data register).",
          "Completes the fourth missing entry as MDR (memory data register).",
        ],
        modelAnswer:
          "Stage | Register / component | Action\nFetch | PC | Stores the address of the next instruction\nFetch | MAR | Receives the address copied from the PC\nFetch | MDR | Holds the instruction transferred from main memory\nFetch | CIR | Receives the instruction from the MDR",
        examinerGuidance: [
          "Award each missing entry independently.",
          "Accept the full register name or the standard abbreviation where the meaning is unambiguous.",
        ],
        misconceptions: [
          "Confusing the role of the program counter with the memory address register.",
          "Assuming the CIR stores the address of the next instruction.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const clockSpeedGHz = item.difficulty === "higher" ? 3.6 : 2.4;
      const seconds = item.difficulty === "foundation" ? 1 : 2;
      const cyclesPerSecond = clockSpeedGHz * 1_000_000_000;
      const totalCycles = cyclesPerSecond * seconds;

      return {
        question:
          `A processor has a clock speed of ${clockSpeedGHz} GHz. Calculate the maximum number of clock cycles that occur in ${seconds} second${seconds === 1 ? "" : "s"}. Show your working.`,
        context:
          "Use 1 GHz = 1,000,000,000 clock cycles per second.",
        markPoints: [
          `Converts ${clockSpeedGHz} GHz to ${cyclesPerSecond.toLocaleString("en-GB")} clock cycles per second.`,
          `Calculates ${cyclesPerSecond.toLocaleString("en-GB")} × ${seconds} = ${totalCycles.toLocaleString("en-GB")} clock cycles.`,
          "Shows a correct conversion or multiplication method.",
          "Uses an appropriate unit for the final answer.",
        ],
        modelAnswer:
          `${clockSpeedGHz} GHz = ${cyclesPerSecond.toLocaleString("en-GB")} clock cycles per second.\n${cyclesPerSecond.toLocaleString("en-GB")} × ${seconds} = ${totalCycles.toLocaleString("en-GB")} clock cycles.\n\nTherefore, the processor can undergo up to ${totalCycles.toLocaleString("en-GB")} clock cycles in ${seconds} second${seconds === 1 ? "" : "s"}.`,
        examinerGuidance: [
          "Award method credit for a correct GHz-to-cycles-per-second conversion even if a later arithmetic error occurs.",
          "Do not interpret clock cycles as the same thing as completed instructions; one instruction may require more than one clock cycle.",
        ],
        misconceptions: [
          "Treating GHz as millions rather than billions of cycles per second.",
          "Assuming one clock cycle always equals one completed instruction.",
        ],
      };
    }
  }


  // Consolidated core-curriculum task-type handlers.
  // The automatic blueprint commonly uses CALCULATE and COMPLETE slots.
  // Every supported core topic therefore receives a concrete task for those
  // command words instead of falling through to a generic EXPLAIN response.
  if (profile.id === "memory-storage") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing entries in the table.\n\nTechnology | Volatile? | Typical purpose\nRAM | ______ | Stores data and instructions currently in use\nROM | No | ______\nSSD | No | ______\nVirtual memory | No | ______",
        context:
          "Use precise Computer Science terminology. Each missing entry is worth 1 mark.",
        markPoints: [
          "Completes RAM as volatile (Yes).",
          "States that ROM typically stores firmware or fixed start-up instructions.",
          "States that an SSD provides non-volatile secondary storage for files and programs.",
          "States that virtual memory uses secondary storage when RAM is insufficient.",
        ],
        modelAnswer:
          "Technology | Volatile? | Typical purpose\nRAM | Yes | Stores data and instructions currently in use\nROM | No | Stores firmware or fixed start-up instructions\nSSD | No | Provides non-volatile secondary storage for files and programs\nVirtual memory | No | Uses secondary storage when RAM is insufficient",
        examinerGuidance: [
          "Award each missing entry independently.",
          "Accept equivalent wording where the technical meaning is correct.",
        ],
        misconceptions: [
          "Treating RAM as non-volatile storage.",
          "Believing virtual memory increases the physical amount of RAM installed.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const fileSizeMB = item.difficulty === "higher" ? 750 : 500;
      const fileCount = item.difficulty === "foundation" ? 6 : 8;
      const totalMB = fileSizeMB * fileCount;
      const totalGB = totalMB / 1000;

      return {
        question:
          `A school needs to store ${fileCount} backup files. Each file is ${fileSizeMB} MB. Calculate the total storage required in GB. Show your working.`,
        context: "Use 1 GB = 1000 MB.",
        markPoints: [
          `Calculates ${fileCount} × ${fileSizeMB} = ${totalMB} MB.`,
          `Converts ${totalMB} MB to ${totalGB} GB.`,
          "Shows a correct multiplication method.",
          "Uses the correct final unit.",
        ],
        modelAnswer:
          `${fileCount} × ${fileSizeMB} MB = ${totalMB} MB.\n${totalMB} ÷ 1000 = ${totalGB} GB.\n\nTherefore, the total storage required is ${totalGB} GB.`,
        examinerGuidance: [
          "Award method credit for the correct multiplication even if the later conversion is incorrect.",
          "Use the decimal conversion stated in the question.",
        ],
        misconceptions: [
          "Dividing the file count by the file size instead of multiplying.",
          "Using a different MB-to-GB conversion from the one stated in the question.",
        ],
      };
    }
  }

  if (profile.id === "networks") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing entries in the networking table.\n\nItem | Role\nSwitch | ______\nRouter | ______\nDNS | ______\nTCP | ______",
        context:
          "Give one precise role for each device or protocol. Each missing entry is worth 1 mark.",
        markPoints: [
          "States that a switch forwards frames between devices on a local network.",
          "States that a router forwards packets between different networks.",
          "States that DNS translates domain names into IP addresses.",
          "States that TCP provides reliable, ordered delivery using acknowledgements or retransmission where needed.",
        ],
        modelAnswer:
          "Item | Role\nSwitch | Forwards frames between devices on a local network\nRouter | Forwards packets between different networks\nDNS | Translates domain names into IP addresses\nTCP | Provides reliable, ordered delivery of data",
        examinerGuidance: [
          "Award each row independently.",
          "Accept equivalent technically accurate descriptions of the stated role.",
        ],
        misconceptions: [
          "Confusing the role of a switch with the role of a router.",
          "Saying that DNS physically carries packets between networks.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const dataMB = item.difficulty === "higher" ? 96 : 48;
      const rateMBps = item.difficulty === "foundation" ? 8 : 12;
      const seconds = dataMB / rateMBps;

      return {
        question:
          `A ${dataMB} MB file is transferred across a network at ${rateMBps} MB per second. Calculate the ideal transfer time in seconds.`,
        context:
          "Assume the transfer rate remains constant and ignore protocol overhead.",
        markPoints: [
          `Uses time = data size ÷ transfer rate.`,
          `Calculates ${dataMB} ÷ ${rateMBps} = ${seconds} seconds.`,
          "Shows the substitution into the formula.",
          "Uses seconds as the final unit.",
        ],
        modelAnswer:
          `Time = data size ÷ transfer rate\n= ${dataMB} MB ÷ ${rateMBps} MB/s\n= ${seconds} seconds.`,
        examinerGuidance: [
          "Award method credit for the correct division even if the final arithmetic is incorrect.",
          "Do not require conversion to bits because both quantities are given in MB-based units.",
        ],
        misconceptions: [
          "Multiplying the file size by the transfer rate.",
          "Converting units unnecessarily when both values already use MB.",
        ],
      };
    }
  }

  if (profile.id === "cybersecurity") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing entries in the cybersecurity table.\n\nThreat / control | Description\nPhishing | ______\nMalware | ______\nMulti-factor authentication | ______\nEncryption | ______",
        context:
          "Give one precise description for each entry. Each missing entry is worth 1 mark.",
        markPoints: [
          "States that phishing attempts to deceive a user into revealing information or following a malicious link.",
          "States that malware is malicious software designed to damage, disrupt, spy on or gain unauthorised access to systems.",
          "States that multi-factor authentication requires more than one type of authentication evidence.",
          "States that encryption converts plaintext into ciphertext using a key so unauthorised users cannot read the data.",
        ],
        modelAnswer:
          "Phishing | Deceives users into revealing information or following malicious links\nMalware | Malicious software that can damage, disrupt, spy on or gain unauthorised access\nMulti-factor authentication | Requires more than one type of authentication evidence\nEncryption | Converts plaintext into ciphertext using a key",
        examinerGuidance: [
          "Award each row independently.",
          "Accept equivalent cybersecurity terminology where the meaning is precise.",
        ],
        misconceptions: [
          "Treating phishing as a type of hardware failure.",
          "Saying that encryption and hashing are the same reversible process.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const digits = item.difficulty === "higher" ? 6 : 4;
      const combinations = 10 ** digits;

      return {
        question:
          `A numeric access code contains ${digits} digits. Each digit can be any value from 0 to 9 and digits may repeat. Calculate the number of possible access codes a brute-force attack may need to try.`,
        context:
          "Include codes that begin with zero.",
        markPoints: [
          `Recognises that each of the ${digits} positions has 10 possible values.`,
          `Calculates 10^${digits} = ${combinations.toLocaleString("en-GB")} possible codes.`,
          "Uses multiplication or index notation correctly.",
          "States the result as a number of possible codes.",
        ],
        modelAnswer:
          `There are 10 choices for each digit.\n10^${digits} = ${combinations.toLocaleString("en-GB")}.\n\nTherefore, there are ${combinations.toLocaleString("en-GB")} possible access codes.`,
        examinerGuidance: [
          "Award the calculation mark only when leading-zero codes are included.",
          "Do not subtract codes simply because digits repeat; repetition is explicitly allowed.",
        ],
        misconceptions: [
          "Using 9 possibilities per digit instead of 10.",
          "Excluding codes that start with zero.",
        ],
      };
    }
  }

  if (profile.id === "algorithms") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing entries in the searching-algorithms table.\n\nFeature | Linear search | Binary search\nData must already be ordered | No | ______\nMethod | Checks items one at a time | ______\nCan be used immediately on unsorted data | ______ | No\nSearch area can be halved after each comparison | No | ______",
        context:
          "Each missing entry is worth 1 mark.",
        markPoints: [
          "Completes the binary-search ordering requirement as Yes.",
          "States that binary search compares with a middle item and discards half of the remaining search area.",
          "Completes linear search on unsorted data as Yes.",
          "Completes the halving feature for binary search as Yes.",
        ],
        modelAnswer:
          "Feature | Linear search | Binary search\nData must already be ordered | No | Yes\nMethod | Checks items one at a time | Compares with a middle item and repeatedly halves the search area\nCan be used immediately on unsorted data | Yes | No\nSearch area can be halved after each comparison | No | Yes",
        examinerGuidance: [
          "Award each missing entry independently.",
          "Accept 'sorted' as equivalent to 'ordered'.",
        ],
        misconceptions: [
          "Assuming binary search works correctly on unsorted data.",
          "Assuming linear search repeatedly halves the list.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const iterations = item.difficulty === "higher" ? 6 : 5;
      const addedValues = Array.from(
        { length: iterations },
        (_, index) => (index + 1) * 2,
      );
      const total = addedValues.reduce((sum, value) => sum + value, 0);
      const addedValuesList = addedValues.join(", ");
      const addedValuesWorking = addedValues.join(" + ");

      return {
        question:
          `An algorithm starts with total = 0. For n from 1 to ${iterations}, it adds 2 × n to total. Calculate the final value of total.`,
        context:
          "Show the additions made during each iteration.",
        markPoints: [
          `Identifies the added values as ${addedValuesList}.`,
          `Calculates the final total as ${total}.`,
          "Shows the repeated-addition or equivalent arithmetic method.",
          "States the final value clearly.",
        ],
        modelAnswer:
          `The values added are ${addedValuesWorking}.\nThe final total is ${total}.`,
        examinerGuidance: [
          "Award follow-through credit where one early arithmetic error is used consistently.",
          "Do not award full marks for a final value with no working when working is requested.",
        ],
        misconceptions: [
          "Adding n instead of 2 × n.",
          "Starting the loop at 0 instead of 1.",
        ],
      };
    }
  }

  if (profile.id === "programming") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing parts of this Python program so that it counts scores of 50 or more.\n\ncount = ______\nfor score in scores:\n    if score ______ 50:\n        count = count ______ 1\nprint(______)",
        context:
          "Each missing part is worth 1 mark.",
        markPoints: [
          "Completes the initial value as 0.",
          "Completes the comparison as >=.",
          "Completes the update as + (or equivalent correct increment expression).",
          "Completes the output variable as count.",
        ],
        modelAnswer:
          "count = 0\nfor score in scores:\n    if score >= 50:\n        count = count + 1\nprint(count)",
        examinerGuidance: [
          "Award each gap independently where the completed program remains syntactically and logically valid.",
          "Accept an equivalent increment such as count += 1 where the gap format permits it.",
        ],
        misconceptions: [
          "Using = instead of >= in the condition.",
          "Resetting count inside the loop.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      return {
        question:
          "The following code is executed.\n\nx = 7\ny = 3\nresult = (x * 2) + (y ** 2)\n\nCalculate the value stored in result.",
        context:
          "Apply the arithmetic operators in the expression correctly.",
        markPoints: [
          "Calculates x * 2 as 14.",
          "Calculates y ** 2 as 9.",
          "Calculates 14 + 9 as 23.",
          "States result = 23.",
        ],
        modelAnswer:
          "x * 2 = 14\ny ** 2 = 9\n14 + 9 = 23\n\nresult = 23",
        examinerGuidance: [
          "Award method credit for correct intermediate values.",
          "Treat ** as exponentiation, not multiplication.",
        ],
        misconceptions: [
          "Treating ** as multiplication.",
          "Ignoring operator precedence.",
        ],
      };
    }
  }

  if (profile.id === "databases") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing entries in the relational-database table.\n\nTerm | Meaning / example\nPrimary key | ______\nForeign key | ______\nField | ______\nRecord | ______",
        context:
          "Use a school Student/Class database as your context. Each missing entry is worth 1 mark.",
        markPoints: [
          "States that a primary key uniquely identifies each record in a table.",
          "States that a foreign key stores a key value that links to a record in another table.",
          "States that a field stores one attribute or data item.",
          "States that a record contains the related field values for one entity instance.",
        ],
        modelAnswer:
          "Primary key | Uniquely identifies each record in a table\nForeign key | Stores a key value that links to a record in another table\nField | Stores one attribute or data item\nRecord | Contains the related field values for one entity instance",
        examinerGuidance: [
          "Award each row independently.",
          "Accept suitable Student/Class examples in place of generic definitions.",
        ],
        misconceptions: [
          "Saying that a foreign key must be unique in every record.",
          "Confusing a field with a record.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const records = item.difficulty === "higher" ? 2400 : 1200;
      const bytesPerRecord = 250;
      const totalBytes = records * bytesPerRecord;

      return {
        question:
          `A database table contains ${records.toLocaleString("en-GB")} records. Each record uses 250 bytes of storage. Calculate the total storage used by the records in bytes.`,
        context:
          "Ignore indexes, metadata and other database overhead.",
        markPoints: [
          `Uses ${records.toLocaleString("en-GB")} × 250.`,
          `Calculates ${totalBytes.toLocaleString("en-GB")} bytes.`,
          "Shows a correct multiplication method.",
          "Uses bytes as the final unit.",
        ],
        modelAnswer:
          `${records.toLocaleString("en-GB")} × 250 = ${totalBytes.toLocaleString("en-GB")} bytes.`,
        examinerGuidance: [
          "Award method credit for a correct multiplication setup.",
          "Do not add storage for indexes or metadata because the question explicitly says to ignore them.",
        ],
        misconceptions: [
          "Dividing the number of records by the record size.",
          "Adding unstated database overhead.",
        ],
      };
    }
  }

  if (profile.id === "software-development") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "A program accepts an integer from 1 to 100 inclusive. Complete the four missing entries in the test-data table.\n\nTest value | Classification\n50 | ______\n1 | ______\n0 | ______\n101 | ______",
        context:
          "Use the classifications normal, boundary or invalid. Each missing entry is worth 1 mark.",
        markPoints: [
          "Classifies 50 as normal.",
          "Classifies 1 as boundary.",
          "Classifies 0 as invalid.",
          "Classifies 101 as invalid.",
        ],
        modelAnswer:
          "Test value | Classification\n50 | Normal\n1 | Boundary\n0 | Invalid\n101 | Invalid",
        examinerGuidance: [
          "Award each classification independently.",
          "Accept 'invalid boundary' for 0 or 101 where the course terminology permits it.",
        ],
        misconceptions: [
          "Treating 0 as valid because it is close to the lower boundary.",
          "Treating every valid value as boundary data.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      return {
        question:
          "A range check accepts integer values from 10 to 99 inclusive. Calculate how many different integer values pass the validation rule.",
        context:
          "Remember that both boundary values are included.",
        markPoints: [
          "Uses inclusive counting: 99 - 10 + 1.",
          "Calculates 90 valid integer values.",
          "Shows why 1 is added for inclusive boundaries.",
          "States the final count as 90 values.",
        ],
        modelAnswer:
          "99 - 10 + 1 = 90.\n\nThere are 90 integer values that pass the range check.",
        examinerGuidance: [
          "Award method credit for 99 - 10 + 1.",
          "Do not accept 89 because both 10 and 99 are valid inputs.",
        ],
        misconceptions: [
          "Forgetting that the boundary values are included.",
          "Counting only the difference between the two boundaries.",
        ],
      };
    }
  }

  if (profile.id === "ethical-legal-environmental") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing classifications.\n\nIssue | Classification\nCollecting personal data without a valid basis | ______\nReplacing working devices every year and creating e-waste | ______\nAn automated system unfairly disadvantaging one group | ______\nCopying copyrighted software without permission | ______",
        context:
          "Use ethical, legal or environmental. Some issues may raise more than one concern; give the most direct classification in this table.",
        markPoints: [
          "Classifies unlawful personal-data handling as legal.",
          "Classifies unnecessary electronic waste as environmental.",
          "Classifies unfair automated treatment as ethical.",
          "Classifies unauthorised copying of copyrighted software as legal.",
        ],
        modelAnswer:
          "Collecting personal data without a valid basis | Legal\nReplacing working devices every year and creating e-waste | Environmental\nAn automated system unfairly disadvantaging one group | Ethical\nCopying copyrighted software without permission | Legal",
        examinerGuidance: [
          "Award the stated direct classification for each row.",
          "Do not penalise recognition of an additional ethical concern if the required direct classification is also clearly given.",
        ],
        misconceptions: [
          "Assuming anything legal is automatically ethical.",
          "Ignoring indirect environmental effects such as electronic waste.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const computers = item.difficulty === "higher" ? 80 : 50;
      const powerKW = 0.2;
      const hours = 5;
      const energy = computers * powerKW * hours;

      return {
        question:
          `A computer room has ${computers} computers. Each computer uses an average of ${powerKW} kW while in use. They are used for ${hours} hours. Calculate the total electrical energy used in kWh.`,
        context:
          "Use energy (kWh) = power (kW) × time (hours).",
        markPoints: [
          `Calculates total power as ${computers} × ${powerKW} = ${computers * powerKW} kW.`,
          `Calculates ${computers * powerKW} × ${hours} = ${energy} kWh.`,
          "Uses the supplied energy formula correctly.",
          "Uses kWh as the final unit.",
        ],
        modelAnswer:
          `Total power = ${computers} × ${powerKW} = ${computers * powerKW} kW.\nEnergy = ${computers * powerKW} × ${hours} = ${energy} kWh.`,
        examinerGuidance: [
          "Award method credit where the total power is correct but a later arithmetic error occurs.",
          "Do not report the answer in kW; the question asks for energy in kWh.",
        ],
        misconceptions: [
          "Confusing power in kW with energy in kWh.",
          "Forgetting to multiply by the number of computers.",
        ],
      };
    }
  }

  if (profile.id === "ai-machine-learning") {
    if (item.commandWord === "complete" || item.questionType === "complete-table") {
      return {
        question:
          "Complete the four missing entries in the machine-learning workflow.\n\nStage | Purpose\nTraining data | ______\nTraining | ______\nPrediction | ______\nEvaluation | ______",
        context:
          "Give one precise purpose for each stage. Each missing entry is worth 1 mark.",
        markPoints: [
          "States that training data provides examples from which the model learns patterns.",
          "States that training adjusts or learns the model from the supplied examples.",
          "States that prediction applies the trained model to new data to produce an output.",
          "States that evaluation measures performance using suitable data or metrics.",
        ],
        modelAnswer:
          "Training data | Provides examples from which the model learns patterns\nTraining | Learns or adjusts the model from the supplied examples\nPrediction | Applies the trained model to new data to produce an output\nEvaluation | Measures model performance using suitable data or metrics",
        examinerGuidance: [
          "Award each row independently.",
          "Accept equivalent machine-learning terminology where the stage purpose remains accurate.",
        ],
        misconceptions: [
          "Assuming training data and unseen evaluation data always have the same role.",
          "Treating a model prediction as a guaranteed fact.",
        ],
      };
    }

    if (
      item.commandWord === "calculate" ||
      item.questionType === "calculation" ||
      item.questionType === "worked-calculation"
    ) {
      const totalPredictions = 100;
      const correctPredictions = item.difficulty === "higher" ? 87 : 82;
      const accuracy = (correctPredictions / totalPredictions) * 100;

      return {
        question:
          `A machine-learning classifier makes ${totalPredictions} predictions and ${correctPredictions} are correct. Calculate its accuracy as a percentage.`,
        context:
          "Use accuracy = correct predictions ÷ total predictions × 100.",
        markPoints: [
          `Substitutes ${correctPredictions} ÷ ${totalPredictions} × 100.`,
          `Calculates an accuracy of ${accuracy}%.`,
          "Uses the supplied accuracy formula correctly.",
          "Uses % as the final unit.",
        ],
        modelAnswer:
          `Accuracy = ${correctPredictions} ÷ ${totalPredictions} × 100 = ${accuracy}%.`,
        examinerGuidance: [
          "Award method credit for correct substitution into the formula.",
          "Accuracy alone does not prove that a model is fair; that is not part of this calculation mark.",
        ],
        misconceptions: [
          "Dividing total predictions by correct predictions.",
          "Assuming a high accuracy percentage guarantees fairness.",
        ],
      };
    }
  }

  if (item.questionType === "multiple-choice") {
    const options = ["A", "B", "C", "D"].map(
      (letter, index) => `${letter}. ${core.mcq[index]}`,
    );

    return {
      question: `Which statement about ${profile.displayName} is correct?\n\n${options.join("\n")}`,
      context: "Select one answer.",
      markPoints: [
        `Award 1 mark for option ${core.mcqCorrect}: ${core.mcq[["A", "B", "C", "D"].indexOf(core.mcqCorrect)]}`,
      ],
      modelAnswer: core.mcqCorrect,
      examinerGuidance: [
        `Award the mark only for option ${core.mcqCorrect}.`,
        "Do not award multiple selections unless the final answer is clearly indicated.",
      ],
      misconceptions: profile.misconceptions.slice(0, 2),
    };
  }

  if (item.questionType === "compare") {
    return {
      question: core.compareQuestion,
      context: core.compareContext,
      markPoints: core.comparePoints,
      modelAnswer: core.compareAnswer,
      examinerGuidance: [
        "Award marks only for technically accurate comparisons that address both sides of the question.",
        "Do not award the same comparison point more than once when it is merely reworded.",
      ],
      misconceptions: profile.misconceptions.slice(0, 2),
    };
  }

  if (
    item.questionType === "extended-response" ||
    item.questionType === "discuss" ||
    item.questionType === "evaluate" ||
    item.questionType === "scenario-application"
  ) {
    return {
      question: core.scenarioQuestion,
      context: core.scenarioContext,
      markPoints: core.scenarioPoints,
      modelAnswer: core.scenarioAnswer,
      examinerGuidance: [
        "Higher-level responses must apply technical reasoning directly to the scenario and reach a supported judgement.",
        "Do not award the highest level to a one-sided list of advantages or disadvantages with no developed application.",
      ],
      misconceptions: profile.misconceptions.slice(0, 2),
    };
  }

  return {
    question: core.shortQuestion,
    context: core.shortContext,
    markPoints: core.shortPoints,
    modelAnswer: core.shortAnswer,
    examinerGuidance: [
      "Award marks only for distinct, technically accurate points that answer the stated question.",
      "Accept equivalent terminology where the Computer Science meaning remains precise.",
    ],
    misconceptions: profile.misconceptions.slice(0, 2),
  };
}

function createProfileAwareDemoFallback(
  item: AssessmentBlueprintItem,
): DemoQuestionContent {
  const profile = resolveTopicProfile(item.topicFocus);

  if (item.questionType === "multiple-choice") {
    const misconceptionOne =
      profile.misconceptions[0] ||
      `misunderstanding ${profile.displayName}`;

    return {
      question: `Which statement about ${profile.displayName} is correct?\n\nA. ${profile.definition}\nB. It is correct to assume that ${misconceptionOne}.\nC. It has no effect on how a computer system stores, processes or communicates data.\nD. It removes the need for software, hardware or algorithms.`,
      context: "Select one answer.",
      markPoints: [
        `Award 1 mark for option A: ${profile.definition}`,
      ],
      modelAnswer: "A",
      examinerGuidance: [
        "Award the mark only for option A.",
        "Do not award multiple selections unless A is clearly identified as the final answer.",
      ],
      misconceptions: profile.misconceptions.slice(0, 2),
    };
  }

  if (
    item.questionType === "extended-response" ||
    item.questionType === "discuss" ||
    item.questionType === "evaluate" ||
    item.questionType === "scenario-application"
  ) {
    return {
      question: `A school is making a computing decision involving ${profile.displayName}. Evaluate the most important benefits and limitations and recommend an appropriate approach.`,
      context:
        "Apply technical knowledge to the scenario rather than listing generic advantages and disadvantages.",
      markPoints: [
        `Demonstrates accurate knowledge of ${profile.displayName}.`,
        `Explains the benefit that it ${profile.benefits[0]}.`,
        `Explains another relevant benefit: ${profile.benefits[1]}.`,
        `Explains the limitation that ${profile.limitations[0]}.`,
        `Explains another relevant limitation: ${profile.limitations[1]}.`,
        "Applies the discussion to the school scenario.",
        `Uses relevant terminology such as ${profile.keywords.slice(0, 3).join(", ")}.`,
        "Considers a suitable safeguard or alternative.",
        "Makes a judgement based on the evidence.",
        "Provides a justified recommendation.",
        "Maintains balance.",
        "Shows sustained reasoning.",
      ],
      modelAnswer: specificExtendedAnswer(
        item.topicFocus,
        "the school's computing decision",
      ),
      examinerGuidance: [
        "Highest-level responses must apply technical points to the stated decision rather than list memorised advantages and disadvantages.",
        "A conclusion must follow from the technical reasoning presented.",
      ],
      misconceptions: profile.misconceptions.slice(0, 2),
    };
  }

  return {
    question:
      item.marks === 1
        ? `State one accurate fact about ${profile.displayName}.`
        : `Explain how ${profile.displayName} works and why it is important in a computer system.`,
    context:
      "Use precise Computer Science terminology and include a relevant example where appropriate.",
    markPoints: [
      `States an accurate principle: ${profile.definition}`,
      `Explains: ${profile.explanation}`,
      `Uses the example: ${profile.examples[0]}.`,
      `Uses relevant terminology such as ${profile.keywords.slice(0, 3).join(", ")}.`,
      `Explains a relevant benefit: ${profile.benefits[0]}.`,
      `Recognises a relevant limitation: ${profile.limitations[0]}.`,
    ],
    modelAnswer:
      item.marks === 1
        ? profile.definition
        : `${profile.definition} ${profile.explanation}`,
    examinerGuidance: [
      "Award marks only for technically accurate, distinct points.",
      "Do not award repeated wording that does not add new Computer Science knowledge.",
    ],
    misconceptions: profile.misconceptions.slice(0, 2),
  };
}

function createConcreteDemoContent(
  item: AssessmentBlueprintItem,
  index: number,
  content: {
    question: string;
    context: string;
    markPoints: string[];
    modelAnswer: string;
    examinerGuidance: string[];
    misconceptions: string[];
  },
) {
  const topic = item.topicFocus.trim();

  const lowerTopic = topic.toLowerCase();

  const variant = index + 1;

  const dataRepresentationContent =
    createDataRepresentationDemoContent(item, index);

  if (dataRepresentationContent) {
    return dataRepresentationContent;
  }

  const coreCurriculumContent = createCoreCurriculumDemoContent(item);

  const resolvedProfile = resolveTopicProfile(item.topicFocus);
  const coreProfilesWithConcreteTaskTypes = new Set([
    "cpu-architecture",
    "memory-storage",
    "networks",
    "cybersecurity",
    "algorithms",
    "programming",
    "databases",
    "software-development",
    "ethical-legal-environmental",
    "ai-machine-learning",
  ]);

  if (
    coreCurriculumContent &&
    (
      coreProfilesWithConcreteTaskTypes.has(resolvedProfile.id) ||
      ![
        "conversion",
        "calculation",
        "worked-calculation",
        "truth-table",
        "trace-table",
        "code-tracing",
        "code-completion",
        "debugging",
        "algorithm-design",
      ].includes(item.questionType)
    )
  ) {
    return coreCurriculumContent;
  }

  if (item.questionType === "definition") {
    return {
      ...content,
      question: `Define the term ${topic}.`,
      context: "Use precise Computer Science terminology.",
      markPoints: [
        `States that ${definitionForTopic(topic).split(".")[0]}.`,
        "Adds an accurate technical characteristic, purpose or example that distinguishes the concept.",
      ],
      modelAnswer: definitionForTopic(topic),
    };
  }

  if (item.questionType === "conversion" && lowerTopic.includes("binary")) {
    const denaryValue = 18 + variant * 7;

    const binaryValue = denaryValue.toString(2).padStart(8, "0");

    return {
      ...content,
      question: `Convert the denary value ${denaryValue} into 8-bit binary. Show your working.`,
      context: "Use the place values 128, 64, 32, 16, 8, 4, 2 and 1.",
      markPoints: [
        "Uses the correct binary place values.",
        `Selects place values that total ${denaryValue}.`,
        `Gives the correct 8-bit answer ${binaryValue}.`,
        "Shows clear and consistent working.",
      ],
      modelAnswer: `${denaryValue} = ${[128, 64, 32, 16, 8, 4, 2, 1]
        .filter((placeValue) => (denaryValue & placeValue) !== 0)
        .join(" + ")}.\n\nTherefore, ${denaryValue}₁₀ = ${binaryValue}₂.`,
    };
  }

  if (
    (item.questionType === "calculation" ||
      item.questionType === "worked-calculation") &&
    lowerTopic.includes("binary")
  ) {
    const firstValue = 20 + variant * 3;

    const secondValue = 7 + variant * 2;

    const result = firstValue + secondValue;

    const firstBinary = firstValue.toString(2).padStart(8, "0");

    const secondBinary = secondValue.toString(2).padStart(8, "0");

    const resultBinary = result.toString(2).padStart(8, "0");

    return {
      ...content,
      question: `Complete the 8-bit binary addition ${firstBinary} + ${secondBinary}. Show all carries and state whether overflow occurs.`,
      context: "Assume an unsigned 8-bit register.",
      markPoints: [
        "Applies the binary addition rules correctly.",
        "Shows the carries in the correct columns.",
        `Obtains the result ${resultBinary}.`,
        "States that no overflow occurs because the result is within the unsigned 8-bit range 0–255.",
        "Shows clear working.",
        `Confirms that the denary check is ${firstValue} + ${secondValue} = ${result}.`,
      ],
      modelAnswer: `  ${firstBinary}\n+ ${secondBinary}\n= ${resultBinary}\n\nChecking in denary: ${firstValue} + ${secondValue} = ${result}.\n\nNo overflow occurs because ${result} can be represented within 8 unsigned bits.`,
    };
  }

  if (item.questionType === "truth-table") {
    return {
      ...content,
      question:
        "Complete the truth table for the Boolean expression A AND (NOT B).",
      context: "Use 0 for false and 1 for true.",
      markPoints: [
        "For A = 0, B = 0, gives output 0.",
        "For A = 0, B = 1, gives output 0.",
        "For A = 1, B = 0, gives output 1.",
        "For A = 1, B = 1, gives output 0.",
        "Uses consistent Boolean notation.",
      ],
      modelAnswer:
        "A | B | NOT B | A AND (NOT B)\n0 | 0 |   1   |       0\n0 | 1 |   0   |       0\n1 | 0 |   1   |       1\n1 | 1 |   0   |       0",
    };
  }

  if (
    item.questionType === "trace-table" ||
    item.questionType === "code-tracing"
  ) {
    return {
      ...content,
      question:
        "Trace the algorithm and record the values of total and count after each loop iteration.\n\nSET total TO 0\nFOR count FROM 1 TO 4\n    SET total TO total + count\nNEXT count\nOUTPUT total",
      context: "Complete one row for each iteration.",
      markPoints: [
        "After count = 1, records total = 1.",
        "After count = 2, records total = 3.",
        "After count = 3, records total = 6.",
        "After count = 4, records total = 10.",
        "States the final output as 10.",
        "Uses the correct order of updates.",
      ],
      modelAnswer:
        "count | total\n1     | 1\n2     | 3\n3     | 6\n4     | 10\n\nFinal output: 10",
    };
  }

  if (item.questionType === "code-completion") {
    return {
      ...content,
      question:
        "Complete the missing Python line so that the program counts how many values in scores are at least 50.\n\ncount = 0\nfor score in scores:\n    __________\n        count = count + 1\nprint(count)",
      context: "Use a suitable selection statement.",
      markPoints: [
        "Uses an if statement.",
        "Tests whether score is greater than or equal to 50.",
        "Includes the colon.",
        "Uses the loop variable score.",
      ],
      modelAnswer:
        "if score >= 50:\n\nThis condition checks each score and increments count only when the value is at least 50.",
    };
  }

  if (item.questionType === "debugging") {
    return {
      ...content,
      question:
        "The following Python code should output the largest value in numbers, but it contains two errors. Identify and correct both errors.\n\nlargest = 0\nfor number in numbers:\n    if number < largest:\n        largest == number\nprint(largest)",
      context: "Assume numbers contains at least one positive integer.",
      markPoints: [
        "Changes < to > in the selection condition.",
        "Changes == to = in the assignment statement.",
        "Explains that > identifies a new larger value.",
        "Explains that = stores the new value in largest.",
      ],
      modelAnswer:
        "largest = 0\nfor number in numbers:\n    if number > largest:\n        largest = number\nprint(largest)\n\nThe comparison must check whether number is greater than the current largest value. A single equals sign is then used to assign that value to largest.",
    };
  }

  if (item.questionType === "algorithm-design") {
    return {
      ...content,
      question: `Design an algorithm that repeatedly asks the user for a positive integer and then outputs its 8-bit binary representation. The input must be validated so that only values from 0 to 255 are accepted.`,
      context: `The algorithm should use input, validation, processing and output. Topic focus: ${topic}.`,
      markPoints: [
        "Inputs an integer from the user.",
        "Checks that the value is at least 0.",
        "Checks that the value is no more than 255.",
        "Repeats input while the value is invalid.",
        "Converts the accepted value into binary.",
        "Pads the result to 8 bits.",
        "Outputs the binary result.",
        "Uses clear and logically ordered pseudocode.",
      ],
      modelAnswer:
        'INPUT value\nWHILE value < 0 OR value > 255\n    OUTPUT "Enter a value from 0 to 255"\n    INPUT value\nENDWHILE\nSET binary TO CONVERT_TO_BINARY(value)\nSET binary TO PAD_LEFT_WITH_ZEROES(binary, 8)\nOUTPUT binary',
    };
  }

  if (item.questionType === "compare") {
    return {
      ...content,
      question: `Compare binary and hexadecimal as ways of representing data in a computer system.`,
      context:
        "Include at least one similarity, one difference and a justified use for each representation.",
      markPoints: [
        "States that both represent numerical values.",
        "States that binary uses base 2 and hexadecimal uses base 16.",
        "Explains that one hexadecimal digit represents four binary bits.",
        "Explains that hexadecimal is shorter and easier for humans to read.",
        "Explains that hardware ultimately stores and processes binary.",
        "Reaches a justified conclusion about when each is useful.",
      ],
      modelAnswer:
        "Binary and hexadecimal both represent numerical data. Binary uses only 0 and 1, whereas hexadecimal uses sixteen symbols, 0–9 and A–F. One hexadecimal digit represents four binary bits, so hexadecimal is more compact and easier for people to read when working with values such as memory addresses or colour codes. However, computer hardware stores and processes the underlying data in binary. Therefore, binary is appropriate for machine-level representation, while hexadecimal is useful as a human-readable shorthand.",
    };
  }

  if (
    item.questionType === "extended-response" ||
    item.questionType === "discuss" ||
    item.questionType === "evaluate"
  ) {
    return {
      ...content,
      question: `Evaluate the benefits and limitations of using ${topic} in a school computing system. Reach a justified conclusion.`,
      context: `A secondary school is considering whether to rely more heavily on ${topic}. It must consider performance, cost, security, reliability and the needs of users.`,
      markPoints: [
        `Demonstrates accurate knowledge of ${topic}.`,
        `Explains a specific benefit of using ${topic}.`,
        "Develops the benefit using the school scenario.",
        `Explains a specific limitation or risk of ${topic}.`,
        "Develops the limitation using the school scenario.",
        "Considers an alternative approach or safeguard.",
        "Uses accurate Computer Science terminology.",
        "Maintains a clear and logical line of reasoning.",
        "Makes a judgement based on the evidence.",
        "Provides a justified conclusion linked to the school.",
        "Maintains balance across benefits and limitations.",
        "Shows sustained analysis or evaluation.",
      ],
      modelAnswer: `${topic} could benefit the school by improving the way it processes information and supports users. When applied correctly, it may increase efficiency, consistency and access to computing services. For example, automated processing can reduce repetitive manual work and allow staff or students to receive results more quickly.\n\nHowever, the school must also consider limitations. Implementing ${topic} may require new hardware, software, training or maintenance. Poor configuration could create security, reliability or usability problems. The school should therefore use appropriate access controls, testing, backups and staff training rather than assuming that the technology will work safely without management.\n\nAn alternative is to introduce ${topic} gradually and retain a suitable manual or existing process while it is evaluated. This reduces risk and allows problems to be corrected before wider deployment.\n\nOverall, the school should use ${topic} when the educational and operational benefits clearly outweigh the costs and risks. A controlled implementation with security measures, testing and regular review is more appropriate than immediate unrestricted adoption.`,
    };
  }

  if (item.questionType === "scenario-application") {
    return {
      ...content,
      question: `A school needs to apply ${topic} to improve one of its computing processes. Recommend a suitable solution and explain one benefit and one limitation.`,
      context: "The school has a limited budget and must protect student data.",
      markPoints: [
        `Selects an appropriate use of ${topic}.`,
        "Links the solution to the school's requirement.",
        "Explains a relevant benefit.",
        "Explains a relevant limitation or risk.",
        "Addresses cost or data protection.",
        "Reaches a justified recommendation.",
      ],
      modelAnswer: specificExtendedAnswer(topic, "the school's stated process"),
    };
  }

  if (item.questionType === "multiple-choice") {
    return content;
  }

  return createProfileAwareDemoFallback(item);
}

function createDemoQuestion(
  item: AssessmentBlueprintItem,
  index: number,
): GeneratedExamQuestion {
  const templateContent = demoContentForType(item, index);

  const content = createConcreteDemoContent(item, index, templateContent);

  return {
    id: `${item.id}-generated`,
    questionNumber: item.questionNumber,
    topic: item.topicFocus,
    questionType: item.questionType,
    commandWord: item.commandWord,
    question: content.question,
    context: content.context,
    marks: item.marks,
    difficulty: item.difficulty,
    assessmentObjective: item.assessmentObjective,
    markScheme: createSpecificMarkScheme(item, content.markPoints),
    levelDescriptors: createLevelDescriptors(item.marks),
    modelAnswer: content.modelAnswer,
    examinerGuidance: content.examinerGuidance,
    commonMisconceptions: content.misconceptions,
  };
}

function createDemoQuestionSet(request: RequestBody): GeneratedExamQuestionSet {
  const questionSetId = `${slugify(request.topic)}-${Date.now()}`;

  const totalMarks = request.blueprint.reduce(
    (sum, item) => sum + item.marks,
    0,
  );

  return {
    id: questionSetId,
    title: `${request.examBoard}-style ${request.qualification} practice: ${request.topic}`,
    description:
      "Original exam-style practice generated from a teacher-controlled assessment blueprint.",
    qualification: request.qualification,
    examBoard: request.examBoard,
    topic: request.topic.trim(),
    difficulty: request.difficulty,
    generationMode: request.generationMode,
    questionCount: request.blueprint.length,
    totalMarks,
    estimatedTime: `${Math.max(10, Math.ceil(totalMarks * 1.2))} minutes`,
    copyrightNotice:
      "Independently generated practice material. It is not an official past-paper question and is not produced, endorsed or approved by any examination board.",
    blueprint: request.blueprint,
    questions: request.blueprint.map(createDemoQuestion),
    createdAt: new Date().toISOString(),
  };
}

function normaliseMarkScheme(
  item: AssessmentBlueprintItem,
  markScheme: Array<{
    description: string;
    marks: number;
  }>,
): ExamQuestionMarkPoint[] {
  const cleaned = markScheme
    .filter(
      (point) =>
        point.description.trim().length > 0 &&
        Number.isInteger(point.marks) &&
        point.marks >= 1,
    )
    .map((point, index) => ({
      id: `${item.id}-mark-${index + 1}`,
      description: point.description.trim(),
      marks: point.marks,
    }));

  if (cleaned.length === 0) {
    return createSpecificMarkScheme(item, [
      `Credit an accurate, relevant point about ${item.topicFocus}.`,
    ]);
  }

  const currentTotal = cleaned.reduce((sum, point) => sum + point.marks, 0);

  if (currentTotal === item.marks) {
    return cleaned;
  }

  return createSpecificMarkScheme(
    item,
    cleaned.map((point) => point.description),
  );
}

function normaliseLevels(
  item: AssessmentBlueprintItem,
  levels: Array<{
    level: number;
    markRange: string;
    description: string;
  }>,
): ExamQuestionLevelDescriptor[] {
  if (item.marks < 6) {
    return [];
  }

  const cleaned = levels
    .filter(
      (level) =>
        Number.isInteger(level.level) &&
        level.level >= 1 &&
        level.markRange.trim().length > 0 &&
        level.description.trim().length > 0,
    )
    .map((level) => ({
      level: level.level,
      markRange: level.markRange.trim(),
      description: level.description.trim(),
    }));

  return cleaned.length > 0 ? cleaned : createLevelDescriptors(item.marks);
}


const LOW_QUALITY_QUESTION_PATTERNS: RegExp[] = [
  /\bconnected to\b/i,
  /\bcalculation involving\b/i,
  /\bteacher (?:may|should) edit\b/i,
  /\bteacher should insert\b/i,
  /\buse two original values suitable\b/i,
  /\bfinal published version should contain\b/i,
  /\bapply your knowledge of .+ to the original scenario provided\b/i,
  /\bis a computer science concept that\b/i,
  /\bshould be defined using (?:its|the) purpose\b/i,
  /\bshould be explained by identifying what it does\b/i,
  /\ba practical computing use of\b/i,
  /\ba relevant (?:advantage|benefit|limitation) of .+ in the stated context\b/i,
];

function hasLowQualityQuestionWording(value: string): boolean {
  const cleaned = value.trim();

  if (cleaned.length < 12) {
    return true;
  }

  return LOW_QUALITY_QUESTION_PATTERNS.some((pattern) =>
    pattern.test(cleaned),
  );
}

function questionMatchesBlueprintTask(
  item: AssessmentBlueprintItem,
  generated: ParsedQuestion,
): boolean {
  const combined = `${generated.question} ${generated.context}`.toLowerCase();

  if (
    item.commandWord === "calculate" ||
    item.questionType === "calculation" ||
    item.questionType === "worked-calculation"
  ) {
    return (
      /\bcalculate\b|\bworking\b|\bformula\b|\btotal\b|\bpercentage\b/.test(combined) &&
      /\d/.test(combined)
    );
  }

  if (
    item.commandWord === "complete" ||
    item.questionType === "complete-table" ||
    item.questionType === "truth-table"
  ) {
    return /\bcomplete\b|\bmissing\b|____|\bgap\b|\btable\b/.test(combined);
  }

  if (item.commandWord === "evaluate" || item.questionType === "evaluate") {
    return /\bevaluate\b|\bjudge\b|\brecommend\b|\bconclusion\b/.test(combined);
  }

  if (item.commandWord === "compare" || item.questionType === "compare") {
    return /\bcompare\b|\bsimilar|\bdiffer|\bwhereas\b/.test(combined);
  }

  return true;
}

function isGeneratedQuestionUsable(
  item: AssessmentBlueprintItem,
  generated: ParsedQuestion,
): boolean {
  if (
    hasLowQualityQuestionWording(generated.question) ||
    hasLowQualityQuestionWording(generated.context) ||
    !questionMatchesBlueprintTask(item, generated)
  ) {
    return false;
  }

  if (
    !generated.modelAnswer.trim() ||
    generated.modelAnswer.trim().length < 8
  ) {
    return false;
  }

  const markTotal = generated.markScheme.reduce(
    (sum, point) =>
      sum +
      (Number.isInteger(point.marks) && point.marks > 0
        ? point.marks
        : 0),
    0,
  );

  if (markTotal !== item.marks) {
    return false;
  }

  if (
    item.marks >= 6 &&
    generated.levelDescriptors.length === 0
  ) {
    return false;
  }

  if (
    item.marks < 6 &&
    generated.levelDescriptors.length > 0
  ) {
    return false;
  }

  return true;
}

function createTopicKnowledgePrompt(topic: string): string {
  const profile = resolveTopicProfile(topic);

  return [
    `Curriculum knowledge for ${topic}:`,
    `Precise focus: ${profile.displayName}.`,
    `Definition: ${profile.definition}`,
    `Core explanation: ${profile.explanation}`,
    `Concrete examples: ${profile.examples.join(" | ")}.`,
    `Benefits where relevant: ${profile.benefits.join(" | ")}.`,
    `Limitations where relevant: ${profile.limitations.join(" | ")}.`,
    `Common misconceptions to avoid or assess: ${profile.misconceptions.join(" | ")}.`,
    `Preferred technical vocabulary: ${profile.keywords.join(", ")}.`,
  ].join("\n");
}

function buildQuestionSet(
  request: RequestBody,
  parsed: {
    title: string;
    description: string;
    estimatedTime: string;
    questions: ParsedQuestion[];
  },
): GeneratedExamQuestionSet {
  const questionSetId = `${slugify(request.topic)}-${Date.now()}`;

  const questions = request.blueprint.map((item, index) => {
    const generated = parsed.questions[index];

    if (
      !generated ||
      !isGeneratedQuestionUsable(item, generated)
    ) {
      return createDemoQuestion(item, index);
    }

    return {
      id: `${questionSetId}-q-${index + 1}`,
      questionNumber: item.questionNumber,
      topic: item.topicFocus,
      questionType: item.questionType,
      commandWord: item.commandWord,
      question: generated.question.trim(),
      context: generated.context.trim(),
      marks: item.marks,
      difficulty: item.difficulty,
      assessmentObjective: item.assessmentObjective,
      markScheme: normaliseMarkScheme(item, generated.markScheme),
      levelDescriptors: normaliseLevels(item, generated.levelDescriptors),
      modelAnswer: generated.modelAnswer.trim(),
      examinerGuidance: generated.examinerGuidance,
      commonMisconceptions: generated.commonMisconceptions,
    } satisfies GeneratedExamQuestion;
  });

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0,
  );

  return {
    id: questionSetId,
    title: parsed.title.trim(),
    description: parsed.description.trim(),
    qualification: request.qualification,
    examBoard: request.examBoard,
    topic: request.topic.trim(),
    difficulty: request.difficulty,
    generationMode: request.generationMode,
    questionCount: questions.length,
    totalMarks,
    estimatedTime:
      parsed.estimatedTime.trim() ||
      `${Math.max(10, Math.ceil(totalMarks * 1.2))} minutes`,
    copyrightNotice:
      "Independently generated practice material. It is not an official past-paper question and is not produced, endorsed or approved by any examination board.",
    blueprint: request.blueprint,
    questions,
    createdAt: new Date().toISOString(),
  };
}

function createBlueprintPrompt(blueprint: AssessmentBlueprintItem[]): string {
  return blueprint
    .map((item) =>
      [
        `Question ${item.questionNumber}`,
        `Topic focus: ${item.topicFocus}`,
        `Assessment objective: ${item.assessmentObjective}`,
        `Question type: ${item.questionType}`,
        `Command word: ${item.commandWord}`,
        `Marks: ${item.marks}`,
        `Difficulty: ${item.difficulty}`,
      ].join("\n"),
    )
    .join("\n\n");
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isValidRequest(body)) {
      return NextResponse.json(
        {
          error: "Invalid assessment blueprint request.",
          errorCode: "invalid_request",
        },
        {
          status: 400,
        },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (body.useDemo || !apiKey) {
      return NextResponse.json({
        questionSet: createDemoQuestionSet(body),
        source: "demo",
        warning: !apiKey
          ? "Live AI is not configured, so a curriculum-aware offline paper was generated from the blueprint."
          : undefined,
      });
    }

    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.responses.create({
      model: process.env.OPENAI_EXAM_QUESTION_MODEL || "gpt-5.6",

      instructions: [
        "You are an expert UK Computer Science assessment writer.",
        "Create fully original exam-style practice material.",
        "Do not reproduce, closely paraphrase, or transform any identifiable past-paper question, mark scheme or examiner report.",
        "Do not claim that the material is official or endorsed by an examination board.",
        "Use British English and accurate Computer Science terminology.",
        "Follow every blueprint row exactly.",
        "Each question must be meaningfully different from every other question.",
        "The question type, command word, assessment objective, marks, difficulty and topic focus are fixed by the blueprint.",
        "Create a new context, wording, values, code, data or scenario for every question.",
        "Every mark scheme must be specific to its own question and must identify the actual knowledge, working, output, reasoning or judgement being rewarded.",
        "Do not use generic repeated marking points such as 'award one mark for a relevant point' unless the point itself is explicitly named.",
        "The sum of markScheme marks for each question must equal that question's blueprint mark value.",
        "Every model answer must actually answer its question in full. Never write advice such as 'a strong answer should'.",
        "Every examiner-guidance item must explain a question-specific marking decision, acceptable alternative or maximum-mark restriction.",
        "Every misconception must be specific to the content and process assessed in that question.",
        "Questions worth 6 to 12 marks must include level descriptors with clear mark ranges, quality criteria and expectations for reasoning, application, balance and conclusion where appropriate.",
        "Questions worth fewer than 6 marks must return an empty levelDescriptors array.",
        "Multiple-choice questions must contain four plausible options and exactly one correct answer, identified in the model answer and mark scheme.",
        "Calculation, conversion, table, trace, code and algorithm questions must include all values, code or data needed to answer them.",
        "Never create placeholder wording such as 'connected to [topic]', 'a calculation involving [topic]', 'teacher may edit', 'teacher should insert', or instructions asking the teacher to supply missing values later.",
        "A generated question must be ready for a teacher to publish without rewriting its technical content.",
        "Use the supplied curriculum knowledge to make the question test the actual Computer Science concept, not merely repeat the topic name.",
        "For image representation, test pixels, resolution, colour depth, file-size calculations and suitable compression choices where appropriate.",
        "For sound representation, test sampling, sample rate, bit depth, file-size calculations and quality/file-size trade-offs where appropriate.",
        "For character representation, test character sets, numeric codes, ASCII and Unicode where appropriate.",
        "For compression, distinguish lossy and lossless methods and select them according to data-loss requirements.",
        "Return only JSON matching the supplied schema.",
      ].join(" "),

      input: [
        `Main topic: ${body.topic}.`,
        `Qualification: ${body.qualification}.`,
        `Exam-board alignment: ${body.examBoard}-style.`,
        `Default difficulty: ${body.difficulty}.`,
        `Blueprint mode: ${body.generationMode}.`,
        "",
        "Curriculum knowledge:",
        createTopicKnowledgePrompt(body.topic),
        "",
        "Teacher-approved blueprint:",
        createBlueprintPrompt(body.blueprint),
        "",
        "Blueprint-row curriculum notes:",
        body.blueprint
          .map((item) => createTopicKnowledgePrompt(item.topicFocus))
          .join("\n\n"),
      ].join("\n"),

      text: {
        format: {
          type: "json_schema",
          name: "blueprinted_exam_question_set",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: {
                type: "string",
              },
              description: {
                type: "string",
              },
              estimatedTime: {
                type: "string",
              },
              questions: {
                type: "array",
                minItems: body.blueprint.length,
                maxItems: body.blueprint.length,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    question: {
                      type: "string",
                    },
                    context: {
                      type: "string",
                    },
                    markScheme: {
                      type: "array",
                      minItems: 1,
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          description: {
                            type: "string",
                          },
                          marks: {
                            type: "integer",
                            minimum: 1,
                            maximum: 12,
                          },
                        },
                        required: ["description", "marks"],
                      },
                    },
                    levelDescriptors: {
                      type: "array",
                      items: {
                        type: "object",
                        additionalProperties: false,
                        properties: {
                          level: {
                            type: "integer",
                            minimum: 1,
                            maximum: 4,
                          },
                          markRange: {
                            type: "string",
                          },
                          description: {
                            type: "string",
                          },
                        },
                        required: ["level", "markRange", "description"],
                      },
                    },
                    modelAnswer: {
                      type: "string",
                    },
                    examinerGuidance: {
                      type: "array",
                      minItems: 2,
                      items: {
                        type: "string",
                      },
                    },
                    commonMisconceptions: {
                      type: "array",
                      minItems: 2,
                      items: {
                        type: "string",
                      },
                    },
                  },
                  required: [
                    "question",
                    "context",
                    "markScheme",
                    "levelDescriptors",
                    "modelAnswer",
                    "examinerGuidance",
                    "commonMisconceptions",
                  ],
                },
              },
            },
            required: ["title", "description", "estimatedTime", "questions"],
          },
        },
      },
    });

    if (!response.output_text) {
      return NextResponse.json({
        questionSet: createDemoQuestionSet(body),
        source: "demo",
        warning:
          "The live assistant returned no content, so a curriculum-aware offline paper was generated from the blueprint.",
      });
    }

    const parsed = JSON.parse(response.output_text) as {
      title: string;
      description: string;
      estimatedTime: string;
      questions: ParsedQuestion[];
    };

    return NextResponse.json({
      questionSet: buildQuestionSet(body, parsed),
      source: "ai",
    });
  } catch (error) {
    console.error("Blueprinted exam-question generation error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The exam-style paper could not be generated.",
        errorCode: "generation_failed",
      },
      {
        status: 500,
      },
    );
  }
}
