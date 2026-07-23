// src/components/client/quote/PaymentMethodSelector.jsx
import { useMemo } from 'react';
import { Card, Button } from '../../commons';
import { PhoneInput } from '../../auth/PhoneInput';
import { validateCamerounPhone } from '../../../utils/formatters';

const METHODS = [
  { id: 'orange_money', label: 'Orange Money',     dot: 'var(--color-orange-money)' },
  { id: 'mtn_momo',     label: 'MTN Mobile Money', dot: 'var(--color-mtn-momo)' },
];

// Convertit la valeur complète renvoyée par PhoneInput ("+237XXXXXXXXX") en 9 chiffres bruts
function extractNineDigits(fullValue) {
  const digits = fullValue.replace(/\D/g, ''); // "237XXXXXXXXX"
  const nine = digits.startsWith('237') ? digits.slice(3) : digits;
  return nine.slice(0, 9);
}

export default function PaymentMethodSelector({ value, onChange, phoneNumber, onPhoneChange }) {
  const validation = useMemo(() => {
    if (phoneNumber.length < 9) return null;
    return validateCamerounPhone(`+237${phoneNumber}`);
  }, [phoneNumber]);

  const operatorMismatch = validation?.valid && validation.operator !== value;

  const errorMessage = validation && !validation.valid
    ? validation.message
    : operatorMismatch
      ? `Ce numéro correspond à ${validation.operator === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}, pas à ${value === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}.`
      : '';

  return (
    <Card title="Paiement via">
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
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: method.dot }}
              />
              <span>{method.label}</span>
            </Button>
          );
        })}
      </div>

      {value && (
        <div className="mt-3">
          <PhoneInput
            label={`Numéro ${value === 'orange_money' ? 'Orange Money' : 'MTN Mobile Money'}`}
            value={phoneNumber ? `+237${phoneNumber}` : ''}
            onChange={(fullValue) => onPhoneChange(extractNineDigits(fullValue))}
            error={errorMessage}
          />
        </div>
      )}
    </Card>
  );
}