// src/components/provider/chat/ClientPanel.jsx

import { X }                                    from '../../commons';
import { Card, SkeletonLoader, Avatar }         from '../../commons';
import { MissionInfo }                          from '../../client/chat/MissionPanel';

function ClientInfo({ client }) {
  return (
    <Card title={client.fullName}>
      <div className="flex flex-col items-center text-center gap-2">
        <Avatar
          initial={client.avatarInitial}
          size="lg"
          isOnline={client.isOnline}
        />
        <p
          className="font-semibold text-sm"
          style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}
        >
          {client.fullName}
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}
        >
          {client.completedMissions} mission{client.completedMissions > 1 ? 's' : ''}
        </p>
      </div>
    </Card>
  );
}

export function ClientPanel({ context, loading, isOpen, onClose }) {
  const content = loading || !context ? (
    <div className="p-4 space-y-4">
      <SkeletonLoader variant="card" count={1} />
      <SkeletonLoader variant="card" count={1} />
    </div>
  ) : (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      {context.mission && <MissionInfo mission={context.mission} />}
      {context.client && <ClientInfo client={context.client} />}
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
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(15,23,42,0.4)' }}
            onClick={onClose}
          />

          <div
            className="relative ml-auto w-[85vw] max-w-[340px] h-full flex flex-col"
            style={{
              background: 'var(--color-sl-50)',
              borderLeft: '1px solid var(--color-sl-200)',
            }}
          >
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