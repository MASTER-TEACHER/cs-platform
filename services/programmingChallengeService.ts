import { allProgrammingChallenges } from "@/data/programming/challenges";
import { getProgrammingCurriculumProfile } from "@/data/programming/programmingCurriculumMap";
import type {
  ProgrammingChallenge,
  ProgrammingChallengeFilter,
  ProgrammingChallengeSelectionContext,
  ProgrammingSkill,
} from "@/types/programming";

function matchesFilter(
  challenge: ProgrammingChallenge,
  filter: ProgrammingChallengeFilter,
): boolean {
  if (challenge.mode !== filter.mode) return false;
  if (challenge.difficulty !== filter.difficulty) return false;
  if (!challenge.qualifications.includes(filter.qualification)) return false;

  if (
    filter.examBoard &&
    challenge.examBoards &&
    !challenge.examBoards.includes(filter.examBoard)
  ) {
    return false;
  }

  if (
    filter.topicId &&
    !challenge.curriculumTopicIds.includes(filter.topicId) &&
    challenge.topicId !== filter.topicId
  ) {
    return false;
  }

  if (filter.skill && !challenge.skills.includes(filter.skill)) {
    return false;
  }

  return true;
}

export function getProgrammingChallenges(
  filter: ProgrammingChallengeFilter,
): ProgrammingChallenge[] {
  return allProgrammingChallenges.filter((challenge) =>
    matchesFilter(challenge, filter),
  );
}

function weakSkillScore(
  challenge: ProgrammingChallenge,
  preferredWeakSkills: ProgrammingSkill[],
): number {
  return challenge.skills.reduce(
    (score, skill) =>
      score + (preferredWeakSkills.includes(skill) ? 5 : 0),
    0,
  );
}

export function chooseNextProgrammingChallenge(
  context: ProgrammingChallengeSelectionContext,
): ProgrammingChallenge | null {
  const matches = getProgrammingChallenges(context);
  if (matches.length === 0) return null;

  const completed = new Set(context.completedChallengeIds ?? []);
  const recent = new Set(context.recentChallengeIds ?? []);
  const weakSkills = context.preferredWeakSkills ?? [];

  const curriculumProfile = getProgrammingCurriculumProfile(
    context.qualification,
    context.examBoard ?? null,
  );

  const prioritySkills = curriculumProfile?.prioritySkills ?? [];

  return [...matches].sort((a, b) => {
    const aCompleted = completed.has(a.id) ? 1 : 0;
    const bCompleted = completed.has(b.id) ? 1 : 0;
    if (aCompleted !== bCompleted) return aCompleted - bCompleted;

    const aRecent = recent.has(a.id) ? 1 : 0;
    const bRecent = recent.has(b.id) ? 1 : 0;
    if (aRecent !== bRecent) return aRecent - bRecent;

    const aWeak = weakSkillScore(a, weakSkills);
    const bWeak = weakSkillScore(b, weakSkills);
    if (aWeak !== bWeak) return bWeak - aWeak;

    const aPriority = a.skills.filter((skill) =>
      prioritySkills.includes(skill)
    ).length;

    const bPriority = b.skills.filter((skill) =>
      prioritySkills.includes(skill)
    ).length;

    if (aPriority !== bPriority) return bPriority - aPriority;

    return a.title.localeCompare(b.title);
  })[0];
}
