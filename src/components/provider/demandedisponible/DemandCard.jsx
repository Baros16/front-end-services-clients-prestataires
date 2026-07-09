// src/components/provider/demandedisponible/DemandCard.jsx
import { useState } from 'react';
import { Button }      from '../../commons/Button';
import { Card }        from '../../commons/Card';
import { StatusBadge } from '../../commons/StatusBadge';
import { RatingStars } from '../../commons/RatingStars';
import { AlertBanner } from '../../commons/AlertBanner';
import { DemandDetailModal } from './DemandDetailModal';
import { formatBudget } from './formatBudget';
import {
  MapPin,
  Wrench,
  Zap,
  Brush,
  Key,
  Sparkles,
  ChevronRight,
} from '../../commons/Icons';

/* ── Mapping catégories → icône Lucide + fond ─────────────── */
const CATEGORY_DISPLAY = {
  wrench:  { Icon: Wrench,   bgVar: 'var(--color-accent-light)' },
  bolt:    { Icon: Zap,      bgVar: 'var(--color-warning-light)' },
  broom:   { Icon: Brush,    bgVar: 'var(--color-success-light)' },
  key:     { Icon: Key,      bgVar: 'var(--color-accent-light)' },
  paint:   { Icon: Sparkles, bgVar: '#F3E8FF' },
  default: { Icon: Wrench,   bgVar: 'var(--color-sl-100)' },
};

function formatPostedAgo(d) {
  if (d.postedAgo) return d.postedAgo;
  const min = d.postedMinutesAgo ?? 0;
  if (min < 60)   return `Il y a ${min} min`;
  if (min < 1440) return `Il y a ${Math.floor(min / 60)}h`;
  return `Il y a ${Math.floor(min / 1440)}j`;
}

export function DemandCard({ demand, onViewDetails, onApply, isApplying = false, feedback = null, onDismissFeedback }) {
  const [showModal, setShowModal] = useState(false);
  const { Icon, bgVar } =
    CATEGORY_DISPLAY[demand.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  return (
    <>
      <Card
        noPadding
        title={
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-[var(--radius-sm)] shrink-0"
            style={{ background: bgVar }}
          >
            <Icon size={16} className="text-[var(--color-sl-700)]" />
            <span className="text-sm font-medium text-[var(--color-sl-900)] font-[family-name:var(--font-body)]">
              {demand.category?.label}
            </span>
          </div>
        }
        actions={
          <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
            {demand.isUrgent && <StatusBadge variant="urgent" size="sm" />}
            <StatusBadge variant="ouvert" size="sm" />
          </div>
        }
      >
        <div className="flex flex-col gap-3 p-4">

          {/* ── Description (2 lignes max) ── */}
          <p className="text-sm leading-relaxed line-clamp-2 text-[var(--color-sl-600)] font-[family-name:var(--font-body)]">
            {demand.description}
          </p>

          {/* ── Budget ── */}
          <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-sl-50)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--color-sl-400)]">
              Budget estimé
            </span>
            <span className="text-sm font-semibold text-[var(--color-sl-900)] font-[family-name:var(--font-display)]">
              {formatBudget(demand)}
            </span>
          </div>

          {/* ── Distance + Note client ── */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-[var(--color-sl-500)]">
              <MapPin size={12} />
              {demand.distanceKm} km
            </span>
            <div className="flex items-center gap-1">
              <RatingStars value={demand.clientRating} size="sm" />
              <span className="text-xs text-[var(--color-sl-500)]">
                {demand.clientRating}
              </span>
            </div>
          </div>

          {/* ── Temps écoulé ── */}
          <span className="text-xs text-[var(--color-sl-400)]">
            {formatPostedAgo(demand)}
          </span>

          {/* ── Feedback (succès / erreur postulation) ── */}
          {feedback && (
            <AlertBanner
              type={feedback.type}
              message={feedback.message}
              onClose={onDismissFeedback}
              size="sm"
            />
          )}

          {/* ── Actions ── */}
          <div className="flex gap-2 pt-2 mt-auto border-t border-[var(--color-sl-100)]">
            <Button
              variant="ghost"
              size="md"
              onClick={() => setShowModal(true)}
              className="flex-1"
            >
              Voir détails
            </Button>
            <Button
              variant="dark"
              size="md"
              onClick={() => onApply(demand.id)}
              disabled={isApplying}
              className="flex-1"
            >
              {isApplying ? 'Envoi...' : <span className="flex items-center gap-1">Postuler <ChevronRight size={16} /></span>}
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Modal détails ── */}
      {showModal && (
        <DemandDetailModal
          open={showModal}
          demand={demand}
          onClose={() => setShowModal(false)}
          onApply={() => { setShowModal(false); onApply(demand.id); }}
          isApplying={isApplying}
        />
      )}
    </>
  );
}