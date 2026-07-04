// src/components/client/chat/ChatHeader.jsx

import { Phone }               from '../../commons';
import { StatusBadge, Card, SkeletonLoader, Button } from '../..//commons';

export function ChatHeader({ provider, loading }) {
  if (loading || !provider) {
    return (
      <div className="h-[68px] flex items-center px-6 border-b bg-white shrink-0"
        style={{ borderColor: 'var(--color-sl-200)' }}>
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-full sl-animate-shimmer"
            style={{ background: 'var(--color-sl-200)' }} />
          <div className="space-y-2">
            <div className="h-3 w-36 rounded sl-animate-shimmer"
              style={{ background: 'var(--color-sl-200)' }} />
            <div className="h-2 w-24 rounded sl-animate-shimmer"
              style={{ background: 'var(--color-sl-100)' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b shrink-0"
      style={{ borderColor: 'var(--color-sl-200)' }}>

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center
                          text-white text-sm font-bold select-none"
            style={{ background: 'var(--color-brand-light)', fontFamily: 'var(--font-display)' }}>
            {provider.avatarInitial}
          </div>
          {provider.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full
                             border-2 border-white sl-animate-pulse-dot"
              style={{ background: 'var(--color-success)' }} />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight"
            style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}>
            {provider.fullName}
          </p>
          <p className="text-xs flex items-center gap-1 mt-0.5"
            style={{ fontFamily: 'var(--font-body)' }}>
            {provider.isOnline && (
              <>
                <span style={{ color: 'var(--color-success)' }}>En ligne</span>
                <span style={{ color: 'var(--color-sl-300)' }}>·</span>
              </>
            )}
            <span style={{ color: 'var(--color-sl-400)' }}>{provider.category}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button label="Appeler" onClick={() => {}}> Appeler<Phone size={14} /></Button>
        <StatusBadge label="Mission en cours" variant="en_cours" />
      </div>
    </div>
  );
}