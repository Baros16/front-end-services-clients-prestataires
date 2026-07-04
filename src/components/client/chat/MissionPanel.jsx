// src/components/client/chat/MissionPanel.jsx

import { Wrench, X }                                    from '../../commons';
import { Card, StatusBadge, AmountDisplay,
         RatingStars, SkeletonLoader, Avatar }       from '../../commons';

function MissionInfo({ mission }) {
  return (
    <Card title="Mission associée">
      <div
        className="flex items-center gap-3 p-3 rounded-xl mb-4"
        style={{
          background: 'var(--color-info-light)',
          border:     '1px solid var(--color-info)',
        }}
      >
        <span
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--color-info)', color: 'var(--color-sl-50)' }}
        >
          <Wrench size={13} />
        </span>
        <div className="min-w-0">
          <p
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--color-sl-800)', fontFamily: 'var(--font-display)' }}
          >
            {mission.category.label}
            {mission.category.subLabel && ` / ${mission.category.subLabel}`}
          </p>
          <p
            className="text-xs"
            style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}
          >
            {mission.location} · {mission.scheduledAt}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}
          >
            Montant devis
          </span>
          <AmountDisplay amount={mission.totalAmount} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span
            className="text-sm"
            style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}
          >
            Statut paiement
          </span>
          <StatusBadge label="Séquestré" variant="sequestre" size="sm" />
        </div>
      </div>
    </Card>
  );
}

function ProviderInfo({ provider }) {
  return (
    <Card title={provider.fullName}>
      <div className="flex flex-col items-center text-center gap-2">
        <Avatar
          initial={provider.avatarInitial}
          size="lg"
          isOnline={provider.isOnline}
        />
        <p
          className="font-semibold text-sm"
          style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}
        >
          {provider.fullName}
        </p>
        <RatingStars value={provider.rating} readonly showValue size="sm" />
        <p
          className="text-xs"
          style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}
        >
          {provider.missionCount} missions · {provider.specialty}
        </p>
      </div>
    </Card>
  );
}


export function MissionPanel({ context, loading, isOpen, onClose }) {
  // ── Contenu partagé desktop / mobile ─────────────────────────────────────
  const content = loading || !context ? (
    <div className="p-4 space-y-4">
      <SkeletonLoader variant="card" count={1} />
      <SkeletonLoader variant="card" count={1} />
    </div>
  ) : (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {context.mission && <MissionInfo mission={context.mission} />}
      {context.provider && <ProviderInfo provider={context.provider} />}
    </div>
  );

  return (
    <>
      {/* ── Desktop : panel latéral fixe ────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width:      340,
          flexShrink: 0,
          borderLeft: '1px solid var(--color-sl-200)',
          background: 'var(--color-sl-50)',
          overflowY:  'auto',
        }}
      >
        {content}
      </aside>

      {/* ── Mobile : drawer overlay ──────────────────────────────────── */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(15,23,42,0.4)' }}
            onClick={onClose}
          />

          {/* Panneau */}
          <div
            className="relative ml-auto w-[85vw] max-w-[340px] h-full flex flex-col"
            style={{
              background: 'var(--color-sl-50)',
              borderLeft: '1px solid var(--color-sl-200)',
            }}
          >
            {/* Header drawer mobile */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b shrink-0"
              style={{ borderColor: 'var(--color-sl-200)' }}
            >
              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}
              >
                Détails de la mission
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           transition-all duration-150 active:scale-95"
                style={{ color: 'var(--color-sl-500)' }}
              >
                <X size={18} />
              </button>
            </div>

            {content}
          </div>
        </div>
      )}
    </>
  );
}