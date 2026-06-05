
export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  className = "",
}) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const isComplete = percent === 100;

  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-[12px] font-medium text-sl-600">{label}</span>
          )}
          {showPercent && (
            <span
              className={`text-[12px] font-bold ${
                isComplete ? "text-success" : "text-brand"
              }`}
            >
              {percent}%
            </span>
          )}
        </div>
      )}

      <div className="h-2 bg-sl-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            isComplete ? "bg-success" : "bg-brand"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
