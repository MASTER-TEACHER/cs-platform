import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";


type LessonHeroProps = {
  title: string;
  subtitle: string;
  duration: string;
  difficulty: string;
  progress: number;
  lessonNumber: number;
  totalLessons: number;
};

export default function LessonHero({
  title,
  subtitle,
  duration,
  difficulty,
  progress,
  lessonNumber,
  totalLessons,

}: LessonHeroProps) {
  return (
    <Card className="overflow-hidden border-blue-100 bg-gradient-to-br from-white to-blue-50">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            📘 GCSE Computer Science
          </span>

          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {subtitle}
          </p>
        </div>

        <div className="hidden rounded-2xl border-2 border-blue-500 bg-white px-8 py-6 text-4xl font-bold tracking-[0.35em] text-blue-600 shadow-sm lg:block">
          1011
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm md:grid-cols-3">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
            ⏱
          </div>
          <div>
            <p className="text-sm text-slate-500">Duration</p>
            <p className="text-lg font-bold text-slate-900">{duration}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-xl">
            ⭐
          </div>
          <div>
            <p className="text-sm text-slate-500">Difficulty</p>
            <p className="text-lg font-bold text-slate-900">{difficulty}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl">
            📋
          </div>
          <div>
            <p className="text-sm text-slate-500">Lesson</p>
            <p className="text-lg font-bold text-slate-900">
              {lessonNumber} / {totalLessons}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
  <div className="mb-3 flex items-center justify-between">
    <span className="font-semibold text-slate-800">Course Progress</span>
    <span className="font-bold text-blue-700">{progress}%</span>
  </div>

  <ProgressBar value={progress} />
</div>

<div className="mt-10">
  <Button>▶ Start Lesson</Button>
</div>
    </Card>
  );
}