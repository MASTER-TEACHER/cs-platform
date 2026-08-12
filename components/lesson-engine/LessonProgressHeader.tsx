import type { InteractiveLessonStep } from "@/types/interactiveLesson";

type Props = {
  steps: InteractiveLessonStep[];
  currentStepIndex: number;
};

export default function LessonProgressHeader({
  steps,
  currentStepIndex,
}: Props) {
  const totalSteps = Math.max(steps.length, 1);

  const safeCurrentIndex = Math.min(
    Math.max(currentStepIndex, 0),
    totalSteps - 1,
  );

  const currentStep = steps[safeCurrentIndex];

  const progressPercentage = Math.round(
    ((safeCurrentIndex + 1) / totalSteps) * 100,
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
            Lesson progress
          </p>

          <h2 className="mt-1 text-xl font-black text-slate-950">
            {currentStep?.title || "Interactive lesson"}
          </h2>

          {currentStep?.description && (
            <p className="mt-1 text-sm text-slate-600">
              {currentStep.description}
            </p>
          )}
        </div>

        <div className="text-left sm:text-right">
          <p className="text-2xl font-black text-blue-700">
            {progressPercentage}%
          </p>

          <p className="text-sm font-bold text-slate-500">
            Step {safeCurrentIndex + 1} of {totalSteps}
          </p>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 transition-all duration-300"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {steps.map((step, index) => {
          const completed = index < safeCurrentIndex;
          const active = index === safeCurrentIndex;

          return (
            <div
              key={step.id}
              title={step.title}
              className={`h-2 min-w-8 flex-1 rounded-full ${
                active
                  ? "bg-blue-600"
                  : completed
                    ? "bg-emerald-500"
                    : "bg-slate-200"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
