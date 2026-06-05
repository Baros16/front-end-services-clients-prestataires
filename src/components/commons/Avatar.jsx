
const SIZE_CLASSES = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-[13px]",
  lg: "w-12 h-12 text-[18px]",
  xl: "w-14 h-14 text-[22px]",
};

export function Avatar({
  initial,
  name,
  size = "md",
  bgClass = "bg-brand",
  className = "",
}) {
  return (
    <div
      title={name}
      className={`
        ${SIZE_CLASSES[size]} ${bgClass}
        rounded-full flex items-center justify-center shrink-0
        text-white font-bold font-[family-name:var(--font-display)]
        ${className}
      `}
    >
      {initial?.toUpperCase()}
    </div>
  );
}
