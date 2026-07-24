// src/components/client/dashboard/DashboardMetrics.jsx

import { StatCard } from "../../commons/index.js";
import { formatXAF } from "../../../utils/formatters.js";

export default function DashboardMetrics({ financialSummary }) {
  if (!financialSummary) return null;

  const { totalSpent, completedMissions, pendingPayment } = financialSummary;

  const pendingAmount = pendingPayment?.amount;
  const pendingLabel  = pendingPayment?.missionLabel;

  return (
    <div className="flex flex-col gap-4">
      <StatCard
        label="Montant total dépensé"
        value={formatXAF(totalSpent ?? 0)}
        trendSubtext={`Sur ${completedMissions ?? 0} missions terminées`}
        accentColorClass="bg-info"
      />
      <StatCard
        label="Paiement en attente"
        value={
          pendingAmount != null
            ? `${formatXAF(pendingAmount)} séquestrés`
            : "Aucun paiement en attente"
        }
        trendSubtext={pendingLabel ?? "—"}
        accentColorClass="bg-warning"
      />
    </div>
  );
}