import { StatusBadge } from '../commons';

const SCHEDULE = [
  { label: 'Lundi – Vendredi', days: ['monday','tuesday','wednesday','thursday','friday'] },
  { label: 'Samedi',           days: ['saturday'] },
  { label: 'Dimanche',         days: ['sunday'] },
];

export function AvailabilitySchedule({ availability }) {
  if (!availability) return null;
  return (
    <div className="bg-white border border-sl-100 rounded-xl p-4 space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-sl-400">Disponibilité</p>
      {SCHEDULE.map(({ label, days }) => {
        const day = availability[days[0]];
        return (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm text-sl-700">{label}</span>
            {day?.available
              ? <StatusBadge label={`${day.start}–${day.end}`} variant="disponible" size="sm" />
              : <StatusBadge label="INDISPONIBLE" variant="annulee" size="sm" />
            }
          </div>
        );
      })}
    </div>
  );
}
