// src/components/client/urgency/CriterionSelector.jsx
import { CheckCircle } from '../../commons';

export function CriterionSelector({ label, options, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-sl-400)' }}>
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95"
            style={{
              background: value === opt ? 'var(--color-sl-900)' : 'var(--color-surface)',
              color: value === opt ? 'var(--color-sl-50)' : 'var(--color-sl-500)',
              border: `1px solid ${value === opt ? 'var(--color-sl-900)' : 'var(--color-sl-200)'}`,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}