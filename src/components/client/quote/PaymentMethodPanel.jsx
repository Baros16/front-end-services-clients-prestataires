// src/components/client/quote/PaymentMethodPanel.jsx
import { useMemo } from 'react';
import { Button } from '../../commons';
import { X } from '../../commons';
import { validateCamerounPhone } from '../../../utils/formatters';

const METHODS = [
  { id: 'orange_money', label: 'Orange Money',     dot: '#FF6600' },
  { id: 'mtn_momo',     label: 'MTN Mobile Money', dot: '#FFCB00' },
];

export default function PaymentMethodPanel({ open, value, onChange, onClose, phoneNumber, onPhoneChange }) {
  const validation = useMemo(() => {
    if (phoneNumber.length < 9) return null;
    return validateCamerounPhone(`+237${phoneNumber}`);
  }, [phoneNumber]);

  const operatorMismatch = validation?.valid && validation.operator !== value;
  const hasError = (validation && !validation.valid) || operatorMismatch;
  const isPhoneValid = validation?.valid && validation.operator === value;

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    onPhoneChange(digits);
  }

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

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
                onClick={() => onChange(method.id)}
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

        {value && (
          <div className="mt-4">
            <label className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]">
              Numéro {value === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="6XX XXX XXX"
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={[
                'mt-1 w-full rounded-[var(--radius-lg)] border px-3 py-2 text-sm',
                hasError ? 'border-[var(--color-danger)]' : 'border-[var(--color-sl-200)]',
              ].join(' ')}
            />
            {validation && !validation.valid && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{validation.message}</p>
            )}
            {operatorMismatch && (
              <p className="mt-1 text-xs text-[var(--color-danger)]">
                Ce numéro correspond à {validation.operator === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}, pas à {value === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}.
              </p>
            )}
            <Button
              variant="primary"
              size="lg"
              className="w-full mt-3"
              onClick={onClose}
              disabled={!isPhoneValid}
            >
              Confirmer
            </Button>
          </div>
        )}
      </div>
    </>
  );
}