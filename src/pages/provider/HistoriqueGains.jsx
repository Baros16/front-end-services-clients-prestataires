// src/pages/provider/HistoriqueGains.jsx
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, StatCard, SkeletonLoader, EmptyState, AlertBanner, Avatar,
} from '../../components/commons';
import { TrendingUp, Wallet, Star, BarChart2, Download } from '../../components/commons';
import { getEarnings } from '../../services/providerService';
import { formatXAF, formatDate } from '../../utils/formatters';

const MONTHLY_GAINS = [
  { month: 'Jan', amount: 64000, missions: 2 },
  { month: 'Fev', amount: 85000, missions: 3 },
  { month: 'Mar', amount: 72000, missions: 2 },
  { month: 'Avr', amount: 98000, missions: 4 },
  { month: 'Mai', amount: 110000, missions: 5 },
  { month: 'Jui', amount: 76000, missions: 3 },
];

export default function HistoriqueGains() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEarnings()
      .then((res) => setData(res?.data ?? res))
      .catch((err) => setError(err.message))
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

  const earnings = data?.earnings ?? [];
  const totalGains = earnings.reduce((s, e) => s + (e.amount || 0), 0);
  const totalMissions = earnings.length;
  const avgRating = 4.8;
  const totalCumulated = 505000;
  const maxGain = Math.max(...MONTHLY_GAINS.map((m) => m.amount), 1);

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <PageHeader title="Gains" subtitle="Suivez vos revenus et votre performance" />
        <button
          className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95"
          style={{ border: '1px solid var(--color-sl-200)', background: 'var(--color-surface)' }}
        >
          <Download size={14} /> Exporter CSV
        </button>
      </div>

      {/* 4 metriques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Gains du mois" value={formatXAF(totalGains)} icon={<Wallet size={20} />} trend="up" />
        <StatCard label="Missions" value={totalMissions} icon={<BarChart2 size={20} />} trend="neutral" />
        <StatCard label="Note moyenne" value={`${avgRating}/5`} icon={<Star size={20} />} trend="up" />
        <StatCard label="Total cumule" value={formatXAF(totalCumulated)} icon={<TrendingUp size={20} />} trend="up" />
      </div>

      {/* Graphique gains par mois */}
      <Card title="Gains par mois">
        <div className="flex flex-col gap-3">
          {MONTHLY_GAINS.map((m) => (
            <div key={m.month} className="flex items-center gap-3">
              <span className="text-xs font-bold w-8" style={{ color: 'var(--color-sl-500)' }}>{m.month}</span>
              <div className="flex-1">
                <div className="relative h-6 rounded-full" style={{ background: 'var(--color-sl-100)' }}>
                  <div
                    className="h-6 rounded-full transition-all"
                    style={{
                      width: `${(m.amount / maxGain) * 100}%`,
                      background: 'var(--color-brand)',
                    }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold w-20 text-right" style={{ color: 'var(--color-sl-800)' }}>
                {formatXAF(m.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Dernieres transactions */}
      <Card title="Dernieres transactions">
        {earnings.length === 0 ? (
          <EmptyState icon={<Wallet size={48} />} title="Aucune transaction" description="Vos gains apparaitront ici." />
        ) : (
          <div className="flex flex-col gap-3">
            {earnings.slice(0, 5).map((e, i) => (
              <div key={e.id ?? i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--color-sl-50)' }}>
                <div className="flex items-center gap-3">
                  <Avatar initial={e.clientName?.[0] ?? 'C'} size="sm" />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-sl-800)' }}>{e.clientName ?? 'Client'}</p>
                    <p className="text-xs" style={{ color: 'var(--color-sl-400)' }}>{e.serviceName ?? 'Service'} · {formatDate(e.date)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--color-success)' }}>+{formatXAF(e.amount ?? 0)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}