export type InterventionPlanningPriority =
  | "high"
  | "medium"
  | "monitor";

export type InterventionStrategy =
  | "reteach_then_reassess"
  | "targeted_practice"
  | "monitor_with_evidence";

export type InterventionPlanningStudent = {
  id: string;
  name: string;
  averageScore: number;
  weakTopic: string;
  recommendedAction: string;
};

export type InterventionPlanningStep = {
  id: string;
  order: number;
  label: string;
  description: string;
};

export type InterventionPlanningGroup = {
  id: string;
  topic: string;
  studentCount: number;
  students: InterventionPlanningStudent[];
  averageScore: number;
  lowestScore: number;
  priority: InterventionPlanningPriority;
  strategy: InterventionStrategy;
  rationale: string;
  evidenceCaution: string;
  steps: InterventionPlanningStep[];
  knowledgeMapHref: string;
  assignmentHref: string;
  interventionHref: string;
};

export type TeacherInterventionPlan = {
  totalStudentsRequiringSupport: number;
  highPriorityGroups: number;
  groupedTopics: number;
  averageAtRiskScore: number;
  groups: InterventionPlanningGroup[];
};
