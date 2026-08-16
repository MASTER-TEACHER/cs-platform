import type {
  AnalyticsBoundarySource,
  AnalyticsQualification,
  GradeLabel,
} from "@/types/analytics";

export type ExamBoundaryConfigurationRow = {
  grade: GradeLabel;
  minimumMark: number;
};

export type ExamBoundaryConfigurationInput = {
  assignmentId: string;
  teacherId: string;
  qualification: AnalyticsQualification;
  examBoard: string;
  academicYear: string;
  assessmentTitle: string;
  title: string;
  source: AnalyticsBoundarySource;
  sourceNote: string;
  totalMarks: number;
  boundaries: ExamBoundaryConfigurationRow[];
};
