// src/components/provider/mission-start/QuoteDetailCard.jsx
import { Card, StatusBadge, AmountDisplay } from "../../commons";
import { formatDate } from "../../../utils/formatters";

/**
 * QuoteDetailCard
 * Détail complet du devis associé à la mission — lecture seule.
 * Alimenté par getQuoteById(mission.quoteId) en amont (providerService).
 *
 * @prop {object} quote - Quote complet (voir API_CONTRACT.md §4.6)
 */
export function QuoteDetailCard({ quote, className = "" }) {
  return (
    <Card
      title="Devis"
      actions={<StatusBadge variant={quote.status} size="sm" />}
      className={className}
    >
      <div className="flex flex-col gap-4">
        <p className="text-[12px] text-sl-400 m-0">{quote.reference}</p>

        <div className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-[0.08em] text-sl-400 font-semibold">
            Main d'œuvre
          </span>
          <p className="text-[13px] text-sl-700 m-0">{quote.laborDescription}</p>
          <AmountDisplay amount={quote.laborAmount} size="sm" />
        </div>

        {quote.materials?.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.08em] text-sl-400 font-semibold">
              Matériaux
            </span>
            <ul className="flex flex-col gap-2 list-none m-0 p-0">
              {quote.materials.map((mat) => (
                <li key={mat.id} className="flex items-start justify-between gap-3 text-[13px]">
                  <div className="min-w-0">
                    <p className="text-sl-700 m-0 truncate">{mat.designation}</p>
                    <p className="text-[11px] text-sl-400 m-0">
                      {mat.quantity} × {new Intl.NumberFormat("fr-FR").format(mat.unitPrice)} XAF
                    </p>
                  </div>
                  <AmountDisplay amount={mat.subtotal} size="sm" className="shrink-0" />
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-sl-100 pt-2">
              <span className="text-[12px] text-sl-500">Sous-total matériaux</span>
              <AmountDisplay amount={quote.materialsTotal} size="sm" variant="muted" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-sl-200 pt-3">
          <span className="text-[13px] font-semibold text-sl-900">Total</span>
          <AmountDisplay amount={quote.totalAmount} size="lg" />
        </div>

        <div className="flex flex-col gap-1 text-[12px] text-sl-400">
          <span>Durée estimée : {quote.estimatedDurationHours} h</span>
          <span>Valide {quote.validityDays} jours — expire le {formatDate(quote.expiresAt)}</span>
        </div>
      </div>
    </Card>
  );
}