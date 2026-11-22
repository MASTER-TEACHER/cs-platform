import type { BankQuestion } from "./bankUtilities";

/*
 * Specification section for a question, from its qualification and topic.
 * Currently mapped for OCR (J277 GCSE and H446 A Level). Other boards show no
 * reference until mapped. Sections are at topic level, e.g. "J277 1.3".
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

export function specReference(item: Pick<BankQuestion, "qualification" | "examBoard"> & { question: { topic: string } }): string {
  if (item.examBoard.trim().toUpperCase() !== "OCR") return "";
  const topic = item.question.topic.trim().toLowerCase();
  if (/^gcse$/i.test(item.qualification.trim())) return OCR_GCSE[topic] ?? "";
  if (/^a\s*level$/i.test(item.qualification.trim())) return OCR_A_LEVEL[topic] ?? "";
  return "";
}
