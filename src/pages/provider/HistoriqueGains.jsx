// src/pages/provider/HistoriqueGains.jsx
import { useState, useEffect } from 'react';

import {
  PageHeader,
  Card,
  StatCard,
  TabBar,
  Button,
  AlertBanner,
  SkeletonLoader,
} from '../../components/commons';

import { EarningsMissionRow } from '../../components/provider/gains/EarningsMissionRow';
import { MonthlyGainBar }     from '../../components/provider/gains/MonthlyGainBar';

import { getEarnings } from '../../services/providerService';

const TABS = [
  { id: 'all',   label: 'Tout' },
  { id: 'month', label: 'Ce mois' },
  { id: 'paid',  label: 'Payées' },
];

export default function HistoriqueGains() {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('month');

  useEffect(() => {
    getEarnings()
      .then(setData)
      .catch(() => setError('Impossible de charger les gains.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <SkeletonLoader variant="metric" count={4} />
        <SkeletonLoader variant="card"   count={2} />
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

  const { metrics, payouts, monthlyGains } = data;

  const filteredPayouts = payouts.filter((p) => {
    if (activeTab === 'paid')  return p.status === 'completed';
    if (activeTab === 'month') {
      const date = new Date(p.date);
      const now  = new Date();
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()

      ) 
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 `min-h-[100dvh]` bg-sl-50">

      {/* En-tête */}
      <PageHeader
        title="Gains & historique"
        subtitle="Votre activité et vos revenus"
        actions={
          <Button variant="secondary" size="sm">
            Exporter CSV
          </Button>
        }
      />

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Missions ce mois"
          value={String(metrics.missionsThisMonth)}
          trend={{ direction: 'up', value: metrics.missionsThisMonthTrend }}
          accentColorClass="bg-transparent "
        />
        <StatCard
          label="Gains nets"
          value={`${Math.round(metrics.netGains / 1000)}k XAF`}
          trend={{ direction: 'up', value: metrics.netGainsTrend }}
          accentColorClass="bg-transparent "
        />
        <StatCard
          label="Note moyenne"
          value={`${metrics.averageRating} / 5`}
          trend={{ direction: 'up', value: metrics.averageRatingTrend }}
          accentColorClass="bg-transparent "
        />
        <StatCard
          label="Total cumulé"
          value={`${(metrics.totalCumulated / 1000000).toFixed(2)}M XAF`}
          accentColorClass="bg-transparent "
        />
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Missions récentes ── */}
        <Card 
          title="Missions récentes"
          actions={
           <div className="flex items-center gap-2">
             {TABS.map((tab) => (
               <Button
                 key={tab.id}
                 variant={activeTab === tab.id ? 'primary' : 'ghost'}
                 size="sm"
                 onClick={() => setActiveTab(tab.id)}
                 className="rounded-full"
                >
                 {tab.label}
                </Button>
              ))}
           </div>
          }
        >

          <div className="flex flex-col">
            {filteredPayouts.length === 0 ? (
              <p className="text-[13px] `font-[family-name:var(--font-body)]` text-sl-400 py-4 text-center">
                Aucune mission pour ce filtre.
              </p>
            ) : (
              filteredPayouts.map((payout) => (
                <EarningsMissionRow key={payout.id} payout={payout} />
              ))
            )}
          </div>
          
        </Card>{/* ── Gains par mois ── */}
        <Card title="Gains par mois" className="sticky top-6 self-start">
          <div className="flex flex-col gap-4">
            {monthlyGains.map((item) => (
              <MonthlyGainBar
                key={item.month}
                month={item.month}
                amount={item.amount}
                maxAmount={item.maxAmount}
              />
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}