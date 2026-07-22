// src/pages/service-client/ServiceClientDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  StatCard,
  Card,
  StatusBadge,
  SkeletonLoader,
  EmptyState,
  AlertBanner,
} from '../../components/commons';
import { Scale, Clock, CheckCircle, Wallet } from '../../components/commons';
import { getSCDashboard } from '../../services/serviceClientService';

export default function ServiceClientDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSCDashboard()
      .then(setData)
      .catch(err => {
        console.error(err);
        setError(err.message || 'Erreur lors du chargement du tableau de bord');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <SkeletonLoader variant="metric" count={4} />
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertBanner type="danger" message={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <EmptyState
          icon={<Scale size={48} />}
          title="Aucune donnée disponible"
          description="Le tableau de bord n'a pas pu charger les informations."
        />
      </div>
    );
  }

  const { metrics, recentLitiges = [], notifications = [] } = data;

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader
        title="Tableau de bord"
        subtitle="Service Client — Vue d'ensemble des litiges"
      />

      {/* Métriques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Litiges assignés"
          value={metrics.assignedLitiges}
          icon={<Scale size={20} />}
          trend="neutral"
        />
        <StatCard
          label="Litiges ouverts"
          value={metrics.openLitiges}
          icon={<Clock size={20} />}
          trend="up"
          trendSubtext="En attente"
        />
        <StatCard
          label="Résolus ce mois"
          value={metrics.resolvedThisMonth}
          icon={<CheckCircle size={20} />}
          trend="down"
          trendSubtext="Ce mois"
        />
        <StatCard
          label="Montant séquestré"
          value={`${metrics.totalAmountSequestred.toLocaleString()} XAF`}
          icon={<Wallet size={20} />}
          trend="neutral"
        />
      </div>

      {/* Litiges récents */}
      <Card
        title="Litiges récents"
        actions={
          <button
            onClick={() => navigate('/service-client/litiges')}
            className="text-sm font-medium"
            style={{ color: 'var(--color-brand)' }}
          >
            Voir tout →
          </button>
        }
      >
        {recentLitiges.length === 0 ? (
          <EmptyState
            icon={<Scale size={32} />}
            title="Aucun litige récent"
            description="Les litiges assignés apparaîtront ici."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {recentLitiges.map((litige) => (
              <div
                key={litige.id}
                onClick={() => navigate(`/service-client/litiges/${litige.id}`)}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
                style={{ background: 'var(--color-surface-subtle)' }}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-sl-800)' }}>
                    {litige.reference}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-sl-500)' }}>
                    {litige.clientName} vs {litige.providerName}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
                    {litige.motif}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-xaf)' }}>
                    {litige.amount.toLocaleString()} XAF
                  </span>
                  <StatusBadge label={litige.status} variant={litige.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card title="Notifications">
          <div className="flex flex-col gap-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{
                  background: notif.read ? 'transparent' : 'var(--color-info-light)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: notif.read ? 'var(--color-sl-300)' : 'var(--color-info)',
                  }}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm" style={{ color: 'var(--color-sl-700)' }}>
                    {notif.message}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
                    {new Date(notif.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}