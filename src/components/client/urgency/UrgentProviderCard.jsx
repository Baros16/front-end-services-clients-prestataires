// src/components/client/urgency/UrgentProviderCard.jsx
import { Card, Avatar } from '../../commons';
import { formatXAF } from '../../../utils/formatters';

export function UrgentProviderCard({ provider, onContact }) {
  const isDisponible = provider.status === 'disponible';

  return (
    <Card>
      <div className="flex items-center gap-4 mb-6">
        <Avatar initial={provider.initial} size="lg" />
        <div>
          <p className="font-bold" style={{ color: 'var(--color-sl-800)' }}>{provider.name}</p>
          <p className="text-xs" style={{ color: 'var(--color-sl-500)' }}>{provider.specialty}</p>
        </div>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span style={{ color: 'var(--color-sl-500)' }}>Distance</span>
        <span className="font-bold">{provider.distance}</span>
      </div>
      <div className="flex justify-between text-sm mb-4">
        <span style={{ color: 'var(--color-sl-500)' }}>Tarif horaire</span>
        <span className="font-bold">{formatXAF(provider.rate)}/h</span>
      </div>
      <span
        className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 border"
        style={{
          background: isDisponible ? 'var(--color-success-light)' : 'var(--color-warning-light)',
          color: isDisponible ? 'var(--color-success)' : 'var(--color-warning)',
          borderColor: isDisponible ? 'var(--color-success)' : 'var(--color-warning)',
        }}
      >
        {isDisponible ? 'DISPONIBLE' : 'SOUS 30 MIN'}
      </span>
      <button
        onClick={() => onContact?.(provider.id)}
        className="w-full font-bold py-2 rounded-lg text-sm transition-all active:scale-95"
        style={{ background: 'var(--color-sl-900)', color: 'var(--color-sl-50)' }}
      >
        Contacter
      </button>
    </Card>
  );
}