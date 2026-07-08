// src/components/provider/earnings/MonthlyGainBar.jsx
import { formatXAF } from '../../../utils/formatters';

export function MonthlyGainBar({ month, amount, maxAmount }) {
  const percent = maxAmount > 0
    ? Math.round((amount / maxAmount) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-[family-name:var(--font-body)] text-sl-700">
          {month}
        </span>
        <span className="text-[13px] font-bold font-[family-name:var(--font-display)] text-sl-900">
          {formatXAF(amount)}
        </span>
      </div>
      <div className="h-2 bg-sl-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
          style={{ width: '${percent}% '}}
        />
      </div>
    </div>
  );
}