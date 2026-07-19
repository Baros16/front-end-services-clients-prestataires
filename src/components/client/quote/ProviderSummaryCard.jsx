import { Card, Avatar, RatingStars, ShieldCheck } from '../../commons';

export default function ProviderSummaryCard({ provider }) {
  return (
    <div className="space-y-3">
      <Card title="Prestataire">
        <div className="flex items-center gap-3.5">
          <Avatar initial={provider.avatarInitial} size="md" color="brand" />
          <div className="min-w-0">
            <p className="font-semibold text-[var(--color-sl-900)] font-display truncate">
              {provider.fullName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <RatingStars value={provider.rating} readonly size="sm" showValue />
            </div>
            <p className="text-xs text-[var(--color-sl-400)] mt-0.5">
              {provider.missionsCount} missions réalisées
            </p>
          </div>
        </div>
      </Card>

      <Card className="!bg-[var(--color-info-light)] !border-[var(--color-info)]/20">
        <div className="flex items-start gap-2.5">
          <ShieldCheck size={15} className="text-[var(--color-info)] mt-[1px] shrink-0" />
          <div>
            <p className="text-sm font-semibold font-display text-[var(--color-info)] leading-none mb-1">
              Paiement sécurisé
            </p>
            <p className="text-xs text-[var(--color-sl-600)] leading-relaxed">
              Votre paiement est séquestré sur la plateforme et libéré uniquement après validation de la mission.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}