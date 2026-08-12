export type ExamQuestionDifficulty = "foundation" | "standard" | "higher";

export type AssessmentObjective = "AO1" | "AO2" | "AO3";

export type ExamQuestionCommandWord =
  | "state"
  | "identify"
  | "define"
  | "describe"
  | "explain"
  | "compare"
  | "calculate"
  | "complete"
  | "write"
  | "trace"
  | "debug"
  | "design"
  | "evaluate"
  | "discuss";

export type AssessmentQuestionType =
  | "multiple-choice"
  | "state-identify"
  | "short-response"
  | "definition"
  | "conversion"
  | "calculation"
  | "worked-calculation"
  | "complete-table"
  | "trace-table"
  | "truth-table"
  | "code-completion"
  | "code-tracing"
  | "debugging"
  | "algorithm-design"
  | "compare"
  | "explain"
  | "scenario-application"
  | "extended-response"
  | "discuss"
  | "evaluate";

export type AssessmentGenerationMode = "automatic" | "manual";

export type AssessmentBlueprintItem = {
  id: string;
  questionNumber: number;
  assessmentObjective: AssessmentObjective;
  questionType: AssessmentQuestionType;
  commandWord: ExamQuestionCommandWord;
  marks: number;
  difficulty: ExamQuestionDifficulty;
  topicFocus: string;
};

export type ExamQuestionMarkPoint = {
  id: string;
  description: string;
  marks: number;
};

export type ExamQuestionLevelDescriptor = {
  level: number;
  markRange: string;
  description: string;
};

export type GeneratedExamQuestion = {
  id: string;
  questionNumber: number;
  topic: string;
  questionType: AssessmentQuestionType;
  commandWord: ExamQuestionCommandWord;
  question: string;
  context: string;
  marks: number;
  difficulty: ExamQuestionDifficulty;
  assessmentObjective: AssessmentObjective;
  markScheme: ExamQuestionMarkPoint[];
  levelDescriptors: ExamQuestionLevelDescriptor[];
  modelAnswer: string;
  examinerGuidance: string[];
  commonMisconceptions: string[];
};

export type GeneratedExamQuestionSet = {
  id: string;
  title: string;
  description: string;
  qualification: string;
  examBoard: string;
  topic: string;
  difficulty: ExamQuestionDifficulty;
  generationMode: AssessmentGenerationMode;
  questionCount: number;
  totalMarks: number;
  estimatedTime: string;
  copyrightNotice: string;
  blueprint: AssessmentBlueprintItem[];
  questions: GeneratedExamQuestion[];
  createdAt: string;
};

export type ExamQuestionGeneratorSettings = {
  topic: string;
  qualification: string;
  examBoard: string;
  difficulty: ExamQuestionDifficulty;
  generationMode: AssessmentGenerationMode;
  blueprint: AssessmentBlueprintItem[];
};

export type GenerateExamQuestionsResponse = {
  questionSet?: GeneratedExamQuestionSet;
  source?: "ai" | "demo";
  warning?: string;
  error?: string;
  errorCode?: string;
};
