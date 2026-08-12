import type { ExamBoard, Qualification } from "@/types/user";

export type CurriculumTopicReference = {
  id: string;
  title: string;
  description?: string;
  lessonIds: string[];
};

export type CurriculumUnit = {
  id: string;
  title: string;
  description?: string;
  topicIds: string[];
};

export type CurriculumPaper = {
  id: string;
  title: string;
  description?: string;
  units: CurriculumUnit[];
};

export type CurriculumCourse = {
  id: string;
  title: string;
  qualification: Qualification;
  examBoard: ExamBoard;
  papers: CurriculumPaper[];
};
