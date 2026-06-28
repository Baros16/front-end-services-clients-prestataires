// src/components/client/mission/SequestredAmountCard.jsx
import { AmountDisplay, ProgressBar } from '@/components/commons';

export function SequestredAmountCard({ totalAmount, steps = [] }) {
  const completed = steps.filter((s) => s.completed).length;
  const percent = steps.length > 0
    ? Math.round((completed / steps.length) * 100)
    : 0;

  return (
    <div
      className="rounded-[var(--radius-lg)] p-4 flex flex-col gap-3"
      style={{ backgroundColor: 'var(--color-sl-50)' }}
    >
      <span
        className="text-xs font-body tracking-widest uppercase"
        style={{ color: 'var(--color-sl-500)' }}
      >
        Séquestre
      </span>

      <AmountDisplay
        amount={totalAmount}
        size="lg"
        variant="default"
      />

      <span
        className="text-xs font-body"
        style={{ color: 'var(--color-sl-500)' }}
      >
        Libéré après double validation
      </span>

      <ProgressBar
        value={percent}
        max={100}
        color="var(--color-brand)"
        showLabel
        size="sm"
      />

      <span
        className="text-xs font-body"
        style={{ color: 'var(--color-sl-500)' }}
      >
        {percent}% de la mission accomplie
      </span>
    </div>
  );
}