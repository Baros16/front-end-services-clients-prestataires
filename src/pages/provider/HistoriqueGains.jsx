// src/pages/provider/HistoriqueGains.jsx
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, StatCard, DataTable, AmountDisplay, SkeletonLoader, EmptyState, AlertBanner, TabBar,
} from '../../components/commons';
import { Wallet, TrendingUp, Receipt, Calendar } from '../../components/commons';
import { getProviderEarnings } from '../../services/providerService';

const PERIOD_TABS = [
  { id: 'month', label: 'Ce mois' },
  { id: 'quarter', label: 'Ce trimestre' },
  { id: 'year', label: 'Cette année' },
  { id: 'all', label: 'Tout' },
];

const COLUMNS = [
  { key: 'reference', label: 'Réf.', render: (v) => <span className="font-medium text-sm">{v}</span> },
  { key: 'clientName', label: 'Client' },
  { key: 'serviceName', label: 'Service' },
  { key: 'date', label: 'Date', render: (v) => new Date(v).toLocaleDateString('fr-FR') },
  { key: 'amount', label: 'Montant', render: (v) => <AmountDisplay amount={v} size="sm" /> },
  { key: 'commission', label: 'Commission', render: (v) => <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>-{v} XAF</span> },
  { key: 'netAmount', label: 'Net', render: (v) => <AmountDisplay amount={v} size="sm" variant="success" /> },
];

export default function HistoriqueGains() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    getProviderEarnings()
      .then((res) => setData(res?.data ?? res ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <SkeletonLoader variant="metric" count={3} />
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

  const earnings = Array.isArray(data) ? data : [];
  const totalGross = earnings.reduce((s, e) => s + (e.amount || 0), 0);
  const totalCommission = earnings.reduce((s, e) => s + (e.commission || 0), 0);
  const totalNet = earnings.reduce((s, e) => s + (e.netAmount || e.amount || 0), 0);

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Historique des gains" subtitle="Suivez vos revenus" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total brut" value={`${totalGross.toLocaleString()} XAF`} icon={<Receipt size={20} />} trend="neutral" />
        <StatCard label="Commission" value={`-${totalCommission.toLocaleString()} XAF`} icon={<TrendingUp size={20} />} trend="down" />
        <StatCard label="Net perçu" value={`${totalNet.toLocaleString()} XAF`} icon={<Wallet size={20} />} trend="up" />
      </div>

      <TabBar tabs={PERIOD_TABS} activeTabId={period} onChange={setPeriod} />

      {earnings.length === 0 ? (
        <EmptyState icon={<Wallet size={48} />} title="Aucun gain" description="Vos gains apparaîtront ici après vos premières missions." />
      ) : (
        <DataTable columns={COLUMNS} data={earnings} keyExtractor={(e) => e.id} />
      )}
    </div>
  );
}