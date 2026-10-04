import Link from "next/link";

import { imediaPracticeBank } from "@/data/imedia/practiceBank";

const units = [
  ["r093", "R093 Creative iMedia in the Media Industry"],
  ["r094", "R094 Visual Identity and Digital Graphics"],
  ["r095", "R095 Characters and Comics"],
  ["r096", "R096 Animation with Audio"],
  ["r097", "R097 Interactive Digital Media"],
  ["r098", "R098 Visual Imaging"],
  ["r099", "R099 Digital Games"],
] as const;

function kindLabel(kind: string) {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export default function IMediaPracticePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-fuchsia-950 via-purple-950 to-indigo-900 p-7 text-white shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-purple-200">
          OCR Cambridge National Creative iMedia J834
        </p>
        <h1 className="mt-3 text-3xl font-black">Creative iMedia Practice</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-purple-100">
          Original CS Master formative practice for R093–R099. R094–R099
          activities use fictional scenarios to develop planning, production,
          testing and review skills; they are not answers to live OCR-set
          assignments.
        </p>
        <Link
          href="/quiz"
          className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-black text-purple-950"
        >
          Open iMedia quizzes
        </Link>
      </section>

      {units.map(([unitId, title]) => {
        const items = imediaPracticeBank.filter(
          (item) => item.unitId === unitId,
        );

        return (
          <section
            key={unitId}
            id={unitId}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-purple-700">
                  {unitId.toUpperCase()}
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">
                  {title}
                </h2>
              </div>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-black text-purple-800">
                {items.length} activities
              </span>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
                      {kindLabel(item.kind)}
                    </span>
                    {typeof item.marks === "number" && (
                      <span className="text-xs font-bold text-slate-500">
                        {item.marks} marks
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 text-lg font-black text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {item.prompt}
                  </p>

                  <details className="mt-4 rounded-xl bg-slate-50">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-black text-slate-900">
                      Success criteria and guidance
                    </summary>
                    <div className="border-t border-slate-200 p-4">
                      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {item.successCriteria.map((criterion, index) => (
                          <li key={`${item.id}-${index}`}>{criterion}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {item.modelGuidance}
                      </p>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
