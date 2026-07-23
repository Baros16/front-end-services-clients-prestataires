// src/components/provider/missions/MissionCard.jsx
import { useNavigate }                          from 'react-router-dom';
import { AmountDisplay, StatusBadge, Avatar, Button, Card } from '../commons';
import { formatDateShort }                      from '../../utils/formatters';

export function MissionCard({ mission , basePath}) {
  const navigate     = useNavigate();
  const dateAffichee = mission.completedAt ?? mission.startedAt;

  return (
    <Card>
      {/* ── Ligne 1 : titre + badge statut ── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <Avatar initial={mission.title.charAt(0)} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight truncate
                          font-[family-name:var(--font-display)] text-sl-900">
              {mission.title}
            </p>
            <p className="text-xs mt-0.5 text-sl-400 font-[family-name:var(--font-body)]">
              {mission.category}
            </p>
          </div>
        </div>
        <StatusBadge variant={mission.status} withDot={mission.status == "en_cours"} />
      </div>

      {/* ── Adresse ── */}
      <p className="text-xs text-sl-500 font-[family-name:var(--font-body)] truncate mb-3">
        {mission.location.address}
      </p>

      {/* ── Montant + date ── */}
      <div className="flex items-center justify-between mb-4">
        <AmountDisplay amount={mission.totalAmount} size="sm" variant="success" showSign />
        {dateAffichee && (
          <span className="text-xs text-sl-400 font-[family-name:var(--font-body)]">
            {formatDateShort(dateAffichee)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-sl-400 font-[family-name:var(--font-body)]">
          Paiement :
        </span>
        <StatusBadge variant={mission.paymentStatus} size="sm" withDot={false} />
      </div>

      {/* ── Bouton ── */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate(`${basePath}/${mission.id}`)}
        className="w-full"
      >
        Voir détails
      </Button>
    </Card>
  );
}