import { Quiz } from "@/types/quiz";
import { binaryQuiz } from "./binary";
import { hexadecimalQuiz } from "./hexadecimal";

export const quizLibrary: Record<string, Quiz> = {
  binary: binaryQuiz,
  hexadecimal: hexadecimalQuiz,
};