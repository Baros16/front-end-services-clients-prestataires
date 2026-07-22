// src/components/provider/demandedisponible/DemandDetailModal.jsx
import { Modal }       from '../../commons/Modal';
import { Button }      from '../../commons/Button';
import { StatusBadge } from '../../commons/StatusBadge';
import { RatingStars } from '../../commons/RatingStars';
import { MapPin, Clock } from '../../commons/Icons';
import { formatBudget } from './formatBudget';
import { CATEGORY_DISPLAY } from './categoryDisplay';
import { formatRelativeTime } from '../../../utils/formatters';

function getLocationText(location) {
  if (!location) return null;
  if (typeof location === 'string') return location;
  return location.address ?? location.city ?? JSON.stringify(location);
}

export function DemandDetailModal({ open, demand, onClose, onApply, isApplying = false }) {
  const { Icon, bgVar } =
    CATEGORY_DISPLAY[demand?.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)]"
            style={{ background: bgVar }}
          >
            <Icon size={18} strokeWidth={1.8} className="text-[var(--color-sl-700)]" />
            <span className="text-sm font-semibold text-[var(--color-sl-900)] font-[family-name:var(--font-body)]">
              {demand?.category?.label}
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {demand?.isUrgent && <StatusBadge variant="urgent" size="sm" />}
            <StatusBadge variant="ouvert" size="sm" />
          </div>
        </div>
      }
      footer={
        <>
          <Button variant="ghost" size="md" onClick={onClose} className="flex-1">
            Fermer
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onApply}
            disabled={isApplying}
            className="flex-1"
          >
            {isApplying ? '...' : 'Postuler →'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[var(--color-sl-400)]">
            Description
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-sl-700)] font-[family-name:var(--font-body)]">
            {demand?.description}
          </p>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--color-sl-400)]">
            Budget estimé
          </span>
          <span className="text-base font-semibold text-[var(--color-sl-900)] font-[family-name:var(--font-display)]">
            {demand && formatBudget(demand)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">

          <div className="flex flex-col items-center gap-1 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)] border border-[var(--color-sl-100)]">
            <MapPin size={18} className="text-[var(--color-sl-500)]" />
            <span className="text-sm font-semibold text-[var(--color-sl-900)]">
              {demand?.distanceKm} km
            </span>
            <span className="text-xs text-[var(--color-sl-400)]">Distance</span>
          </div>

          <div className="flex flex-col items-center gap-1 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)] border border-[var(--color-sl-100)]">
            <RatingStars value={demand?.clientRating} size="sm" />
            <span className="text-sm font-semibold text-[var(--color-sl-900)]">
              {demand?.clientRating}
            </span>
            <span className="text-xs text-[var(--color-sl-400)]">Note client</span>
          </div>

          <div className="flex flex-col items-center gap-1 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)] border border-[var(--color-sl-100)]">
            <Clock size={18} className="text-[var(--color-sl-500)]" />
            <span className="text-sm font-semibold text-[var(--color-sl-900)]">
              {demand && formatRelativeTime(demand)}
            </span>
            <span className="text-xs text-[var(--color-sl-400)]">Publié</span>
          </div>
        </div>

        {getLocationText(demand?.location) && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[var(--color-sl-400)]">
              Localisation
            </p>
            <p className="text-sm flex items-center gap-1.5 text-[var(--color-sl-700)]">
              <MapPin size={14} className="text-[var(--color-sl-400)]" />
              {getLocationText(demand.location)}
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
}