type ProgressProps = {
  value: number;
};

export default function ProgressBar({
  value,
}: ProgressProps) {
  return (
    <div className="mt-2 h-2 rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-blue-600 transition-all"
        style={{
          width: `${value}%`,
        }}
      />
    </div>
  );
}