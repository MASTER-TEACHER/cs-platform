import type { ExamBoard, Qualification } from "@/types/user";

export type CurriculumUnitDefinition = {
  id: string;
  title: string;
  description: string;
  topicIds: string[];
};

export type CurriculumDefinition = {
  qualification: Qualification;
  examBoard: ExamBoard;
  title: string;
  specificationLabel: string;
  units: CurriculumUnitDefinition[];
};

export const curriculumDefinitions: CurriculumDefinition[] = [
  {
    qualification: "GCSE",
    examBoard: "AQA",
    title: "AQA GCSE Computer Science",
    specificationLabel: "AQA GCSE Computer Science",
    units: [
      {
        id: "aqa-algorithms",
        title: "Fundamentals of Algorithms",
        description:
          "Develop computational thinking, decomposition, abstraction, algorithm design, searching, sorting and trace-table skills.",
        topicIds: ["algorithms"],
      },
      {
        id: "aqa-programming",
        title: "Programming",
        description:
          "Use variables, data types, sequence, selection, iteration, functions, procedures, arrays, validation and robust programming techniques.",
        topicIds: ["programming"],
      },
      {
        id: "aqa-data-representation",
        title: "Fundamentals of Data Representation",
        description:
          "Represent numbers, text, images and sound digitally, and understand compression techniques.",
        topicIds: [
          "binary",
          "hexadecimal",
          "characters",
          "images",
          "sound",
          "compression",
        ],
      },
      {
        id: "aqa-computer-systems",
        title: "Computer Systems",
        description:
          "Understand computer architecture, processors, memory, storage, operating systems, utility software and Boolean logic.",
        topicIds: [
          "cpu",
          "memory-storage",
          "systems-software",
          "boolean-logic",
        ],
      },
      {
        id: "aqa-networks",
        title: "Computer Networks",
        description:
          "Study network types, topologies, hardware, protocols, addressing, cloud computing and the internet.",
        topicIds: ["networks"],
      },
      {
        id: "aqa-cyber-security",
        title: "Cyber Security",
        description:
          "Understand threats, vulnerabilities, social engineering, malware, authentication and defensive security measures.",
        topicIds: ["cyber-security"],
      },
      {
        id: "aqa-databases",
        title: "Relational Databases and SQL",
        description:
          "Understand tables, records, fields, keys, relationships, validation and SQL queries.",
        topicIds: ["databases"],
      },
      {
        id: "aqa-ethical-legal",
        title: "Ethical, Legal and Environmental Impacts",
        description:
          "Explore privacy, legislation, copyright, software licensing, environmental impact and ethical issues created by digital technology.",
        topicIds: ["ethical-legal"],
      },
    ],
  },

  {
    qualification: "GCSE",
    examBoard: "OCR",
    title: "OCR GCSE Computer Science",
    specificationLabel: "OCR J277",
    units: [
      {
        id: "ocr-systems-architecture",
        title: "Systems Architecture",
        description:
          "Study processor components, the fetch-decode-execute cycle, embedded systems and processor performance.",
        topicIds: ["cpu"],
      },
      {
        id: "ocr-memory-storage",
        title: "Memory and Storage",
        description:
          "Understand primary memory, secondary storage, units, number systems, text, images, sound and compression.",
        topicIds: [
          "memory-storage",
          "binary",
          "hexadecimal",
          "characters",
          "images",
          "sound",
          "compression",
        ],
      },
      {
        id: "ocr-networks",
        title: "Computer Networks, Connections and Protocols",
        description:
          "Study network types, hardware, topologies, protocols, addressing, layers and network performance.",
        topicIds: ["networks"],
      },
      {
        id: "ocr-security",
        title: "Network Security",
        description:
          "Understand network threats, vulnerabilities and prevention methods.",
        topicIds: ["cyber-security"],
      },
      {
        id: "ocr-systems-software",
        title: "Systems Software",
        description:
          "Understand operating systems, utility software and their roles.",
        topicIds: ["systems-software"],
      },
      {
        id: "ocr-algorithms",
        title: "Algorithms",
        description:
          "Develop computational thinking, searching, sorting, flowcharts, pseudocode and trace-table skills.",
        topicIds: ["algorithms"],
      },
      {
        id: "ocr-programming",
        title: "Programming Fundamentals",
        description:
          "Use variables, data types, sequence, selection, iteration, arrays, functions, procedures and file handling.",
        topicIds: ["programming"],
      },
      {
        id: "ocr-boolean-logic",
        title: "Boolean Logic",
        description:
          "Use logic gates, truth tables and Boolean expressions.",
        topicIds: ["boolean-logic"],
      },
      {
        id: "ocr-languages-ides",
        title: "Programming Languages and IDEs",
        description:
          "Understand translators, language levels and integrated development environments.",
        topicIds: ["programming-languages"],
      },
      {
        id: "ocr-databases",
        title: "Databases",
        description:
          "Understand database concepts, relational structures and SQL.",
        topicIds: ["databases"],
      },
      {
        id: "ocr-ethical-legal",
        title: "Ethical, Legal, Cultural and Environmental Issues",
        description:
          "Understand ethical, legal, cultural, environmental and privacy issues together with relevant computer legislation and software licensing.",
        topicIds: ["ethical-legal"],
      },
    ],
  },

  {
    qualification: "GCSE",
    examBoard: "EDEXCEL",
    title: "Pearson Edexcel GCSE Computer Science",
    specificationLabel: "Pearson Edexcel GCSE Computer Science",
    units: [
      {
        id: "edexcel-computational-thinking",
        title: "Computational Thinking",
        description:
          "Apply decomposition, abstraction, algorithmic thinking, searching, sorting and problem-solving techniques.",
        topicIds: ["algorithms"],
      },
      {
        id: "edexcel-data",
        title: "Data",
        description:
          "Understand binary, hexadecimal, text, image and sound representation together with compression.",
        topicIds: [
          "binary",
          "hexadecimal",
          "characters",
          "images",
          "sound",
          "compression",
        ],
      },
      {
        id: "edexcel-hardware-software",
        title: "Computers, Hardware and Software",
        description:
          "Study processors, memory, storage, operating systems and utility software.",
        topicIds: [
          "cpu",
          "memory-storage",
          "systems-software",
          "boolean-logic",
        ],
      },
      {
        id: "edexcel-networks",
        title: "Computer Networks",
        description:
          "Understand network types, hardware, protocols, the internet and network security.",
        topicIds: ["networks", "cyber-security"],
      },
      {
        id: "edexcel-programming",
        title: "Programming",
        description:
          "Design, write, test and refine programs using appropriate programming constructs.",
        topicIds: ["programming"],
      },
      {
        id: "edexcel-databases",
        title: "Databases",
        description:
          "Understand relational databases, validation, keys, relationships and SQL.",
        topicIds: ["databases"],
      },
      {
        id: "edexcel-ethical-legal",
        title: "Issues and Impact of Digital Technology",
        description:
          "Explore privacy, legal responsibilities, intellectual property, software licensing, social impact and environmental issues associated with digital technology.",
        topicIds: ["ethical-legal"],
      },
    ],
  },

  {
    qualification: "A_LEVEL",
    examBoard: "AQA",
    title: "AQA A-level Computer Science",
    specificationLabel: "AQA 7517",
    units: [
      {
        id: "aqa-al-4-1",
        title: "4.1 Fundamentals of Programming",
        description:
          "Develop data types, program structures, subroutines, recursion, object orientation and robust programming techniques.",
        topicIds: ["advanced-programming"],
      },
      {
        id: "aqa-al-4-2",
        title: "4.2 Fundamentals of Data Structures",
        description:
          "Study queues, stacks, lists, graphs, trees, hash tables and abstract data types.",
        topicIds: ["data-structures"],
      },
      {
        id: "aqa-al-4-3",
        title: "4.3 Fundamentals of Algorithms",
        description:
          "Study graph traversal, searching, sorting, shortest paths, complexity and algorithmic efficiency.",
        topicIds: ["computational-thinking"],
      },
      {
        id: "aqa-al-4-4",
        title: "4.4 Theory of Computation",
        description:
          "Study finite-state machines, regular languages, Turing machines, computability and computational limits.",
        topicIds: ["theory-computation"],
      },
      {
        id: "aqa-al-4-5",
        title: "4.5 Fundamentals of Data Representation",
        description:
          "Study signed binary, floating point, precision, range, character representation and compression.",
        topicIds: ["advanced-data-representation"],
      },
      {
        id: "aqa-al-4-6",
        title: "4.6 Fundamentals of Computer Systems",
        description:
          "Study hardware, software, operating systems, translators, logic and system-level behaviour.",
        topicIds: ["advanced-systems"],
      },
      {
        id: "aqa-al-4-7",
        title: "4.7 Computer Organisation and Architecture",
        description:
          "Study processor components, registers, buses, instruction execution, pipelining and processor design.",
        topicIds: ["advanced-systems"],
      },
      {
        id: "aqa-al-4-8",
        title: "4.8 Consequences of Uses of Computing",
        description:
          "Evaluate legal, moral, ethical, cultural, privacy and environmental consequences of computing.",
        topicIds: ["legal-ethical-a-level"],
      },
      {
        id: "aqa-al-4-9",
        title: "4.9 Communication and Networking",
        description:
          "Study protocols, layered models, routing, addressing, internet technologies and network security.",
        topicIds: ["advanced-networks"],
      },
      {
        id: "aqa-al-4-10",
        title: "4.10 Fundamentals of Databases",
        description:
          "Study relational modelling, normalisation, SQL, transactions, indexing and integrity.",
        topicIds: ["advanced-databases"],
      },
      {
        id: "aqa-al-4-11",
        title: "4.11 Big Data",
        description:
          "Study large-scale data, distributed processing, data quality, bias, privacy and analytical challenges.",
        topicIds: ["big-data"],
      },
      {
        id: "aqa-al-4-12",
        title: "4.12 Functional Programming",
        description:
          "Study pure functions, immutability, higher-order functions, recursion and functional composition.",
        topicIds: ["functional-programming"],
      },
      {
        id: "aqa-al-4-13",
        title: "4.13 Systematic Approach to Problem Solving",
        description:
          "Apply analysis, design, decomposition, testing, evaluation and structured development practice.",
        topicIds: [
          "computational-thinking",
          "software-development",
        ],
      },
      {
        id: "aqa-al-4-14",
        title: "4.14 Non-exam Assessment: Computing Practical Project",
        description:
          "Apply a systematic approach to an independently developed computing project using analysis, design, implementation, testing and evaluation.",
        topicIds: ["software-development"],
      },
    ],
  },

  {
    qualification: "A_LEVEL",
    examBoard: "OCR",
    title: "OCR A-level Computer Science",
    specificationLabel: "OCR H446",
    units: [
      {
        id: "ocr-al-1-1",
        title: "1.1 Processors, Input, Output and Storage",
        description:
          "Study processor structure, the fetch-decode-execute cycle, processor types, performance, input/output and storage technologies.",
        topicIds: ["advanced-systems"],
      },
      {
        id: "ocr-al-1-2",
        title: "1.2 Software and Software Development",
        description:
          "Study operating systems, applications, translators, software methodologies, development practice and programming paradigms.",
        topicIds: [
          "advanced-systems",
          "software-development",
          "advanced-programming",
        ],
      },
      {
        id: "ocr-al-1-3",
        title: "1.3 Exchanging Data",
        description:
          "Study compression, encryption, databases, networks, internet technologies, web technologies and communication protocols.",
        topicIds: [
          "advanced-data-representation",
          "advanced-databases",
          "advanced-networks",
        ],
      },
      {
        id: "ocr-al-1-4",
        title: "1.4 Data Types, Data Structures and Algorithms",
        description:
          "Study data representation, Boolean concepts, advanced structures, searching, sorting and algorithmic techniques.",
        topicIds: [
          "advanced-data-representation",
          "data-structures",
          "computational-thinking",
        ],
      },
      {
        id: "ocr-al-1-5",
        title: "1.5 Legal, Moral, Cultural and Ethical Issues",
        description:
          "Evaluate legal responsibilities and the moral, cultural, ethical, privacy and environmental impact of computing.",
        topicIds: ["legal-ethical-a-level"],
      },
      {
        id: "ocr-al-2-1",
        title: "2.1 Elements of Computational Thinking",
        description:
          "Apply abstraction, decomposition, thinking ahead, thinking logically, thinking procedurally and thinking concurrently.",
        topicIds: ["computational-thinking"],
      },
      {
        id: "ocr-al-2-2",
        title: "2.2 Problem Solving and Programming",
        description:
          "Develop algorithms and programs using suitable constructs, structures, paradigms, testing and robust solution design.",
        topicIds: [
          "advanced-programming",
          "software-development",
        ],
      },
      {
        id: "ocr-al-2-3",
        title: "2.3 Algorithms",
        description:
          "Study searching, sorting, graph algorithms, shortest paths, complexity and algorithm design.",
        topicIds: ["computational-thinking"],
      },
      {
        id: "ocr-al-3",
        title: "03 Programming Project",
        description:
          "Apply analysis, design, development, testing, evaluation and documentation to an independent programming project.",
        topicIds: ["software-development"],
      },
    ],
  },
];

export function getCurriculumDefinition(
  qualification: Qualification,
  examBoard: ExamBoard,
): CurriculumDefinition | undefined {
  return curriculumDefinitions.find(
    (curriculum) =>
      curriculum.qualification === qualification &&
      curriculum.examBoard === examBoard,
  );
}
