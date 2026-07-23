// src/components/AmountDisplay.jsx

/**
 * AmountDisplay
 * Affichage standardisé d'un montant monétaire en XAF.
 * Gère le formatage fr-FR et les variants sémantiques de couleur.
 *
 * sizes    : sm | md | lg | xl
 * variants : default | positive | negative | muted
 * showSign : affiche + ou - devant le montant
 */

const SIZES = {
  sm: "text-[13px]",
  md: "text-[16px]",
  lg: "text-[22px]",
  xl: "text-[30px]",
};

const VARIANTS = {
  default:  "text-sl-900",
  positive: "text-success",
  negative: "text-danger",
  muted:    "text-sl-400",
};

export function AmountDisplay({
  amount,
  currency = "XAF",
  size = "md",
  variant = "default",
  showSign = false,
  className = "",
}) {
  const formatted = new Intl.NumberFormat("fr-FR").format(Math.abs(amount));
  const sign = showSign ? (amount >= 0 ? "+" : "−") : amount < 0 ? "−" : "";

  return (
    <span
      className={`
        font-[family-name:var(--font-body)] font-bold tracking-[-0.02em]
        ${SIZES[size]} ${VARIANTS[variant]} ${className}
      `}
    >
      {sign}{formatted}
      <span className="text-[0.65em] font-medium ml-[3px] text-sl-400">
        {currency}
      </span>
    </span>
  );
}
