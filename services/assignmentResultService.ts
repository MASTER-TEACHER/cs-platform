export type QuizIntegrityIncidentType =
  | "fullscreen_exit"
  | "fullscreen_restored"
  | "page_hidden"
  | "page_visible"
  | "auto_submit";

export type QuizIntegrityIncident = {
  id: string;
  type: QuizIntegrityIncidentType;
  occurredAt: string;
  questionNumber: number | null;
  detail: string;
};

export type SaveAssignmentResultInput = {
  assignmentId: string;
  studentId: string;
  classId: string;
  teacherId: string;
  assignmentType: "lesson" | "quiz";
  resourceId: string;

  score?: number;
  totalQuestions?: number;
  percentage?: number;
  earnedXP?: number;
  timeTakenSeconds?: number;

  /*
   * Quiz delivery / integrity evidence.
   *
   * Practice assignments keep the default "practice" value.
   * Assessment quizzes may additionally save an integrity timeline.
   */
  deliveryMode?: "practice" | "assessment";
  integritySessionStartedAt?: string | null;
  integrityIncidents?: QuizIntegrityIncident[];
  integrityTerminated?: boolean;
  integrityTerminationReason?: string;
};

/** @deprecated Direct browser writes to assessed results are forbidden. */
export async function saveAssignmentResult(_input: SaveAssignmentResultInput): Promise<string> {
  void _input;
  throw new Error("Legacy assignment result writes are disabled. Use /api/quiz/secure.");
}
