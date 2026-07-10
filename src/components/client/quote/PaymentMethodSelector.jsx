import { Card, Button } from '../../commons';


const METHODS = [
  { id: 'orange_money', label: 'Orange Money',     dot: 'var(--color-orange-money)' },
  { id: 'mtn_momo',     label: 'MTN Mobile Money', dot: 'var(--color-mtn-momo' },
];

export default function PaymentMethodSelector({ value, onChange }) {
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
    </Card>
  );
}