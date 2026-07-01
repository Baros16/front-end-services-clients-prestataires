
export function EmptyState({
  icon = "📭",
  title,
  subtitle,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-3
        py-12 px-6 text-center sl-animate-fade-in
        ${className}
      `}
    >
      <span className="text-[40px] leading-none">{icon}</span>

      <div>
        <p className="m-0 font-[family-name:var(--font-display)] font-bold text-[16px] text-sl-700">
          {title}
        </p>
        {subtitle && (
          <p className="m-0 mt-1 text-[13px] text-sl-400">{subtitle}</p>
        )}
      </div>

      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
