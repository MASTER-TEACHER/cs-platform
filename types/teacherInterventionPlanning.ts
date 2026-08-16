export type InterventionPlanningPriority =
  | "high"
  | "medium"
  | "monitor";

export type InterventionPlanningStudent = {
  id: string;
  name: string;
  averageScore: number;
  weakTopic: string;
  recommendedAction: string;
};

export type InterventionPlanningGroup = {
  id: string;
  topic: string;
  studentCount: number;
  students: InterventionPlanningStudent[];
  averageScore: number;
  lowestScore: number;
  priority: InterventionPlanningPriority;
  rationale: string;
  knowledgeMapHref: string;
  assignmentHref: string;
  interventionHref: string;
};

export type TeacherInterventionPlan = {
  totalStudentsRequiringSupport: number;
  highPriorityGroups: number;
  groupedTopics: number;
  groups: InterventionPlanningGroup[];
};
