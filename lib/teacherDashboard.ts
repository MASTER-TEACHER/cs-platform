export function getPerformanceMessage(score: number) {
  if (score >= 80) {
    return "Excellent overall quiz performance";
  }

  if (score >= 70) {
    return "Strong performance across completed quizzes";
  }

  if (score >= 50) {
    return "Developing performance with room for improvement";
  }

  if (score > 0) {
    return "Targeted intervention may be required";
  }

  return "Quiz scores will appear after student attempts";
}

export function getCompletionMessage(rate: number) {
  if (rate >= 90) {
    return "Excellent submission rate";
  }

  if (rate >= 75) {
    return "Strong assignment engagement";
  }

  if (rate >= 50) {
    return "Some outstanding work requires follow-up";
  }

  if (rate > 0) {
    return "Review incomplete and overdue work";
  }

  return "Completion data will appear after assignments";
}
