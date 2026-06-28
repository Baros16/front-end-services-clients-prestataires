import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader, StatCard, Card, AmountDisplay,
  RatingStars, DataTable, EmptyState, SkeletonLoader, AlertBanner,
} from '../../components/commons';
import { AvailabilitySchedule } from '../../components/provider/AvailabilitySchedule';
import { getProviderDashboard } from '../../services/providerService';
import mockDashboard from '../../data/provider/mock_dashboard.json';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then(setData)
      .catch(() => { setData(mockDashboard.data); setError(false); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-6 space-y-4">
      <SkeletonLoader variant="metric" count={4} />
      <SkeletonLoader variant="row"    count={4} />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <AlertBanner type="error" message="Impossible de charger le tableau de bord." />
    </div>
  );

  const { profile, metrics, recentMissions, availability } = data;

  const MISSIONS_COLUMNS = [
    { key: 'title',         header: 'Mission',  render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'status',        header: 'Statut',   render: (r) => <span>{r.status}</span> },
    { key: 'totalAmount',   header: 'Montant',  render: (r) => <AmountDisplay amount={r.totalAmount} size="sm" /> },
    { key: 'paymentStatus', header: 'Paiement', render: (r) => <span>{r.paymentStatus}</span> },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Tableau de bord"
        subtitle={`${profile.specialty} · ${profile.completedMissions} missions`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="MISSIONS CE MOIS"
          value={metrics.missionsThisMonth}
          trend={metrics.trends.missions}
          trendSubtext={metrics.trends.missions.subtext}
        />
        <StatCard
          label="GAINS NETS"
          value={<AmountDisplay amount={metrics.netEarnings} size="lg" />}
          trend={metrics.trends.earnings}
          trendSubtext={metrics.trends.earnings.subtext}
        />
        <StatCard
          label="NOTE MOYENNE"
          value={
            <div className="space-y-1">
              <RatingStars value={metrics.averageRating} size="sm" />
              <span className="text-xl font-bold text-sl-900">{metrics.averageRating} / 5</span>
            </div>
          }
          trend={metrics.trends.rating}
          trendSubtext={metrics.trends.rating.subtext}
        />
        <StatCard
          label="DEMANDES DISPO"
          value={metrics.availableDemandsCount}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <Card
            title="MISSIONS RÉCENTES"
            actions={
              <button onClick={() => navigate('/provider/missions')} className="text-xs text-brand font-medium">
                Tout voir
              </button>
            }
            noPadding
          >
            <DataTable
              columns={MISSIONS_COLUMNS}
              data={recentMissions}
              keyExtractor={(r) => r.id}
              isLoading={false}
              emptyState={
                <EmptyState
                  title="Aucune mission récente"
                  description="Vos missions terminées apparaîtront ici."
                />
              }
            />
          </Card>
        </div>

        <div className="space-y-4">
          <AvailabilitySchedule availability={availability} />
          <Card title="GAINS DU MOIS">
            <AmountDisplay amount={metrics.netEarnings} size="xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}
