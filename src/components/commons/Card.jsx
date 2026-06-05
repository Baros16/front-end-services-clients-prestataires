
export function Card({
  children,
  title,
  actions,
  noPadding = false,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white rounded-[var(--radius-lg)] border border-sl-200
        shadow-[var(--shadow-card)] overflow-hidden sl-animate-fade-in
        ${className}
      `}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-sl-100">
          {title && (
            <span className="font-[family-name:var(--font-display)] text-[11px] font-bold tracking-[0.1em] uppercase text-sl-500">
              {title}
            </span>
          )}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}
