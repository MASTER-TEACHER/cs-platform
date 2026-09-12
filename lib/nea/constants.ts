import type {
  NeaMilestone,
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

export const NEA_STAGE_LABELS: Record<
  NeaStageId,
  string
> = {
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

export const DEFAULT_NEA_MILESTONES: NeaMilestone[] = [
  {
    id: "analysis-problem",
    stage: "analysis",
    title: "Define the problem and intended users",
    completed: false,
  },
  {
    id: "analysis-requirements",
    stage: "analysis",
    title: "Identify measurable requirements and success criteria",
    completed: false,
  },
  {
    id: "design-structure",
    stage: "design",
    title: "Plan data structures, algorithms and system structure",
    completed: false,
  },
  {
    id: "design-interface",
    stage: "design",
    title: "Plan inputs, outputs and user interaction",
    completed: false,
  },
  {
    id: "development-iterations",
    stage: "development",
    title: "Record meaningful development iterations",
    completed: false,
  },
  {
    id: "development-evidence",
    stage: "development",
    title: "Collect evidence of technical decisions and implementation",
    completed: false,
  },
  {
    id: "testing-plan",
    stage: "testing",
    title: "Create a test strategy linked to requirements",
    completed: false,
  },
  {
    id: "testing-results",
    stage: "testing",
    title: "Record test results, fixes and retesting",
    completed: false,
  },
  {
    id: "evaluation-criteria",
    stage: "evaluation",
    title: "Evaluate the solution against success criteria",
    completed: false,
  },
  {
    id: "evaluation-improvements",
    stage: "evaluation",
    title: "Identify justified limitations and future improvements",
    completed: false,
  },
];

export function calculateNeaOverallProgress(
  progress: NeaStageProgress,
): number {
  const total = NEA_STAGE_ORDER.reduce(
    (sum, stage) => sum + progress[stage],
    0,
  );

  return Math.round(
    total / NEA_STAGE_ORDER.length,
  );
}

export function determineCurrentNeaStage(
  progress: NeaStageProgress,
): NeaStageId {
  return (
    NEA_STAGE_ORDER.find(
      (stage) => progress[stage] < 100,
    ) || "evaluation"
  );
}

export const NEA_INTEGRITY_NOTICE =
  "CS Master may explain concepts, ask questions, help you plan and review your own work. It must not produce assessed NEA sections, program solutions, testing evidence or evaluation text for submission.";
