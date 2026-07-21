import { Inbox } from "./Icons";
export function EmptyState({
  icon = <Inbox size={40} strokeWidth={1.5}/>,
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
      <span className="var(--color-sl-300)">{icon}</span>

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
