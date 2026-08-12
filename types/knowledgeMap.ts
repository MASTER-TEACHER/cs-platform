import type {
  AdaptiveLearningAction,
  AdaptiveTopicMastery,
} from "@/types/adaptiveLearning";

export type CurriculumUnitId =
  | "data-representation"
  | "computer-systems"
  | "algorithms-programming"
  | "networks-security"
  | "other";

export type CurriculumTopicDefinition = {
  id: string;
  title: string;
  unitId: CurriculumUnitId;
  unitTitle: string;
  aliases: string[];
  lessonIds: string[];
  prerequisites: string[];
  displayOrder: number;
};

export type NormalisedTopic = {
  topicId: string;
  topicTitle: string;
  unitId: CurriculumUnitId;
  unitTitle: string;
};

export type KnowledgeMapTopic = {
  definition: CurriculumTopicDefinition;
  mastery: AdaptiveTopicMastery | null;
  nextAction: AdaptiveLearningAction | null;
};

export type KnowledgeMapUnit = {
  id: CurriculumUnitId;
  title: string;
  topics: KnowledgeMapTopic[];
};

export type KnowledgeMap = {
  studentId: string;
  generatedAt: Date;
  units: KnowledgeMapUnit[];
  unclassifiedTopics: AdaptiveTopicMastery[];
};

export type ClassKnowledgeMapTopic = {
  topicId: string;
  topicTitle: string;
  unitId: CurriculumUnitId;
  unitTitle: string;
  classAverage: number;
  averageConfidence: number;
  assessedStudents: number;
  priorityStudents: number;
  secureStudents: number;
};

export type ClassKnowledgeMap = {
  teacherId: string;
  generatedAt: Date;
  studentCount: number;
  topics: ClassKnowledgeMapTopic[];
};
