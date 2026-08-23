export type TeacherContentKind =
  | "teaching-resource"
  | "ai-quiz"
  | "exam-paper";

export type TeacherContentLifecycle =
  | "draft"
  | "published"
  | "archived";

export type TeacherContentItem = {
  key: string;
  id: string;
  teacherId: string;
  kind: TeacherContentKind;
  title: string;
  description: string;
  topic: string;
  qualification: string;
  examBoard: string;
  yearGroup: string;
  difficulty: string;
  lifecycle: TeacherContentLifecycle;
  questionCount: number | null;
  totalMarks: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  openHref: string;
  assignHref: string | null;
};
