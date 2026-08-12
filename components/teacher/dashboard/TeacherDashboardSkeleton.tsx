import Skeleton from "@/components/ui/Skeleton";

export default function TeacherDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-56 w-full" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_item, index) => (
          <Skeleton key={index} className="h-40" />
        ))}
      </div>

      <Skeleton className="h-56 w-full" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Skeleton className="h-96 xl:col-span-2" />
        <Skeleton className="h-96" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
