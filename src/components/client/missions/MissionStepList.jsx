// src/components/client/missions/MissionStepList.jsx
import { Check } from '../../commons/Icons';

export function MissionStepList({ steps = [] }) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((step) => (
        <div
          key={step.id}
          className={`flex items-center gap-3 px-3 py-3 rounded-md ${
            step.completed ? 'bg-brand-xlight' : 'bg-sl-100'
          }`}
        >
          <div
            className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${
              step.completed ? 'bg-brand' : 'bg-sl-200'
            }`}
          >
            {step.completed && (
              <Check size={12} color="white" strokeWidth={3} />
            )}
          </div>

          <span
            className={`text-[13px] font-[family-name:var(--font-body)] ${
              step.completed
                ? 'text-sl-400 line-through'
                : 'text-sl-700'
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}