
const VARIANT_CLASSES = {
  default: "bg-sl-100 text-sl-600",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger:  "bg-danger-light text-danger",
  info:    "bg-info-light text-info",
  accent:  "bg-accent-light text-[#B45309]",
  brand:   "bg-brand-xlight text-brand",
};

export function Badge({
  label,
  variant = "default",
  size = "md",
  withDot = false,
  className = "",
}) {
  const sizes = {
    sm: "px-2 py-[2px] text-[11px]",
    md: "px-[10px] py-1 text-[12px]",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-[5px] rounded-full font-semibold
        tracking-[0.02em] font-[family-name:var(--font-body)]
        ${sizes[size]} ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default}
        ${className}
      `}
    >
      {withDot && (
        <span className="w-[6px] h-[6px] rounded-full bg-current sl-animate-pulse-dot" />
      )}
      {label}
    </span>
  );
}
