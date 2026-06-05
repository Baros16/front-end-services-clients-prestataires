
export function TabBar({ tabs = [], activeId, onChange, className = "" }) {
  return (
    <div
      className={`
        inline-flex gap-1 bg-sl-100 p-1 rounded-[var(--radius-md)]
        ${className}
      `}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => onChange?.(tab.id)}
            className={`
              px-4 py-[7px] rounded-[var(--radius-sm)] text-[13px] font-semibold
              font-[family-name:var(--font-body)] transition-all duration-150
              cursor-pointer border-none whitespace-nowrap
              ${
                isActive
                  ? "bg-white text-sl-900 shadow-[var(--shadow-card)]"
                  : "bg-transparent text-sl-500 hover:text-sl-700"
              }
            `}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`
                  ml-[6px] text-[10px] font-bold px-[7px] py-[1px] rounded-full
                  ${
                    isActive
                      ? "bg-brand-xlight text-brand"
                      : "bg-sl-200 text-sl-500"
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
