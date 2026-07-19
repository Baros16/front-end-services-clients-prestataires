// src/components/client/quote/ProviderAvatarReveal.jsx
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, RatingStars } from '../..//commons';

export default function ProviderAvatarReveal({ provider }) {
  const navigate = useNavigate();

  return (
    <div className="relative group inline-block">
      <button
        type="button"
        onClick={() => navigate(`/client/prestataires/${provider.id}`)}
        className="block rounded-full transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
        aria-label={`Voir le profil de ${provider.fullName}`}
      >
        <Avatar initial={provider.avatarInitial} size="md" color="brand" />
      </button>

      {/* Reveal au survol — desktop uniquement (pas de hover fiable en tactile) */}
      <div
        className={[
          'hidden md:block absolute right-0 top-full mt-2 w-64 z-20',
          'opacity-0 invisible translate-y-1',
          'group-hover:opacity-100 group-hover:visible group-hover:translate-y-0',
          'transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
        ].join(' ')}
      >
        <Card className="shadow-[var(--shadow-md)]">
          <div className="flex items-center gap-3">
            <Avatar initial={provider.avatarInitial} size="sm" color="brand" />
            <div className="min-w-0">
              <p className="font-semibold text-[var(--color-sl-900)] font-display truncate text-sm">
                {provider.fullName}
              </p>
              <RatingStars value={provider.rating} readonly size="sm" showValue />
              <p className="text-xs text-[var(--color-sl-400)] mt-0.5">
                {provider.missionsCount} missions réalisées
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}