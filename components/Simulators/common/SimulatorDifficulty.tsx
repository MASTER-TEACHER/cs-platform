import type { SimulatorDifficulty } from "./useSimulator";

type Props = {
  value: SimulatorDifficulty;
  onChange: (difficulty: SimulatorDifficulty) => void;
};

const options: Array<{
  value: SimulatorDifficulty;
  title: string;
  description: string;
}> = [
  {
    value: "foundation",
    title: "Foundation",
    description: "Build confidence with simpler examples.",
  },
  {
    value: "intermediate",
    title: "Intermediate",
    description: "Standard GCSE-level practice.",
  },
  {
    value: "higher",
    title: "Higher",
    description: "More demanding examples and challenges.",
  },
];

export default function SimulatorDifficulty({ value, onChange }: Props) {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border-2 p-4 text-left transition ${
              selected
                ? "border-blue-600 bg-blue-50"
                : "border-slate-200 bg-white hover:border-blue-300"
            }`}
          >
            <p className="font-black text-slate-950">{option.title}</p>

            <p className="mt-1 text-sm leading-6 text-slate-600">
              {option.description}
            </p>
          </button>
        );
      })}
    </section>
  );
}
