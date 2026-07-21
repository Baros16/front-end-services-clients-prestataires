// src/components/provider/dashboard/EarningsSummaryCard.jsx
import { Card, AmountDisplay } from '../../commons';

export function EarningsSummaryCard({ amount }) {
  return (
    <Card
      title="GAINS DU MOIS"
      className="bg-[var(--color-info-light)]"
    >
      <AmountDisplay amount={amount} size="lg" />
    </Card>
  );
}