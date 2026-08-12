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
import type { Topic } from "@/types/curriculum";
import { programmingLanguagesTopic } from "./programming-languages";

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
