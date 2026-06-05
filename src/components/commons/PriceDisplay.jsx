
const SIZE_CLASSES = {
  sm: "text-[13px]",
  md: "text-[16px]",
  lg: "text-[22px]",
  xl: "text-[30px]",
};

export function PriceDisplay({ amount, size = "md", muted = false, className = "" }) {
  const formatted = new Intl.NumberFormat("fr-FR").format(amount);

  return (
    <span
      className={`
        font-[family-name:var(--font-display)] font-bold tracking-[-0.02em]
        ${SIZE_CLASSES[size]}
        ${muted ? "text-sl-400" : "text-sl-900"}
        ${className}
      `}
    >
      {formatted}
      <span className="text-[0.65em] font-medium ml-[3px] text-sl-400">XAF</span>
    </span>
  );
}
