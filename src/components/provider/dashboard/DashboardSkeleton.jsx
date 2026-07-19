// src/components/provider/dashboard/DashboardSkeleton.jsx
import { SkeletonLoader } from '../../commons';

export function DashboardSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => (
          <SkeletonLoader key={i} variant="metric" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
        <SkeletonLoader variant="card" />
        <div className="flex flex-col gap-4">
          <SkeletonLoader variant="card" />
          <SkeletonLoader variant="card" />
        </div>
      </div>
    </div>
  );
}