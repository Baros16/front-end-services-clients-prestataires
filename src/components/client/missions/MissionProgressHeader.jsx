// src/components/client/mission/MissionProgressHeader.jsx
import { formatTime } from '@/utils/formatters';

function calcElapsed(startedAt) {
  const diffMs = Date.now() - new Date(startedAt).getTime();
  const totalMin = Math.floor(diffMs / 60000);
  const h = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  if (h === 0) return `${min}min`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}min`;
}

export function MissionProgressHeader({ startedAt, estimatedDurationHours }) {
  const metrics = [
    { label: 'DÉMARRÉ À',      value: formatTime(startedAt) },
    { label: 'DURÉE ÉCOULÉE',  value: calcElapsed(startedAt) },
    { label: 'DURÉE ESTIMÉE',  value: `${estimatedDurationHours}h` },
  ];

  return (
    <div className="grid grid-cols-3 divide-x divide-[var(--color-sl-200)]">
      {metrics.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center py-4 px-2 gap-1">
          <span
            className="text-xs font-body tracking-wide uppercase"
            style={{ color: 'var(--color-sl-500)' }}
          >
            {label}
          </span>
          <span
            className="text-2xl font-display font-semibold tracking-tight"
            style={{ color: 'var(--color-sl-900)' }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}