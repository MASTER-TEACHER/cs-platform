export type NeaStageId =
  | "analysis"
  | "design"
  | "development"
  | "testing"
  | "evaluation";

export type NeaProjectStatus =
  | "active"
  | "completed"
  | "archived";

export type NeaStageProgress = Record<NeaStageId, number>;

export type NeaMilestone = {
  id: string;
  stage: NeaStageId;
  title: string;
  completed: boolean;
};

export type NeaProject = {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  schoolId: string | null;
  classId: string | null;
  teacherId: string | null;
  title: string;
  projectBrief: string;
  qualification: string;
  examBoard: string;
  status: NeaProjectStatus;
  currentStage: NeaStageId;
  stageProgress: NeaStageProgress;
  overallProgress: number;
  milestones: NeaMilestone[];
  evidenceCount: number;
  teacherFeedbackCount: number;
  latestReflection: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NeaEvidence = {
  id: string;
  projectId: string;
  studentId?: string;
  stage: NeaStageId;
  title: string;
  description: string;
  createdAt: string | null;
};

export type NeaFeedback = {
  id: string;
  projectId: string;
  teacherId: string;
  teacherName: string;
  message: string;
  createdAt: string | null;
};

export type NeaProjectDetail = {
  project: NeaProject;
  evidence: NeaEvidence[];
  feedback: NeaFeedback[];
};
