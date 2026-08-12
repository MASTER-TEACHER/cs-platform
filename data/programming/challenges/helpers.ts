import type {
  ProgrammingChallenge,
  ProgrammingDifficulty,
  ProgrammingExamBoard,
  ProgrammingQualification,
  ProgrammingSkill,
  ProgrammingTestCase,
} from "@/types/programming";

type ChallengeInput = {
  id: string;
  title: string;
  description: string;
  topicId: string;
  curriculumTopicIds?: string[];
  skills: ProgrammingSkill[];
  mode?: "practice" | "debug";
  difficulty: ProgrammingDifficulty;
  qualifications: ProgrammingQualification[];
  examBoards?: ProgrammingExamBoard[];
  starterCode: string;
  stdin?: string;
  visibleTests: ProgrammingTestCase[];
  hiddenTests?: ProgrammingTestCase[];
  hint: string;
  secondHint?: string;
  explanation: string;
  examinerTip: string;
  xpReward: number;
  estimatedMinutes?: number;
};

export function challenge(input: ChallengeInput): ProgrammingChallenge {
  return {
    ...input,
    curriculumTopicIds: input.curriculumTopicIds ?? [input.topicId],
    mode: input.mode ?? "practice",
    hiddenTests: input.hiddenTests ?? [],
    estimatedMinutes: input.estimatedMinutes ?? 8,
  };
}

export function visible(id: string, label: string, input: string, expectedOutput: string): ProgrammingTestCase {
  return { id, label, input, expectedOutput };
}

export function hidden(id: string, label: string, input: string, expectedOutput: string): ProgrammingTestCase {
  return { id, label, input, expectedOutput, hidden: true };
}
