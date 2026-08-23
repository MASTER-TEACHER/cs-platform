import type { Quiz } from "@/types/quiz";

import { algorithmsQuiz } from "./algorithms";
import { binaryQuiz } from "./binary";
import { booleanLogicQuiz } from "./boolean-logic";
import { charactersQuiz } from "./characters";
import { compressionQuiz } from "./compression";
import { cpuQuiz } from "./cpu";
import { cyberSecurityQuiz } from "./cyber-security";
import { databasesQuiz } from "./databases";
import { ethicalLegalQuiz } from "./ethical-legal";
import { hexadecimalQuiz } from "./hexadecimal";
import { imagesQuiz } from "./images";
import { memoryStorageQuiz } from "./memory-storage";
import { networksQuiz } from "./networks";
import { programmingLanguagesQuiz } from "./programming-languages";
import { programmingQuiz } from "./programming";
import { soundQuiz } from "./sound";
import { systemsSoftwareQuiz } from "./systems-software";

export const quizLibrary: Record<string, Quiz> = {
  algorithms: algorithmsQuiz,
  binary: binaryQuiz,
  "boolean-logic": booleanLogicQuiz,
  characters: charactersQuiz,
  compression: compressionQuiz,
  cpu: cpuQuiz,
  "cyber-security": cyberSecurityQuiz,
  databases: databasesQuiz,
  "ethical-legal": ethicalLegalQuiz,
  hexadecimal: hexadecimalQuiz,
  images: imagesQuiz,
  "memory-storage": memoryStorageQuiz,
  networks: networksQuiz,
  "programming-languages": programmingLanguagesQuiz,
  programming: programmingQuiz,
  sound: soundQuiz,
  "systems-software": systemsSoftwareQuiz,
};
