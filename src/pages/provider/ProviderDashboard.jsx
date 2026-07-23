// src/pages/provider/DashboardPage.jsx
import { useState, useEffect }        from 'react';
import { useNavigate, useLocation }   from 'react-router-dom';

import { DashboardSkeleton }          from '../../components/provider/dashboard/DashboardSkeleton';
import { RecentMissionRow }           from '../../components/provider/dashboard/RecentMissionRow';
import { AvailabilityPanel }          from '../../components/provider/dashboard/AvailabilityPanel';
import { EarningsSummaryCard }        from '../../components/provider/dashboard/EarningsSummaryCard';

import {
  PageHeader,
  StatCard,
  Card,
  Button,
  AlertBanner,
  StatusBadge,
  EmptyState,
  Inbox,
} from '../../components/commons';

import { formatXAF }                  from '../../utils/formatters';
import { getProviderDashboard }       from '../../services/providerService';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Message de succès transmis via la redirection
  const successMessage = location.state?.successMessage;
  const [showSuccess, setShowSuccess] = useState(Boolean(successMessage));

  // Timer de 3 secondes pour effacer le message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        // Supprime le message de l'historique de navigation
        navigate(location.pathname, { replace: true, state: {} });
      }, 3000); // 3000 ms = 3 secondes

      return () => clearTimeout(timer);
    }
  }, [showSuccess, navigate, location.pathname]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProviderDashboard()
      .then(res => setData(res.data ?? res))
      .catch(err => {
        console.error('[ProviderDashboard]', err);
        setError('Impossible de charger le tableau de bord. Vérifiez votre connexion.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="p-6">
        <AlertBanner type="danger" title="Erreur" message={error} />
      </div>
    );
  }

  const { profile, metrics, recentMissions, availability } = data;
  const { trends } = metrics;

  return (
    <div className="p-4 md:p-6 flex flex-col gap-5">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <PageHeader
        title="Tableau de bord"
        subtitle={profile.fullName}
        actions={
          <StatusBadge
            label={profile.isAvailable ? 'Disponible' : 'Indisponible'}
            variant={profile.isAvailable ? 'disponible' : 'indisponible'}
            withDot
          />
        }
      />

      {/* ── Alerte de succès (s'affiche 3 secondes puis disparaît) ─────── */}
      {showSuccess && successMessage && (
        <AlertBanner
          type="success"
          title="Litige transmis"
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {/* ── 4 StatCards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="MISSIONS CE MOIS"
          value={String(metrics.missionsThisMonth)}
          trend={trends.missions}
          trendSubtext={trends.missions.subtext.replace(trends.missions.value,'').trim()}
        />
        <StatCard
          label="GAINS NETS"
          value={formatXAF(metrics.netEarnings)}
          trend={trends.earnings}
          trendSubtext={trends.earnings.subtext.replace(trends.earnings.value,'').trim()}
        />
        <StatCard
          label="NOTE MOYENNE"
          value={`${metrics.averageRating} / 5`}
          trend={trends.rating}
          trendSubtext={trends.rating.subtext.replace(trends.rating.value,'').trim()}
        />
        <StatCard
          label="DEMANDES DISPO"
          value={String(metrics.availableDemandsCount)}
        />
      </div>

      {/* ── Corps 2 colonnes ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

        {/* ── Missions récentes ──────────────────────────────────────── */}
        <Card
          title="MISSIONS RÉCENTES"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/provider/missions')}
            >
              Tout voir
            </Button>
          }
        >
          {recentMissions.length === 0 ? (
            <EmptyState
              icon={<Inbox size={40} strokeWidth={1.5} />}
              title="Aucune mission récente"
              subtitle="Vos missions terminées apparaîtront ici."
            />
          ) : (
            recentMissions.map((mission, idx) => (
              <RecentMissionRow
                key={mission.id}
                mission={mission}
                isLast={idx === recentMissions.length - 1}
              />
            ))
          )}
        </Card>

        {/* ── Colonne droite ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <AvailabilityPanel availability={availability} />
          <EarningsSummaryCard amount={profile.monthlyEarnings} />
        </div>
      </div>
    </div>
  );
}