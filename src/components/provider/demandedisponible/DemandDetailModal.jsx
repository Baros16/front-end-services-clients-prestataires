// src/components/provider/DemandeDisponible/DemandDetailModal.jsx
import { Modal }       from '../../commons/Modal';
import { Button }      from '../../commons/Button';
import { StatusBadge } from '../../commons/StatusBadge';
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

function formatPostedAgo(createdAt) {
  if (!createdAt) return '';
  const diffMin = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (diffMin < 60)   return `Il y a ${diffMin} min`;
  if (diffMin < 1440) return `Il y a ${Math.floor(diffMin / 60)}h`;
  return `Il y a ${Math.floor(diffMin / 1440)}j`;
}

function getLocationText(location) {
  if (!location) return null;
  if (typeof location === 'string') return location;
  return location.address ?? location.city ?? JSON.stringify(location);
}

export function DemandDetailModal({ open, demand, onClose, onCreateQuote }) {
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
            {demand?.urgent && <StatusBadge variant="urgent" size="sm" />}
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
            onClick={onCreateQuote}
            className="flex-1"
          >
            Postuler →
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

        {/* ── Temps écoulé ── */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[var(--color-sl-50)] rounded-[var(--radius-md)] border border-[var(--color-sl-100)]">
          <Clock size={18} className="text-[var(--color-sl-500)]" />
          <span className="text-sm text-[var(--color-sl-700)]">
            Publié {demand && formatPostedAgo(demand.createdAt)}
          </span>
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