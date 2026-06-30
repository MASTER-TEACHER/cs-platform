import WelcomeCard from "@/components/dashboard/WelcomeCard";
import ContinueLearning from "@/components/dashboard/ContinueLearning";
import RecentActivity from "@/components/dashboard/RecentActivity";


export default function Dashboard() {
  return (
    <div className="space-y-6">
      <WelcomeCard />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-6 shadow-sm shadow-slate-900/5">
          <p className="text-sm font-medium text-slate-500">Overall Progress</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">68%</p>
          <p className="mt-2 text-sm text-slate-500">Across all topics</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-6 shadow-sm shadow-slate-900/5">
          <p className="text-sm font-medium text-slate-500">Daily Streak</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">7</p>
          <p className="mt-2 text-sm text-slate-500">days active</p>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-5 py-6 shadow-sm shadow-slate-900/5">
          <p className="text-sm font-medium text-slate-500">Predicted Grade</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">7</p>
          <p className="mt-2 text-sm text-slate-500">based on quiz results</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContinueLearning />
        <RecentActivity />
      </div>
    </div>
  );
}