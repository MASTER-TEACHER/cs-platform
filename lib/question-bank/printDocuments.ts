import type {
  GeneratedExamQuestion,
  GeneratedExamQuestionSet,
} from "@/types/examQuestion";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );
}

function formatText(value: unknown): string {
  // Keep line breaks and the indentation of code in printed papers.
  return escapeHtml(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^ +/, (spaces) => "&nbsp;".repeat(spaces.length)))
    .join("<br>");
}

function answerArea(question: GeneratedExamQuestion): string {
  const type = String(question.questionType).toLowerCase();
  const text = `${question.question} ${question.context}`.toLowerCase();

  if (
    type.includes("multiple-choice") ||
    type.includes("multiple_choice")
  ) {
    return `
      <div class="answer-choice">
        Answer: ____________________
      </div>
    `;
  }

  if (
    type.includes("table") ||
    text.includes("complete the truth table")
  ) {
    const rows = Math.min(12, Math.max(4, question.marks + 2));

    return `
      <div class="structured-answer">
        <p><strong>Working / completed table:</strong></p>
        <table class="answer-table">
          <tbody>
            ${Array.from(
              { length: rows },
              () => "<tr><td>&nbsp;</td></tr>",
            ).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  if (
    type.includes("algorithm") ||
    type.includes("code") ||
    type.includes("debug") ||
    text.includes("pseudocode")
  ) {
    const lines = Math.min(24, Math.max(7, question.marks * 2));

    return `
      <div class="code-answer">
        ${Array.from(
          { length: lines },
          (_, index) =>
            `<div class="code-line"><span>${index + 1}</span></div>`,
        ).join("")}
      </div>
    `;
  }

  const lines = Math.min(
    24,
    Math.max(3, Math.ceil(question.marks * 2.2)),
  );

  return `
    <div class="written-answer">
      ${Array.from(
        { length: lines },
        () => '<div class="answer-line"></div>',
      ).join("")}
    </div>
  `;
}

function questionHtml(question: GeneratedExamQuestion): string {
  return `
    <section class="question">
      <div class="question-header">
        <strong>Question ${question.questionNumber}</strong>
        <strong>[${question.marks} marks]</strong>
      </div>

      ${
        question.context
          ? `<div class="context">${formatText(question.context)}</div>`
          : ""
      }

      <div class="question-text">
        ${formatText(question.question)}
      </div>

      ${answerArea(question)}
    </section>
  `;
}

function markSchemeHtml(question: GeneratedExamQuestion): string {
  const points = question.markScheme ?? [];
  const levels = question.levelDescriptors ?? [];

  const allocatedMarks = points.reduce(
    (sum, point) => sum + point.marks,
    0,
  );

  const markWarning =
    points.length > 0 && allocatedMarks !== question.marks
      ? `<p class="review-warning">
           Teacher check: marking points total ${allocatedMarks},
           but the question is worth ${question.marks} marks.
         </p>`
      : "";

  return `
    <section class="question">
      <div class="question-header">
        <strong>Question ${question.questionNumber}</strong>
        <strong>[${question.marks} marks]</strong>
      </div>

      <p class="metadata">
        ${escapeHtml(question.topic)}
        | ${escapeHtml(question.assessmentObjective)}
      </p>

      <div class="question-text">
        ${formatText(question.question)}
      </div>

      <h3>Marking points</h3>

      <table class="mark-table">
        <thead>
          <tr>
            <th>Acceptable response / marking guidance</th>
            <th class="mark-column">Marks</th>
          </tr>
        </thead>
        <tbody>
          ${
            points.length
              ? points
                  .map(
                    (point) => `
                      <tr>
                        <td>${formatText(point.description)}</td>
                        <td class="mark-column">${point.marks}</td>
                      </tr>
                    `,
                  )
                  .join("")
              : `<tr><td colspan="2">
                   No marking points supplied. Teacher review required.
                 </td></tr>`
          }
        </tbody>
      </table>

      ${markWarning}

      ${
        levels.length
          ? `
            <h3>Level descriptors</h3>
            <table class="mark-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Mark range</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${levels
                  .map(
                    (level) => `
                      <tr>
                        <td>${level.level}</td>
                        <td>${escapeHtml(level.markRange)}</td>
                        <td>${formatText(level.description)}</td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          `
          : ""
      }

      ${
        question.modelAnswer
          ? `
            <h3>Indicative model answer</h3>
            <div class="model-answer">
              ${formatText(question.modelAnswer)}
            </div>
          `
          : ""
      }

      ${
        question.examinerGuidance?.length
          ? `
            <h3>Examiner guidance</h3>
            <ul>
              ${question.examinerGuidance
                .map((item) => `<li>${formatText(item)}</li>`)
                .join("")}
            </ul>
          `
          : ""
      }
    </section>
  `;
}

export function generatePrintableDocument(
  paper: GeneratedExamQuestionSet,
  includeAnswers: boolean,
): string {
  const documentType = includeAnswers
    ? "Mark Scheme"
    : "Question Paper";

  const totalMarks = paper.questions.reduce(
    (sum, question) => sum + question.marks,
    0,
  );

  const content = paper.questions
    .map((question) =>
      includeAnswers
        ? markSchemeHtml(question)
        : questionHtml(question),
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(paper.title)} - ${documentType}</title>

<style>
@page {
  size: A4;
  margin: 15mm 17mm;
}

* {
  box-sizing: border-box;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  color: #172033;
  font-size: 10.5pt;
  line-height: 1.4;
  margin: 0;
}

h1 {
  font-size: 21pt;
  margin: 10px 0;
}

h2 {
  font-size: 14pt;
}

h3 {
  font-size: 10.5pt;
  margin: 14px 0 6px;
}

.brand {
  color: #344b91;
  font-size: 10pt;
  font-weight: bold;
  letter-spacing: 1px;
}

.cover {
  break-after: page;
  padding-top: 10mm;
}

.document-type {
  margin-top: 22px;
  color: #344b91;
  font-size: 15pt;
  font-weight: bold;
}

.meta {
  margin: 20px 0;
  padding: 12px 0;
  border-top: 2px solid #344b91;
  border-bottom: 1px solid #b8c4d9;
}

.meta p {
  margin: 5px 0;
}

.candidate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin: 20px 0;
}

.candidate-field {
  border-bottom: 1px solid #64748b;
  padding-bottom: 18px;
}

.instructions {
  border: 1px solid #cbd5e1;
  padding: 12px 16px;
  margin-top: 20px;
}

.instructions ul {
  margin-bottom: 0;
}

.question {
  margin-bottom: 26px;
}

.question-header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #a9b8d4;
  padding: 8px 0;
  margin-bottom: 12px;
  break-after: avoid;
}

.context {
  background: #f1f5f9;
  border-left: 3px solid #64748b;
  padding: 10px;
  margin: 10px 0;
}

.question-text {
  margin: 12px 0;
  white-space: normal;
}

.written-answer,
.code-answer,
.structured-answer {
  margin-top: 14px;
}

.answer-line {
  height: 25px;
  border-bottom: 1px solid #cbd5e1;
}

.answer-choice {
  margin: 24px 0;
  font-weight: bold;
}

.code-answer {
  border: 1px solid #cbd5e1;
  font-family: Consolas, monospace;
}

.code-line {
  height: 25px;
  border-bottom: 1px solid #e2e8f0;
}

.code-line:last-child {
  border-bottom: none;
}

.code-line span {
  display: inline-block;
  width: 30px;
  padding: 4px;
  margin-right: 10px;
  border-right: 1px solid #cbd5e1;
  color: #64748b;
  text-align: center;
}

.answer-table,
.mark-table {
  width: 100%;
  border-collapse: collapse;
}

.answer-table td {
  height: 28px;
  border: 1px solid #cbd5e1;
}

.mark-table th,
.mark-table td {
  border: 1px solid #b9c4d8;
  padding: 7px;
  vertical-align: top;
  text-align: left;
}

.mark-table th {
  background: #edf2fa;
}

.mark-column {
  width: 65px;
  text-align: center !important;
}

.metadata {
  color: #475569;
  font-size: 9pt;
}

.model-answer {
  padding: 10px;
  background: #f8fafc;
  border-left: 3px solid #94a3b8;
}

.review-warning {
  color: #9a3412;
  font-weight: bold;
}

li {
  margin-bottom: 4px;
}

@media print {
  .cover {
    min-height: 245mm;
  }

  .question-header,
  h3,
  tr {
    break-inside: avoid;
  }

  .question-header {
    break-after: avoid;
  }
}
</style>
</head>

<body>
<section class="cover">
  <div class="brand">CS MASTER | ASSESSMENT CENTRE</div>

  <div class="document-type">${documentType}</div>

  <h1>${escapeHtml(paper.title)}</h1>

  <div class="meta">
    <p><strong>Qualification:</strong>
      ${escapeHtml(paper.qualification)}</p>
    <p><strong>Exam board:</strong>
      ${escapeHtml(paper.examBoard)}</p>
    <p><strong>Questions:</strong>
      ${paper.questions.length}</p>
    <p><strong>Total marks:</strong>
      ${totalMarks}</p>
    <p><strong>Suggested time:</strong>
      ${escapeHtml(paper.estimatedTime)}</p>
  </div>

  ${
    includeAnswers
      ? `
        <div class="instructions">
          <strong>Teacher marking copy</strong>
          <p>
            Review the marking points, model answers,
            level descriptors and mark allocations
            before assessment use.
          </p>
        </div>
      `
      : `
        <div class="candidate-grid">
          <div class="candidate-field">Candidate name</div>
          <div class="candidate-field">Candidate number</div>
          <div class="candidate-field">Class</div>
          <div class="candidate-field">Date</div>
        </div>

        <div class="instructions">
          <strong>Instructions</strong>
          <ul>
            <li>Answer all questions.</li>
            <li>Read each question carefully.</li>
            <li>Show your working where appropriate.</li>
            <li>Use the spaces provided for your answers.</li>
            <li>The marks for each question are shown.</li>
          </ul>
        </div>
      `
  }
</section>

<main>${content}</main>
</body>
</html>`;
}