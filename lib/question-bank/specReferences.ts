import type { BankQuestion } from "./bankUtilities";

/*
 * Specification section for a question, from its qualification and topic.
 * Mapped for OCR (J277, H446), AQA (8525, 7517) and Edexcel GCSE (1CP2), at
 * specification-section level, e.g. "J277 1.3". Edexcel A Level is not mapped yet.
 */
const OCR_GCSE: Record<string, string> = {
  "cpu architecture": "J277 1.1 Systems architecture",
  "cpu and processor architecture": "J277 1.1 Systems architecture",
  "memory and storage": "J277 1.2 Memory and storage",
  "data representation": "J277 1.2 Memory and storage",
  "binary representation and arithmetic": "J277 1.2 Memory and storage",
  "binary numbers": "J277 1.2 Memory and storage",
  "hexadecimal": "J277 1.2 Memory and storage",
  "character representation": "J277 1.2 Memory and storage",
  "image representation": "J277 1.2 Memory and storage",
  "sound representation": "J277 1.2 Memory and storage",
  "data compression": "J277 1.2 Memory and storage",
  "computer networks": "J277 1.3 Networks, connections and protocols",
  "cybersecurity": "J277 1.4 Network security",
  "systems software": "J277 1.5 Systems software",
  "ethical, legal and environmental impacts": "J277 1.6 Ethical, legal, cultural and environmental impacts",
  "legal, moral and ethical": "J277 1.6 Ethical, legal, cultural and environmental impacts",
  "algorithms": "J277 2.1 Algorithms",
  "programming": "J277 2.2 Programming fundamentals",
  "databases and sql": "J277 2.2 Programming fundamentals (SQL)",
  "defensive design": "J277 2.3 Producing robust programs",
  "software development and testing": "J277 2.3 Producing robust programs",
  "boolean logic": "J277 2.4 Boolean logic",
  "logic gates": "J277 2.4 Boolean logic",
  "programming languages and ides": "J277 2.5 Programming languages and IDEs",
};

const OCR_A_LEVEL: Record<string, string> = {
  "computer organisation": "H446 1.1 Processors, input, output and storage",
  "operating systems": "H446 1.2 Software and software development",
  "software development": "H446 1.2 Software and software development",
  "functional programming": "H446 1.2 Software and software development",
  "networking": "H446 1.3 Exchanging data",
  "databases": "H446 1.3 Exchanging data",
  "cybersecurity": "H446 1.3 Exchanging data",
  "data representation": "H446 1.4 Data types, data structures and algorithms",
  "data structures": "H446 1.4 Data types, data structures and algorithms",
  "boolean algebra": "H446 1.4 Data types, data structures and algorithms",
  "ethical, legal and environmental impacts": "H446 1.5 Legal, moral, cultural and ethical issues",
  "programming": "H446 2.2 Problem solving and programming",
  "object-oriented programming": "H446 2.2 Problem solving and programming",
  "recursion": "H446 2.2 Problem solving and programming",
  "algorithms": "H446 2.3 Algorithms",
  "computational complexity": "H446 2.3 Algorithms",
};

const AQA_GCSE: Record<string, string> = {
  "algorithms": "AQA 8525 3.1 Fundamentals of algorithms",
  "programming": "AQA 8525 3.2 Programming",
  "defensive design": "AQA 8525 3.2 Programming (robust and secure programming)",
  "software development and testing": "AQA 8525 3.2 Programming (robust and secure programming)",
  "data representation": "AQA 8525 3.3 Fundamentals of data representation",
  "binary representation and arithmetic": "AQA 8525 3.3 Fundamentals of data representation",
  "binary numbers": "AQA 8525 3.3 Fundamentals of data representation",
  "hexadecimal": "AQA 8525 3.3 Fundamentals of data representation",
  "character representation": "AQA 8525 3.3 Fundamentals of data representation",
  "image representation": "AQA 8525 3.3 Fundamentals of data representation",
  "sound representation": "AQA 8525 3.3 Fundamentals of data representation",
  "data compression": "AQA 8525 3.3 Fundamentals of data representation",
  "cpu architecture": "AQA 8525 3.4 Computer systems",
  "cpu and processor architecture": "AQA 8525 3.4 Computer systems",
  "memory and storage": "AQA 8525 3.4 Computer systems",
  "boolean logic": "AQA 8525 3.4 Computer systems",
  "logic gates": "AQA 8525 3.4 Computer systems",
  "systems software": "AQA 8525 3.4 Computer systems",
  "programming languages and ides": "AQA 8525 3.4 Computer systems",
  "computer networks": "AQA 8525 3.5 Fundamentals of computer networks",
  "cybersecurity": "AQA 8525 3.6 Cyber security",
  "databases and sql": "AQA 8525 3.7 Relational databases and SQL",
  "ethical, legal and environmental impacts": "AQA 8525 3.8 Ethical, legal and environmental impacts",
  "legal, moral and ethical": "AQA 8525 3.8 Ethical, legal and environmental impacts",
};

const AQA_A_LEVEL: Record<string, string> = {
  "programming": "AQA 7517 4.1 Fundamentals of programming",
  "object-oriented programming": "AQA 7517 4.1 Fundamentals of programming",
  "recursion": "AQA 7517 4.1 Fundamentals of programming",
  "data structures": "AQA 7517 4.2 Fundamentals of data structures",
  "algorithms": "AQA 7517 4.3 Fundamentals of algorithms",
  "theory of computation": "AQA 7517 4.4 Theory of computation",
  "computational complexity": "AQA 7517 4.4 Theory of computation",
  "data representation": "AQA 7517 4.5 Fundamentals of data representation",
  "boolean algebra": "AQA 7517 4.6 Fundamentals of computer systems",
  "operating systems": "AQA 7517 4.6 Fundamentals of computer systems",
  "computer organisation": "AQA 7517 4.7 Computer organisation and architecture",
  "ethical, legal and environmental impacts": "AQA 7517 4.8 Consequences of uses of computing",
  "networking": "AQA 7517 4.9 Communication and networking",
  "cybersecurity": "AQA 7517 4.5/4.9 Encryption and network security",
  "databases": "AQA 7517 4.10 Fundamentals of databases",
  "big data": "AQA 7517 4.11 Big Data",
  "functional programming": "AQA 7517 4.12 Fundamentals of functional programming",
  "software development": "AQA 7517 4.13 Systematic approach to problem solving",
};

const EDEXCEL_GCSE: Record<string, string> = {
  "algorithms": "Edexcel 1CP2 Topic 1 Computational thinking",
  "boolean logic": "Edexcel 1CP2 Topic 1 Computational thinking",
  "logic gates": "Edexcel 1CP2 Topic 1 Computational thinking",
  "data representation": "Edexcel 1CP2 Topic 2 Data",
  "binary representation and arithmetic": "Edexcel 1CP2 Topic 2 Data",
  "binary numbers": "Edexcel 1CP2 Topic 2 Data",
  "hexadecimal": "Edexcel 1CP2 Topic 2 Data",
  "character representation": "Edexcel 1CP2 Topic 2 Data",
  "image representation": "Edexcel 1CP2 Topic 2 Data",
  "sound representation": "Edexcel 1CP2 Topic 2 Data",
  "data compression": "Edexcel 1CP2 Topic 2 Data",
  "cpu architecture": "Edexcel 1CP2 Topic 3 Computers",
  "cpu and processor architecture": "Edexcel 1CP2 Topic 3 Computers",
  "memory and storage": "Edexcel 1CP2 Topic 3 Computers",
  "systems software": "Edexcel 1CP2 Topic 3 Computers",
  "programming languages and ides": "Edexcel 1CP2 Topic 3 Computers",
  "computer networks": "Edexcel 1CP2 Topic 4 Networks",
  "cybersecurity": "Edexcel 1CP2 Topics 4–5 Network security and cybersecurity",
  "ethical, legal and environmental impacts": "Edexcel 1CP2 Topic 5 Issues and impact",
  "legal, moral and ethical": "Edexcel 1CP2 Topic 5 Issues and impact",
  "programming": "Edexcel 1CP2 Topic 6 Problem solving with programming",
  "defensive design": "Edexcel 1CP2 Topic 6 Problem solving with programming",
  "software development and testing": "Edexcel 1CP2 Topic 6 Problem solving with programming",
};

export function specReference(item: Pick<BankQuestion, "qualification" | "examBoard"> & { question: { topic: string } }): string {
  const board = item.examBoard.trim().toUpperCase();
  const topic = item.question.topic.trim().toLowerCase();
  const gcse = /^gcse$/i.test(item.qualification.trim());
  const aLevel = /^a\s*level$/i.test(item.qualification.trim());
  if (board === "OCR") return (gcse ? OCR_GCSE[topic] : aLevel ? OCR_A_LEVEL[topic] : "") ?? "";
  if (board === "AQA") return (gcse ? AQA_GCSE[topic] : aLevel ? AQA_A_LEVEL[topic] : "") ?? "";
  if (board === "EDEXCEL") return (gcse ? EDEXCEL_GCSE[topic] : "") ?? "";
  return "";
}
