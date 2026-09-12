import type {
  NeaMilestone,
  NeaMilestoneStatus,
  NeaStageId,
  NeaStageProgress,
} from "@/types/nea";

export const NEA_STAGE_ORDER: NeaStageId[] = [
  "analysis",
  "design",
  "development",
  "testing",
  "evaluation",
];

export const NEA_STAGE_LABELS: Record<NeaStageId, string> = {
  analysis: "Analysis",
  design: "Design",
  development: "Development",
  testing: "Testing",
  evaluation: "Evaluation",
};

export const EMPTY_NEA_STAGE_PROGRESS: NeaStageProgress = {
  analysis: 0,
  design: 0,
  development: 0,
  testing: 0,
  evaluation: 0,
};

const milestone = (
  id: string,
  stage: NeaStageId,
  title: string,
): NeaMilestone => ({
  id,
  stage,
  title,
  status: "not_started",
  completed: false,
  dueDate: null,
  completedAt: null,
});

export const DEFAULT_NEA_MILESTONES: NeaMilestone[] = [
  milestone("analysis-problem", "analysis", "Define the problem and intended users"),
  milestone("analysis-research", "analysis", "Record stakeholder or research evidence"),
  milestone("analysis-requirements", "analysis", "Identify measurable requirements and success criteria"),
  milestone("design-structure", "design", "Plan data structures, algorithms and system structure"),
  milestone("design-interface", "design", "Plan inputs, outputs and user interaction"),
  milestone("design-validation", "design", "Plan validation, error handling and testable design decisions"),
  milestone("development-iterations", "development", "Record meaningful development iterations"),
  milestone("development-evidence", "development", "Collect evidence of technical decisions and implementation"),
  milestone("development-review", "development", "Explain significant problems, fixes and refinements"),
  milestone("testing-plan", "testing", "Create a test strategy linked to requirements"),
  milestone("testing-results", "testing", "Record normal, boundary and erroneous test results"),
  milestone("testing-retest", "testing", "Record fixes and regression or retesting evidence"),
  milestone("evaluation-criteria", "evaluation", "Evaluate the solution against success criteria"),
  milestone("evaluation-user", "evaluation", "Use relevant user or stakeholder feedback in the evaluation"),
  milestone("evaluation-improvements", "evaluation", "Identify justified limitations and prioritised improvements"),
];

export function calculateNeaOverallProgress(
  progress: NeaStageProgress,
): number {
  const total = NEA_STAGE_ORDER.reduce(
    (sum, stage) => sum + progress[stage],
    0,
  );
  return Math.round(total / NEA_STAGE_ORDER.length);
}

export function determineCurrentNeaStage(
  progress: NeaStageProgress,
): NeaStageId {
  return (
    NEA_STAGE_ORDER.find((stage) => progress[stage] < 100) ||
    "evaluation"
  );
}

export function nextNeaStage(
  stage: NeaStageId,
): NeaStageId | null {
  const index = NEA_STAGE_ORDER.indexOf(stage);
  if (index < 0 || index >= NEA_STAGE_ORDER.length - 1) {
    return null;
  }
  return NEA_STAGE_ORDER[index + 1];
}

export function normaliseMilestoneStatus(
  value: unknown,
  completed: boolean,
): NeaMilestoneStatus {
  if (
    value === "not_started" ||
    value === "in_progress" ||
    value === "complete"
  ) {
    return value;
  }

  return completed ? "complete" : "not_started";
}

export const NEA_INTEGRITY_NOTICE =
  "CS Master provides guidance only. It may explain concepts, ask questions, help you plan and review your own work. Assessed NEA writing, program solutions, evidence, testing results and evaluation judgements must remain the student's own work.";
