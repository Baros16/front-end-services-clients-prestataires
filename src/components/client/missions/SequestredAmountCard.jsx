// src/components/client/missions/SequestredAmountCard.jsx
import { Card, AmountDisplay, ProgressBar } from '../../commons';

export function SequestredAmountCard({ totalAmount, steps = [] }) {
  const completed = steps.filter((s) => s.completed).length;
  const percent = steps.length > 0
    ? Math.round((completed / steps.length) * 100)
    : 0;

  return (
    <Card title="Séquestre">
      <div className="flex flex-col gap-3">
        <AmountDisplay
          amount={totalAmount}
          size="lg"
          variant="default"
        />

        <span className="text-[12px] font-[family-name:var(--font-body)] text-sl-500">
          Libéré après double validation
        </span>
        <div className="h-2 bg-sl-100 rounded-full overflow-hidden">
        <div
         className="h-full rounded-full bg-info transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
          />
        </div>



        <span className="text-[12px] font-[family-name:var(--font-body)] text-sl-500">
          {percent}% de la mission accomplie
        </span>
        
      </div>
    </Card>
  );
}