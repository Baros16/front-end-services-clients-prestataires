// src/components/provider/dashboard/AvailabilityPanel.jsx
import { Card, StatusBadge } from '../../commons';

function buildSlots(availability) {
  const {
    monday, tuesday, wednesday, thursday, friday,
    saturday, sunday,
  } = availability;

  const sameWeekdays =
    monday.available === tuesday.available &&
    monday.available === wednesday.available &&
    monday.available === thursday.available &&
    monday.available === friday.available &&
    monday.start === tuesday.start &&
    monday.start === wednesday.start &&
    monday.start === thursday.start &&
    monday.start === friday.start &&
    monday.end === tuesday.end &&
    monday.end === wednesday.end &&
    monday.end === thursday.end &&
    monday.end === friday.end;

  const slots = [];

  if (sameWeekdays) {
    slots.push({
      id:        'slot_lv',
      day:       'Lundi – Vendredi',
      hours:     monday.available ? `${monday.start} – ${monday.end}` : null,
      available: monday.available,
    });
  } else {
    const labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    [monday, tuesday, wednesday, thursday, friday].forEach((day, idx) => {
      slots.push({
        id:        `slot_${idx}`,
        day:       labels[idx],
        hours:     day.available ? `${day.start} – ${day.end}` : null,
        available: day.available,
      });
    });
  }

  slots.push({
    id:        'slot_sam',
    day:       'Samedi',
    hours:     saturday.available ? `${saturday.start} – ${saturday.end}` : null,
    available: saturday.available,
  });

  slots.push({
    id:        'slot_dim',
    day:       'Dimanche',
    hours:     sunday.available ? `${sunday.start} – ${sunday.end}` : null,
    available: sunday.available,
  });

  return slots;
}

export function AvailabilityPanel({ availability }) {
  const slots = buildSlots(availability);

  return (
    <Card title="DISPONIBILITÉ">
      <div className="flex flex-col gap-4">
        {slots.map(slot => (
          <div key={slot.id} className="flex items-center justify-between gap-3">
            <span className="text-sm text-sl-700 font-[family-name:var(--font-body)]">
              {slot.day}
            </span>
            <StatusBadge
              variant={slot.available ? 'disponible' : 'indisponible'}
              label={slot.available ? slot.hours : 'INDISPONIBLE'}
              withDot={false}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}