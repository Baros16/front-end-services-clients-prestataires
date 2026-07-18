// src/components/client/missions/MissionProgressHeader.jsx
import { useState, useEffect } from 'react';
import { formatTime } from '../../../utils/formatters';

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
  const [elapsed, setElapsed] = useState(calcElapsed(startedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(calcElapsed(startedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const metrics = [
    { label: 'DÉMARRÉ À',     value: formatTime(startedAt) },
    { label: 'DURÉE ÉCOULÉE', value: elapsed },
    { label: 'DURÉE ESTIMÉE', value: `${estimatedDurationHours}h` },
  ];

  
  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map(({ label, value }) => (
        <div
          key={label}
          className="flex flex-col items-center py-4 px-2 gap-1 bg-sl-100 rounded-md"
          >
          <span className="text-[11px] font-[family-name:var(--font-body)] tracking-[0.1em] uppercase text-sl-500">
            {label}
          </span>
          <span className="text-[24px] font-[family-name:var(--font-display)] font-semibold tracking-tight text-sl-900">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}