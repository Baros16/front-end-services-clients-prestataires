import { Button }      from '../../commons/Button';
import { Card }        from '../../commons/Card';
import { StatusBadge } from '../../commons/StatusBadge';
import { formatDateShort } from '../../../utils/formatters';

export function DemandCard({ demand, onClick }) {
  const clickable = Boolean(onClick);

  return (
    <Card
      noPadding
      title={
        <span className="text-sm font-medium text-[var(--color-sl-900)] font-[family-name:var(--font-body)]">
          {demand.category?.label ?? 'Demande'}
        </span>
      }
      actions={
        <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
          {demand.urgent && <StatusBadge variant="urgent" size="sm" />}
          <StatusBadge variant={demand.status} size="sm" />
        </div>
      }
    >
      <div className="flex flex-col gap-3 p-4">

        <p className="text-sm leading-relaxed line-clamp-2 text-[var(--color-sl-600)] font-[family-name:var(--font-body)]">
          {demand.description}
        </p>

        {demand.estimatedBudget && (
          <div className="flex items-center justify-between px-3 py-2 bg-[var(--color-sl-50)] rounded-[var(--radius-md)]">
            <span className="text-xs text-[var(--color-sl-400)]">
              Budget estimé
            </span>
            <span className="text-sm font-semibold text-[var(--color-sl-900)] font-[family-name:var(--font-display)]">
              {formatBudgetRange(demand.estimatedBudget)}
            </span>
          </div>
        )}

        {demand.location?.address && (
          <span className="text-xs text-[var(--color-sl-500)] truncate">
            {demand.location.address}
          </span>
        )}

        <span className="text-xs text-[var(--color-sl-400)]">
          {formatDateShort(demand.createdAt)}
        </span>

        {clickable && (
          <div className="pt-2 mt-auto border-t border-[var(--color-sl-100)]">
            <Button variant="ghost" size="md" onClick={onClick} className="w-full">
              Voir le devis
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}