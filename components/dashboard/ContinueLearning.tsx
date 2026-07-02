"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getNextLesson } from "@/lib/lessonEngine";

export default function ContinueLearning() {
  const nextLesson = getNextLesson();

  return (
    <Card>
      <h2 className="text-2xl font-bold">
        Continue Learning
      </h2>

      {nextLesson ? (
        <>
          <p className="mt-6 text-slate-500">
            Current Topic
          </p>

          <h3 className="text-xl font-semibold">
            {nextLesson.topic}
          </h3>

          <p className="mt-4 text-slate-500">
            Next Lesson
          </p>

          <h4 className="text-lg">
            {nextLesson.lesson}
          </h4>

          <div className="mt-6">
            <Button>
              Continue →
            </Button>
          </div>
        </>
      ) : (
        <p>🎉 Course Complete!</p>
      )}
    </Card>
  );
}