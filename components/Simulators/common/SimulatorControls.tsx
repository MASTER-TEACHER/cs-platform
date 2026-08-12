type Props = {
  canCheck?: boolean;
  checked?: boolean;

  hintVisible?: boolean;
  workingVisible?: boolean;

  showCheck?: boolean;
  showHint?: boolean;
  showWorking?: boolean;
  showReset?: boolean;
  showNewExample?: boolean;

  checkLabel?: string;
  resetLabel?: string;
  newExampleLabel?: string;

  onCheck?: () => void;
  onHint?: () => void;
  onToggleWorking?: () => void;
  onReset?: () => void;
  onNewExample?: () => void;
};

export default function SimulatorControls({
  canCheck = true,
  checked = false,

  hintVisible = false,
  workingVisible = false,

  showCheck = true,
  showHint = true,
  showWorking = true,
  showReset = true,
  showNewExample = true,

  checkLabel = "Check answer",
  resetLabel = "Try again",
  newExampleLabel = "New example",

  onCheck,
  onHint,
  onToggleWorking,
  onReset,
  onNewExample,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {showCheck && (
        <button
          type="button"
          onClick={onCheck}
          disabled={!canCheck || checked}
          className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {checked ? "Answer checked" : checkLabel}
        </button>
      )}

      {showHint && (
        <button
          type="button"
          onClick={onHint}
          className="rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 font-black text-amber-800 transition hover:bg-amber-100"
        >
          {hintVisible ? "Hide hint" : "Hint"}
        </button>
      )}

      {showWorking && (
        <button
          type="button"
          onClick={onToggleWorking}
          className="rounded-xl border border-violet-300 bg-violet-50 px-5 py-3 font-black text-violet-800 transition hover:bg-violet-100"
        >
          {workingVisible ? "Hide working" : "Show working"}
        </button>
      )}

      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-black text-slate-700 transition hover:bg-slate-50"
        >
          {resetLabel}
        </button>
      )}

      {showNewExample && (
        <button
          type="button"
          onClick={onNewExample}
          className="rounded-xl border border-blue-300 bg-blue-50 px-5 py-3 font-black text-blue-700 transition hover:bg-blue-100"
        >
          {newExampleLabel}
        </button>
      )}
    </div>
  );
}
