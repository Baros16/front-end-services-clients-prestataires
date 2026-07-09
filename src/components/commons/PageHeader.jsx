export function PageHeader({ title, subtitle, badge, actions, className = "" }) {
  return (
    <div
      className={`
        flex items-start justify-between gap-4
        px-6 py-5 border-b border-sl-200 bg-white
        font-[family-name:var(--font-body)]
        ${className}
      `}
    >

      <div className="flex flex-col gap-1 min-0">
        <div className="flex items-center gap-3 flex-wrap">

          <h1
            className="
              font-[family-name:var(--font-display)] font-bold text-[20px]
              text-sl-900 leading-tight m-0
            "
          >
            {title}
          </h1>

        </div>

        {subtitle && (
          <p className="text-[13px] text-sl-500 m-0">
            {subtitle}
          </p>
        )}
      </div>


      {badge && (
        <div className="shrink-0 mt-[2px]">
          {badge}
        </div>
      )}


      {actions && (
        <div className="flex items-center gap-2 shrink-0 mt-[2px]">
          {actions}
        </div>
      )}

    </div>
  );
}