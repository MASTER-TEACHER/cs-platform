import type {
  TeacherInterventionPlan,
} from "@/types/teacherInterventionPlanning";

function csvCell(value: unknown): string {
  const text = String(value ?? "");

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n")
  ) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

export function buildInterventionCohortCsv(
  plan: TeacherInterventionPlan,
): string {
  const rows: string[][] = [
    [
      "Topic",
      "Priority",
      "Strategy",
      "Student",
      "Student score",
      "Group average",
      "Lowest score",
      "Rationale",
      "Evidence caution",
      "Recommended sequence",
    ],
  ];

  plan.groups.forEach((group) => {
    const sequence = group.steps
      .map((step) => `${step.order}. ${step.label}: ${step.description}`)
      .join(" | ");

    group.students.forEach((student) => {
      rows.push([
        group.topic,
        group.priority,
        group.strategy,
        student.name,
        `${student.averageScore}%`,
        `${group.averageScore}%`,
        `${group.lowestScore}%`,
        group.rationale,
        group.evidenceCaution,
        sequence,
      ]);
    });
  });

  return rows
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
}

export function interventionCohortFilename(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `cs-master-intervention-cohorts-${date}.csv`;
}
