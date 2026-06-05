
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  onClick,
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-md)] " +
    "transition-all duration-150 whitespace-nowrap cursor-pointer select-none " +
    "disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-body)] tracking-[0.01em]";

  const sizes = {
    sm: "px-[14px] py-[6px] text-[13px]",
    md: "px-5 py-[10px] text-[14px]",
    lg: "px-7 py-[13px] text-[15px]",
  };

  const variants = {
    primary:
      "bg-brand text-white shadow-[0_2px_6px_rgba(27,67,50,0.25)] " +
      "hover:bg-brand-light active:scale-[0.98]",
    secondary:
      "bg-transparent text-brand border-[1.5px] border-brand " +
      "hover:bg-brand-xlight active:scale-[0.98]",
    ghost:
      "bg-transparent text-sl-600 border-[1.5px] border-sl-200 " +
      "hover:bg-sl-100 hover:border-sl-300 active:scale-[0.98]",
    danger:
      "bg-danger text-white shadow-[0_2px_6px_rgba(220,38,38,0.25)] " +
      "hover:brightness-110 active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
