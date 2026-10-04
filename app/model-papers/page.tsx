import Link from "next/link";

import { modelPaperDefinitions } from "@/data/modelPapers";
import {
  getModelPaperMarkScheme,
  getResolvedModelPaper,
} from "@/services/modelPaperService";

function qualificationLabel(value: "GCSE" | "A_LEVEL") {
  return value === "A_LEVEL" ? "A Level" : "GCSE";
}

export default function ModelPapersPage() {
  const papers = modelPaperDefinitions.map((definition) => {
    const paper = getResolvedModelPaper(definition.id);
    const markScheme = getModelPaperMarkScheme(definition.id);

    if (!paper || !markScheme) {
      throw new Error(`Unable to resolve model paper ${definition.id}.`);
    }

    return { paper, markScheme };
  });

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-7 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
          CS Master original practice
        </p>
        <h1 className="mt-3 text-3xl font-black">Model Papers</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
          Full practice papers assembled from the CS Master question bank.
          These are original CS Master resources, not official awarding-body
          past papers or specimen papers.
        </p>
        <Link
          href="/exam-trainer"
          className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-black text-blue-950"
        >
          Back to Exam Trainer
        </Link>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        {papers.map(({ paper, markScheme }) => (
          <article
            key={paper.id}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                {qualificationLabel(paper.qualification)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {paper.examBoard}
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black text-slate-950">
              {paper.title}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {paper.durationMinutes} minutes · {paper.totalMarks} marks ·{" "}
              {paper.questions.length} questions
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {paper.notes}
            </p>

            <details className="mt-5 rounded-2xl border border-slate-200">
              <summary className="cursor-pointer px-4 py-3 font-black text-slate-900">
                Open question paper
              </summary>
              <div className="space-y-5 border-t border-slate-200 p-4">
                {paper.questions.map((question, index) => (
                  <div key={question.id}>
                    <div className="flex items-start justify-between gap-4">
                      <p className="whitespace-pre-wrap font-semibold text-slate-900">
                        {index + 1}. {question.question}
                      </p>
                      <span className="shrink-0 text-sm font-black text-slate-600">
                        [{question.marks}]
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/40">
              <summary className="cursor-pointer px-4 py-3 font-black text-emerald-950">
                Open mark scheme
              </summary>
              <div className="space-y-6 border-t border-emerald-200 p-4">
                {markScheme.questions.map((question) => (
                  <div key={question.questionId}>
                    <p className="font-black text-slate-950">
                      Question {question.number} [{question.marks}]
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                      {question.markPoints.map((point, index) => (
                        <li key={`${question.questionId}-${index}`}>{point}</li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      <span className="font-black">Model answer:</span>{" "}
                      {question.modelAnswer}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}
