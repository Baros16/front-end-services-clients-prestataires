// src/components/provider/DemandeDisponible/DemandDetailModal.jsx
import { Modal }       from '../../commons/Modal';
import { Button }      from '../../commons/Button';
import { StatusBadge } from '../../commons/StatusBadge';
import { RatingStars } from '../../commons/RatingStars';
import { MapPin, Clock } from '../../commons/Icons';

const CATEGORY_DISPLAY = {
  wrench:  { emoji: '🔧', bgVar: 'var(--color-accent-light)' },
  bolt:    { emoji: '⚡', bgVar: 'var(--color-warning-light)' },
  broom:   { emoji: '🧹', bgVar: 'var(--color-success-light)' },
  key:     { emoji: '🔑', bgVar: 'var(--color-accent-light)' },
  paint:   { emoji: '🎨', bgVar: '#F3E8FF' },
  default: { emoji: '🛠️', bgVar: 'var(--color-sl-100)' },
};

function formatBudget(d) {
  const min = d.budgetMin ?? d.estimatedBudget?.min ?? 0;
  const max = d.budgetMax ?? d.estimatedBudget?.max ?? 0;
  const fmt = (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v);
  return `~${fmt(min)}-${fmt(max)} XAF`;
}

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
  const { emoji, bgVar } =
    CATEGORY_DISPLAY[demand?.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-1"
            style={{ background: bgVar, borderRadius: 'var(--radius-sm)' }}
          >
            <span className="text-xl leading-none">{emoji}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-body)' }}
            >
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
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--color-sl-400)' }}
          >
            Description
          </p>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-sl-700)', fontFamily: 'var(--font-body)' }}
          >
            {demand?.description}
          </p>
        </div>

        {/* ── Budget ── */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: 'var(--color-sl-50)', borderRadius: 'var(--radius-md)' }}
        >
          <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
            Budget estimé
          </span>
          <span
            className="text-base font-semibold"
            style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}
          >
            {demand && formatBudget(demand)}
          </span>
        </div>

        {/* ── Infos : distance + note + temps ── */}
        <div className="grid grid-cols-3 gap-3">

          {/* Distance */}
          <div
            className="flex flex-col items-center gap-1 py-3"
            style={{
              background: 'var(--color-sl-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-sl-100)',
            }}
          >
            <MapPin size={18} style={{ color: 'var(--color-sl-500)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-sl-900)' }}>
              {demand?.distanceKm} km
            </span>
            <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>Distance</span>
          </div>

          {/* Note client */}
          <div
            className="flex flex-col items-center gap-1 py-3"
            style={{
              background: 'var(--color-sl-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-sl-100)',
            }}
          >
            <RatingStars value={demand?.clientRating} size="sm" />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-sl-900)' }}>
              {demand?.clientRating}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>Note client</span>
          </div>

          {/* Temps */}
          <div
            className="flex flex-col items-center gap-1 py-3"
            style={{
              background: 'var(--color-sl-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-sl-100)',
            }}
          >
            <Clock size={18} style={{ color: 'var(--color-sl-500)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-sl-900)' }}>
              {demand && formatPostedAgo(demand)}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>Publié</span>
          </div>
        </div>

        {/* ── Localisation ── */}
        {getLocationText(demand?.location) && (
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--color-sl-400)' }}
            >
              Localisation
            </p>
            <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--color-sl-700)' }}>
              <MapPin size={14} style={{ color: 'var(--color-sl-400)' }} />
              {getLocationText(demand.location)}
            </p>
          </div>
        )}

      </div>
    </Modal>
  );
}