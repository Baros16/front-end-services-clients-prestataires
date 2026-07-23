
export function StatCard({
  label,
  value,
  trend,
  trendSubtext,
  accentColorClass = "bg-brand",
  className = "",
}) {
  const trendColor =
    trend?.direction === "up"
      ? "text-success"
      : trend?.direction === "down"
      ? "text-danger"
      : "text-sl-400";

  const trendIcon =
    trend?.direction === "up" ? "↑" : trend?.direction === "down" ? "↓" : "→";

  return (
    <div
      className={`
        bg-white rounded-[var(--radius-lg)] border border-sl-200
        shadow-[var(--shadow-card)] p-5 flex flex-col gap-2
        ${className}
      `}
    >
      <span className="font-[family-name:var(--font-display)] text-[10px] font-bold tracking-[0.12em] uppercase text-sl-400">
        {label}
      </span>

      <span className="font-[family-name:var(--font-body)] text-[26px] font-extrabold text-sl-900 leading-none">
        {value}
      </span>

      {trend && (
        <div className="flex items-center gap-[6px]">
          <span className={`text-[12px] font-semibold ${trendColor}`}>
            {trendIcon} {trend.value}
          </span>
          {trendSubtext && (
            <span className="text-[11px] text-sl-400">{trendSubtext}</span>
          )}
        </div>
      )}
    </div>
  );
}
