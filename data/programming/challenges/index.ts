import { debugProgrammingChallenges } from "@/data/programming/debugChallenges";
import type { ProgrammingChallenge } from "@/types/programming";

import { foundationProgrammingChallenges } from "./foundation";
import { higherProgrammingChallenges } from "./higher";
import { intermediateProgrammingChallenges } from "./intermediate";

export const practiceProgrammingChallenges: ProgrammingChallenge[] = [
  ...foundationProgrammingChallenges,
  ...intermediateProgrammingChallenges,
  ...higherProgrammingChallenges,
];

export const allProgrammingChallenges: ProgrammingChallenge[] = [
  ...practiceProgrammingChallenges,
  ...debugProgrammingChallenges,
];

export function getProgrammingChallengeById(
  challengeId: string,
): ProgrammingChallenge | null {
  return (
    allProgrammingChallenges.find(
      (challenge) => challenge.id === challengeId,
    ) ?? null
  );
}
