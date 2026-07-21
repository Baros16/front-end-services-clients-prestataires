// src/pages/client/ClientDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClientDashboard } from "../../services/clientService.js";
import { PageHeader, SkeletonLoader, AlertBanner } from "../../components/commons/index.js";
import WelcomeBanner from "../../components/client/dashboard/WelcomeBanner.jsx";
import ServiceCategoryGrid from "../../components/client/dashboard/CategoryGrid.jsx";
import RecentDemandsList from "../../components/client/dashboard/RecentDemandsList.jsx";
import DashboardMetrics from "../../components/client/dashboard/DashboardMetrics.jsx";
import { Button } from "../../components/commons/index.js"
import { Bell } from "../../components/commons/Icons.jsx";


export default function ClientDashboard() {

const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const navigate = useNavigate();
useEffect(() => {
getClientDashboard()
.then(setData)
.catch(() => setError("Impossible de charger le tableau de bord."))
.finally(() => setLoading(false));
}, []);
if (loading) return (
<div className="p-4 md:p-6">
<SkeletonLoader variant="metric" count={3} />
</div>
);
if (error) return (
<div className="p-4 md:p-6">
<AlertBanner variant="error" message={error} />
</div>
);
return (
<div
style={{ background: "var(--color-sl-50)", minHeight: "100dvh" }}
className="p-4 md:p-6"
>
<PageHeader
title="Tableau de bord"
actions={
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <Button 
      variant="ghost"
      size="md"
    > 
      <Bell size={18} />
    </Button>  
<Button 
 variant="secondary"
 size="md"
 className="!bg-black !text-white !border-black hover:!bg-gray-900"
 onClick={() => navigate("/client/nouvelle-demande")}
>
+ Nouvelle demande
</Button>
</div>
}
/>
<WelcomeBanner
profile={data.profile}
/>
<ServiceCategoryGrid
onSelect={(cat) => navigate(`/client/nouvelle-demande?cat=${cat.id}`)}
/>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-4">
<div className="md:col-span-2">
<RecentDemandsList demands={data.recentDemands} />
</div>
<div className="md:col-span-1">
<DashboardMetrics financialSummary={data.financialSummary} />
</div>
</div>
</div>
);
}