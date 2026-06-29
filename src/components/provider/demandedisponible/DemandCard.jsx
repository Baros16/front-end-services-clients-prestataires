// src/components/provider/DemandeDisponible/DemandCard.jsx
import { useState } from 'react';
import { Button }      from '../../commons/Button';
import { StatusBadge } from '../../commons/StatusBadge';
import { RatingStars } from '../../commons/RatingStars';
import { Card }        from '../../commons/Card';
import { DemandDetailModal } from './DemandDetailModal';
import {
  MapPin,
  Wrench,
  Zap,
  Brush,
  Key,
  Sparkles,
  ChevronRight,
} from '../../commons/Icons';

/* ── Mapping catégories → icône lucide + fond ─────────────── */
const CATEGORY_DISPLAY = {
  wrench:  { icon: <Wrench   size={16} />, bgVar: 'var(--color-accent-light)' },
  bolt:    { icon: <Zap      size={16} />, bgVar: 'var(--color-warning-light)' },
  broom:   { icon: <Brush    size={16} />, bgVar: 'var(--color-success-light)' },
  key:     { icon: <Key      size={16} />, bgVar: 'var(--color-accent-light)' },
  paint:   { icon: <Sparkles size={16} />, bgVar: '#F3E8FF' },
  default: { icon: <Wrench   size={16} />, bgVar: 'var(--color-sl-100)' },
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

export function DemandCard({ demand, onViewDetails, onApply, isApplying = false }) {
  const [showModal, setShowModal] = useState(false);
  const { icon, bgVar } =
    CATEGORY_DISPLAY[demand.category?.iconKey] ?? CATEGORY_DISPLAY.default;

  return (
    <>
      <Card
        noPadding
        title={
          <div
            className="flex items-center gap-2 px-2 py-1"
            style={{ background: bgVar, borderRadius: 'var(--radius-sm)' }}
          >
            <span style={{ color: 'var(--color-sl-700)' }}>{icon}</span>
            <span
              className="text-sm font-medium"
              style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-body)' }}
            >
              {demand.category?.label}
            </span>
          </div>
        }
        actions={
          <div className="flex gap-1.5 flex-wrap justify-end">
            {demand.isUrgent && <StatusBadge variant="urgent" size="sm" />}
            <StatusBadge variant="ouvert" size="sm" />
          </div>
        }
      >
        <div className="flex flex-col gap-3 p-4">

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
              <MapPin size={12} />
              {demand.distanceKm} km
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
             onClick={(e) => {
             //e.stopPropagation();   // ← empêche la navigation du Card parent
             setShowModal(true);
          }}
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
              {isApplying ? 'Envoi...' : <>Postuler <ChevronRight size={16} /></>}
            </Button>
            
          </div>
        </div>
      </Card>

      {/* ── Modal détails ── */}
      
        <DemandDetailModal
          open={showModal}
           demand={demand}
           onClose={() => setShowModal(false)}
           onApply={() => { setShowModal(false); onApply(demand.id); }}
          isApplying={isApplying}
      />
      
    </>
  );
}