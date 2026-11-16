export type BankSubject = "computer-science" | "creative-imedia";

export const IMEDIA_QUALIFICATION = "Cambridge National J834";
export const IMEDIA_BOARD = "OCR";

export const IMEDIA_UNITS: Record<string, string> = {
  R093: "Creative iMedia in the Media Industry",
  R094: "Visual Identity and Digital Graphics",
  R095: "Characters and Comics",
  R096: "Animation with Audio",
  R097: "Interactive Digital Media",
  R098: "Visual Imaging",
  R099: "Digital Games",
};

export function canonicalBankTopic(value: string): string {
  const trimmed = value
    .trim()
    .replace(/\s+/g, " ");

  if (!trimmed) return "";

  const key = trimmed
    .toLowerCase()
    .replace(/[,;]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const aliases: Record<string, string> = {
    "algorithm": "Algorithms",
    "algorithms": "Algorithms",

    "boolean logic": "Boolean Logic",
    "logic gates": "Logic Gates",

    "cyber security": "Cybersecurity",
    "cybersecurity": "Cybersecurity",

    "cpu": "CPU and Processor Architecture",
    "cpu architecture": "CPU and Processor Architecture",
    "cpu and processor architecture": "CPU and Processor Architecture",

    "legal moral and ethical": "Legal, Moral and Ethical",
    "legal, moral and ethical": "Legal, Moral and Ethical",
    "legal,moral,ethical": "Legal, Moral and Ethical",

    "binary": "Binary Numbers",
    "binary numbers": "Binary Numbers"
  };

  return aliases[key] ?? trimmed;
}
export function isIMediaQualification(value: string): boolean {
  return /cambridge national|creative\s*i\s*media|\bimedia\b|\bj834\b/i.test(
    value
  );
}