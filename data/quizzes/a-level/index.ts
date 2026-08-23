import type { Quiz } from "@/types/quiz";

import { advancedDataRepresentationQuiz } from "./advanced-data-representation";
import { advancedDatabasesQuiz } from "./advanced-databases";
import { advancedNetworksQuiz } from "./advanced-networks";
import { advancedProgrammingQuiz } from "./advanced-programming";
import { advancedSystemsQuiz } from "./advanced-systems";
import { bigDataQuiz } from "./big-data";
import { computationalThinkingQuiz } from "./computational-thinking";
import { dataStructuresQuiz } from "./data-structures";
import { functionalProgrammingQuiz } from "./functional-programming";
import { legalEthicalALevelQuiz } from "./legal-ethical-a-level";
import { softwareDevelopmentQuiz } from "./software-development";
import { theoryComputationQuiz } from "./theory-computation";

export const aLevelQuizLibrary: Record<string, Quiz> = {
  "advanced-data-representation": advancedDataRepresentationQuiz,
  "advanced-databases": advancedDatabasesQuiz,
  "advanced-networks": advancedNetworksQuiz,
  "advanced-programming": advancedProgrammingQuiz,
  "advanced-systems": advancedSystemsQuiz,
  "big-data": bigDataQuiz,
  "computational-thinking": computationalThinkingQuiz,
  "data-structures": dataStructuresQuiz,
  "functional-programming": functionalProgrammingQuiz,
  "legal-ethical-a-level": legalEthicalALevelQuiz,
  "software-development": softwareDevelopmentQuiz,
  "theory-computation": theoryComputationQuiz,
};
