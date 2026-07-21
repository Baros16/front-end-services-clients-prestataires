// src/components/provider/dashboard/RecentMissionRow.jsx
import { AmountDisplay, StatusBadge } from '../../commons';
import { formatDateShort }            from '../../../utils/formatters';

export function RecentMissionRow({ mission, isLast }) {
  const dateAffichee = mission.completedAt ?? mission.startedAt;

  return (
    <div className={`flex items-center gap-3 py-3 ${isLast ? '' : 'border-b border-sl-100'}`}>

      {/* Titre + statut */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate font-[family-name:var(--font-display)] text-sl-900">
          {mission.title}
        </p>
        <div className="mt-1">
          <StatusBadge
            label={mission.status}
            variant={mission.status}
            size="sm"
            withDot={false}
          />
        </div>
      </div>

      {/* Montant + date */}
      <div className="flex flex-col items-end shrink-0 gap-0.5">
        <AmountDisplay amount={mission.totalAmount} showSign size="md" variant="positive" />
        <p className="text-xs text-sl-400 font-[family-name:var(--font-body)]">
          {formatDateShort(dateAffichee)}
        </p>
      </div>

    </div>
  );
}