// src/pages/admin/PaiementsPage.jsx
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, StatCard, StatusBadge, SkeletonLoader, EmptyState, AlertBanner, TabBar, Button,
} from '../../components/commons';
import { Wallet, CreditCard, Banknote, RefreshCw, Download } from '../../components/commons';
import { getAdminStats } from '../../services/adminService';
import { formatXAF, formatTime } from '../../utils/formatters';

const PAYMENT_TABS = [
  { id: 'all', label: 'Tous' },
  { id: 'sequestre', label: 'Sequestre' },
  { id: 'debloque', label: 'Debloque' },
  { id: 'rembourse', label: 'Rembourse' },
  { id: 'echec', label: 'Echec' },
];

const MOCK_PAYMENTS = [
  { id: '1', reference: 'MTN-2026-4412', type: 'Debit initial', operator: 'MTN', clientName: 'Madeleine K.', amount: 25000, status: 'sequestre', date: '2026-05-20T11:42:00' },
  { id: '2', reference: 'OM-2026-8841', type: 'Liberation', operator: 'OM', clientName: 'Sylvie N.', amount: 18000, status: 'debloque', date: '2026-05-20T10:15:00' },
  { id: '3', reference: 'MTN-2026-4411', type: 'Debit initial', operator: 'MTN', clientName: 'Helene A.', amount: 35000, status: 'litige', date: '2026-05-20T09:30:00' },
  { id: '4', reference: 'OM-2026-8840', type: 'Remboursement', operator: 'OM', clientName: 'Robert T.', amount: 10000, status: 'rembourse', date: '2026-05-20T08:30:00' },
  { id: '5', reference: 'OM-2026-8839', type: 'Debit initial', operator: 'OM', clientName: 'Clara B.', amount: 14000, status: 'debloque', date: '2026-05-20T07:12:00' },
  { id: '6', reference: 'MTN-2026-4410', type: 'Debit initial', operator: 'MTN', clientName: 'Joseph A.', amount: 8000, status: 'echec', date: '2026-05-20T06:55:00' },
];

export default function PaiementsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getAdminStats()
      .then((res) => {
        const stats = res?.data ?? res;
        setData({ ...stats, payments: MOCK_PAYMENTS });
      })
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

  const payments = data?.payments ?? MOCK_PAYMENTS;
  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter || p.type.toLowerCase().includes(filter));
  const totalAmount = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'sequestre' || p.status === 'en_attente').reduce((s, p) => s + (p.amount || 0), 0);
  const litigeAmount = payments.filter(p => p.status === 'litige').reduce((s, p) => s + (p.amount || 0), 0);
  const echecCount = payments.filter(p => p.status === 'echec').length;
  const echecRate = payments.length > 0 ? ((echecCount / payments.length) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <PageHeader title="Monitoring paiements Mobile Money" subtitle="Transactions Orange Money et MTN Momo" />
        <div className="flex gap-3">
          <Button variant="secondary" size="sm">
            <RefreshCw size={16} /> Actualiser
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={16} /> Exporter CSV
          </Button>
        </div>
      </div>

      {/* 4 metriques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Volume du jour" value={formatXAF(totalAmount)} icon={<Wallet size={20} />} trend="up" />
        <StatCard label="Transactions" value={payments.length} icon={<Banknote size={20} />} trend="neutral" />
        <StatCard label="Sequestres" value={formatXAF(pendingAmount)} icon={<CreditCard size={20} />} trend="up" />
        <StatCard label="Taux d'echec" value={`${echecRate}%`} icon={<RefreshCw size={20} />} trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tableau */}
        <div className="lg:col-span-2">
          <Card title="Journal des transactions">
            <TabBar tabs={PAYMENT_TABS} activeTabId={filter} onChange={setFilter} />

            {filtered.length === 0 ? (
              <EmptyState icon={<Wallet size={48} />} title="Aucune transaction" description="Les transactions apparaissent ici." />
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase" style={{ color: 'var(--color-sl-400)' }}>
                      <th className="pb-3 font-medium">Ref.</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Operateur</th>
                      <th className="pb-3 font-medium">Client</th>
                      <th className="pb-3 font-medium">Montant</th>
                      <th className="pb-3 font-medium">Statut</th>
                      <th className="pb-3 font-medium text-right">Heure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => {
                      const isOrange = p.operator === 'OM' || p.operator === 'orange';
                      const isMTN = p.operator === 'MTN' || p.operator === 'mtn';
                      return (
                        <tr key={p.id} className="border-b" style={{ borderColor: 'var(--color-sl-50)' }}>
                          <td className="py-4 font-bold text-sm" style={{ color: 'var(--color-sl-800)' }}>{p.reference}</td>
                          <td className="py-4 text-sm" style={{ color: 'var(--color-sl-600)' }}>{p.type}</td>
                          <td className="py-4">
                            <span className="flex items-center gap-2 text-sm">
                              <span className="w-2 h-2 rounded-full" style={{ background: isOrange ? 'var(--color-orange-money)' : 'var(--color-mtn-momo)' }}></span>
                              {isOrange ? 'Orange' : 'MTN'}
                            </span>
                          </td>
                          <td className="py-4 text-sm" style={{ color: 'var(--color-sl-600)' }}>{p.clientName}</td>
                          <td className="py-4 font-bold text-sm">{formatXAF(p.amount)}</td>
                          <td className="py-4">
                            <StatusBadge label={p.status} variant={p.status} size="sm" />
                          </td>
                          <td className="py-4 text-xs text-right" style={{ color: 'var(--color-sl-400)' }}>{formatTime(p.date)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Graphiques lateraux */}
        <div className="flex flex-col gap-6">
          <Card title="Repartition Operateurs">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: 'var(--color-orange-money)' }}></span>Orange Money</span>
                <span className="font-bold">62%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--color-sl-100)' }}>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--color-orange-money)', width: '62%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background: 'var(--color-mtn-momo)' }}></span>MTN Momo</span>
                <span className="font-bold">38%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--color-sl-100)' }}>
                <div className="h-1.5 rounded-full" style={{ background: 'var(--color-mtn-momo)', width: '38%' }}></div>
              </div>
            </div>
          </Card>

          <Card title="Statuts des fonds">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-warning)' }}></span>Sequestres</span>
              <span className="font-bold">{formatXAF(pendingAmount)}</span>
            </div>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-success)' }}></span>A liberer</span>
              <span className="font-bold">{formatXAF(totalAmount - pendingAmount - litigeAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-danger)' }}></span>En litige</span>
              <span className="font-bold">{formatXAF(litigeAmount)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}