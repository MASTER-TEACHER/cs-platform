import Button from "@/components/ui/Button";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  xpReward: number;
  achievements: Achievement[];
  alreadyCompleted?: boolean;
  onClose: () => void;
};

export default function LessonCompleteModal({
  xpReward,
  achievements,
  alreadyCompleted = false,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="text-7xl">{alreadyCompleted ? "✅" : "🎉"}</div>

        <h1 className="mt-6 text-4xl font-bold text-slate-900">
          {alreadyCompleted ? "Lesson Already Completed" : "Lesson Complete!"}
        </h1>

        <p className="mt-3 text-slate-600">
          {alreadyCompleted
            ? "You've already completed this lesson. Keep going with your next challenge."
            : "Great work. You have made progress in your Computer Science journey."}
        </p>

        {!alreadyCompleted && (
          <div className="mt-6 rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-600">XP Earned</p>
            <p className="mt-1 text-3xl font-bold text-blue-700">
              ⭐ +{xpReward} XP
            </p>
          </div>
        )}

        {achievements.length > 0 && (
          <div className="mt-6 space-y-3">
            <p className="font-bold text-slate-900">Achievements Unlocked</p>

            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4"
              >
                <div className="text-4xl">{achievement.icon}</div>
                <p className="mt-2 font-bold text-slate-900">
                  {achievement.title}
                </p>
                <p className="text-sm text-slate-600">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button onClick={onClose}>Continue Learning →</Button>
        </div>
      </div>
    </div>
  );
}