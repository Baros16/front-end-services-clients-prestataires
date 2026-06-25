// src/components/common/Avatar.jsx

const SIZE_CLASSES = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-[13px]",
  lg: "w-12 h-12 text-[18px]",
  xl: "w-14 h-14 text-[22px]",
};

const DOT_CLASSES = {
  sm: "w-2 h-2 border",
  md: "w-2.5 h-2.5 border-[1.5px]",
  lg: "w-3 h-3 border-2",
  xl: "w-3.5 h-3.5 border-2",
};

export function Avatar({
  initial,
  name,
  size = "md",
  bgClass = "bg-brand",
  isOnline,
  className = "",
}) {
  return (
    <div className={`relative shrink-0 inline-flex ${className}`}>
      <div
        title={name}
        className={`
          ${SIZE_CLASSES[size]} ${bgClass}
          rounded-full flex items-center justify-center
          text-white font-bold font-[family-name:var(--font-display)]
        `}
      >
        {initial?.toUpperCase()}
      </div>

      {isOnline && (
        <span
          className={`
            absolute bottom-0 right-0
            ${DOT_CLASSES[size]}
            rounded-full border-white sl-animate-pulse-dot
          `}
          style={{ background: 'var(--color-success)' }}
        />
      )}
    </div>
  );
}