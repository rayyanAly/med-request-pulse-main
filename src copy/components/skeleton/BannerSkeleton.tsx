import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const BannerSkeleton: React.FC = () => {
  return (
    <div className="stat-card">
      {/* Banner Preview Skeleton */}
      <div className="mb-4 max-h-48 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Skeleton className="w-full h-32" />
      </div>

      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-5 w-8 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <div className="mt-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4 mt-1" />
      </div>
    </div>
  );
};

export default BannerSkeleton;