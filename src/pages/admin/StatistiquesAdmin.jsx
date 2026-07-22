// src/pages/admin/StatistiquesAdmin.jsx

import { useState, useEffect }  from 'react';
import {
  PageHeader,
  Button,
  StatCard,
  SkeletonLoader,
  EmptyState,
} from '../../components/commons';
import { MissionChart }     from '../../components/admin/stats/MissionChart';
import { ServiceBreakdown } from '../../components/admin/stats/ServiceBreakdown';
import { getStats }         from '../../services/statsService';

// ─── Squelette chargement ─────────────────────────────────────────────────────
function StatsSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1">
            <SkeletonLoader variant="metric" count={1} />
          </div>
        ))}
      </div>
      <div className="flex gap-5">
        <div className="flex-1">
          <SkeletonLoader variant="card" count={1} />
        </div>
        <div style={{ width: 340, flexShrink: 0 }}>
          <SkeletonLoader variant="card" count={1} />
        </div>
      </div>
      <div className="flex gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-1">
            <SkeletonLoader variant="metric" count={1} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── StatisticsPage ───────────────────────────────────────────────────────────
export default function StatisticsAdmin() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // S3 : POST /admin/stats/export?format=pdf|csv
  function handleExportPDF() { console.log('Export PDF — S3'); }
  function handleExportCSV() { console.log('Export CSV — S3'); }

  return (
    <div className="p-8 min-h-full" style={{ background: 'var(--color-sl-50)' }}>

      <PageHeader
        title="Statistiques & Reporting"
        subtitle="Période : Mai 2026"
        actions={
          <div className="flex items-center gap-3">
            <Button onClick={handleExportPDF}>Exporter PDF</Button>
            <Button onClick={handleExportCSV}>Exporter CSV</Button>
          </div>
        }
      />

      <div className="mt-8">
        {loading && <StatsSkeleton />}

        {!loading && error && (
          <EmptyState
            icon="alert"
            title="Erreur de chargement"
            description="Impossible de charger les statistiques. Réessayez."
          />
        )}

        {!loading && !error && stats && (
          <div className="space-y-5">

            {/* ── Ligne 1 : KPI ── */}
            <div className="flex gap-5">
              <div className="flex-1">
                <StatCard
                  label="CA Total"
                  value="8.4M XAF"
                  trend={stats.kpiTrends.revenue}
                  trendSubtext="vs mois dernier"
                />
              </div>
              <div className="flex-1">
                <StatCard
                  label="Commissions"
                  value="672k XAF"
                  trend={stats.kpiTrends.commission}
                  trendSubtext="vs mois dernier"
                />
              </div>
              <div className="flex-1">
                <StatCard
                  label="Taux de complétion"
                  value={`${Math.round(stats.missions.completionRate)}%`}
                  trend={stats.kpiTrends.completionRate}
                  trendSubtext="vs mois dernier"
                />
              </div>
              <div className="flex-1">
                <StatCard
                  label="Satisfaction"
                  value={`${stats.satisfaction.value} / 5`}
                  trend={stats.satisfaction.trend}
                  trendSubtext="vs mois dernier"
                />
              </div>
            </div>

            {/* ── Ligne 2 : Graphique + Répartition ── */}
            <div className="flex gap-5 items-stretch">
              <div className="flex-1 min-w-0">
                <MissionChart
                  points={stats.dailyPoints}
                  period="Mai 2026"
                />
              </div>
              <ServiceBreakdown categories={stats.popularCategories} />
            </div>

            {/* ── Ligne 3 : Métriques ── */}
            <div className="flex gap-5">
              <div className="flex-1">
                <StatCard
                  label="Prestataires actifs"
                  value={String(stats.providers.active)}
                  trendSubtext={`sur ${stats.providers.total} inscrits`}
                />
              </div>
              <div className="flex-1">
                <StatCard
                  label="Taux de litige"
                  value={`${stats.disputeRate.value}%`}
                  trendSubtext={`Objectif < ${stats.disputeRate.target}%`}
                />
              </div>
              <div className="flex-1">
                <StatCard
                  label="Délai moyen résolution"
                  value={`${stats.avgResolutionDays} jours`}
                  trendSubtext="Litiges"
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}