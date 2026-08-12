import type {
  ProgrammingChallenge,
  ProgrammingEvaluation,
} from "@/types/programming";

type Props = {
  challenge: ProgrammingChallenge | null;
  evaluation: ProgrammingEvaluation | null;
  hintLevel: 0 | 1 | 2;
  showExplanation: boolean;
};

export default function ProgrammingChallengePanel({
  challenge,
  evaluation,
  hintLevel,
  showExplanation,
}: Props) {
  if (!challenge) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
        <p className="font-black text-amber-950">
          No challenge is available for this combination yet.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <p className="text-xs font-black uppercase tracking-widest text-blue-600">
          {challenge.mode === "debug"
            ? "Debugging challenge"
            : "Programming challenge"}
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          {challenge.title}
        </h2>

        <p className="mt-3 leading-7 text-slate-700">
          {challenge.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-black">
          <span className="rounded-full bg-white px-3 py-1 text-slate-700">
            {challenge.difficulty}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-slate-700">
            {challenge.xpReward} XP
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-slate-700">
            ~{challenge.estimatedMinutes} min
          </span>

          {challenge.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-blue-100 px-3 py-1 text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-black text-slate-950">
          Visible tests
        </h3>

        <div className="mt-4 space-y-3">
          {challenge.visibleTests.map((test) => (
            <article
              key={test.id}
              className="rounded-2xl bg-slate-50 p-4"
            >
              <p className="font-black text-slate-800">
                {test.label}
              </p>

              <div className="mt-2 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="font-bold text-slate-500">Input</p>
                  <pre className="mt-1 whitespace-pre-wrap font-mono text-slate-800">
                    {test.input || "(none)"}
                  </pre>
                </div>

                <div>
                  <p className="font-bold text-slate-500">
                    Expected output
                  </p>
                  <pre className="mt-1 whitespace-pre-wrap font-mono text-slate-800">
                    {test.expectedOutput}
                  </pre>
                </div>
              </div>
            </article>
          ))}
        </div>

        {challenge.hiddenTests.length > 0 && (
          <p className="mt-4 text-sm font-bold text-slate-500">
            + {challenge.hiddenTests.length} hidden test
            {challenge.hiddenTests.length === 1 ? "" : "s"}
          </p>
        )}
      </section>

      {hintLevel >= 1 && (
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">
            Hint 1
          </p>
          <p className="mt-2 leading-7 text-amber-950">
            {challenge.hint}
          </p>
        </section>
      )}

      {hintLevel >= 2 && challenge.secondHint && (
        <section className="rounded-3xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-orange-700">
            Hint 2
          </p>
          <p className="mt-2 leading-7 text-orange-950">
            {challenge.secondHint}
          </p>
        </section>
      )}

      {evaluation && (
        <section
          className={`rounded-3xl border p-6 ${
            evaluation.passed
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <h3
            className={`text-xl font-black ${
              evaluation.passed
                ? "text-emerald-950"
                : "text-red-950"
            }`}
          >
            {evaluation.passed
              ? "All tests passed"
              : `${evaluation.passedCount}/${evaluation.totalCount} tests passed`}
          </h3>
        </section>
      )}

      {showExplanation && (
        <>
          <section className="rounded-3xl border border-violet-200 bg-violet-50 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-violet-700">
              Explanation
            </p>
            <p className="mt-2 leading-7 text-violet-950">
              {challenge.explanation}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              Examiner / revision guidance
            </p>
            <p className="mt-2 leading-7 text-slate-700">
              {challenge.examinerTip}
            </p>
          </section>
        </>
      )}
    </div>
  );
}
