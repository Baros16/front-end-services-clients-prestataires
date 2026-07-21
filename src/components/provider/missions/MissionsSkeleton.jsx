// src/components/provider/missions/MissionsSkeleton.jsx
import { SkeletonLoader } from '../../commons';

export function MissionsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <SkeletonLoader key={i} variant="card" />
      ))}
    </div>
  );
}