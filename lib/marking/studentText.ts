/*
 * Feedback and improvement guidance are shown to students. Remove any sentence
 * that talks about the marking process rather than the student's answer
 * (transcription, examiners, moderation, AI, uncertain readings).
 */
const INTERNAL =
  /(\btranscri\w*|\bexaminer|\bmoderat\w*|\bthe ai\b|\bai (?:marker|model)|\blanguage model|\bhandwriting (?:was|is|may be) (?:unclear|illegible|hard)|\buncertain reading|\[\[|\[uncertain|\bscanned (?:copy|page|script))/i;

export function studentFacing(text: string | undefined | null): string {
  const value = (text ?? "").trim();
  if (!value) return "";
  const sentences = value.split(/(?<=[.!?])\s+/);
  const kept = sentences.filter((sentence) => !INTERNAL.test(sentence));
  return kept.join(" ").trim();
}
