import type { Topic } from "@/types/curriculum";
import { binaryTopic } from "./binary";
import { hexadecimalTopic } from "./hexadecimal";

export const topicLibrary: Record<string, Topic> = {
  binary: binaryTopic,
  hexadecimal: hexadecimalTopic,
};