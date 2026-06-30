import { topics } from "@/data/topics";
import CourseCard from "@/components/ui/CourseCard";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Learn</h1>
        <p className="mt-2 text-slate-600">
          Choose a Computer Science topic and continue your revision journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <CourseCard
            key={topic.id}
            title={topic.title}
            description={topic.description}
            level={topic.level}
            progress={topic.progress}
            duration="20 mins"
            difficulty="Easy"
            href={`/learn/${topic.id}`}
          />
        ))}
      </div>
    </div>
  );
}