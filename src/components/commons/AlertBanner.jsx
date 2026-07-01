
const TYPE_CONFIG = {
  info:    { classes: "bg-info-light text-info border-info/20",          icon: "ℹ" },
  success: { classes: "bg-success-light text-success border-success/20", icon: "✓" },
  warning: { classes: "bg-warning-light text-warning border-warning/20", icon: "⚠" },
  danger:  { classes: "bg-danger-light text-danger border-danger/20",    icon: "✕" },
};

export function AlertBanner({ type = "info", title, message, onClose, className = "" }) {
  const { classes, icon } = TYPE_CONFIG[type] ?? TYPE_CONFIG.info;

  return (
    <div
      className={`
        flex gap-3 items-start rounded-[var(--radius-md)] px-4 py-3 border
        font-[family-name:var(--font-body)] sl-animate-fade-in
        ${classes} ${className}
      `}
    >
      <span className="text-[16px] shrink-0 mt-[1px]">{icon}</span>

      <div className="flex-1">
        {title && (
          <p className="m-0 font-semibold text-[13px] mb-[2px]">{title}</p>
        )}
        {message && (
          <p className="m-0 text-[13px] text-sl-600">{message}</p>
        )}
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-sl-400 hover:text-sl-600 text-[16px] leading-none
                     bg-transparent border-none cursor-pointer p-0 shrink-0 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
}
