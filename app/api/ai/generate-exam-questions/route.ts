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
      /\bnetwork\b/i,
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
      /\bcyber\b/i,
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
      /\balgorithm\b/i,
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
      /\bdatabase\b/i,
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

function resolveTopicProfile(topic: string): TopicProfile {
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

function isGeneratedQuestionUsable(
  item: AssessmentBlueprintItem,
  generated: ParsedQuestion,
): boolean {
  if (
    hasLowQualityQuestionWording(generated.question) ||
    hasLowQualityQuestionWording(generated.context)
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
