import type { GeneratedExamQuestion } from "@/types/examQuestion";

/** Original CS Master starter questions, not copied from exam-board past papers. */
const starter = [
  ["Binary Numbers", "Convert denary 13 to an 8-bit binary number.", "00001101", ["Eight bits", "Correct binary value"]],
  ["Hexadecimal", "Convert the binary number 11110000 to hexadecimal.", "F0", ["First nibble is F", "Second nibble is 0"]],
  ["Boolean Logic", "State the output of an AND gate when input A is 1 and input B is 0. Explain your answer.", "0; both inputs must be 1 for AND to output 1.", ["Output 0", "AND rule explained"]],
  ["Cyber Security", "Describe two measures a school could take to reduce phishing attacks.", "Staff awareness training and email filtering.", ["One suitable measure", "Second distinct suitable measure"]],
  ["Relational Databases and SQL", "Write SQL to select name from Students where score is at least 70.", "SELECT name FROM Students WHERE score >= 70;", ["SELECT name", "FROM Students", "WHERE score >= 70"]],
  ["Programming", "Explain the difference between a local variable and a global variable.", "A local variable is scoped to a function or block; a global variable is accessible across a wider program scope.", ["Local scope", "Global scope"]],
  ["Computer Networks", "Give two differences between a LAN and a WAN.", "LAN covers a smaller geographic area and is usually controlled by one organisation; WAN spans a wider area and can link multiple LANs.", ["Geographical scope", "Network ownership or connection distinction"]],
  ["CPU and Processor Architecture", "Name two CPU components and state the purpose of each.", "ALU performs arithmetic and logic; control unit coordinates instruction execution.", ["Valid component and purpose", "Second valid component and purpose"]],
] as const;

export const builtInExamQuestions: GeneratedExamQuestion[] = starter.map(([topic, question, modelAnswer, points], index) => ({
  id: `cs-master-original-${index + 1}`,
  questionNumber: index + 1,
  topic,
  questionType: "short-response",
  commandWord: "explain",
  question,
  context: "",
  marks: points.length,
  difficulty: "standard",
  assessmentObjective: "AO1",
  markScheme: points.map((description, i) => ({ id: `mp-${i + 1}`, description, marks: 1 })),
  levelDescriptors: [],
  modelAnswer,
  examinerGuidance: ["Award credit for equivalent correct answers."],
  commonMisconceptions: [],
}));
