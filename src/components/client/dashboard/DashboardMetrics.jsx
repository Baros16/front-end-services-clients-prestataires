// src/components/client/dashboard/DashboardMetrics.jsx

import { StatCard, AmountDisplay } from "../../commons/index.js";
import { formatXAF } from "../../../utils/formatters.js";

export default function DashboardMetrics({ financialSummary }) {
    
if (!financialSummary) return null;
const { totalSpent, completedMissions, pendingPayment } = financialSummary;
return (
<div className="flex flex-col gap-4">
<StatCard
label="Montant total dépensé"
value={formatXAF(totalSpent)}
trendSubtext={`Sur ${completedMissions} missions terminées`}
accentColorClass="bg-info"
/>
<StatCard
label="Paiement en attente"
value={`${formatXAF(pendingPayment?.amount)} séquestrés`}
trendSubtext={pendingPayment?.missionLabel}
accentColorClass="bg-warning"
/>
</div>
);
}