
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}) {
  if (!open) return null;

  const maxWidths = {
    sm: "max-w-[380px]",
    md: "max-w-[520px]",
    lg: "max-w-[680px]",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 sl-animate-fade-in"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        className={`
          bg-white rounded-[var(--radius-xl)] w-full ${maxWidths[size]}
          shadow-[var(--shadow-lg)] flex flex-col max-h-[90vh] overflow-hidden
          sl-animate-scale-in
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sl-100">
          <span className="font-[family-name:var(--font-display)] font-bold text-[17px] text-sl-900">
            {title}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-sl-100 hover:bg-sl-200 flex items-center justify-center
                       text-sl-500 text-lg leading-none transition-colors duration-150 cursor-pointer border-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-sl-100 flex items-center justify-end gap-[10px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
