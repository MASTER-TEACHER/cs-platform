"use client";

import InterventionImpactCard from "@/components/teacher/interventions/InterventionImpactCard";

export default function StudentInterventionImpactList({
  teacherId,
  interventionIds,
}: {
  teacherId: string;
  interventionIds: string[];
}) {
  if (interventionIds.length === 0) return null;

  return (
    <div className="space-y-6">
      {interventionIds.map((interventionId) => (
        <InterventionImpactCard
          key={interventionId}
          interventionId={interventionId}
          teacherId={teacherId}
        />
      ))}
    </div>
  );
}
