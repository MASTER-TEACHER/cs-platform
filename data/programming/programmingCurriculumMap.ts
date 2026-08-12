import type {
  ProgrammingExamBoard,
  ProgrammingQualification,
  ProgrammingSkill,
} from "@/types/programming";

export type ProgrammingCurriculumProfile = {
  qualification: ProgrammingQualification;
  examBoard: ProgrammingExamBoard;
  prioritySkills: ProgrammingSkill[];
  supportedTopicIds: string[];
};

export const programmingCurriculumProfiles: ProgrammingCurriculumProfile[] = [
  {
    qualification: "GCSE",
    examBoard: "AQA",
    prioritySkills: [
      "sequence", "input-output", "variables", "selection", "iteration",
      "strings", "lists", "functions", "validation", "testing",
      "debugging", "files", "searching", "sorting",
    ],
    supportedTopicIds: ["programming", "algorithms"],
  },
  {
    qualification: "GCSE",
    examBoard: "OCR",
    prioritySkills: [
      "sequence", "input-output", "variables", "selection", "iteration",
      "strings", "lists", "functions", "validation", "testing",
      "debugging", "files", "searching", "sorting",
    ],
    supportedTopicIds: ["programming", "algorithms"],
  },
  {
    qualification: "GCSE",
    examBoard: "EDEXCEL",
    prioritySkills: [
      "sequence", "input-output", "variables", "selection", "iteration",
      "strings", "lists", "functions", "validation", "testing",
      "debugging", "searching", "sorting",
    ],
    supportedTopicIds: ["programming", "algorithms"],
  },
  {
    qualification: "A_LEVEL",
    examBoard: "AQA",
    prioritySkills: [
      "functions", "recursion", "oop", "stacks", "queues",
      "searching", "sorting", "algorithmic-thinking",
      "testing", "debugging", "files",
    ],
    supportedTopicIds: [
      "advanced-programming",
      "data-structures",
      "algorithms",
      "computational-thinking",
      "software-development",
    ],
  },
  {
    qualification: "A_LEVEL",
    examBoard: "OCR",
    prioritySkills: [
      "functions", "recursion", "oop", "stacks", "queues",
      "searching", "sorting", "algorithmic-thinking",
      "testing", "debugging", "files",
    ],
    supportedTopicIds: [
      "advanced-programming",
      "data-structures",
      "algorithms",
      "computational-thinking",
      "software-development",
    ],
  },
];

export function getProgrammingCurriculumProfile(
  qualification: ProgrammingQualification,
  examBoard: ProgrammingExamBoard | null,
): ProgrammingCurriculumProfile | null {
  if (!examBoard) return null;

  return (
    programmingCurriculumProfiles.find(
      (profile) =>
        profile.qualification === qualification &&
        profile.examBoard === examBoard,
    ) ?? null
  );
}
