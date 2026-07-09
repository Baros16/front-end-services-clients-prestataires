// src/components/provider/DemandeDisponible/DemandDetailModal.jsx
import { Modal }       from '../../commons/Modal';
import { Button }      from '../../commons/Button';
import { StatusBadge } from '../../commons/StatusBadge';
import { RatingStars } from '../../commons/RatingStars';
import { MapPin, Clock, Wrench, Zap, Sparkles, Key, Brush } from '../../commons/Icons';
import { formatBudget } from './formatBudget';

const CATEGORY_DISPLAY = {
  wrench:  { Icon: Wrench,   bgVar: 'var(--color-accent-light)' },
  bolt:    { Icon: Zap,      bgVar: 'var(--color-warning-light)' },
  broom:   { Icon: Sparkles, bgVar: 'var(--color-success-light)' },
  key:     { Icon: Key,      bgVar: 'var(--color-accent-light)' },
  paint:   { Icon: Brush,    bgVar: '#F3E8FF' },
  default: { Icon: Wrench,   bgVar: 'var(--color-sl-100)' },
};

function formatPostedAgo(d) {
  if (d.postedAgo) return d.postedAgo;
  const min = d.postedMinutesAgo ?? 0;
  if (min < 60)   return `Il y a ${min} min`;
  if (min < 1440) return `Il y a ${Math.floor(min / 60)}h`;
  return `Il y a ${Math.floor(min / 1440)}j`;
}

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

        {/* ── Description complète ── */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[var(--color-sl-400)]">
            Description
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-sl-700)] font-[family-name:var(--font-body)]">
            {demand?.description}
          </p>
        </div>

        {/* ── Budget ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)]">
          <span className="text-xs text-[var(--color-sl-400)]">
            Budget estimé
          </span>
          <span className="text-base font-semibold text-[var(--color-sl-900)] font-[family-name:var(--font-display)]">
            {demand && formatBudget(demand)}
          </span>
        </div>

        {/* ── Infos : distance + note + temps ── */}
        <div className="grid grid-cols-3 gap-3">

          {/* Distance */}
          <div className="flex flex-col items-center gap-1 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)] border border-[var(--color-sl-100)]">
            <MapPin size={18} className="text-[var(--color-sl-500)]" />
            <span className="text-sm font-semibold text-[var(--color-sl-900)]">
              {demand?.distanceKm} km
            </span>
            <span className="text-xs text-[var(--color-sl-400)]">Distance</span>
          </div>

          {/* Note client */}
          <div className="flex flex-col items-center gap-1 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)] border border-[var(--color-sl-100)]">
            <RatingStars value={demand?.clientRating} size="sm" />
            <span className="text-sm font-semibold text-[var(--color-sl-900)]">
              {demand?.clientRating}
            </span>
            <span className="text-xs text-[var(--color-sl-400)]">Note client</span>
          </div>

          {/* Temps */}
          <div className="flex flex-col items-center gap-1 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)] border border-[var(--color-sl-100)]">
            <Clock size={18} className="text-[var(--color-sl-500)]" />
            <span className="text-sm font-semibold text-[var(--color-sl-900)]">
              {demand && formatPostedAgo(demand)}
            </span>
            <span className="text-xs text-[var(--color-sl-400)]">Publié</span>
          </div>
        </div>

        {/* ── Localisation ── */}
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