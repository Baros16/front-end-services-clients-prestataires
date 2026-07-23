// src/components/common/ServiceCategoryCard.jsx

const SIZES = {
  sm: {
    wrapper: "p-3 gap-2 rounded-[var(--radius-md)] min-w-[90px]",
    icon:    "w-8 h-8 text-[18px] rounded-[var(--radius-sm)]",
    label:   "text-[11px]",
  },
  md: {
    wrapper: "p-4 gap-3 rounded-[var(--radius-lg)] min-w-[110px]",
    icon:    "w-10 h-10 text-[22px] rounded-[var(--radius-md)]",
    label:   "text-[12px]",
  },
};

export function ServiceCategoryCard({
  category,
  selected = false,
  onClick,
  size = "md",
  className = "",
}) {
  const s = SIZES[size];
  const color = category.color ?? 'var(--color-sl-300)';

  return (
    <button
      type="button"
      onClick={() => onClick?.(category.id)}
      className={[
        'flex flex-col items-center cursor-pointer border-2 transition-all duration-200',
        'ease-[cubic-bezier(0.32,0.72,0,1)] font-[family-name:var(--font-body)]',
        'active:scale-[0.97] focus-visible:outline-none',
        s.wrapper,
        selected
          ? 'shadow-[var(--shadow-card)]'
          : 'border-transparent hover:shadow-[var(--shadow-card)]',
        className,
      ].join(' ')}
      style={{
        backgroundColor: selected
          ? `color-mix(in srgb, ${color} 18%, transparent)`
          : `color-mix(in srgb, ${color} 5%, transparent)`,
        borderColor: selected ? color : 'transparent',
      }}
    >
      {/* Icône — fond catégorie à 25% */}
      <div
        className={`${s.icon} flex items-center justify-center shrink-0`}
        style={{ backgroundColor: `color-mix(in srgb, ${color} 25%, transparent)` }}
      >
        {category.icon}
      </div>

      {/* Label — couleur catégorie si sélectionné */}
      <span
        className={`${s.label} font-medium text-center leading-tight transition-colors duration-200`}
        style={{ color: selected ? color : 'var(--color-sl-700)' }}
      >
        {category.label}
      </span>
    </button>
  );
}