// src/pages/admin/PaiementsPage.jsx
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, StatCard, DataTable, AmountDisplay, StatusBadge, SkeletonLoader, EmptyState, AlertBanner, TabBar,
} from '../../components/commons';
import { Wallet, CreditCard, Banknote, RefreshCw } from '../../components/commons';
import { getAdminStats } from '../../services/adminService';

const PAYMENT_TABS = [
  { id: 'all', label: 'Tous' },
  { id: 'sequestre', label: 'Séquestre' },
  { id: 'debloque', label: 'Débloqué' },
  { id: 'rembourse', label: 'Remboursé' },
  { id: 'echec', label: 'Échec' },
];

const COLUMNS = [
  { key: 'reference', label: 'Réf.', render: (v) => <span className="font-medium text-sm">{v}</span> },
  { key: 'type', label: 'Type', render: (v) => <span className="text-xs capitalize">{v}</span> },
  { key: 'clientName', label: 'Client' },
  { key: 'providerName', label: 'Prestataire' },
  { key: 'amount', label: 'Montant', render: (v) => <AmountDisplay amount={v} size="sm" /> },
  { key: 'status', label: 'Statut', render: (v) => <StatusBadge label={v} variant={v} size="sm" /> },
  { key: 'date', label: 'Date', render: (v) => new Date(v).toLocaleDateString('fr-FR') },
];

export default function PaiementsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAdminStats()
      .then((res) => setData(res?.data ?? res))
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

  const payments = data?.payments ?? data?.transactions ?? [];
  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter || p.type === filter);
  const totalAmount = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'sequestre' || p.status === 'en_attente')
    .reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Paiements Système" subtitle="Gestion des transactions et du séquestre" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total transactions" value={`${totalAmount.toLocaleString()} XAF`} icon={<Wallet size={20} />} trend="neutral" />
        <StatCard label="Montant séquestré" value={`${pendingAmount.toLocaleString()} XAF`} icon={<CreditCard size={20} />} trend="up" />
        <StatCard label="Nombre de transactions" value={payments.length} icon={<Banknote size={20} />} trend="neutral" />
      </div>

      <TabBar tabs={PAYMENT_TABS} activeTabId={filter} onChange={setFilter} />

      {filtered.length === 0 ? (
        <EmptyState icon={<Wallet size={48} />} title="Aucune transaction" description="Les transactions apparaîtront ici." />
      ) : (
        <DataTable columns={COLUMNS} data={filtered} keyExtractor={(p) => p.id} />
      )}
    </div>
  );
}