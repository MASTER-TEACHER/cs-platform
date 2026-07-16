import Link from "next/link";
import Card from "@/components/ui/Card";

const actions = [
  {
    href: "/teacher/students",
    icon: "👨‍🎓",
    title: "Manage Students",
    description: "View student profiles, progress and quiz performance.",
  },
  {
    href: "/teacher/classes",
    icon: "🏫",
    title: "Manage Classes",
    description: "Create classes and organise students into teaching groups.",
  },
  {
    href: "/teacher/assignments",
    icon: "📋",
    title: "Create Assignment",
    description: "Assign lessons and quizzes to students.",
  },
  {
    href: "/teacher/reports",
    icon: "📊",
    title: "View Reports",
    description: "Review class performance and export progress reports.",
  },
];

export default function TeacherQuickActions() {
  return (
    <Card>
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
        Teacher Tools
      </p>

      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        Quick Actions
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-teal-300 hover:bg-teal-50 hover:shadow-md"
          >
            <div className="text-3xl">{action.icon}</div>

            <h3 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-teal-700">
              {action.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </Card>
  );
}