// src/pages/provider/DashboardPage.jsx
// M4 Kenfack — Semaine 2 — Écran 14 : Dashboard Prestataire (UC28)

import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";

// ✅ Composants Krisan — JAMAIS réécrire ce qui existe ici
import AppShell        from "@/components/commons/AppShell";
import Sidebar         from "@/components/commons/Sidebar";
import PageHeader      from "@/components/commons/PageHeader";
import MetricCard      from "@/components/commons/MetricCard";
import SectionCard     from "@/components/commons/SectionCard";
import StatusBadge     from "@/components/commons/StatusBadge";
import AmountDisplay   from "@/components/commons/AmountDisplay";
import StarRating      from "@/components/commons/StarRating";
import DataTable       from "@/components/commons/DataTable";
import EmptyState      from "@/components/commons/EmptyState";
import SkeletonLoader  from "@/components/commons/SkeletonLoader";

// ✅ Composant prestataire — toggle disponibilité (Krisan)
import AvailabilityToggle from "@/components/provider/AvailabilityToggle";

// ✅ Service + mock fallback (pattern obligatoire)
import { getProviderDashboard } from "@/services/providerService";
import mockDashboard            from "@/data/provider/mock_dashboard.json";

// ─── NAVIGATION SIDEBAR ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Tableau de bord", icon: "🏠", href: "/provider"          },
  { id: "demands",   label: "Demandes dispo",  icon: "📋", href: "/provider/demands"  },
  { id: "missions",  label: "Mes missions",    icon: "🚀", href: "/provider/missions" },
  { id: "earnings",  label: "Mes gains",       icon: "💰", href: "/provider/earnings" },
];

// ─── COLONNES DATATATABLE ─────────────────────────────────────────────────────
const COLONNES_MISSIONS = [
  {
    key:    "title",
    header: "Mission",
    render: (row) => <span className="font-medium text-sl-900">{row.title}</span>,
  },
  {
    key:    "status",
    header: "Statut",
    render: (row) => <StatusBadge label={row.status} variant={row.status} size="sm" />,
  },
  {
    key:    "totalAmount",
    header: "Montant",
    // ✅ AmountDisplay formate le XAF — jamais de fonction xaf() custom
    render: (row) => <AmountDisplay amount={row.totalAmount} size="sm" />,
  },
  {
    key:    "paymentStatus",
    header: "Paiement",
    render: (row) => <StatusBadge label={row.paymentStatus} variant={row.paymentStatus} size="sm" />,
  },
];

// =============================================================================
// COMPOSANT PAGE
// =============================================================================
export default function DashboardPage() {
  const navigate = useNavigate();

  const [data,      setData]      = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // ✅ Pattern obligatoire : appel via service, jamais axios direct dans la page
    getProviderDashboard()
      .then((d) => {
        setData(d);
        setAvailable(d.profile.isAvailable);
      })
      .catch(() => {
        // Fallback mock si API plante — règle ServiLoc démo
        const fallback = mockDashboard.data;
        setData(fallback);
        setAvailable(fallback.profile.isAvailable);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── ÉTAT CHARGEMENT ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AppShell
        role="provider"
        sidebar={
          <Sidebar
            items={NAV_ITEMS}
            activeItemId="dashboard"
            role="provider"
            user={{ name: "…", subtitle: "…", avatarInitial: "…" }}
            onNavigate={() => {}}
          />
        }
      >
        <PageHeader title="Tableau de bord" />
        <div className="p-6 space-y-4">
          {/* ✅ SkeletonLoader — jamais de div grise animée custom */}
          <SkeletonLoader variant="metric" count={4} />
          <SkeletonLoader variant="row"    count={3} />
        </div>
      </AppShell>
    );
  }

  const { profile, metrics, recentMissions } = data;

  return (
    <AppShell
      role="provider"
      sidebar={
        <Sidebar
          items={NAV_ITEMS}
          activeItemId="dashboard"
          role="provider"
          user={{
            name:          profile.fullName,
            subtitle:      `${profile.specialty} · ⭐ ${profile.rating}`,
            avatarInitial: profile.avatarInitial,
          }}
          onNavigate={(id) => {
            const item = NAV_ITEMS.find((i) => i.id === id);
            if (item) navigate(item.href);
          }}
        />
      }
    >
      <PageHeader
        title={`Bonjour, ${profile.firstName} 👋`}
        subtitle="Voici votre activité du mois en cours"
        actions={
          // ✅ AvailabilityToggle — composant Krisan, jamais réécrire le toggle
          <AvailabilityToggle
            isAvailable={available}
            onChange={setAvailable}
          />
        }
      />

      <div className="p-6 space-y-6">

        {/* ── 4 METRIC CARDS ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <MetricCard
            label="MISSIONS CE MOIS"
            value={metrics.missionsThisMonth}
            trend={metrics.trends.missions}
            trendSubtext={metrics.trends.missions.subtext}
          />

          <MetricCard
            label="GAINS DU MOIS"
            value={<AmountDisplay amount={metrics.netEarnings} size="lg" />}
            trend={metrics.trends.earnings}
            trendSubtext={metrics.trends.earnings.subtext}
          />

          <MetricCard
            label="NOTE MOYENNE"
            value={
              // ✅ StarRating readonly — jamais "★".repeat(n) custom
              <StarRating
                value={metrics.averageRating}
                readonly
                showValue
                size="sm"
              />
            }
            trend={metrics.trends.rating}
            trendSubtext={metrics.trends.rating.subtext}
          />

          <MetricCard
            label="DEMANDES DISPO"
            value={metrics.availableDemandsCount}
          />

        </div>

        {/* ── MISSIONS RÉCENTES ──────────────────────────────────────────── */}
        <SectionCard
          title="Missions récentes"
          noPadding
          actions={
            <button
              onClick={() => navigate("/provider/missions")}
              className="text-xs font-medium text-brand hover:underline"
            >
              Voir tout →
            </button>
          }
        >
          {/* ✅ DataTable — jamais de <table> HTML réécrit à la main */}
          <DataTable
            columns={COLONNES_MISSIONS}
            data={recentMissions}
            keyExtractor={(row) => row.id}
            isLoading={false}
            emptyState={
              <EmptyState
                icon="briefcase"
                title="Aucune mission récente"
                description="Vos missions terminées apparaîtront ici."
              />
            }
          />
        </SectionCard>

      </div>
    </AppShell>
  );
}