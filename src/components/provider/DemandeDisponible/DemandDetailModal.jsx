import { useEffect }   from 'react';
import { Button }      from '../../../components/commons/Button';
import { StatusBadge } from '../../../components/commons/StatusBadge';
import { RatingStars } from '../../../components/commons/RatingStars';

/* ── Mapping catégories (même que DemandCard) ───────────── */
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

/* ══════════════════════════════════════════════════════════
   DemandDetailModal
   Props :
   - demand      {object}   Objet demande complet
   - onClose     {fn}       Ferme le modal
   - onApply     {fn}       Postule depuis le modal
   - isApplying  {boolean}  Désactive le bouton pendant l'envoi
   ══════════════════════════════════════════════════════════ */
export function DemandDetailModal({ demand, onClose, onApply, isApplying = false }) {
  const { emoji, bgVar } =
    CATEGORY_DISPLAY[demand.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  /* Fermer avec Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  /* Bloquer le scroll du body */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    /* ── Overlay ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15, 23, 42, 0.5)' }}
      onClick={onClose}
    >
      {/* ── Panneau modal ── */}
      <div
        className="relative w-full max-w-lg flex flex-col gap-5 bg-white p-6 sl-animate-scale-in"
        style={{
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Bouton fermer ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-sl-200)',
            background: 'white',
            color: 'var(--color-sl-500)',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          aria-label="Fermer"
        >
          ✕
        </button>

        {/* ── En-tête : catégorie + badges ── */}
        <div className="flex items-start justify-between gap-3 pr-8">
          <div
            className="flex items-center gap-2 px-3 py-1.5"
            style={{ background: bgVar, borderRadius: 'var(--radius-sm)' }}
          >
            <span className="text-xl leading-none">{emoji}</span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-body)' }}
            >
              {demand.category?.label}
            </span>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
            {demand.isUrgent && <StatusBadge variant="urgent" size="sm" />}
            <StatusBadge variant="ouvert" size="sm" />
          </div>
        </div>

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
            {demand.description}
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
            {formatBudget(demand)}
          </span>
        </div>

        {/* ── Infos : distance + note + temps ── */}
        <div
          className="grid grid-cols-3 gap-3"
        >
          {/* Distance */}
          <div
            className="flex flex-col items-center gap-1 py-3"
            style={{
              background: 'var(--color-sl-50)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-sl-100)',
            }}
          >
            <span className="text-lg">📍</span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-sl-900)' }}
            >
              {demand.distanceKm} km
            </span>
            <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
              Distance
            </span>
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
            <RatingStars value={demand.clientRating} size="sm" />
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-sl-900)' }}
            >
              {demand.clientRating}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
              Note client
            </span>
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
            <span className="text-lg">🕐</span>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--color-sl-900)' }}
            >
              {formatPostedAgo(demand)}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
              Publié
            </span>
          </div>
        </div>

        {/* ── Localisation si disponible ── */}
        {demand.location && (
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--color-sl-400)' }}
            >
              Localisation
            </p>
            <p
              className="text-sm"
              style={{ color: 'var(--color-sl-700)' }}
            >
              📍 {demand.location}
            </p>
          </div>
        )}

        {/* ── Actions ── */}
        <div
          className="flex gap-3 pt-2"
          style={{ borderTop: '1px solid var(--color-sl-100)' }}
        >
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className="flex-1"
          >
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
        </div>
      </div>
    </div>
  );
}