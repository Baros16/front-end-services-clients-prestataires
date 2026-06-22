// src/pages/provider/DashboardPage.jsx
// M4 Kenfack — Semaine 2 — Écran 14 : Dashboard Prestataire
// ⚠️ Utilise UNIQUEMENT les composants de src/components/commons/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Composants de Krisan — import via le barrel
import {
  AppShell,
  Sidebar,
  PageHeader,
  MetricCard,
  SectionCard,
  StatusBadge,
  AmountDisplay,
  StarRating,
  DataTable,
  EmptyState,
  SkeletonLoader,
  Spinner,
} from "../../components/commons";

// ✅ Composants spécifiques prestataire (créés par Krisan)
import { AvailabilityToggle } from "./components/provider/AvailabilityToggle";

// ✅ Données mock — import depuis src/data/ (jamais inline)
import mockDashboard from "../../data/provider/mock_dashboard.json";

// ✅ Service — pattern obligatoire (jamais d'appel direct dans la page)
import { getProviderDashboard } from "../../services/providerService";

// ─── NAVIGATION SIDEBAR ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",  label: "Tableau de bord",   icon: "🏠", href: "/provider" },
  { id: "demands",    label: "Demandes dispo",     icon: "📋", href: "/provider/demands" },
  { id: "missions",   label: "Mes missions",       icon: "🚀", href: "/provider/missions" },
  { id: "earnings",   label: "Mes gains",          icon: "💰", href: "/provider/earnings" },
];

// ─── COLONNES DU DATATATABLE ──────────────────────────────────────────────────
// DataTable attend un tableau de colonnes avec { key, header, render? }
const MISSIONS_COLUMNS = [
  {
    key: "title",
    header: "Mission",
    render: (row) => (
      <span className="font-medium text-sl-900">{row.title}</span>
    ),
  },
  {
    key: "status",
    header: "Statut",
    render: (row) => (
      <StatusBadge label={row.status} variant={row.status} size="sm" />
    ),
  },
  {
    key: "totalAmount",
    header: "Montant",
    render: (row) => (
      <AmountDisplay amount={row.totalAmount} size="sm" />
    ),
  },
  {
    key: "paymentStatus",
    header: "Paiement",
    render: (row) => (
      <StatusBadge label={row.paymentStatus} variant={row.paymentStatus} size="sm" />
    ),
  },
];

// =============================================================================
// PAGE PRINCIPALE
// =============================================================================
export default function DashboardPage() {
  const navigate = useNavigate();

  const [data, setData]           = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // ✅ Pattern obligatoire : appel via le service, jamais axios direct ici
    getProviderDashboard()
      .then((d) => {
        setData(d);
        setAvailable(d.profile.isAvailable);
      })
      .catch(() => {
        // Fallback mock si le service échoue (règle ServiLoc démo)
        setData(mockDashboard.data);
        setAvailable(mockDashboard.data.profile.isAvailable);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── État chargement ──────────────────────────────────────────────────────────
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
            onNavigate={(id) => navigate(NAV_ITEMS.find((i) => i.id === id)?.href)}
          />
        }
      >
        <PageHeader title="Tableau de bord" />
        <div className="p-6 space-y-4">
          {/* SkeletonLoader simule le contenu pendant le chargement */}
          <SkeletonLoader variant="metric" count={4} />
          <SkeletonLoader variant="row"    count={3} />
        </div>
      </AppShell>
    );
  }

  const { profile, metrics, recentMissions } = data;

  // Données utilisateur pour la Sidebar
  const sidebarUser = {
    name:          profile.fullName,
    subtitle:      `${profile.specialty} · ⭐ ${profile.rating}`,
    avatarInitial: profile.avatarInitial,
  };

  return (
    <AppShell
      role="provider"
      sidebar={
        <Sidebar
          items={NAV_ITEMS}
          activeItemId="dashboard"
          role="provider"
          user={sidebarUser}
          onNavigate={(id) => navigate(NAV_ITEMS.find((i) => i.id === id)?.href)}
        />
      }
    >
      {/* En-tête de page */}
      <PageHeader
        title={`Bonjour, ${profile.firstName} 👋`}
        subtitle="Voici votre activité du mois en cours"
        actions={
          // ✅ Composant AvailabilityToggle créé par Krisan pour le prestataire
          <AvailabilityToggle
            isAvailable={available}
            onChange={setAvailable}
          />
        }
      />

      <div className="p-6 space-y-6">

        {/* ── MÉTRIQUES ────────────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* ✅ MetricCard — composant Krisan, pas de StatCard réécrit */}
            <MetricCard
              label="MISSIONS CE MOIS"
              value={metrics.missionsThisMonth}
              trend={metrics.trends.missions}
              trendSubtext={metrics.trends.missions.subtext}
            />
            <MetricCard
              label="GAINS DU MOIS"
              // ✅ AmountDisplay formate le XAF — pas de fonction xaf() custom
              value={<AmountDisplay amount={metrics.netEarnings} size="lg" />}
              trend={metrics.trends.earnings}
              trendSubtext={metrics.trends.earnings.subtext}
            />
            <MetricCard
              label="NOTE MOYENNE"
              // ✅ StarRating — pas d'"★".repeat() codé à la main
              value={
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
        </section>

        {/* ── MISSIONS RÉCENTES ────────────────────────────────────────────── */}
        <SectionCard
          title="Missions récentes"
          actions={
            <button
              onClick={() => navigate("/provider/missions")}
              className="text-xs text-brand hover:underline font-medium"
            >
              Voir tout →
            </button>
          }
          noPadding
        >
          {/* ✅ DataTable — composant Krisan, pas de <table> HTML réécrit */}
          <DataTable
            columns={MISSIONS_COLUMNS}
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