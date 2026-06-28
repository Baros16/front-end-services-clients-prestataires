// src/components/client/mission/MissionStepList.jsx
import { Check } from '@/components/commons/Icons';

export function MissionStepList({ steps = [] }) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((step) => (
        <div
          key={step.id}
          className="flex items-center gap-3 px-3 py-3 rounded-[var(--radius-md)]"
          style={{
            backgroundColor: step.completed
              ? 'var(--color-success-light)'
              : 'var(--color-sl-50)',
          }}
        >
          {/* Case à cocher */}
          <div
            className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: step.completed
                ? 'var(--color-success)'
                : 'var(--color-sl-200)',
            }}
          >
            {step.completed && (
              <Check size={12} color="white" strokeWidth={3} />
            )}
          </div>

          {/* Label */}
          <span
            className="text-sm font-body"
            style={{
              color: step.completed
                ? 'var(--color-sl-400)'
                : 'var(--color-sl-700)',
              textDecoration: step.completed ? 'line-through' : 'none',
            }}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}