export type IMediaPracticeKind = "exam" | "knowledge" | "planning" | "testing" | "review";
export interface IMediaPracticeItem {
  id: string; unitId: string; kind: IMediaPracticeKind; title: string;
  prompt: string; marks?: number; successCriteria: string[]; modelGuidance: string;
  assessmentSafe: boolean;
}
