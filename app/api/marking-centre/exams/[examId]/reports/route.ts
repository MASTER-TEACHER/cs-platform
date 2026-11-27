import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import ExcelJS from "exceljs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { requireAuthenticatedUser } from "@/lib/auth/requireUser";
import { centreCollection, requireCentreTeacher } from "@/lib/marking/centre";
import { studentFacing } from "@/lib/marking/studentText";
import { GET as getResults } from "../results/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ examId: string }> };
type Mark = { questionId: string; awardedMarks: number; feedback?: string; evidence?: string; teacherJustification?: string };
type Detail = { candidateCode: string; paper: string; paperId: string; question: string; awarded: number; maximum: number; feedback: string; improvement: string; evidence: string; guidanceStatus: string };
const safe = (value: unknown) => String(value ?? "").replace(/[\u0000-\u001f]/g, " ").trim();
const csvCell = (value: unknown) => { const v = safe(value); const guarded = /^[=+@\-\t\r]/.test(v) ? "'" + v : v; return `"${guarded.replace(/"/g, '""')}"`; };
const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
// Standard PDF fonts only support WinAnsi. Convert mathematical Unicode to readable
// ASCII equivalents instead of silently removing operators or changing equations.
// CSV and Excel retain the teacher's original Unicode text.
function pdfMathText(value: unknown): string {
  const subscript: Record<string, string> = { "₀":"0", "₁":"1", "₂":"2", "₃":"3", "₄":"4", "₅":"5", "₆":"6", "₇":"7", "₈":"8", "₉":"9", "ₙ":"n", "ₓ":"x", "ᵢ":"i" };
  const superscript: Record<string, string> = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "ⁿ":"n", "⁻":"-", "⁺":"+" };
  const operators: Record<string, string> = {
    "−":"-", "–":"-", "—":"-", "‑":"-", "×":" * ", "⋅":" * ", "·":" * ",
    "÷":" / ", "⁄":"/", "＝":"=", "≠":" != ", "≤":" <= ", "≥":" >= ",
    "≈":" ~= ", "±":" +/- ", "√":"sqrt", "∞":"infinity", "π":"pi",
    "∑":"sum", "∫":"integral", "Δ":"Delta", "θ":"theta", "α":"alpha", "β":"beta",
    "′":"'", "″":"''", "→":" -> ", "⇒":" => ", "∈":" in ", "∩":" intersect ", "∪":" union ",
    "“":'"', "”":'"', "‘":"'", "’":"'", "…":"...", "°":" degrees",
  };
  let out = "";
  const input = String(value ?? "");
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c in subscript) {
      // Group consecutive subscript characters into one readable index: u₁₅ -> u_(15).
      let group = "";
      while (i < input.length && input[i] in subscript) group += subscript[input[i++]];
      i--;
      out += `_${group.length > 1 ? `(${group})` : group}`;
    } else if (c in superscript) {
      let group = "";
      while (i < input.length && input[i] in superscript) group += superscript[input[i++]];
      i--;
      out += `^${group.length > 1 ? `(${group})` : group}`;
    } else if (c in operators) out += operators[c];
    else if (c === "\n" || c === "\r" || c === "\t") out += " ";
    else if (c.charCodeAt(0) >= 32 && c.charCodeAt(0) <= 126) out += c;
    else if (c === "£") out += "GBP ";
    else if (c === "€") out += "EUR ";
    else out += "[symbol]"; // Visible flag; never silently drop an unknown mathematical character.
  }
  return out.replace(/\s+/g, " ").trim();
}

// Never infer an improvement instruction by copying a feedback sentence.
// Only separately teacher-approved guidance is distributed as improvement advice.
const missingGuidance = "Improvement guidance not yet approved by the teacher.";
function guidanceKey(paperId: string, candidateCode: string, questionId: string) {
  return createHash("sha256").update(JSON.stringify([paperId, candidateCode, questionId])).digest("hex");
}
function textResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  const status = message.startsWith("AUTH_") ? 401 : message === "CENTRE_FORBIDDEN" ? 403 : message === "CENTRE_NOT_FOUND" ? 404 : message === "INVALID_REPORT" ? 400 : 500;
  return NextResponse.json({ error: status === 500 ? "Unable to generate report." : message }, { status, headers });
}
export async function GET(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("INVALID_REPORT");
    const ref = centreCollection.doc(examId);
    const exam = await ref.get();
    if (!exam.exists || exam.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
    const papers = exam.data()?.papers as { id: string; title?: string }[] | undefined;
    if (!Array.isArray(papers) || !papers.length) throw new Error("INVALID_REPORT");
    const resultResponse = await getResults(request, context);
    if (!resultResponse.ok) return resultResponse;
    const result = await resultResponse.json() as { rows: { candidateCode: string; total: number | null; grade: string | null; status: string; paperScores: Record<string, number | null> }[]; maximum: number; grading: { mode: string; sourceNote: string } };
    const [reviews, scripts, guidanceDocs, ...structures] = await Promise.all([
      ref.collection("markingReviews").limit(3000).get(),
      ref.collection("candidateScripts").limit(3000).get(),
      ref.collection("reportGuidance").limit(3000).get(),
      ...papers.map(p => ref.collection("paperStructures").doc(p.id).get()),
    ]);
    const reviewMap = new Map(reviews.docs.map(d => [d.id, d.data()]));
    const scriptMap = new Map(scripts.docs.map(d => [d.id, d.data()]));
    const guidanceMap = new Map(guidanceDocs.docs.map(d => [d.id, d.data()]));
    const details: Detail[] = [];
    for (const row of result.rows) for (let i = 0; i < papers.length; i++) {
      const paper = papers[i];
      if (row.paperScores[paper.id] === null) continue;
      const key = `${paper.id}_${row.candidateCode}`;
      const review = reviewMap.get(key);
      const script = scriptMap.get(key);
      const structure = structures[i].data();
      if (!review || !script || !structure || review.status !== "approved" || structure.status !== "approved") continue;
      if (!review.approvedAt?.toMillis || !script.uploadedAt?.toMillis || review.approvedAt.toMillis() < script.uploadedAt.toMillis()) continue;
      const hash = createHash("sha256").update(JSON.stringify(structure.questions)).digest("hex");
      if (review.structureHash !== hash || !Array.isArray(review.marks) || !Array.isArray(structure.questions)) continue;
      for (const q of structure.questions as { id: string; maxMarks: number }[]) {
        const mark = (review.marks as Mark[]).find(m => m.questionId === q.id);
        if (!mark || !Number.isInteger(mark.awardedMarks) || mark.awardedMarks < 0 || mark.awardedMarks > q.maxMarks) continue;
        // Student-facing text: strip any sentences about the marking process (older reviews).
        const feedback = safe(studentFacing(mark.feedback) || (mark.awardedMarks === q.maxMarks ? "Full marks." : "See the improvement guidance for this question."));
        const saved = guidanceMap.get(guidanceKey(paper.id, row.candidateCode, q.id));
        const approved = saved?.status === "approved" && saved?.structureHash === hash && saved?.reviewRevision === review.revision && saved?.awardedMarks === mark.awardedMarks && typeof saved?.text === "string" && saved.text.trim().length > 0;
        // Integrated improvement guidance becomes approved only as part of the locked, current teacher-approved marking review.
        // Legacy separately approved guidance remains supported for older reviews.
        const integrated = typeof (mark as Mark & { improvementGuidance?: string }).improvementGuidance === "string" ? (mark as Mark & { improvementGuidance?: string }).improvementGuidance!.trim() : "";
        const integratedApproved = review.status === "approved" && integrated.length > 0;
        details.push({ candidateCode: row.candidateCode, paper: paper.title || paper.id, paperId: paper.id, question: q.id, awarded: mark.awardedMarks, maximum: q.maxMarks, feedback, improvement: mark.awardedMarks === q.maxMarks ? "Full marks achieved." : integratedApproved ? safe(studentFacing(integrated)) : approved ? safe(studentFacing(saved.text)) : missingGuidance, evidence: safe(mark.evidence), guidanceStatus: mark.awardedMarks === q.maxMarks ? "not_required" : (integratedApproved || approved) ? "approved" : "needs_teacher_approval" });
      }
    }
    const url = new URL(request.url);
    const format = url.searchParams.get("format") ?? "detailed-csv";
    const candidate = url.searchParams.get("candidateCode");
    if (format === "guidance-json") {
      return NextResponse.json({ details }, { headers });
    }
    if (format === "detailed-csv") {
      const table = [["Candidate code", "Paper", "Question", "Marks awarded", "Maximum marks", "Approved feedback", "Improvement guidance", "Guidance status", "Evidence"], ...details.map(d => [d.candidateCode, d.paper, d.question, d.awarded, d.maximum, d.feedback, d.improvement, d.guidanceStatus, d.evidence])];
      const body = "\uFEFF" + table.map(row => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
      return new Response(body, { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="csmaster-detailed-feedback.csv"' } });
    }
    if (format === "qla-xlsx") {
      // Tracker-style QLA: editable boundaries driving live grade formulas, a sheet per
      // paper with heat map and topic priorities, and a combined overview.
      const examData = exam.data() ?? {};
      const mappings = (examData.qlaTopicMappings && typeof examData.qlaTopicMappings === "object" ? examData.qlaTopicMappings : {}) as Record<string, string>;
      const boundaries = Array.isArray(examData.gradingBoundaries) ? examData.gradingBoundaries as { grade: string; minimum: number }[] : [];
      const detailMap = new Map(details.map(d => [`${d.paperId}::${d.candidateCode}::${d.question}`, d]));
      const qlaPapers = papers.map((p, i) => ({
        id: p.id, title: p.title || p.id,
        questions: ((structures[i].data()?.questions ?? []) as { id: string; maxMarks: number }[]).map(q => ({ id: q.id, maxMarks: q.maxMarks, topic: mappings[`${p.id}::${q.id}`] || undefined })),
      }));
      const candidates = result.rows.map(r => ({
        code: r.candidateCode,
        scores: Object.fromEntries(qlaPapers.map(p => {
          const marks = p.questions.map(q => [q.id, detailMap.get(`${p.id}::${r.candidateCode}::${q.id}`)?.awarded] as const).filter((e): e is readonly [string, number] => typeof e[1] === "number");
          return [p.id, marks.length ? Object.fromEntries(marks) : null];
        })),
      }));
      const { buildQlaModel, writeQlaWorkbook } = await import("@/lib/marking/qlaWorkbook");
      const model = buildQlaModel({
        examTitle: String(examData.title ?? "Exam"), qualification: String(examData.qualificationLevel ?? ""),
        papers: qlaPapers, candidates, boundaries, boundarySource: result.grading.sourceNote,
      });
      const bytes = await writeQlaWorkbook(model, ExcelJS);
      return new Response(bytes, { headers: { ...headers, "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": 'attachment; filename="csmaster-subject-qla.xlsx"' } });
    }
    if (format === "xlsx") {
      const wb = new ExcelJS.Workbook(); wb.creator = "CS Master";
      const summary = wb.addWorksheet("Results summary");
      summary.addRow(["Candidate code", ...papers.map(p => p.title || p.id), "Total", "Maximum", "Grade", "Status"]);
      for (const r of result.rows) summary.addRow([r.candidateCode, ...papers.map(p => r.paperScores[p.id] ?? "Pending"), r.total ?? "Pending", result.maximum, r.grade ?? "", r.status]);
      const feedback = wb.addWorksheet("Question feedback");
      feedback.addRow(["Candidate code", "Paper", "Question", "Awarded", "Maximum", "Approved feedback", "Improvement guidance", "Guidance status", "Evidence"]);
      for (const d of details) feedback.addRow([d.candidateCode, d.paper, d.question, d.awarded, d.maximum, d.feedback, d.improvement, d.guidanceStatus, d.evidence]);
      // A single row per candidate allows teachers to filter, print, or mail-merge
      // individual reports without downloading one PDF per student.
      const candidateReports = wb.addWorksheet("Candidate reports");
      candidateReports.addRow([
        "Candidate code", "Total", "Maximum", "Percentage", "Grade", "Status",
        "Question results", "Approved marking feedback", "Improvement guidance", "Guidance status"
      ]);
      const detailsByCandidate = new Map<string, Detail[]>();
      for (const d of details) {
        const group = detailsByCandidate.get(d.candidateCode) ?? [];
        group.push(d);
        detailsByCandidate.set(d.candidateCode, group);
      }
      // Avoid Excel interpreting teacher-authored or AI-authored text as a formula.
      const excelText = (value: string) => /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
      for (const r of result.rows) {
        const candidateDetails = detailsByCandidate.get(r.candidateCode) ?? [];
        const questionResults = candidateDetails.map(d => `${d.paper} Q${d.question}: ${d.awarded}/${d.maximum}`).join("\n");
        const feedbackText = candidateDetails.map(d => `${d.paper} Q${d.question}: ${d.feedback || "No feedback recorded."}`).join("\n\n");
        const guidanceText = candidateDetails.map(d => `${d.paper} Q${d.question}: ${d.improvement}`).join("\n\n");
        const pendingGuidance = candidateDetails.some(d => d.guidanceStatus === "needs_teacher_approval");
        const reportRow = candidateReports.addRow([
          excelText(r.candidateCode), r.total ?? "Pending", result.maximum,
          r.total === null || result.maximum <= 0 ? "" : Math.round(10000 * r.total / result.maximum) / 100,
          r.grade ?? "", r.status, excelText(questionResults), excelText(feedbackText),
          excelText(guidanceText), !candidateDetails.length ? "No approved question feedback" : pendingGuidance ? "Guidance pending" : "Approved / not required"
        ]);
        for (const index of [7, 8, 9]) reportRow.getCell(index).alignment = { vertical: "top", wrapText: true };
        reportRow.height = Math.min(240, Math.max(42, candidateDetails.length * 24));
      }
      candidateReports.getColumn(1).width = 28;
      candidateReports.getColumn(7).width = 40;
      candidateReports.getColumn(8).width = 78;
      candidateReports.getColumn(9).width = 78;
      candidateReports.getColumn(10).width = 30;
      candidateReports.getColumn(4).numFmt = '0.00"%"';
      const analysis = wb.addWorksheet("Question analysis");
      analysis.addRow(["Paper", "Question", "Scripts approved", "Mean mark", "Maximum", "Mean percentage"]);
      const groups = new Map<string, Detail[]>();
      for (const d of details) { const k = `${d.paper}\u0000${d.question}`; groups.set(k, [...(groups.get(k) ?? []), d]); }
      for (const group of groups.values()) { const d = group[0]; const mean = group.reduce((s, x) => s + x.awarded, 0) / group.length; analysis.addRow([d.paper, d.question, group.length, Math.round(mean * 100) / 100, d.maximum, Math.round(10000 * mean / d.maximum) / 100]); }
      const notes = wb.addWorksheet("Report notes");
      notes.addRows([["Grade boundary mode", result.grading.mode], ["Boundary source", result.grading.sourceNote], ["Confidentiality", "Teacher-only. Candidate codes are pseudonymous identifiers."], ["Marking", "Only current approved marks are included. Review guidance before distributing."], ["Incomplete candidates", "Pending results are not assigned a grade."]]);
      for (const sheet of wb.worksheets) { sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }; sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3730A3" } }; sheet.views = [{ state: "frozen", ySplit: 1 }]; sheet.columns.forEach((c, i) => { c.width = i === 0 ? 25 : Math.min(65, i > 4 ? 55 : 22); }); sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columnCount } }; }
      // Override the generic widths for the report sheet, which contains long text.
      candidateReports.getColumn(1).width = 28;
      candidateReports.getColumn(7).width = 40;
      candidateReports.getColumn(8).width = 78;
      candidateReports.getColumn(9).width = 78;
      candidateReports.getColumn(10).width = 30;
      const buffer = await wb.xlsx.writeBuffer();
      return new Response(new Uint8Array(buffer), { headers: { ...headers, "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": 'attachment; filename="csmaster-exam-analysis.xlsx"' } });
    }
    if (format === "pdf" || format === "pdf-all") {
      if (format === "pdf" && (!candidate || !result.rows.some(r => r.candidateCode === candidate))) throw new Error("INVALID_REPORT");
      const selected = format === "pdf" ? result.rows.filter(r => r.candidateCode === candidate) : result.rows;
      const pdf = await PDFDocument.create();
      const regular = await pdf.embedFont(StandardFonts.Helvetica);
      const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
      const clean = pdfMathText;
      for (const r of selected) {
        let page = pdf.addPage([595, 842]); let y = 794;
        const write = (value: unknown, size = 10, strong = false) => {
          const font = strong ? bold : regular;
          const words = clean(value).split(/\s+/); let line = "";
          const flush = () => { if (y < 55) { page = pdf.addPage([595, 842]); y = 794; } page.drawText(line || " ", { x: 45, y, size, font, color: rgb(.1,.15,.25) }); y -= size + 6; line = ""; };
          for (const word of words) { const next = line ? `${line} ${word}` : word; if (font.widthOfTextAtSize(next, size) > 500 && line) flush(); line = line ? `${line} ${word}` : word; }
          if (line) flush();
        };
        write("CS MASTER | CANDIDATE FEEDBACK REPORT", 16, true); y -= 10;
        write(`Candidate: ${r.candidateCode}`, 12, true);
        write(`Result: ${r.total ?? "Pending"} / ${result.maximum} | Grade: ${r.grade ?? "Not available"}`);
        write(`Grading: ${result.grading.mode === "official" ? "Verified official" : "Internal estimate"}`);
        y -= 12;
        const candidateDetails = details.filter(d => d.candidateCode === r.candidateCode);
        if (!candidateDetails.length) write("No current approved question feedback is available.");
        for (const d of candidateDetails) { write(`${d.paper} - Question ${d.question}: ${d.awarded}/${d.maximum}`, 11, true); write(`Feedback: ${d.feedback || "Teacher feedback not recorded."}`); if (d.awarded < d.maximum) write(`${d.guidanceStatus === "approved" ? "How to gain full marks" : "Improvement guidance pending"}: ${d.improvement}`); y -= 9; }
        y -= 10; write("Teacher-reviewed feedback. Check accuracy before distribution.", 9);
      }
      const bytes = await pdf.save();
      return new Response(new Uint8Array(bytes), { headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${format === "pdf-all" ? "csmaster-all-candidate-reports" : "csmaster-candidate-report"}.pdf"` } });
    }
    throw new Error("INVALID_REPORT");
  } catch (error) { return textResponse(error); }
}

// Separate teacher-approved improvement guidance; does not alter approved marking.
export async function PUT(request: Request, context: Context) {
  try {
    const actor = await requireAuthenticatedUser(request);
    requireCentreTeacher(actor);
    const { examId } = await context.params;
    if (!/^[\w-]{1,128}$/.test(examId)) throw new Error("INVALID_REPORT");
    const ref = centreCollection.doc(examId);
    const exam = await ref.get();
    if (!exam.exists || exam.data()?.ownerId !== actor.uid) throw new Error("CENTRE_NOT_FOUND");
    const body = await request.json() as { candidateCode?: string; paperId?: string; questionId?: string; text?: string };
    const { candidateCode, paperId, questionId } = body;
    if (!candidateCode || !paperId || !questionId || typeof body.text !== "string" || body.text.trim().length < 15 || body.text.length > 3000) throw new Error("INVALID_REPORT");
    if (!Array.isArray(exam.data()?.papers) || !exam.data()!.papers.some((p: { id: string }) => p.id === paperId)) throw new Error("INVALID_REPORT");
    const [candidateSnap, structureSnap, reviewSnap, scriptSnap] = await Promise.all([
      ref.collection("candidates").doc(candidateCode).get(),
      ref.collection("paperStructures").doc(paperId).get(),
      ref.collection("markingReviews").doc(`${paperId}_${candidateCode}`).get(),
      ref.collection("candidateScripts").doc(`${paperId}_${candidateCode}`).get(),
    ]);
    const structure = structureSnap.data(); const review = reviewSnap.data(); const script = scriptSnap.data();
    const q = structure?.questions?.find((x: { id: string }) => x.id === questionId);
    const mark = review?.marks?.find((x: { questionId: string }) => x.questionId === questionId);
    const hash = Array.isArray(structure?.questions) ? createHash("sha256").update(JSON.stringify(structure.questions)).digest("hex") : "";
    if (!candidateSnap.exists || structure?.status !== "approved" || review?.status !== "approved" || !q || !mark || review.structureHash !== hash || !review.approvedAt?.toMillis || !script?.uploadedAt?.toMillis || review.approvedAt.toMillis() < script.uploadedAt.toMillis() || !Number.isInteger(mark.awardedMarks) || mark.awardedMarks < 0 || mark.awardedMarks >= q.maxMarks) throw new Error("INVALID_REPORT");
    const key = guidanceKey(paperId, candidateCode, questionId);
    await ref.collection("reportGuidance").doc(key).set({ candidateCode, paperId, questionId, text: body.text.trim(), status: "approved", reviewRevision: review.revision, structureHash: hash, awardedMarks: mark.awardedMarks, approvedBy: actor.uid, approvedAt: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true }, { headers });
  } catch (error) { return textResponse(error); }
}
