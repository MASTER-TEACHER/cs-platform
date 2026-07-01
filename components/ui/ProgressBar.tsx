type ProgressBarProps = {
  value: number;
};

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 transition-all duration-700 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}