// src/components/common/Toast.jsx
import { CheckCircle, XCircle, AlertCircle, Info, X } from './Icons';

const VARIANTS = {
  success: { Icon: CheckCircle, bg: 'var(--color-success)' },
  error:   { Icon: XCircle,     bg: 'var(--color-danger)'  },
  warning: { Icon: AlertCircle, bg: 'var(--color-warning)' },
  info:    { Icon: Info,        bg: 'var(--color-info)'    },
};

export function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const { type = 'info', message, duration = 3000 } = toast;
  const { Icon, bg } = VARIANTS[type] ?? VARIANTS.info;

  return (
    <div
      className="fixed top-6 right-6 z-50 flex flex-col overflow-hidden rounded-xl shadow-lg"
      style={{ background: bg, color: '#fff', fontFamily: 'var(--font-body)', minWidth: 280, maxWidth: 380 }}
    >
      {/* Message */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Icon size={18} strokeWidth={2.5} style={{ flexShrink: 0 }} />
        <p style={{ fontSize: 14, fontWeight: 500, flex: 1, lineHeight: 1.4 }}>
          {message}
        </p>
        <button
          onClick={onDismiss}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.8, padding: 2, flexShrink: 0 }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Barre de progression auto-dismiss */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.25)' }}>
        <div style={{
          height: '100%',
          background: 'rgba(255,255,255,0.6)',
          transformOrigin: 'left',
          animation: `toast-drain ${duration}ms linear forwards`,
        }} />
      </div>

      <style>{`
        @keyframes toast-drain {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
}