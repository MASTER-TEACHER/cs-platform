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
      { id: "aqa-algorithms", title: "Fundamentals of Algorithms", description: "Develop computational thinking, decomposition, abstraction, algorithm design, searching, sorting and trace-table skills.", topicIds: ["algorithms"] },
      { id: "aqa-programming", title: "Programming", description: "Use variables, data types, sequence, selection, iteration, functions, procedures, arrays, validation and robust programming techniques.", topicIds: ["programming"] },
      { id: "aqa-data-representation", title: "Fundamentals of Data Representation", description: "Represent numbers, text, images and sound digitally, and understand compression techniques.", topicIds: ["binary", "hexadecimal", "characters", "images", "sound", "compression"] },
      { id: "aqa-computer-systems", title: "Computer Systems", description: "Understand computer architecture, processors, memory, storage, operating systems, utility software and Boolean logic.", topicIds: ["cpu", "memory-storage", "systems-software", "boolean-logic"] },
      { id: "aqa-networks", title: "Computer Networks", description: "Study network types, topologies, hardware, protocols, addressing, cloud computing and the internet.", topicIds: ["networks"] },
      { id: "aqa-cyber-security", title: "Cyber Security", description: "Understand threats, vulnerabilities, social engineering, malware, authentication and defensive security measures.", topicIds: ["cyber-security"] },
      { id: "aqa-databases", title: "Relational Databases and SQL", description: "Understand tables, records, fields, keys, relationships, validation and SQL queries.", topicIds: ["databases"] },
      { id: "aqa-ethical-legal", title: "Ethical, Legal and Environmental Impacts", description: "Explore privacy, legislation, copyright, software licensing, environmental impact and ethical issues created by digital technology.", topicIds: ["ethical-legal"] },
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "OCR",
    title: "OCR GCSE Computer Science",
    specificationLabel: "OCR J277",
    units: [
      { id: "ocr-systems-architecture", title: "Systems Architecture", description: "Study processor components, the fetch-decode-execute cycle, embedded systems and processor performance.", topicIds: ["cpu"] },
      { id: "ocr-memory-storage", title: "Memory and Storage", description: "Understand primary memory, secondary storage, units, number systems, text, images, sound and compression.", topicIds: ["memory-storage", "binary", "hexadecimal", "characters", "images", "sound", "compression"] },
      { id: "ocr-networks", title: "Computer Networks, Connections and Protocols", description: "Study network types, hardware, topologies, protocols, addressing, layers and network performance.", topicIds: ["networks"] },
      { id: "ocr-security", title: "Network Security", description: "Understand network threats, vulnerabilities and prevention methods.", topicIds: ["cyber-security"] },
      { id: "ocr-systems-software", title: "Systems Software", description: "Understand operating systems, utility software and their roles.", topicIds: ["systems-software"] },
      { id: "ocr-algorithms", title: "Algorithms", description: "Develop computational thinking, searching, sorting, flowcharts, pseudocode and trace-table skills.", topicIds: ["algorithms"] },
      { id: "ocr-programming", title: "Programming Fundamentals", description: "Use variables, data types, sequence, selection, iteration, arrays, functions, procedures and file handling.", topicIds: ["programming"] },
      { id: "ocr-boolean-logic", title: "Boolean Logic", description: "Use logic gates, truth tables and Boolean expressions.", topicIds: ["boolean-logic"] },
      { id: "ocr-languages-ides", title: "Programming Languages and IDEs", description: "Understand translators, language levels and integrated development environments.", topicIds: ["programming-languages"] },
      { id: "ocr-databases", title: "Databases", description: "Understand database concepts, relational structures and SQL.", topicIds: ["databases"] },
      { id: "ocr-ethical-legal", title: "Ethical, Legal, Cultural and Environmental Issues", description: "Understand ethical, legal, cultural, environmental and privacy issues together with relevant computer legislation and software licensing.", topicIds: ["ethical-legal"] },
    ],
  },
  {
    qualification: "GCSE",
    examBoard: "EDEXCEL",
    title: "Pearson Edexcel GCSE Computer Science",
    specificationLabel: "Pearson Edexcel GCSE Computer Science",
    units: [
      { id: "edexcel-computational-thinking", title: "Computational Thinking", description: "Apply decomposition, abstraction, algorithmic thinking, searching, sorting and problem-solving techniques.", topicIds: ["algorithms"] },
      { id: "edexcel-data", title: "Data", description: "Understand binary, hexadecimal, text, image and sound representation together with compression.", topicIds: ["binary", "hexadecimal", "characters", "images", "sound", "compression"] },
      { id: "edexcel-hardware-software", title: "Computers, Hardware and Software", description: "Study processors, memory, storage, operating systems and utility software.", topicIds: ["cpu", "memory-storage", "systems-software", "boolean-logic"] },
      { id: "edexcel-networks", title: "Computer Networks", description: "Understand network types, hardware, protocols, the internet and network security.", topicIds: ["networks", "cyber-security"] },
      { id: "edexcel-programming", title: "Programming", description: "Design, write, test and refine programs using appropriate programming constructs.", topicIds: ["programming"] },
      { id: "edexcel-databases", title: "Databases", description: "Understand relational databases, validation, keys, relationships and SQL.", topicIds: ["databases"] },
      { id: "edexcel-ethical-legal", title: "Issues and Impact of Digital Technology", description: "Explore privacy, legal responsibilities, intellectual property, software licensing, social impact and environmental issues associated with digital technology.", topicIds: ["ethical-legal"] },
    ],
  },

  {
    qualification: "A_LEVEL",
    examBoard: "AQA",
    title: "AQA A-level Computer Science",
    specificationLabel: "AQA A-level Computer Science 7517",
    units: [
      { id: "aqa-al-programming", title: "4.1 Fundamentals of Programming", description: "Advanced programming including OOP, recursion and robustness.", topicIds: ["advanced-programming"] },
      { id: "aqa-al-data-structures", title: "4.2 Fundamentals of Data Structures", description: "Stacks, queues, linked structures, trees and graphs.", topicIds: ["data-structures"] },
      { id: "aqa-al-algorithms", title: "4.3 Fundamentals of Algorithms", description: "Algorithm design, correctness, searching, sorting and efficiency.", topicIds: ["algorithms", "computational-thinking"] },
      { id: "aqa-al-theory", title: "4.4 Theory of Computation", description: "Finite-state machines, Turing machines and complexity.", topicIds: ["theory-computation"] },
      { id: "aqa-al-data-representation", title: "4.5 Fundamentals of Data Representation", description: "Signed binary, floating point, precision and encoding.", topicIds: ["advanced-data-representation"] },
      { id: "aqa-al-computer-systems", title: "4.6 Fundamentals of Computer Systems", description: "Systems software, translators and operating systems.", topicIds: ["advanced-systems"] },
      { id: "aqa-al-architecture", title: "4.7 Computer Organisation and Architecture", description: "Processor architecture, instruction execution and assembly.", topicIds: ["advanced-systems"] },
      { id: "aqa-al-consequences", title: "4.8 Consequences of Uses of Computing", description: "Legal, moral, social, cultural and environmental issues.", topicIds: ["legal-ethical-a-level"] },
      { id: "aqa-al-networks", title: "4.9 Communication and Networking", description: "Layered communication, routing, internet services and security.", topicIds: ["advanced-networks"] },
      { id: "aqa-al-databases", title: "4.10 Fundamentals of Databases", description: "Relational design, normalisation, SQL and transactions.", topicIds: ["advanced-databases"] },
      { id: "aqa-al-big-data", title: "4.11 Big Data", description: "Scale, distributed processing, privacy and bias.", topicIds: ["big-data"] },
      { id: "aqa-al-functional", title: "4.12 Functional Programming", description: "Pure functions, immutability and higher-order operations.", topicIds: ["functional-programming"] },
      { id: "aqa-al-problem-solving", title: "4.13 Systematic Approach to Problem Solving", description: "Analysis, design, testing and evaluation.", topicIds: ["computational-thinking", "software-development"] },
      { id: "aqa-al-nea", title: "4.14 Non-exam Assessment", description: "Project analysis, design, implementation, testing and evaluation.", topicIds: ["software-development"] },
    ],
  },

  {
    qualification: "A_LEVEL",
    examBoard: "OCR",
    title: "OCR A-level Computer Science",
    specificationLabel: "OCR H446",
    units: [
      { id: "ocr-al-processors", title: "1.1 Contemporary Processors, Input, Output and Storage", description: "Processor architecture, performance, memory and storage at A-level depth.", topicIds: ["advanced-systems", "advanced-data-representation"] },
      { id: "ocr-al-software", title: "1.2 Software and Software Development", description: "Operating systems, translators, methodologies, programming paradigms and testing.", topicIds: ["advanced-systems", "advanced-programming", "software-development", "functional-programming"] },
      { id: "ocr-al-data-exchange", title: "1.3 Exchanging Data", description: "Compression, databases, networks, internet communication and secure data exchange.", topicIds: ["advanced-networks", "advanced-databases", "advanced-data-representation"] },
      { id: "ocr-al-data-structures", title: "1.4 Data Types, Data Structures and Algorithms", description: "Advanced representation, Boolean algebra, data structures and algorithms.", topicIds: ["advanced-data-representation", "data-structures", "advanced-systems", "algorithms"] },
      { id: "ocr-al-issues", title: "1.5 Legal, Moral, Cultural and Ethical Issues", description: "Evaluate responsibilities and consequences associated with computing.", topicIds: ["legal-ethical-a-level"] },
      { id: "ocr-al-thinking", title: "2.1 Elements of Computational Thinking", description: "Abstraction, decomposition, modelling and problem solving.", topicIds: ["computational-thinking"] },
      { id: "ocr-al-problem-solving", title: "2.2 Problem Solving and Programming", description: "Advanced programming, robust solution design and systematic testing.", topicIds: ["advanced-programming", "software-development"] },
      { id: "ocr-al-algorithms", title: "2.3 Algorithms", description: "Design, trace, compare and evaluate algorithms and their efficiency.", topicIds: ["algorithms", "theory-computation", "computational-thinking"] },
      { id: "ocr-al-project", title: "3 Programming Project", description: "Analyse, design, develop, test, evaluate and document a substantial solution.", topicIds: ["software-development", "advanced-programming"] },
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
