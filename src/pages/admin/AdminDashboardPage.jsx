// src/components/admin/dashboard/AdminDashboardPage.jsx

import { PageHeader, StatCard, Button, SkeletonLoader } from "../../components/commons";
import { formatXAF } from "../../utils/formatters";
import { useAdminDashboard } from "../../hooks/admin/useAdminDashboard";
import PendingValidationPanel  from "../../components/admin/dashboard/PendingValidationPanel";
import ActiveLitigesPanel      from "../../components/admin/dashboard/ActiveLitigesPanel";
import PopularCategoriesPanel  from "../../components/admin/dashboard/PopularCategoriesPanel";
import RecentTransactionsTable from "../../components/admin/dashboard/RecentTransactionsTable";



/**
 * Détermine la direction de la tendance depuis la chaîne API ("+12%", "-3%").
 */
function trendDir(trendStr) {
  if (!trendStr) return "neutral";
  if (trendStr.startsWith("+")) return "up";
  if (trendStr.startsWith("-") || trendStr.startsWith("−")) return "down";
  return "neutral";
}

const TODAY = new Date().toLocaleDateString("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// ─── Skeleton de chargement ───────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <SkeletonLoader variant="metric" count={4} />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-5"><SkeletonLoader variant="card" /></div>
        <div className="col-span-12 xl:col-span-3"><SkeletonLoader variant="card" /></div>
        <div className="col-span-12 xl:col-span-4"><SkeletonLoader variant="card" /></div>
      </div>
      <SkeletonLoader variant="card" />
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

/**
 * AdminDashboardPage
 *
 * Orchestre :
 *  - 4 StatCard (KPIs)
 *  - PendingValidationPanel | ActiveLitigesPanel | PopularCategoriesPanel
 *  - RecentTransactionsTable
 *
 * Données via useAdminDashboard (shape normalisée par toDashboard dans adminService).
 */
export default function AdminDashboardPage() {
  const { data, isLoading, handleApprove, handleReject } = useAdminDashboard();

  if (isLoading) return <DashboardSkeleton />;

  const {
    metrics,
    pendingProviders,
    activeLitiges,
    popularCategories,
    recentTransactions,
  } = data;

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* ── En-tête de page ── */}
      <PageHeader
        title="Tableau de bord"
        subtitle={TODAY}
        actions={
          <Button size="sm" variant="secondary">
            Exporter
          </Button>
        }
      />

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Demandes actives"
          value={metrics.activeRequests.value}
          trend={{ direction: trendDir(metrics.activeRequests.trend), value: metrics.activeRequests.trend }}
        />
        <StatCard
          label="Missions en cours"
          value={metrics.ongoingMissions.value}
          trend={{ direction: trendDir(metrics.ongoingMissions.trend), value: metrics.ongoingMissions.trend }}
        />
        <StatCard
          label="CA du mois"
          value={formatXAF(metrics.monthlyRevenue.value)}
          trend={{ direction: trendDir(metrics.monthlyRevenue.trend), value: metrics.monthlyRevenue.trend }}
          accentColorClass="bg-success"
        />
        <StatCard
          label="Commission perçue"
          value={formatXAF(metrics.commission.value)}
          trend={{ direction: trendDir(metrics.commission.trend), value: metrics.commission.trend }}
          accentColorClass="bg-success"
        />
      </div>

      {/* ── Rangée milieu : validation | litiges | catégories ── */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-5">
          <PendingValidationPanel
            pendingProviders={pendingProviders}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>
        <div className="col-span-12 xl:col-span-3">
          <ActiveLitigesPanel
            litiges={activeLitiges}
            onLitigeClick={(id) => {
              // TODO : naviguer vers /admin/litiges/:id via React Router
              console.log("[nav] litige →", id);
            }}
          />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <PopularCategoriesPanel categories={popularCategories} />
        </div>
      </div>

      {/* ── Transactions récentes ── */}
      <RecentTransactionsTable
        transactions={recentTransactions}
        onViewAll={() => {
          // TODO : naviguer vers /admin/transactions via React Router
          console.log("[nav] transactions →");
        }}
      />

    </div>
  );
}
