// src/components/client/urgency/ProviderInfoCard.jsx
import { Card, Avatar } from '../../commons';

export function ProviderInfoCard({ provider }) {
  return (
    <Card>
      <div className="flex items-center gap-4 mb-4">
        <Avatar initial={provider.avatarInitial} size="lg" />
        <div>
          <p className="font-bold text-sm" style={{ color: 'var(--color-sl-800)' }}>{provider.fullName}</p>
          <p className="text-xs" style={{ color: 'var(--color-sl-500)' }}>
            {provider.rating}/5 · {provider.missionsCount} missions
          </p>
          <p className="text-xs" style={{ color: 'var(--color-sl-400)' }}>{provider.specialty}</p>
        </div>
      </div>
      <div className="text-center text-sm font-bold py-2 rounded-lg" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
        Disponible maintenant · {provider.distance}
      </div>
    </Card>
  );
}