// src/components/client/chat/MissionPanel.jsx

import { StatusBadge, AmountDisplay, RatingStars, SkeletonLoader } from '../../commons';

function IconWrench() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0
               l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3
               l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

const panelStyle = {
  borderLeft: '1px solid var(--color-sl-200)',
  background:  '#fafafa',
  overflowY:   'auto',
};

export function MissionPanel({ context, loading }) {
  if (loading || !context) {
    return (
      <aside className="w-[340px] shrink-0 p-6 space-y-6" style={panelStyle}>
        <SkeletonLoader variant="card" count={1} />
        <SkeletonLoader variant="card" count={1} />
      </aside>
    );
  }

  const { mission, provider } = context;

  return (
    <aside className="w-[340px] shrink-0" style={panelStyle}>

      {mission && (
        <div className="p-6 border-b" style={{ borderColor: 'var(--color-sl-200)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-display)' }}>
            Mission associée
          </p>

          <div className="flex items-center gap-3 p-3 rounded-xl mb-4"
            style={{ background: 'var(--color-info-light)', border: '1px solid #bfdbfe' }}>
            <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-info)', color: '#fff' }}>
              <IconWrench />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate"
                style={{ color: 'var(--color-sl-800)', fontFamily: 'var(--font-display)' }}>
                {mission.category.label}
                {mission.category.subLabel && ` / ${mission.category.subLabel}`}
              </p>
              <p className="text-xs"
                style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}>
                {mission.location} · {mission.scheduledAt}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm"
                style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}>
                Montant devis
              </span>
              <AmountDisplay amount={mission.totalAmount} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm"
                style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}>
                Statut paiement
              </span>
              <StatusBadge label="Séquestré" variant="sequestre" size="sm" />
            </div>
          </div>
        </div>
      )}

      {provider && (
        <div className="p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-display)' }}>
            {provider.fullName}
          </p>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center
                            text-white text-lg font-bold select-none"
              style={{ background: 'var(--color-brand-light)', fontFamily: 'var(--font-display)' }}>
              {provider.avatarInitial}
            </div>
            <p className="font-semibold text-sm mt-1"
              style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}>
              {provider.fullName}
            </p>
            <RatingStars value={provider.rating} readonly size="sm" showValue />
            <p className="text-xs"
              style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}>
              {provider.missionCount} missions · {provider.specialty}
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}