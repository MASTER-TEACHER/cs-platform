export interface PracticeQuestion {
  question: string;
  answer: string;
  acceptedAnswers?: string[];
  hint?: string;
  feedback?: string;
}

export interface ExamQuestion {
  question: string;
  marks: number;
  answer: string;
  guidance?: string[];
  markScheme?: string[];
}

export type SimulatorType =
  // Data representation
  | "binary"
  | "hexadecimal"
  | "binary-addition"
  | "binary-shift"
  | "character-encoding"
  | "image-representation"
  | "sound-sampling"
  | "compression"

  // Systems architecture
  | "cpu"
  | "memory"
  | "storage-capacity"
  | "storage-comparison"
  | "operating-system"

  // Boolean logic
  | "logic-gates"
  | "truth-table"
  | "logic-circuit"

  // Algorithms
  | "linear-search"
  | "binary-search"
  | "bubble-sort"
  | "merge-sort"
  | "insertion-sort"
  | "quick-sort"
  | "trace-table"
  | "flowchart"

  // Programming
  | "variables"
  | "selection"
  | "iteration"
  | "arrays"
  | "functions"
  | "python"
  | "debugging"

  // Data structures
  | "stack"
  | "queue"
  | "tree"
  | "graph"

  // Networks
  | "network-builder"
  | "packet-routing"
  | "dns"
  | "protocols"
  | "network-topology"

  // Cybersecurity
  | "encryption"
  | "caesar-cipher"
  | "password-security"
  | "cybersecurity"
  | "sql-injection"

  // Databases
  | "database"
  | "sql"
  | "entity-relationship";

export type TopicDifficulty = "⭐☆☆" | "⭐⭐☆" | "⭐⭐⭐";

export type TopicStatus = "published" | "coming-soon" | "draft";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  xpReward: number;

  simulator?: SimulatorType;

  objectives: string[];
  explanation: string;
  workedExample: string;

  practiceQuestions: PracticeQuestion[];
  checkpointQuestions?: PracticeQuestion[];

  examQuestion: ExamQuestion;

  audioTranscript?: string;
  reflectionPrompt?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;

  difficulty: TopicDifficulty;
  estimatedTime: string;

  simulator?: SimulatorType;
  lessons: Lesson[];

  status?: TopicStatus;
  unit?: string;
  specificationReferences?: string[];
}
