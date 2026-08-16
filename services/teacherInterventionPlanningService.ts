import type {
  InterventionPlanningGroup,
  InterventionPlanningPriority,
  InterventionPlanningStudent,
  InterventionStrategy,
  TeacherInterventionPlan,
} from "@/types/teacherInterventionPlanning";

function normaliseTopic(value: string): string {
  const cleaned = value.trim();
  return cleaned || "Combined Assessment Performance";
}

function average(values: number[]): number {
  if (!values.length) return 0;

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) / values.length,
  );
}

function priorityForGroup({
  averageScore,
  lowestScore,
  studentCount,
}: {
  averageScore: number;
  lowestScore: number;
  studentCount: number;
}): InterventionPlanningPriority {
  if (lowestScore < 30 || averageScore < 35 || studentCount >= 4) {
    return "high";
  }

  if (averageScore < 50 || studentCount >= 2) {
    return "medium";
  }

  return "monitor";
}

function strategyForGroup({
  averageScore,
  lowestScore,
  studentCount,
}: {
  averageScore: number;
  lowestScore: number;
  studentCount: number;
}): InterventionStrategy {
  if (lowestScore < 30 || averageScore < 35) {
    return "reteach_then_reassess";
  }

  if (averageScore < 50 || studentCount >= 2) {
    return "targeted_practice";
  }

  return "monitor_with_evidence";
}

function rationaleForGroup({
  topic,
  averageScore,
  lowestScore,
  studentCount,
}: {
  topic: string;
  averageScore: number;
  lowestScore: number;
  studentCount: number;
}): string {
  if (lowestScore < 30) {
    return `${studentCount} learner${studentCount === 1 ? "" : "s"} need support in ${topic}; the lowest current score is ${lowestScore}%.`;
  }

  if (averageScore < 50) {
    return `${topic} is a shared weakness for ${studentCount} learner${studentCount === 1 ? "" : "s"}, with an average of ${averageScore}%.`;
  }

  return `${studentCount} learner${studentCount === 1 ? "" : "s"} have been flagged for monitoring in ${topic}.`;
}

function evidenceCaution({
  studentCount,
  averageScore,
}: {
  studentCount: number;
  averageScore: number;
}): string {
  if (studentCount === 1) {
    return "This is an individual signal rather than a class-wide pattern. Review the learner's underlying evidence before changing whole-class teaching.";
  }

  if (studentCount < 3) {
    return "This is a small support cohort. Check whether the weakness is repeated across more than one assessed activity.";
  }

  if (averageScore < 35) {
    return "The group signal is strong, but the teacher should still review question-level and topic evidence before deciding the intervention.";
  }

  return "Use this grouping as a planning aid and confirm it against recent assessment evidence.";
}

function stepsForStrategy(
  strategy: InterventionStrategy,
  topic: string,
) {
  if (strategy === "reteach_then_reassess") {
    return [
      {
        id: "review",
        order: 1,
        label: "Review evidence",
        description: `Check the Knowledge Map and recent assessment evidence for ${topic}.`,
      },
      {
        id: "reteach",
        order: 2,
        label: "Reteach",
        description: `Deliver a focused explanation, worked example or misconception check for ${topic}.`,
      },
      {
        id: "reassess",
        order: 3,
        label: "Reassess",
        description: `Assign a short targeted task or written reassessment on ${topic}.`,
      },
      {
        id: "impact",
        order: 4,
        label: "Review impact",
        description:
          "Use the Intervention Centre to compare new evidence against the baseline.",
      },
    ];
  }

  if (strategy === "targeted_practice") {
    return [
      {
        id: "review",
        order: 1,
        label: "Check evidence",
        description: `Confirm the recurring gap in ${topic}.`,
      },
      {
        id: "practice",
        order: 2,
        label: "Targeted practice",
        description: `Assign focused practice that isolates ${topic}.`,
      },
      {
        id: "check",
        order: 3,
        label: "Check improvement",
        description:
          "Review the next graded evidence before escalating support.",
      },
    ];
  }

  return [
    {
      id: "monitor",
      order: 1,
      label: "Monitor",
      description: `Collect another piece of assessed evidence for ${topic}.`,
    },
    {
      id: "review",
      order: 2,
      label: "Review trend",
      description:
        "Only create a formal intervention if the weakness is repeated or worsens.",
    },
  ];
}

function groupQuery(
  students: InterventionPlanningStudent[],
): string {
  const ids = students
    .map((student) => student.id)
    .filter(Boolean)
    .join(",");

  const names = students
    .map((student) => student.name)
    .filter(Boolean)
    .join(",");

  return `studentIds=${encodeURIComponent(ids)}&studentNames=${encodeURIComponent(names)}`;
}

export function buildTeacherInterventionPlan(
  students: InterventionPlanningStudent[],
): TeacherInterventionPlan {
  const grouped = new Map<string, InterventionPlanningStudent[]>();

  students.forEach((student) => {
    const topic = normaliseTopic(student.weakTopic);
    const current = grouped.get(topic) || [];

    current.push({
      ...student,
      weakTopic: topic,
    });

    grouped.set(topic, current);
  });

  const groups: InterventionPlanningGroup[] = Array.from(grouped.entries())
    .map(([topic, members]) => {
      const scores = members.map((student) => student.averageScore);
      const averageScore = average(scores);
      const lowestScore = scores.length ? Math.min(...scores) : 0;
      const priority = priorityForGroup({
        averageScore,
        lowestScore,
        studentCount: members.length,
      });
      const strategy = strategyForGroup({
        averageScore,
        lowestScore,
        studentCount: members.length,
      });
      const cohort = groupQuery(members);

      return {
        id:
          topic
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "support-group",
        topic,
        studentCount: members.length,
        students: [...members].sort(
          (first, second) => first.averageScore - second.averageScore,
        ),
        averageScore,
        lowestScore,
        priority,
        strategy,
        rationale: rationaleForGroup({
          topic,
          averageScore,
          lowestScore,
          studentCount: members.length,
        }),
        evidenceCaution: evidenceCaution({
          studentCount: members.length,
          averageScore,
        }),
        steps: stepsForStrategy(strategy, topic),
        knowledgeMapHref:
          `/teacher/knowledge-map?topic=${encodeURIComponent(topic)}` +
          `&source=intervention-cohort&${cohort}`,
        assignmentHref:
          `/teacher/assignment-wizard?topic=${encodeURIComponent(topic)}` +
          `&source=intervention-cohort&mode=targeted-reassessment&${cohort}`,
        interventionHref:
          `/teacher/interventions?topic=${encodeURIComponent(topic)}` +
          `&source=intervention-cohort&${cohort}`,
      };
    })
    .sort((first, second) => {
      const priorityRank = {
        high: 0,
        medium: 1,
        monitor: 2,
      };

      const difference =
        priorityRank[first.priority] - priorityRank[second.priority];

      if (difference !== 0) return difference;

      if (first.averageScore !== second.averageScore) {
        return first.averageScore - second.averageScore;
      }

      return second.studentCount - first.studentCount;
    });

  return {
    totalStudentsRequiringSupport: students.length,
    highPriorityGroups: groups.filter((group) => group.priority === "high")
      .length,
    groupedTopics: groups.length,
    averageAtRiskScore: average(
      students.map((student) => student.averageScore),
    ),
    groups,
  };
}
