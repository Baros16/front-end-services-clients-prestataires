// src/components/ServiceCategoryCard.jsx

/**
 * ServiceCategoryCard
 * Tuile catégorie de service avec icône + libellé.
 * Utilisée dans la grille client dashboard et le formulaire nouvelle demande.
 *
 * category : { id, label, icon: ReactNode, color: string (bg Tailwind ou hex) }
 * selected : bordure brand active + légère élévation
 * sizes    : sm | md
 */

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

  return (
    <button
      onClick={() => onClick?.(category.id)}
      className={`
        flex flex-col items-center cursor-pointer border transition-all duration-150
        bg-white font-[family-name:var(--font-body)]
        ${s.wrapper}
        ${
          selected
            ? "border-brand shadow-[0_0_0_2px_var(--color-brand)] shadow-[var(--shadow-md)]"
            : "border-sl-200 hover:border-sl-300 hover:shadow-[var(--shadow-card)]"
        }
        ${className}
      `}
    >
      {/* Icône colorée */}
      <div
        className={`
          ${s.icon} flex items-center justify-center shrink-0
        `}
        style={{ background: category.color ?? "var(--color-sl-100)" }}
      >
        {category.icon}
      </div>

      {/* Label */}
      <span
        className={`
          ${s.label} font-medium text-center leading-tight
          ${selected ? "text-brand font-semibold" : "text-sl-700"}
        `}
      >
        {category.label}
      </span>
    </button>
  );
}
