// Finds the script page an answer was written on, using the page markers in the
// vision transcript ("[PAGE n]"). Tries the candidate's own answer lines first,
// then the printed question label, and falls back to page 1.

const squash = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "");

export function splitPages(transcript: string): { page: number; text: string }[] {
  const parts = transcript.split(/\[PAGE (\d+)\]/);
  const pages: { page: number; text: string }[] = [];
  for (let i = 1; i < parts.length; i += 2) pages.push({ page: Number(parts[i]), text: parts[i + 1] ?? "" });
  return pages;
}

export function findAnswerPage(transcript: string, questionId: string, answerText: string): number {
  const pages = splitPages(transcript);
  if (!pages.length) return 1;
  const squashed = pages.map(p => ({ page: p.page, text: squash(p.text) }));

  // Distinctive answer lines, longest first (ignore labels the transcriber adds).
  const lines = answerText.split(/\n+/)
    .map(line => squash(line.replace(/^(?:answer written|working(?: below the line)?|carry digits written above)[^:]*:/i, "")))
    .filter(line => line.length >= 6)
    .sort((a, b) => b.length - a.length)
    .slice(0, 6);
  for (const line of lines) {
    const hit = squashed.find(p => p.text.includes(line));
    if (hit) return hit.page;
  }

  // The printed label, e.g. "2(b)(i)" or "2 (b) (i)".
  const parts = questionId.match(/\d+|\([a-z]+\)|[a-z]+/gi) ?? [];
  if (parts.length) {
    const pattern = new RegExp(`(?:^|\\s)${parts.map(p => p.replace(/[()]/g, "")).map((p, i) => i === 0 ? p : `\\(?${p}\\)?`).join("\\s*")}(?![\\w])`, "im");
    const hit = pages.find(p => pattern.test(p.text));
    if (hit) return hit.page;
  }
  return pages[0].page;
}
