// src/components/client/quote/PaymentMethodPanel.jsx
import { Button } from '../../commons';
import { X } from '../../commons';

const METHODS = [
  { id: 'orange_money', label: 'Orange Money',     dot: '#FF6600' },
  { id: 'mtn_momo',     label: 'MTN Mobile Money', dot: '#FFCB00' },
];

export default function PaymentMethodPanel({ open, value, onChange, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel — bottom sheet mobile, side panel desktop */}
      <div
        className={[
          'fixed z-50 bg-white shadow-[var(--shadow-md)]',
          'inset-x-0 bottom-0 rounded-t-[var(--radius-xl)] p-6',
          'sm:inset-auto sm:top-0 sm:right-0 sm:h-full sm:w-[380px] sm:rounded-none sm:rounded-l-[var(--radius-xl)]',
          'animate-[slideUp_0.3s_cubic-bezier(0.32,0.72,0,1)]',
          'sm:animate-[slideIn_0.3s_cubic-bezier(0.32,0.72,0,1)]',
        ].join(' ')}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--color-sl-400)]">
            Paiement via
          </p>
          <button type="button" onClick={onClose} aria-label="Fermer">
            <X size={18} className="text-[var(--color-sl-400)]" />
          </button>
        </div>

        <div className="space-y-2">
          {METHODS.map((method) => {
            const selected = value === method.id;
            return (
              <Button
                key={method.id}
                type="button"
                variant={selected ? 'secondary' : 'ghost'}
                size="lg"
                onClick={() => { onChange(method.id); onClose(); }}
                className={[
                  'w-full justify-start gap-3',
                  selected ? '!bg-[var(--color-brand-xlight)]' : '',
                ].join(' ')}
              >
                <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: method.dot }} />
                <span>{method.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}