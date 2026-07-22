// src/components/provider/quote/QuoteTotalPreview.jsx
import { formatXAF } from '../../../utils/formatters';


export function QuoteTotalPreview({ laborAmount, materialsTotal, totalAmount }) {
  return (
    <div className="rounded-lg bg-sl-900 text-white p-5 sm:p-6 shadow-lg lg:sticky lg:top-6">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-sl-400 uppercase mb-4">
        Aperçu du total
      </p>

      <dl className="flex flex-col gap-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-sl-300">Main d&rsquo;œuvre</dt>
          <dd className="font-medium">{formatXAF(laborAmount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sl-300">Matériaux</dt>
          <dd className="font-medium">{formatXAF(materialsTotal)}</dd>
        </div>
      </dl>

      <div className="mt-4 pt-4 border-t border-white/10 flex items-end justify-between">
        <span className="font-display text-sm font-semibold tracking-wide text-sl-300 uppercase">
          Total
        </span>
        {/* AmountDisplayTotal */}
        <span className="font-display text-2xl sm:text-3xl font-bold tabular-nums">
          {formatXAF(totalAmount)}
        </span>
      </div>
    </div>
  );
}