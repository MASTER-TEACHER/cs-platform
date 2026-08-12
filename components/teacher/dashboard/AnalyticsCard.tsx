import Card from "@/components/ui/Card";

type AnalyticsCardTone =
  "blue" | "green" | "amber" | "red" | "indigo" | "violet" | "cyan";

type AnalyticsCardProps = {
  label: string;
  value: string;
  description: string;
  icon: string;
  tone: AnalyticsCardTone;
  compactValue?: boolean;
};

export default function AnalyticsCard({
  label,
  value,
  description,
  icon,
  tone,
  compactValue = false,
}: AnalyticsCardProps) {
  const toneClasses: Record<AnalyticsCardTone, string> = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700",
    cyan: "bg-cyan-50 text-cyan-700",
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{label}</p>

          <p
            className={`mt-3 break-words font-extrabold text-slate-900 ${
              compactValue ? "text-2xl" : "text-4xl"
            }`}
          >
            {value}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${toneClasses[tone]}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
