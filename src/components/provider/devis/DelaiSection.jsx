// src/components/provider/quote/DelaiSection.jsx
import { Card } from '../../commons/';
import { ChevronDown , AlertCircle} from '../../commons';

// Valeurs alignées sur estimatedDurationHours (Quote, API_CONTRACT.md §4.5)
export const DELAI_OPTIONS = [
  { value: 1, label: '1 heure' },
  { value: 2, label: '2 heures' },
  { value: 4, label: 'Demi-journée (4 heures)' },
  { value: 8, label: 'Journée complète (8 heures)' },
  { value: 24, label: 'Plusieurs jours' },
];


export function DelaiSection({ estimatedDurationHours, onChange, error }) {
  return (
    <Card className="p-5 sm:p-6">
      <label
        htmlFor="estimatedDurationHours"
        className="block text-xs font-semibold tracking-wide text-sl-600 uppercase mb-2"
      >
        Délai d&rsquo;exécution estimé
      </label>
      <div className="relative sm:max-w-xs">
        <select
          id="estimatedDurationHours"
          value={estimatedDurationHours}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-invalid={Boolean(error)}
          className={`w-full appearance-none rounded-md border border-sl-200 bg-surface px-3.5 py-2.5 pr-9 text-sm
            text-sl-900 shadow-card transition-colors
            focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light
            ${error ? 'border-danger' : 'border-sl-200'}`}
        >
          {DELAI_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-sl-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      {error && (
          <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
         </p>
        )}
    </Card>
  );
}