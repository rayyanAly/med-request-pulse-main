import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
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