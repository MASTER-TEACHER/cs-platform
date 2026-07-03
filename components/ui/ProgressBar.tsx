type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}