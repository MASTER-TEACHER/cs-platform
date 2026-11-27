// Subject QLA workbook, laid out like a teacher's own tracker: an editable Grade
// Boundaries sheet that drives live formulas, one QLA sheet per paper (topic row,
// maximum row, totals, %, grade, marks to next grade, RAG, heat map, class
// averages and a topic priority table) and a Combined Overview.
//
// buildQlaModel() is pure (no libraries) so its layout and formulas can be tested;
// writeQlaWorkbook() turns the model into an .xlsx with ExcelJS.

export type QlaQuestion = { id: string; maxMarks: number; topic?: string };
export type QlaPaper = { id: string; title: string; questions: QlaQuestion[] };
export type QlaCandidate = { code: string; scores: Record<string, Record<string, number> | null> };
export type QlaInput = {
  examTitle: string;
  qualification: string;
  papers: QlaPaper[];
  candidates: QlaCandidate[];
  boundaries: { grade: string; minimum: number }[];
  boundarySource: string;
};

export type Style = "title" | "note" | "header" | "topic" | "max" | "input" | "label" | "bold" | "warn";
export type Cell = { v?: string | number; f?: string; s?: Style; fmt?: string };
export type Rule = { formula: string; fill: string; font?: string };
export type QlaSheet = {
  name: string;
  cells: Record<string, Cell>;
  widths: Record<number, number>;
  merges: string[];
  freeze?: { row: number; col: number };
  rules: { range: string; rules: Rule[] }[];
};

const GREEN = "C6EFCE", AMBER = "FFEB9C", RED = "FFC7CE";
const GREEN_TEXT = "006100", AMBER_TEXT = "9C5700", RED_TEXT = "9C0006";

export function col(n: number): string {
  let s = "";
  for (let x = n; x > 0; x = Math.floor((x - 1) / 26)) s = String.fromCharCode(65 + ((x - 1) % 26)) + s;
  return s;
}
const quote = (name: string) => `'${name.replace(/'/g, "''")}'`;

/** Working boundaries when none are saved: clearly labelled, editable, not official. */
function defaultBoundaries(qualification: string, total: number) {
  const aLevel = /\bA[\s-]?level|\bAS\b/i.test(qualification);
  const table: [string, number][] = aLevel
    ? [["A*", 0.8], ["A", 0.7], ["B", 0.6], ["C", 0.5], ["D", 0.4], ["E", 0.3]]
    : [["9", 0.85], ["8", 0.75], ["7", 0.65], ["6", 0.55], ["5", 0.45], ["4", 0.35], ["3", 0.25], ["2", 0.15], ["1", 0.05]];
  return table.map(([grade, pct]) => ({ grade, minimum: Math.ceil(pct * total) }));
}

function sheetName(title: string, used: Set<string>): string {
  const base = `${title.replace(/[\[\]:*?/\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 26) || "Paper"} QLA`;
  let name = base, n = 2;
  while (used.has(name.toLowerCase())) name = `${base.slice(0, 27)} ${n++}`;
  used.add(name.toLowerCase());
  return name;
}

export function buildQlaModel(input: QlaInput): { sheets: QlaSheet[]; working: boolean } {
  const papers = input.papers.filter(p => p.questions.length);
  const total = papers.reduce((n, p) => n + p.questions.reduce((m, q) => m + q.maxMarks, 0), 0);
  const working = input.boundaries.length === 0;
  const grades = (working ? defaultBoundaries(input.qualification, total) : input.boundaries)
    .filter(b => b.grade.trim() && Number.isFinite(b.minimum) && b.minimum > 0)
    .sort((a, b) => b.minimum - a.minimum);
  const N = Math.max(1, input.candidates.length);
  const sheets: QlaSheet[] = [];

  // ---------- Grade Boundaries ----------
  const GB = "Grade Boundaries";
  const gb: QlaSheet = { name: GB, cells: {}, widths: { 1: 12, 2: 22, 3: 13 }, merges: ["A1:F1", "A2:F2"], rules: [] };
  gb.cells.A1 = { v: `${input.examTitle} – Grade Boundaries`, s: "title" };
  gb.cells.A2 = { v: working
    ? "WORKING boundaries (not official): edit the yellow minimum marks and every grade in this workbook updates."
    : `Source: ${input.boundarySource || "saved in CS Master"}. You can edit the yellow minimum marks; every grade updates.`, s: working ? "warn" : "note" };
  gb.cells.A4 = { v: "Grade", s: "header" };
  gb.cells.B4 = { v: `Minimum mark (whole exam /${total})`, s: "header" };
  gb.cells.C4 = { v: "Percentage", s: "header" };
  papers.forEach((p, i) => {
    const max = p.questions.reduce((m, q) => m + q.maxMarks, 0);
    gb.cells[`${col(4 + i)}4`] = { v: `Minimum ${p.title} /${max}`, s: "header" };
    gb.widths[4 + i] = 22;
  });
  const first = 5, last = first + grades.length; // last row = U
  [...grades, { grade: "U", minimum: 0 }].forEach((b, i) => {
    const r = first + i;
    const isU = r === last;
    gb.cells[`A${r}`] = { v: /^\d+$/.test(b.grade) ? Number(b.grade) : b.grade, s: "bold" };
    gb.cells[`B${r}`] = isU ? { v: 0 } : { v: b.minimum, s: "input" };
    gb.cells[`C${r}`] = { f: `IF(B${r}="","",B${r}/${total || 1})`, fmt: "0%" };
    papers.forEach((p, k) => {
      const max = p.questions.reduce((m, q) => m + q.maxMarks, 0);
      // Each paper's threshold is the same percentage of that paper.
      gb.cells[`${col(4 + k)}${r}`] = isU ? { v: 0 } : { f: `IF(C${r}="","",ROUNDUP(C${r}*${max},0))` };
    });
  });
  gb.cells[`A${last + 2}`] = { v: "Keep the grades in order, highest first. Per-paper minimums are the whole-exam percentage applied to each paper, for per-paper grades. A mark gets the highest grade whose minimum it reaches.", s: "note" };
  gb.merges.push(`A${last + 2}:F${last + 2}`);
  sheets.push(gb);

  const gradeCol = `${quote(GB)}!$A$${first}:$A$${last}`;
  const minCol = (c: string) => `${quote(GB)}!$${c}$${first}:$${c}$${last}`;
  // Boundaries are listed highest first, so the number of minimums above the mark
  // gives the grade's position (works in every Excel version and Google Sheets).
  const above = (x: string, m: string) => `COUNTIF(${m},">"&${x})`;
  const gradeF = (x: string, m: string) => `IF(${x}="","",INDEX(${gradeCol},${above(x, m)}+1))`;
  const nextF = (x: string, m: string) => `IF(${x}="","",IF(${above(x, m)}=0,"—",INDEX(${gradeCol},${above(x, m)})))`;
  const toNextF = (x: string, m: string) => `IF(${x}="","",IF(${above(x, m)}=0,0,INDEX(${m},${above(x, m)})-${x}))`;
  const ragF = (pct: string) => `IF(${pct}="","",IF(${pct}>=0.7,"Green",IF(${pct}>=0.5,"Amber","Red")))`;
  const ragRules = (range: string, anchor: string): { range: string; rules: Rule[] } => ({ range, rules: [
    { formula: `${anchor}="Green"`, fill: GREEN, font: GREEN_TEXT },
    { formula: `${anchor}="Amber"`, fill: AMBER, font: AMBER_TEXT },
    { formula: `${anchor}="Red"`, fill: RED, font: RED_TEXT },
  ] });

  // ---------- One QLA sheet per paper ----------
  const used = new Set([GB.toLowerCase(), "combined overview", "about this workbook"]);
  const paperRefs: { name: string; max: number; title: string }[] = [];
  const rowStart = 6, rowEnd = 5 + N;
  papers.forEach((paper, k) => {
    const name = sheetName(paper.title, used);
    const max = paper.questions.reduce((m, q) => m + q.maxMarks, 0);
    paperRefs.push({ name, max, title: paper.title });
    const s: QlaSheet = { name, cells: {}, widths: { 1: 26, 2: 12, 3: 10, 4: 12, 5: 12, 6: 10, 7: 9, 8: 18 }, merges: [], freeze: { row: 5, col: 1 }, rules: [] };
    const qStart = 9, qEnd = 8 + paper.questions.length;
    const qL = col(qStart), qR = col(qEnd);
    s.cells.A1 = { v: `${paper.title} – Question Level Analysis`, s: "title" };
    s.cells.A2 = { v: "Approved marks only, by anonymous candidate code. Totals, grades and summaries are live formulas: edit marks or the Grade Boundaries sheet and they update.", s: "note" };
    s.merges.push(`A1:${col(Math.max(12, qEnd))}1`, `A2:${col(Math.max(12, qEnd))}2`);
    ["Candidate code", `Total /${max}`, "%", "Grade", "Marks to next grade", "Next grade", "RAG", "Class / notes"].forEach((h, i) => { s.cells[`${col(i + 1)}4`] = { v: h, s: "header" }; });
    s.cells.A5 = { v: "Maximum", s: "max" };
    s.cells.B5 = { v: max, s: "max" };
    s.cells.C5 = { v: 1, s: "max", fmt: "0%" };
    for (let c = 4; c <= 8; c++) s.cells[`${col(c)}5`] = { s: "max" };
    paper.questions.forEach((q, i) => {
      const c = col(qStart + i);
      s.cells[`${c}3`] = { v: q.topic || "Unmapped", s: "topic" };
      s.cells[`${c}4`] = { v: q.id, s: "header" };
      s.cells[`${c}5`] = { v: q.maxMarks, s: "max" };
      s.widths[qStart + i] = 8;
    });
    s.cells.H3 = { v: "Topic →", s: "topic" };
    const m = minCol(col(4 + k));
    input.candidates.forEach((cand, i) => {
      const r = rowStart + i;
      const scores = cand.scores[paper.id];
      s.cells[`A${r}`] = { v: cand.code, s: "bold" };
      paper.questions.forEach((q, j) => {
        const v = scores?.[q.id];
        if (typeof v === "number") s.cells[`${col(qStart + j)}${r}`] = { v };
      });
      s.cells[`B${r}`] = { f: `IF(COUNT(${qL}${r}:${qR}${r})=0,"",SUM(${qL}${r}:${qR}${r}))` };
      s.cells[`C${r}`] = { f: `IF(B${r}="","",B${r}/$B$5)`, fmt: "0%" };
      s.cells[`D${r}`] = { f: gradeF(`B${r}`, m) };
      s.cells[`E${r}`] = { f: toNextF(`B${r}`, m) };
      s.cells[`F${r}`] = { f: nextF(`B${r}`, m) };
      s.cells[`G${r}`] = { f: ragF(`C${r}`) };
      s.cells[`H${r}`] = { s: "input" };
      if (!scores) s.cells[`H${r}`] = { v: "Pending: not yet approved", s: "input" };
    });
    // Heat map: each mark as a fraction of the question's maximum.
    s.rules.push({ range: `${qL}${rowStart}:${qR}${rowEnd}`, rules: [
      { formula: `AND(ISNUMBER(${qL}${rowStart}),${qL}${rowStart}/${qL}$5>=0.7)`, fill: GREEN, font: GREEN_TEXT },
      { formula: `AND(ISNUMBER(${qL}${rowStart}),${qL}${rowStart}/${qL}$5>=0.4)`, fill: AMBER, font: AMBER_TEXT },
      { formula: `ISNUMBER(${qL}${rowStart})`, fill: RED, font: RED_TEXT },
    ] });
    s.rules.push(ragRules(`G${rowStart}:G${rowEnd}`, `$G${rowStart}`));

    // Class rows.
    const avgRow = rowEnd + 2, pctRow = rowEnd + 3;
    s.cells[`A${avgRow}`] = { v: "Class average", s: "label" };
    s.cells[`A${pctRow}`] = { v: "Success rate", s: "label" };
    s.cells[`B${avgRow}`] = { f: `IFERROR(ROUND(AVERAGE(B${rowStart}:B${rowEnd}),1),"")`, s: "label" };
    s.cells[`C${avgRow}`] = { f: `IFERROR(AVERAGE(C${rowStart}:C${rowEnd}),"")`, s: "label", fmt: "0%" };
    s.cells[`D${avgRow}`] = { f: gradeF(`B${avgRow}`, m), s: "label" };
    paper.questions.forEach((_, j) => {
      const c = col(qStart + j);
      s.cells[`${c}${avgRow}`] = { f: `IFERROR(ROUND(AVERAGE(${c}${rowStart}:${c}${rowEnd}),2),"")`, s: "label" };
      s.cells[`${c}${pctRow}`] = { f: `IFERROR(AVERAGE(${c}${rowStart}:${c}${rowEnd})/${c}$5,"")`, s: "label", fmt: "0%" };
    });
    s.rules.push({ range: `${qL}${pctRow}:${qR}${pctRow}`, rules: [
      { formula: `AND(ISNUMBER(${qL}${pctRow}),${qL}${pctRow}>=0.7)`, fill: GREEN, font: GREEN_TEXT },
      { formula: `AND(ISNUMBER(${qL}${pctRow}),${qL}${pctRow}>=0.5)`, fill: AMBER, font: AMBER_TEXT },
      { formula: `ISNUMBER(${qL}${pctRow})`, fill: RED, font: RED_TEXT },
    ] });

    // Topic analysis.
    const topics = new Map<string, number[]>();
    paper.questions.forEach((q, j) => {
      const t = q.topic || "Unmapped";
      topics.set(t, [...(topics.get(t) ?? []), j]);
    });
    const tHead = pctRow + 3;
    s.cells[`A${tHead - 1}`] = { v: "Topic analysis", s: "title" };
    ["Topic", "Questions", "Available marks", "Class average %", "Priority"].forEach((h, i) => { s.cells[`${col(i + 1)}${tHead}`] = { v: h, s: "header" }; });
    s.merges.push(`A${tHead - 1}:E${tHead - 1}`);
    [...topics.entries()].forEach(([topic, idx], i) => {
      const r = tHead + 1 + i;
      const available = idx.reduce((n, j) => n + paper.questions[j].maxMarks, 0);
      const sums = idx.map(j => `SUM(${col(qStart + j)}${rowStart}:${col(qStart + j)}${rowEnd})`).join("+");
      s.cells[`A${r}`] = { v: topic, s: "bold" };
      s.cells[`B${r}`] = { v: idx.map(j => paper.questions[j].id).join(", ") };
      s.cells[`C${r}`] = { v: available };
      s.cells[`D${r}`] = { f: `IF(COUNT($B$${rowStart}:$B$${rowEnd})=0,"",(${sums})/(COUNT($B$${rowStart}:$B$${rowEnd})*C${r}))`, fmt: "0%" };
      s.cells[`E${r}`] = { f: `IF(D${r}="","",IF(D${r}<0.5,"High",IF(D${r}<0.7,"Medium","Secure")))` };
    });
    const tEnd = tHead + topics.size;
    s.rules.push({ range: `E${tHead + 1}:E${tEnd}`, rules: [
      { formula: `$E${tHead + 1}="Secure"`, fill: GREEN, font: GREEN_TEXT },
      { formula: `$E${tHead + 1}="Medium"`, fill: AMBER, font: AMBER_TEXT },
      { formula: `$E${tHead + 1}="High"`, fill: RED, font: RED_TEXT },
    ] });
    s.cells[`A${tEnd + 2}`] = { v: "Priority: High below 50%, Medium 50–69%, Secure 70%+. Set topics for each question in CS Master (Results → advanced topic mapping) so this table groups them.", s: "note" };
    s.merges.push(`A${tEnd + 2}:${col(Math.max(12, qEnd))}${tEnd + 2}`);
    sheets.push(s);
  });

  // ---------- Combined Overview ----------
  const co: QlaSheet = { name: "Combined Overview", cells: {}, widths: { 1: 16 }, merges: [], freeze: { row: 3, col: 1 }, rules: [] };
  co.cells.A1 = { v: `${input.examTitle} – Combined Overview`, s: "title" };
  const headers = ["Candidate code"];
  paperRefs.forEach(p => headers.push(`${p.title} /${p.max}`, `${p.title} grade`, `${p.title} to next`));
  const base = 2 + paperRefs.length * 3;
  headers.push(`Combined /${total}`, "Combined %", "Grade", "Next grade", "Marks to next grade", "RAG");
  headers.forEach((h, i) => { co.cells[`${col(i + 1)}3`] = { v: h, s: "header" }; co.widths[i + 1] = i === 0 ? 16 : 13; });
  co.merges.push(`A1:${col(headers.length)}1`);
  const cStart = 4, cEnd = 3 + N;
  const cTot = col(base), cPct = col(base + 1), cGrade = col(base + 2), cRag = col(base + 5);
  input.candidates.forEach((cand, i) => {
    const r = cStart + i, src = rowStart + i;
    co.cells[`A${r}`] = { v: cand.code, s: "bold" };
    const totals: string[] = [];
    paperRefs.forEach((p, k) => {
      const c = 2 + k * 3;
      co.cells[`${col(c)}${r}`] = { f: `${quote(p.name)}!B${src}` };
      co.cells[`${col(c + 1)}${r}`] = { f: `${quote(p.name)}!D${src}` };
      co.cells[`${col(c + 2)}${r}`] = { f: `${quote(p.name)}!E${src}` };
      totals.push(`${col(c)}${r}`);
    });
    // Combined only when every paper has an approved mark.
    co.cells[`${cTot}${r}`] = { f: `IF(COUNT(${totals.join(",")})=${paperRefs.length},SUM(${totals.join(",")}),"")` };
    co.cells[`${cPct}${r}`] = { f: `IF(${cTot}${r}="","",${cTot}${r}/${total || 1})`, fmt: "0%" };
    co.cells[`${cGrade}${r}`] = { f: gradeF(`${cTot}${r}`, minCol("B")) };
    co.cells[`${col(base + 3)}${r}`] = { f: nextF(`${cTot}${r}`, minCol("B")) };
    co.cells[`${col(base + 4)}${r}`] = { f: toNextF(`${cTot}${r}`, minCol("B")) };
    co.cells[`${cRag}${r}`] = { f: ragF(`${cPct}${r}`) };
  });
  co.rules.push(ragRules(`${cRag}${cStart}:${cRag}${cEnd}`, `$${cRag}${cStart}`));

  // Class summary and grade distribution.
  const sRow = cEnd + 2;
  co.cells[`A${sRow}`] = { v: "Class average", s: "label" };
  co.cells[`${cTot}${sRow}`] = { f: `IFERROR(ROUND(AVERAGE(${cTot}${cStart}:${cTot}${cEnd}),1),"")`, s: "label" };
  co.cells[`${cPct}${sRow}`] = { f: `IFERROR(AVERAGE(${cPct}${cStart}:${cPct}${cEnd}),"")`, s: "label", fmt: "0%" };
  co.cells[`A${sRow + 1}`] = { v: "Complete (all papers)", s: "label" };
  co.cells[`${cTot}${sRow + 1}`] = { f: `COUNT(${cTot}${cStart}:${cTot}${cEnd})&" of ${input.candidates.length}"`, s: "label" };
  const dRow = sRow + 3;
  co.cells[`A${dRow}`] = { v: "Grade distribution", s: "title" };
  co.cells[`A${dRow + 1}`] = { v: "Grade", s: "header" };
  co.cells[`B${dRow + 1}`] = { v: "Candidates", s: "header" };
  co.cells[`C${dRow + 1}`] = { v: "Share", s: "header" };
  [...grades.map(g => g.grade), "U"].forEach((g, i) => {
    const r = dRow + 2 + i;
    co.cells[`A${r}`] = { f: `${quote(GB)}!A${first + i}`, s: "bold" };
    co.cells[`B${r}`] = { f: `COUNTIF($${cGrade}$${cStart}:$${cGrade}$${cEnd},A${r})` };
    co.cells[`C${r}`] = { f: `IF(COUNT($${cTot}$${cStart}:$${cTot}$${cEnd})=0,"",B${r}/COUNT($${cTot}$${cStart}:$${cTot}$${cEnd}))`, fmt: "0%" };
  });
  sheets.push(co);

  // ---------- About ----------
  const about: QlaSheet = { name: "About this workbook", cells: {}, widths: { 1: 24, 2: 100 }, merges: [], rules: [] };
  [
    ["Exam", `${input.examTitle} (${input.qualification})`],
    ["Marks", "Teacher-approved marks only. Scripts not yet approved show as Pending and are left out of averages."],
    ["Grades", working ? "WORKING boundaries, not official: edit them on the Grade Boundaries sheet." : `Boundaries: ${input.boundarySource || "saved in CS Master"}.`],
    ["RAG", "Green 70%+, Amber 50–69%, Red below 50%. Question cells are shaded by the share of that question's marks gained."],
    ["Topics", "Question topics come from CS Master's topic mapping; unmapped questions are grouped as 'Unmapped'."],
    ["Privacy", "Anonymous candidate codes only. You may add names in the notes column on your own computer; do not upload them back to CS Master."],
  ].forEach(([k, v], i) => { about.cells[`A${i + 1}`] = { v: k, s: "bold" }; about.cells[`B${i + 1}`] = { v }; });
  sheets.push(about);

  return { sheets, working };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Writes the model with ExcelJS (passed in, so this module has no dependency). */
export async function writeQlaWorkbook(model: { sheets: QlaSheet[] }, ExcelJS: any): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "CS Master";
  // Formulas are written without cached results: ask Excel to calculate on open.
  wb.calcProperties = { fullCalcOnLoad: true };
  const fill = (argb: string) => ({ type: "pattern", pattern: "solid", fgColor: { argb: `FF${argb}` } });
  const styles: Record<Style, (cell: any) => void> = {
    title: c => { c.font = { bold: true, size: 14, color: { argb: "FF1F2937" } }; },
    note: c => { c.font = { italic: true, size: 9, color: { argb: "FF475569" } }; c.alignment = { wrapText: true, vertical: "top" }; },
    warn: c => { c.font = { bold: true, size: 10, color: { argb: "FF9C0006" } }; c.fill = fill("FFF2CC"); c.alignment = { wrapText: true }; },
    header: c => { c.font = { bold: true, color: { argb: "FFFFFFFF" } }; c.fill = fill("3730A3"); c.alignment = { wrapText: true, vertical: "middle", horizontal: "center" }; },
    topic: c => { c.font = { italic: true, size: 9, color: { argb: "FF3730A3" } }; c.fill = fill("E0E7FF"); c.alignment = { wrapText: true, textRotation: 90, vertical: "bottom", horizontal: "center" }; },
    max: c => { c.font = { bold: true }; c.fill = fill("E5E7EB"); },
    input: c => { c.fill = fill("FFF2CC"); },
    label: c => { c.font = { bold: true }; c.fill = fill("F1F5F9"); },
    bold: c => { c.font = { bold: true }; },
  };
  for (const s of model.sheets) {
    const ws = wb.addWorksheet(s.name);
    for (const [ref, cell] of Object.entries(s.cells)) {
      const c = ws.getCell(ref);
      if (cell.f !== undefined) c.value = { formula: cell.f };
      else if (cell.v !== undefined) c.value = cell.v;
      if (cell.s) styles[cell.s](c);
      if (cell.fmt) c.numFmt = cell.fmt;
    }
    for (const [i, w] of Object.entries(s.widths)) ws.getColumn(Number(i)).width = w;
    for (const m of s.merges) ws.mergeCells(m);
    if (s.freeze) ws.views = [{ state: "frozen", ySplit: s.freeze.row, xSplit: s.freeze.col }];
    for (const group of s.rules) {
      ws.addConditionalFormatting({
        ref: group.range,
        rules: group.rules.map((r, i) => ({
          type: "expression", priority: i + 1, formulae: [r.formula],
          style: { fill: { type: "pattern", pattern: "solid", bgColor: { argb: `FF${r.fill}` } }, ...(r.font ? { font: { color: { argb: `FF${r.font}` } } } : {}) },
        })),
      });
    }
    // Tall topic row on QLA sheets.
    if (s.cells.H3?.s === "topic") ws.getRow(3).height = 90;
  }
  const bytes = await wb.xlsx.writeBuffer();
  return new Uint8Array(bytes);
}
