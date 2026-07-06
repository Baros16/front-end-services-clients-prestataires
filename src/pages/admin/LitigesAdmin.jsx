// src/pages/admin/LitigesAdmin.jsx

import { useState, useEffect } from "react";
import { PageHeader, StatCard, DataTable, StatusBadge, Button, AlertBanner, AmountDisplay, EmptyState, SkeletonLoader, } from "../../components/commons";
import  { getLitiges } from "../../services/adminService";
import mockUsers from "../../data/admin/mock_users.json";
import mockAgents from "../../data/admin/mock_agents.json";
import { formatDate, formatXAF, shortenName } from "../../utils/formatters";
import { ArrowRight } from "lucide-react";

//Mapping status mock -> StatusVariant attendu par StatusBadge
function toStatusVariant(status) {
if (status === "en_traitement" || status === "assigne") return "traitement"; 
if (status === "resolu" || status === "cloture") return "resolu";
return "ouvert";
}
function toStatusLabel(status) {
if (status === "en_traitement" || status === "assigne") return "TRAITEMENT";
if (status === "resolu") return "RÉSOLU";
if (status === "cloture") return "CLÔTURÉ";
return "OUVERT";
}

function resolveUserName(userId) {
const user = mockUsers.data.find((u) => u.id === userId);
if (user) return user.fullName;
return userId;
} 

function resolveAgentName(agentId) {
if (!agentId) return "Non assigné";
const agent = mockAgents.data.find((a) => a.id === agentId);
if (agent) return agent.fullName;
return agentId;
}

export default function LitigesAdmin() {
const [litiges, setLitiges] = useState([]);
const [metrics, setMetrics] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchLitiges = async() => {
        try{
            const res = await getLitiges();
            setLitiges(res.litiges);
            setMetrics(res.metrics);
        } catch (err) {
            setError(err?.message ?? "Impossible de charger les litiges.");    
        } finally {
          setLoading(false);
        }
    };      
    fetchLitiges(); 
}, []); 

function handleAssign(litigeId) {
// Fallback en attendant assignLitige() dans adminService.js
alert(`Assignation du litige ${litigeId} — fonctionnalité à venir.`);
} 
function handleExport() {
// Fallback : pas d'endpoint export pour l'instant
alert("Export des litiges — fonctionnalité à venir.");
} 
const columns = [
{
key: "reference",
header: "Réf.",
render: (row) => (
     <span className="font-bold">{row.reference}</span>
) 
},{
key: "createdAt",
header: "Date",
render: (row) => (
<span className="text-sl-400">{formatDate(row.createdAt)}</span>
),
},
{
key: "client",
header: "Client",
render: (row) => shortenName(resolveUserName(row.clientId)),
},
{
key: "provider",
header: "Prestataire",
render: (row) => shortenName(resolveUserName(row.providerId)),
},
{
key: "motif",
header: "Motif",
render: (row) => row.motif.title,
},
{
key: "amount",
header: "Montant",
render: (row) => (
    <span className="font-bold text-sl-900">
    {row.amount.toLocaleString("fr-FR")} XAF
    </span>
),
},
{
key: "status",
header: "Statut",
render: (row) => (
<StatusBadge
label={toStatusLabel(row.status)}
variant={toStatusVariant(row.status)}
size="sm"
/>
),
},
{
key: "agent",
header: "Agent",
render: (row) => (
<span className="text-sl-500">{row.status == "ouvert" ? "Non assigné" : row.agentId ? shortenName(resolveAgentName(row.agentId)) : "Non assigné"}
</span>
),
},
{
key: "action",
header: "",
render: (row) =>
row.status == "ouvert" ? (
<Button
size="sm"
variant="secondary"
onClick={() => handleAssign(row.id)}
className="!text-black  !border-gray-300 !font-bold !bg-white !rounded-md gap-1"
>
Assigner 
<ArrowRight size={14}
className="inline ml-1"/>
</Button>
) : null,
},
];
if (loading || !metrics) {
return (
<div className="p-9">
<SkeletonLoader variant="metric" count={4} />
<div className="mt-6">
<SkeletonLoader variant="row" count={4} />
</div>
</div>
);
} if
(error) {
return (
<div className="p-9">
<AlertBanner message={error} variant="error" />
</div>
);
}
return (
<div className="p-9">
<PageHeader
title="Gestion des litiges"subtitle="Litiges en cours et historique"
actions={
<Button 
 variant="secondary"
 size="sm"
 onClick={handleExport}
 className="!text-black  !border-gray-300 !font-bold !bg-white !rounded-md gap-1"
>
Exporter
</Button>
}
/>
<div className="grid grid-cols-4 gap-4 mt-7">
<StatCard label="Litiges ouverts" value={metrics.open} className="[&>div:last-child]:hidden"/>
<StatCard label="En traitement" value={metrics.inProgress} className="[&>div:last-child]:hidden"  />
<StatCard label="Résolus ce mois" value={metrics.resolvedThisMonth}  className="[&>div:last-child]:hidden"/>
<StatCard label="Montants bloqués" value={ `${Math.round(metrics.totalBlockedAmount / 1000)}k XAF`} className="[&>div:last-child]:hidden" 
/>
</div>
<div className="mt-6">
{litiges.length === 0 ? (
<EmptyState
icon="AlertTriangle"
title="Aucun litige"
description=""
/>
) : (
<div className="bg-white rounded-xl border border-gray-200 overflow-hidden">    
 <DataTable
   columns={columns}
   data={litiges}
   keyExtractor={(row) => row.id}
/>
</div>
)}
</div>
</div>
);
}

