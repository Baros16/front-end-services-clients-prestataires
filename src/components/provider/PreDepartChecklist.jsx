export default function PreDepartChecklist({ items, onToggle }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => {
        const checked = item.checked ?? item.completed;

        return (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            className="flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors duration-150"
          >
            <div
              className={`
                w-5 h-5 min-w-5 rounded-md flex items-center justify-center
                text-xs font-bold text-[var(--color-sl-0)]
                ${
                  checked
                    ? "bg-[var(--color-success)] border-0"
                    : "bg-transparent border-2 border-[var(--color-sl-300)]"
                }
              `}
            >
              {checked && "✓"}
            </div>

            <span
              className={`
                text-[13px]
                ${
                  checked
                    ? "text-[var(--color-success)] font-medium line-through"
                    : "text-[var(--color-sl-700)] font-normal no-underline"
                }
              `}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}