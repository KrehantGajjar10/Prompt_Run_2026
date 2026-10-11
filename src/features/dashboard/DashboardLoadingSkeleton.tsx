import React from 'react';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export const DashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6" aria-label="Loading financial dashboard data" role="status">
      {/* Welcome Banner Skeleton */}
      <Card variant="default" className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-3 w-full max-w-xl">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-16 w-36" />
            <Skeleton className="h-16 w-36" />
          </div>
        </div>
      </Card>

      {/* 4 Summary Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} variant="default" className="p-5 h-36 flex flex-col justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-3 w-28" />
          </Card>
        ))}
      </div>

      {/* Timeline Skeleton */}
      <Card variant="default" className="p-5">
        <div className="space-y-3">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-56" />
        </div>
      </Card>

      {/* Allowance & Calculator Skeleton */}
      <Card variant="default" className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="lg:col-span-5 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </div>
      </Card>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <Card variant="default" className="p-5 space-y-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-full" />
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="h-14 w-full rounded-lg" />
            ))}
          </Card>
          <Card variant="default" className="p-5 space-y-4">
            <Skeleton className="h-4 w-40" />
            {[1, 2, 3, 4].map((k) => (
              <Skeleton key={k} className="h-12 w-full rounded-lg" />
            ))}
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card variant="default" className="p-5 space-y-4">
            <Skeleton className="h-4 w-48" />
            {[1, 2, 3].map((m) => (
              <Skeleton key={m} className="h-16 w-full rounded-lg" />
            ))}
          </Card>
          <Card variant="default" className="p-5 space-y-4">
            <Skeleton className="h-4 w-40" />
            {[1, 2].map((n) => (
              <Skeleton key={n} className="h-16 w-full rounded-lg" />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};
