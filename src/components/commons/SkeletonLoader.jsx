

function ShimmerBlock({ height, width = "100%", rounded = false, className = "" }) {
  return (
    <div
      className={`sl-animate-shimmer ${rounded ? "rounded-full" : "rounded-[var(--radius-sm)]"} ${className}`}
      style={{ height, width }}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-sl-200 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ShimmerBlock height={36} width={36} rounded />
        <div className="flex-1 flex flex-col gap-2">
          <ShimmerBlock height={13} width="55%" />
          <ShimmerBlock height={10} width="35%" />
        </div>
      </div>
      <ShimmerBlock height={12} width="100%" />
      <ShimmerBlock height={12} width="80%" />
      <ShimmerBlock height={12} width="65%" />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-sl-100">
      <ShimmerBlock height={32} width={32} rounded />
      <div className="flex-1 flex flex-col gap-2">
        <ShimmerBlock height={12} width="40%" />
        <ShimmerBlock height={10} width="25%" />
      </div>
      <ShimmerBlock height={20} width={60} rounded />
    </div>
  );
}

function SkeletonMetric() {
  return (
    <div className="bg-white rounded-[var(--radius-lg)] border border-sl-200 p-5 flex flex-col gap-3">
      <ShimmerBlock height={10} width="50%" />
      <ShimmerBlock height={28} width="65%" />
      <ShimmerBlock height={10} width="40%" />
      <ShimmerBlock height={3} width="100%" />
    </div>
  );
}

function SkeletonText() {
  return (
    <div className="flex flex-col gap-2">
      <ShimmerBlock height={13} width="100%" />
      <ShimmerBlock height={13} width="90%" />
      <ShimmerBlock height={13} width="75%" />
    </div>
  );
}

const VARIANTS = {
  card:   SkeletonCard,
  row:    SkeletonRow,
  metric: SkeletonMetric,
  text:   SkeletonText,
};

export function SkeletonLoader({ variant = "card", count = 1, className = "" }) {
  const Component = VARIANTS[variant] ?? SkeletonCard;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
