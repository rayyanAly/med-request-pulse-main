import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromotionSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Summary Skeleton */}
      <Card>
        <Skeleton className="h-12" />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <Skeleton className="h-12" />
            <div className="p-6">
              <Skeleton className="h-8 mb-2" />
              <Skeleton className="h-6" />
            </div>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Skeleton className="h-16 w-full" />

      {/* Table Skeleton */}
      <Card className="glass-card">
        <Skeleton className="h-12" />
        <div className="p-6">
          <Skeleton className="h-12 w-full mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}