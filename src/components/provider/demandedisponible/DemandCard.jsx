// src/components/provider/demandedisponible/DemandCard.jsx
import { useState } from 'react';
import { Button }      from '../../commons/Button';
import { Card }        from '../../commons/Card';
import { StatusBadge } from '../../commons/StatusBadge';
import { RatingStars } from '../../commons/RatingStars';
import { AlertBanner } from '../../commons/AlertBanner';
import { DemandDetailModal } from './DemandDetailModal';
import { formatBudget } from './formatBudget';
import { CATEGORY_DISPLAY } from './categoryDisplay';
import { formatRelativeTime } from '../../../utils/formatters';
import { MapPin, ChevronRight } from '../../commons/Icons';

export function DemandCard({ demand, onViewDetails, onApply, isApplying = false, feedback = null, onDismissFeedback }) {
  const [showModal, setShowModal] = useState(false);
  const { Icon, bgVar } =
    CATEGORY_DISPLAY[demand.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  const handleOpenDetails = () => {
    setShowModal(true);
    onViewDetails?.(demand.id);
  };

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
            {demand.urgent && <StatusBadge variant="urgent" size="sm" />}
            <StatusBadge variant="ouvert" size="sm" />
          </div>
        }
      >
        <div className="flex flex-col gap-3 p-4">

          <p className="text-sm leading-relaxed line-clamp-2 text-[var(--color-sl-600)] font-[family-name:var(--font-body)]">
            {demand.description}
          </p>

          <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-sl-50)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--color-sl-400)]">
              Budget estimé
            </span>
            <span className="text-sm font-semibold text-[var(--color-sl-900)] font-[family-name:var(--font-display)]">
              {formatBudget(demand)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-[var(--color-sl-500)]">
              <MapPin size={12} />
              {demand.distanceKm != null ? `${demand.distanceKm} km` : '—'}
            </span>
            {demand.clientRating != null && (
              <div className="flex items-center gap-1">
                <RatingStars value={demand.clientRating} size="sm" />
                <span className="text-xs text-[var(--color-sl-500)]">
                  {demand.clientRating}
                </span>
              </div>
            )}
          </div>

          <span className="text-xs text-[var(--color-sl-400)]">
            {formatRelativeTime(demand.createdAt)}
          </span>

          {feedback && (
            <AlertBanner
              type={feedback.type}
              message={feedback.message}
              onClose={onDismissFeedback}
              size="sm"
            />
          )}

          <div className="flex gap-2 pt-2 mt-auto border-t border-[var(--color-sl-100)]">
            <Button
              variant="ghost"
              size="md"
              onClick={handleOpenDetails}
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