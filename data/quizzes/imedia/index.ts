import type { Quiz } from "@/types/quiz";
import { imediaR093Quiz } from "./r093";
import { imediaR094Quiz } from "./r094";
import { imediaR095Quiz } from "./r095";
import { imediaR096Quiz } from "./r096";
import { imediaR097Quiz } from "./r097";
import { imediaR098Quiz } from "./r098";
import { imediaR099Quiz } from "./r099";

export const imediaQuizLibrary: Record<string, Quiz> = {
  "imedia-r093": imediaR093Quiz,
  "imedia-r094": imediaR094Quiz,
  "imedia-r095": imediaR095Quiz,
  "imedia-r096": imediaR096Quiz,
  "imedia-r097": imediaR097Quiz,
  "imedia-r098": imediaR098Quiz,
  "imedia-r099": imediaR099Quiz,
};
