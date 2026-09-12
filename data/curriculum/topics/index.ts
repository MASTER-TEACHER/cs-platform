import { algorithmsTopic } from "./algorithms";
import { binaryTopic } from "./binary";
import { booleanLogicTopic } from "./boolean-logic";
import { charactersTopic } from "./characters";
import { compressionTopic } from "./compression";
import { cpuTopic } from "./cpu";
import { cyberSecurityTopic } from "./cyber-security";
import { databasesTopic } from "./databases";
import { ethicalLegalTopic } from "./ethical-legal";
import { hexadecimalTopic } from "./hexadecimal";
import { imagesTopic } from "./images";
import { memoryStorageTopic } from "./memory-storage";
import { networksTopic } from "./networks";
import { programmingLanguagesTopic } from "./programming-languages";
import { programmingTopic } from "./programming";
import { soundTopic } from "./sound";
import { systemsSoftwareTopic } from "./systems-software";

import { advancedDataRepresentationTopic } from "./a-level/advanced-data-representation";
import { advancedDatabasesTopic } from "./a-level/advanced-databases";
import { advancedNetworksTopic } from "./a-level/advanced-networks";
import { advancedProgrammingTopic } from "./a-level/advanced-programming";
import { advancedSystemsTopic } from "./a-level/advanced-systems";
import { bigDataTopic } from "./a-level/big-data";
import { computationalThinkingTopic } from "./a-level/computational-thinking";
import { dataStructuresTopic } from "./a-level/data-structures";
import { functionalProgrammingTopic } from "./a-level/functional-programming";
import { legalEthicalALevelTopic } from "./a-level/legal-ethical-a-level";
import { softwareDevelopmentTopic } from "./a-level/software-development";
import { theoryComputationTopic } from "./a-level/theory-computation";
import {
  withSupplementalALevelLessons,
} from "./a-level/supplemental-lessons";

import type { Topic } from "@/types/curriculum";

function createTopicLibrary(
  topics: Topic[],
): Record<string, Topic> {
  return Object.fromEntries(
    topics.map((topic) => [topic.id, topic]),
  );
}

const aLevelTopics = [
  advancedProgrammingTopic,
  advancedDataRepresentationTopic,
  advancedSystemsTopic,
  advancedNetworksTopic,
  advancedDatabasesTopic,
  dataStructuresTopic,
  computationalThinkingTopic,
  theoryComputationTopic,
  functionalProgrammingTopic,
  softwareDevelopmentTopic,
  bigDataTopic,
  legalEthicalALevelTopic,
].map(
  withSupplementalALevelLessons,
);

export const publishedTopics: Topic[] = [
  binaryTopic,
  hexadecimalTopic,
  charactersTopic,
  imagesTopic,
  soundTopic,
  compressionTopic,
  cpuTopic,
  memoryStorageTopic,
  systemsSoftwareTopic,
  networksTopic,
  cyberSecurityTopic,
  algorithmsTopic,
  programmingTopic,
  databasesTopic,
  booleanLogicTopic,
  ethicalLegalTopic,
  programmingLanguagesTopic,
  ...aLevelTopics,
];

export const topicLibrary =
  createTopicLibrary(
    publishedTopics,
  );

export function getTopicById(
  topicId: string,
): Topic | null {
  return topicLibrary[topicId] ?? null;
}

export function getPublishedTopics(): Topic[] {
  return publishedTopics.filter(
    (topic) =>
      topic.status !==
      "coming-soon",
  );
}

export function getTotalPublishedLessons(): number {
  return getPublishedTopics().reduce(
    (total, topic) =>
      total +
      topic.lessons.length,
    0,
  );
}
