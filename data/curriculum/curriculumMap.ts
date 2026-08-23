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
    specificationLabel: "AQA A-level Computer Science",
    units: [
      {
        id: "aqa-al-programming",
        title: "Programming",
        description:
          "Develop advanced procedural, object-oriented, recursive and functional programming skills together with robust solution design.",
        topicIds: [
          "advanced-programming",
          "functional-programming",
          "software-development",
        ],
      },
      {
        id: "aqa-al-data-structures-algorithms",
        title: "Data Structures, Algorithms and Computational Thinking",
        description:
          "Study abstract data structures, algorithm design, complexity, computational thinking and theoretical models of computation.",
        topicIds: [
          "data-structures",
          "computational-thinking",
          "theory-computation",
        ],
      },
      {
        id: "aqa-al-data-representation",
        title: "Data Representation",
        description:
          "Study signed binary, number systems, floating-point ideas, character encoding, images, sound and compression at A-level depth.",
        topicIds: ["advanced-data-representation"],
      },
      {
        id: "aqa-al-computer-systems",
        title: "Computer Systems",
        description:
          "Study processor architecture, memory, storage, operating systems, translators and Boolean logic at A-level depth.",
        topicIds: ["advanced-systems"],
      },
      {
        id: "aqa-al-networks-security",
        title: "Networks and Cyber Security",
        description:
          "Study layered network communication, routing, internet technologies, vulnerabilities and defensive security.",
        topicIds: ["advanced-networks"],
      },
      {
        id: "aqa-al-databases",
        title: "Databases",
        description:
          "Study relational design, normalisation, SQL, transactions and database management.",
        topicIds: ["advanced-databases"],
      },
      {
        id: "aqa-al-big-data",
        title: "Big Data",
        description:
          "Understand large-scale datasets, distributed processing, privacy, bias and the challenges created by volume, velocity and variety.",
        topicIds: ["big-data"],
      },
      {
        id: "aqa-al-ethical-legal",
        title: "Consequences of Computing",
        description:
          "Evaluate legal, moral, cultural, ethical and environmental consequences of computer systems.",
        topicIds: ["legal-ethical-a-level"],
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
        id: "ocr-al-processors",
        title: "The Characteristics of Contemporary Processors",
        description:
          "Study processor architecture, memory hierarchy, low-level execution, storage and performance.",
        topicIds: ["advanced-systems"],
      },
      {
        id: "ocr-al-software-development",
        title: "Software and Software Development",
        description:
          "Study software-development practice, translators, programming methodologies, object orientation, recursion and robust program design.",
        topicIds: [
          "software-development",
          "advanced-programming",
        ],
      },
      {
        id: "ocr-al-data-exchange",
        title: "Exchanging Data",
        description:
          "Study data representation, compression, relational databases, networks, protocols and communication technologies.",
        topicIds: [
          "advanced-data-representation",
          "advanced-databases",
          "advanced-networks",
        ],
      },
      {
        id: "ocr-al-data-structures",
        title: "Data Types, Data Structures and Algorithms",
        description:
          "Study advanced data structures, computational thinking, algorithm design and problem-solving techniques.",
        topicIds: [
          "data-structures",
          "computational-thinking",
        ],
      },
      {
        id: "ocr-al-programming",
        title: "Programming and Problem Solving",
        description:
          "Develop advanced programming, abstraction, object orientation, recursion and robust solution design.",
        topicIds: ["advanced-programming"],
      },
      {
        id: "ocr-al-networks-security",
        title: "Networks and Security",
        description:
          "Study layered communication, routing, internet technologies, cyber-security principles and defensive measures.",
        topicIds: ["advanced-networks"],
      },
      {
        id: "ocr-al-ethical-legal",
        title: "Legal, Moral, Cultural and Ethical Issues",
        description:
          "Evaluate the wider legal, moral, cultural, ethical and environmental impact of computer systems.",
        topicIds: ["legal-ethical-a-level"],
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
