// src/components/provider/quote/ClientSummaryCard.jsx
import { Card } from '../../commons/Card';
import { Star } from '../../commons/Icons';

/**
 * StarRating (atome)
 * Affiche N étoiles pleines/vides + la note chiffrée, ex: ★★★★★ 4.2
 */
function StarRating({ value, className = '' }) {
  // ✅ Normalise null/undefined/NaN vers 0 — value = 0 en défaut de signature
  // ne suffit pas car il ne s'applique pas quand value === null.
  const safeValue = typeof value === 'number' && !Number.isNaN(value) ? value : 0;
  const rounded = Math.round(safeValue);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rounded ? 'text-accent fill-accent' : 'text-sl-200 fill-sl-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-sl-600">{safeValue.toFixed(1)}</span>
    </div>
  );
}

/**
 * SectionCard-Client
 * Rappelle au prestataire pour qui il rédige ce devis (UserAvatar + StarRating).
 *
 * Props — client : sous-ensemble de ClientProfile (API_CONTRACT.md §4.2)
 *   { fullName, avatarInitial, rating, completedMissions }
 */
export function ClientSummaryCard({ client }) {
  const { fullName, avatarInitial, rating, completedMissions } = client;
  // ✅ Idem pour completedMissions : évite "null missions réalisée"
  const safeCompletedMissions = typeof completedMissions === 'number' ? completedMissions : 0;

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-sm font-semibold tracking-wide text-sl-500 uppercase mb-4">
        Client
      </h2>
      <div className="flex items-center gap-3.5">
        {/* UserAvatar */}
        <div
          className="w-12 h-12 shrink-0 rounded-full bg-brand-xlight text-brand flex items-center
            justify-center font-display font-bold text-lg"
          aria-hidden="true"
        >
          {avatarInitial}
        </div>
        <div className="min-w-0">
          <p className="font-display font-semibold text-sl-900 truncate">{fullName}</p>
          <StarRating value={rating} className="mt-0.5" />
          <p className="text-xs text-sl-400 mt-0.5">
            {safeCompletedMissions} mission{safeCompletedMissions > 1 ? 's' : ''} réalisée
            {safeCompletedMissions > 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </Card>
  );
}