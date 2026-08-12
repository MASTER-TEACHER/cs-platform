import { algorithmsTopic } from "./algorithms";
import { binaryTopic } from "./binary";
import { booleanLogicTopic } from "./boolean-logic";
import { charactersTopic } from "./characters";
import { compressionTopic } from "./compression";
import { cpuTopic } from "./cpu";
import { cyberSecurityTopic } from "./cyber-security";
import { databasesTopic } from "./databases";
import { hexadecimalTopic } from "./hexadecimal";
import { imagesTopic } from "./images";
import { memoryStorageTopic } from "./memory-storage";
import { networksTopic } from "./networks";
import { programmingTopic } from "./programming";
import { soundTopic } from "./sound";
import { systemsSoftwareTopic } from "./systems-software";
import { ethicalLegalTopic } from "./ethical-legal";
import { programmingLanguagesTopic } from "./programming-languages";

import { advancedProgrammingTopic } from "./a-level/advanced-programming";
import { dataStructuresTopic } from "./a-level/data-structures";
import { theoryComputationTopic } from "./a-level/theory-computation";
import { advancedDataRepresentationTopic } from "./a-level/advanced-data-representation";
import { advancedSystemsTopic } from "./a-level/advanced-systems";
import { advancedNetworksTopic } from "./a-level/advanced-networks";
import { advancedDatabasesTopic } from "./a-level/advanced-databases";
import { functionalProgrammingTopic } from "./a-level/functional-programming";
import { bigDataTopic } from "./a-level/big-data";
import { softwareDevelopmentTopic } from "./a-level/software-development";
import { legalEthicalALevelTopic } from "./a-level/legal-ethical-a-level";
import { computationalThinkingTopic } from "./a-level/computational-thinking";

import type { Topic } from "@/types/curriculum";

function createTopicLibrary(topics: Topic[]): Record<string, Topic> {
  return Object.fromEntries(topics.map((topic) => [topic.id, topic]));
}

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

  advancedProgrammingTopic,
  dataStructuresTopic,
  theoryComputationTopic,
  advancedDataRepresentationTopic,
  advancedSystemsTopic,
  advancedNetworksTopic,
  advancedDatabasesTopic,
  functionalProgrammingTopic,
  bigDataTopic,
  softwareDevelopmentTopic,
  legalEthicalALevelTopic,
  computationalThinkingTopic,
];

export const topicLibrary = createTopicLibrary(publishedTopics);

export function getTopicById(topicId: string): Topic | null {
  return topicLibrary[topicId] ?? null;
}

export function getPublishedTopics(): Topic[] {
  return publishedTopics.filter((topic) => topic.status !== "coming-soon");
}

export function getTotalPublishedLessons(): number {
  return getPublishedTopics().reduce(
    (total, topic) => total + topic.lessons.length,
    0,
  );
}
