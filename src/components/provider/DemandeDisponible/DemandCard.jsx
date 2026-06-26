import { useState }    from 'react';
import { Button }      from '../../../components/commons/Button';
import { StatusBadge } from '../../../components/commons/StatusBadge';
import { RatingStars } from '../../../components/commons/RatingStars';
import { DemandDetailModal } from './DemandDetailModal';

/* ── Mapping catégories → emoji + fond ─────────────────── */
const CATEGORY_DISPLAY = {
  wrench:  { emoji: '🔧', bgVar: 'var(--color-accent-light)' },
  bolt:    { emoji: '⚡', bgVar: 'var(--color-warning-light)' },
  broom:   { emoji: '🧹', bgVar: 'var(--color-success-light)' },
  key:     { emoji: '🔑', bgVar: 'var(--color-accent-light)' },
  paint:   { emoji: '🎨', bgVar: '#F3E8FF' },
  default: { emoji: '🛠️', bgVar: 'var(--color-sl-100)' },
};

/* ── Budget formaté (ex: ~20-30k XAF) ──────────────────── */
function formatBudget(d) {
  const min = d.budgetMin ?? d.estimatedBudget?.min ?? 0;
  const max = d.budgetMax ?? d.estimatedBudget?.max ?? 0;
  const fmt = (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v);
  return `~${fmt(min)}-${fmt(max)} XAF`;
}

/* ── Temps écoulé (ex: Il y a 5 min) ───────────────────── */
function formatPostedAgo(d) {
  if (d.postedAgo) return d.postedAgo;
  const min = d.postedMinutesAgo ?? 0;
  if (min < 60)   return `Il y a ${min} min`;
  if (min < 1440) return `Il y a ${Math.floor(min / 60)}h`;
  return `Il y a ${Math.floor(min / 1440)}j`;
}

/* ══════════════════════════════════════════════════════════
   DemandCard
   ══════════════════════════════════════════════════════════
   Props :
   - demand       {object}   Objet demande (voir mock_available_demands.json)
   - onViewDetails {fn}      Appelé avec demand.id au clic "Voir détails"
   - onApply       {fn}      Appelé avec demand.id au clic "Postuler"
   - isApplying    {boolean} Désactive le bouton Postuler pendant l'envoi
   ══════════════════════════════════════════════════════════ */
export function DemandCard({ demand, onViewDetails, onApply, isApplying = false }) {
  const [showModal, setShowModal] = useState(false);
  const { emoji, bgVar } =
    CATEGORY_DISPLAY[demand.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  return (
    <>
    <div
      className="flex flex-col gap-3 bg-white p-4 sl-animate-fade-in"
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-sl-200)',
        transition: 'box-shadow 150ms ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
    >
      {/* ── En-tête : icône catégorie + badges statut ── */}
      <div className="flex items-start justify-between gap-2">
        <div
            className="flex items-center gap-2 px-2 py-1 shrink-0"
            style={{ background: bgVar, borderRadius: 'var(--radius-sm)' }}
          >
            <span className="text-lg leading-none">{emoji}</span>
            <span
              className="text-sm font-medium"
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

      {/* ── Description (2 lignes max) ── */}
      <p
        className="text-sm leading-relaxed line-clamp-2"
        style={{ color: 'var(--color-sl-600)', fontFamily: 'var(--font-body)' }}
      >
        {demand.description}
      </p>

      {/* ── Budget ── */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ background: 'var(--color-sl-50)', borderRadius: 'var(--radius-md)' }}
      >
        <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
          Budget estimé
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}
        >
          {formatBudget(demand)}
        </span>
      </div>

      {/* ── Distance + Note client ── */}
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: 'var(--color-sl-500)' }}
        >
          📍 {demand.distanceKm} km
        </span>
        <div className="flex items-center gap-1">
          <RatingStars value={demand.clientRating} size="sm" />
          <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>
            {demand.clientRating}
          </span>
        </div>
      </div>

      {/* ── Temps écoulé ── */}
      <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
        {formatPostedAgo(demand)}
      </span>

      {/* ── Actions ── */}
      <div
        className="flex gap-2 pt-2 mt-auto"
        style={{ borderTop: '1px solid var(--color-sl-100)' }}
      >
        <Button
          variant="ghost"
          size="md"
          onClick={() => setShowModal(true) }
          className="flex-1"
        >
          Voir détails 
        </Button>
        <button
          onClick={() => onApply(demand.id)}
          disabled={isApplying}
          className="flex-1 inline-flex items-center justify-center font-semibold text-[14px] px-5 py-[10px] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: '#0F172A',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: isApplying ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={(e) => { if (!isApplying) e.currentTarget.style.background = '#1E293B'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#0F172A'; }}
        >
          {isApplying ? '...' : 'Postuler →'}
        </button>
      </div>
    </div>

    {/* ── Modal détails ── */}
    {showModal && (
      <DemandDetailModal
        demand={demand}
        onClose={() => setShowModal(false)}
        onApply={() => {
          setShowModal(false);
          onApply(demand.id);
        }}
        isApplying={isApplying}
      />
    )}
  </>
  );
}