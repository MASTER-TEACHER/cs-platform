type Props = {
  checked: boolean;
  correct: boolean;

  successMessage?: string;
  errorMessage?: string;

  hintVisible?: boolean;
  hint?: string;

  workingVisible?: boolean;
  working?: string;

  examinerTip?: string;
};

export default function SimulatorFeedback({
  checked,
  correct,

  successMessage = "Correct. Well done.",
  errorMessage = "Not quite. Review your answer and try another example.",

  hintVisible = false,
  hint = "",

  workingVisible = false,
  working = "",

  examinerTip = "",
}: Props) {
  return (
    <div className="space-y-4">
      {hintVisible && hint && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-amber-700">
            Hint
          </p>

          <p className="mt-2 leading-7 text-amber-950">{hint}</p>
        </section>
      )}

      {workingVisible && working && (
        <section className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
          <p className="text-xs font-black uppercase tracking-widest text-violet-700">
            Worked solution
          </p>

          <p className="mt-2 whitespace-pre-line leading-7 text-violet-950">
            {working}
          </p>
        </section>
      )}

      {checked && (
        <section
          className={`rounded-2xl border p-5 ${
            correct
              ? "border-emerald-200 bg-emerald-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <p
            className={`text-lg font-black ${
              correct ? "text-emerald-900" : "text-red-900"
            }`}
          >
            {correct ? "✓ Correct" : "✕ Not quite"}
          </p>

          <p className="mt-2 leading-7 text-slate-700">
            {correct ? successMessage : errorMessage}
          </p>

          {examinerTip && (
            <div className="mt-4 rounded-xl bg-white/70 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                Examiner tip
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-700">
                {examinerTip}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
