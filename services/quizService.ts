/** @deprecated Client-side result awarding is disabled. Use the trusted secure quiz API. */
export type SaveQuizResultParams = {
  uid: string;
  quizId: string;
  topicId: string;
  title: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  earnedXP: number;
};

export async function saveQuizResult(_params: SaveQuizResultParams): Promise<string> {
  void _params;
  throw new Error("Legacy client quiz result writes are disabled. Use /api/quiz/secure.");
}
