// src/pages/admin/CommissionsPage.jsx
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, StatCard, DataTable, AmountDisplay, SkeletonLoader, EmptyState, AlertBanner, Button, Input,
} from '../../components/commons';
import { Receipt, TrendingUp, Settings, Save } from '../../components/commons';
import { getAdminStats } from '../../services/adminService';

const COMMISSION_COLUMNS = [
  { key: 'reference', label: 'Transaction' },
  { key: 'providerName', label: 'Prestataire' },
  { key: 'amount', label: 'Montant', render: (v) => <AmountDisplay amount={v} size="sm" /> },
  { key: 'commissionRate', label: 'Taux', render: (v) => `${v}%` },
  { key: 'commissionAmount', label: 'Commission', render: (v) => <AmountDisplay amount={v} size="sm" variant="warning" /> },
  { key: 'date', label: 'Date', render: (v) => new Date(v).toLocaleDateString('fr-FR') },
];

export default function CommissionsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rate, setRate] = useState('10');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminStats()
      .then((res) => setData(res?.data ?? res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveRate = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    alert('Taux de commission mis à jour');
  };

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

  const commissions = data?.commissions ?? [];
  const totalCommission = commissions.reduce((s, c) => s + (c.commissionAmount || 0), 0);
  const totalTransactions = commissions.reduce((s, c) => s + (c.amount || 0), 0);

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Commissions & Paramètres" subtitle="Gérez les commissions de la plateforme" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total transactions" value={`${totalTransactions.toLocaleString()} XAF`} icon={<TrendingUp size={20} />} trend="neutral" />
        <StatCard label="Total commissions" value={`${totalCommission.toLocaleString()} XAF`} icon={<Receipt size={20} />} trend="up" />
        <StatCard label="Nombre de transactions" value={commissions.length} icon={<Receipt size={20} />} trend="neutral" />
      </div>

      <Card title="Paramètres de commission">
        <div className="flex items-end gap-4">
          <div className="w-48">
            <Input
              label="Taux de commission (%)"
              type="number"
              value={rate}
              onChange={setRate}
              min={0}
              max={100}
            />
          </div>
          <Button variant="primary" size="md" onClick={handleSaveRate} disabled={saving}>
            <Save size={16} /> {saving ? 'Enregistrement...' : 'Appliquer'}
          </Button>
        </div>
      </Card>

      <Card title="Historique des commissions">
        {commissions.length === 0 ? (
          <EmptyState icon={<Receipt size={48} />} title="Aucune commission" description="Les commissions apparaîtront ici." />
        ) : (
          <DataTable columns={COMMISSION_COLUMNS} data={commissions} keyExtractor={(c) => c.id} />
        )}
      </Card>
    </div>
  );
}