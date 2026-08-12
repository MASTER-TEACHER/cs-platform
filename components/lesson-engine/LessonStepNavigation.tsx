import Link from "next/link";

type Props = {
  currentStepIndex: number;
  totalSteps: number;
  canContinue: boolean;
  onPrevious: () => void;
  onNext: () => void;
  nextLessonHref?: string;
};

export default function LessonStepNavigation({
  currentStepIndex,
  totalSteps,
  canContinue,
  onPrevious,
  onNext,
  nextLessonHref,
}: Props) {
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Previous
      </button>

      <p className="text-center text-sm font-bold text-slate-500">
        Step {currentStepIndex + 1} of {totalSteps}
      </p>

      {isLastStep && nextLessonHref ? (
        <Link
          href={nextLessonHref}
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Next Lesson →
        </Link>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue || isLastStep}
          className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Next →
        </button>
      )}
    </div>
  );
}
