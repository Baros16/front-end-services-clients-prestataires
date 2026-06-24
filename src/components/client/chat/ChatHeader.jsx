// src/components/client/chat/ChatHeader.jsx

import { StatusBadge, SkeletonLoader } from '../../commons';

function IconPhone() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
               A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67
               A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0
               .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6
               l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7
               A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}

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
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2
                             border-white sl-animate-pulse-dot"
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border
                           transition-all duration-150 active:scale-95"
          style={{ border: '1px solid var(--color-sl-300)', color: 'var(--color-sl-600)',
                   fontFamily: 'var(--font-body)', background: 'transparent' }}>
          <IconPhone />
          Appeler
        </button>
        <StatusBadge label="Mission en cours" variant="en_cours" />
      </div>
    </div>
  );
}