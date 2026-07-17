// src/components/provider/gains/EarningsMissionRow.jsx
import { UserAvatarCircle, RatingStars } from '../../commons';
import { formatDate, formatXAF } from '../../../utils/formatters';

export function EarningsMissionRow({ payout }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-sl-100 last:border-none">

      <UserAvatarCircle
        initial={payout.clientInitial}
        size="md"
        bgClass="bg-sl-200"
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[13px] font-semibold `font-[family-name:var(--font-body)]` text-sl-900">
            {payout.clientName}
          </span>
          <span className="text-[13px] `font-[family-name:var(--font-body)]` text-sl-400">
            · {payout.category}
          </span>s
        </div>
        <RatingStars value={payout.rating} size="sm" />
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="text-[13px] font-bold `font-[family-name:var(--font-display)]` text-success">
          +{formatXAF(payout.amount)}
        </span>
        <span className="text-[11px] `font-[family-name:var(--font-body)]` text-sl-400">
          {formatDate(payout.date)}
        </span>
      </div>

    </div>
  );
}