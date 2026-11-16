"use client";

type Question = {
  id: string;
  topic: string;
  prompt: string;
  context: string;
  marks: number;
  qualification: string;
  examBoard: string;
};

type Feedback = {
  questionId: string;
  modelAnswer: string;
  markingPoints: string[];
  guidance: string[];
  teacherReviewRequired: boolean;
};

type Props = {
  questions: Question[];
  feedback: Feedback[];
};

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function PrintControls({
  questions,
  feedback,
}: Props) {
  const submitted =
    questions.length > 0 &&
    feedback.length === questions.length;

  function printDocument(markScheme: boolean) {
    if (markScheme && !submitted) return;

    const title = markScheme
      ? "Practice Marking Guidance"
      : "Practice Question Paper";

    const sections = questions.map((question, index) => {
      const review = feedback.find(
        item => item.questionId === question.id
      );

      const questionHtml = `
        <section>
          <h2>Question ${index + 1}</h2>
          <p><strong>${escapeHtml(question.topic)}</strong></p>
          <p>${escapeHtml(question.prompt)}</p>
          <p>[${question.marks} marks]</p>
      `;

      if (!markScheme) {
        return questionHtml +
          '<div class="answer-space"></div></section>';
      }

      return questionHtml + `
        <h3>Model answer</h3>
        <p>${escapeHtml(review?.modelAnswer || "Not available")}</p>
        <h3>Marking points</h3>
        <ul>${(review?.markingPoints || []).map(
          point => `<li>${escapeHtml(point)}</li>`
        ).join("")}</ul>
        <h3>Additional guidance</h3>
        <ul>${(review?.guidance || []).map(
          point => `<li>${escapeHtml(point)}</li>`
        ).join("")}</ul>
        ${review?.teacherReviewRequired
          ? "<p>Teacher review required for formal assessment.</p>"
          : ""}
        </section>
      `;
    }).join("");

    const popup = window.open("", "_blank");

    if (!popup) {
      window.alert("Please allow pop-ups to print.");
      return;
    }

    popup.document.open();
    popup.document.write(`
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 35px auto;
            max-width: 850px;
            line-height: 1.5;
          }
          section {
            padding: 15px 0;
            border-bottom: 1px solid #ccc;
            break-inside: avoid;
          }
          .answer-space {
            height: 140px;
            background: repeating-linear-gradient(
              to bottom,
              transparent 0px,
              transparent 29px,
              #ddd 30px
            );
          }
          @media print {
            .toolbar { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="toolbar">
          <button onclick="window.print()">
            Print / Save as PDF
          </button>
        </div>
        <h1>${title}</h1>
        <p>CS Master - ${questions.length} questions</p>
        ${markScheme
          ? "<p>Self-review guidance, not an official awarding-body mark scheme.</p>"
          : ""}
        ${sections}
      </body>
      </html>
    `);
    popup.document.close();
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => printDocument(false)}
        className="rounded border px-4 py-2"
      >
        Print question paper
      </button>

      {submitted && (
        <button
          type="button"
          onClick={() => printDocument(true)}
          className="rounded border px-4 py-2"
        >
          Print marking guidance
        </button>
      )}
    </div>
  );
}