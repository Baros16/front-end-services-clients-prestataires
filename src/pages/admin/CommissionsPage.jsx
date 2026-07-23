// src/pages/admin/CommissionsPage.jsx
import { useState, useEffect } from 'react';
import {
  PageHeader, Card, StatCard, SkeletonLoader, EmptyState, AlertBanner, Button,
} from '../../components/commons';
import { TrendingUp, Wallet, Percent, Save } from '../../components/commons';
import { getAdminStats } from '../../services/adminService';
import { formatXAF } from '../../utils/formatters';

const CATEGORY_RATES = [
  { id: 'plomberie', label: 'Plomberie', rate: 12, color: 'var(--color-cat-plomberie)' },
  { id: 'electricite', label: 'Electricite', rate: 10, color: 'var(--color-cat-electricite)' },
  { id: 'nettoyage', label: 'Nettoyage', rate: 8, color: 'var(--color-cat-nettoyage)' },
  { id: 'serrurerie', label: 'Serrurerie', rate: 12, color: 'var(--color-cat-serrurerie)' },
  { id: 'peinture', label: 'Peinture', rate: 10, color: 'var(--color-cat-peinture)' },
];

const REVENUS_PAR_CATEGORIE = [
  { label: 'Plomberie', amount: 145000, color: 'var(--color-cat-plomberie)' },
  { label: 'Electricite', amount: 120000, color: 'var(--color-cat-electricite)' },
  { label: 'Nettoyage', amount: 85000, color: 'var(--color-cat-nettoyage)' },
  { label: 'Serrurerie', amount: 72000, color: 'var(--color-cat-serrurerie)' },
  { label: 'Peinture', amount: 48000, color: 'var(--color-cat-peinture)' },
];

const MAX_REVENU = Math.max(...REVENUS_PAR_CATEGORIE.map((r) => r.amount), 1);

export default function CommissionsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rates, setRates] = useState(CATEGORY_RATES.map((r) => r.rate));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminStats()
      .then((res) => setData(res?.data ?? res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <SkeletonLoader variant="metric" count={3} />
        <SkeletonLoader variant="card" count={2} />
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

  const totalRevenus = REVENUS_PAR_CATEGORIE.reduce((s, r) => s + r.amount, 0);
  const avgRate = CATEGORY_RATES.reduce((s, r) => s + r.rate, 0) / CATEGORY_RATES.length;

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader title="Commissions et parametres" subtitle="Gerer les taux de commission et les parametres du sequestre" />

      {/* 3 metriques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Taux moyen" value={`${avgRate.toFixed(1)}%`} icon={<Percent size={20} />} trend="up" />
        <StatCard label="Revenus commissions" value={formatXAF(totalRevenus)} icon={<Wallet size={20} />} trend="up" />
        <StatCard label="Croissance" value="+12.5%" icon={<TrendingUp size={20} />} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Taux par categorie */}
        <Card title="Taux par categorie">
          <div className="flex flex-col gap-4">
            {CATEGORY_RATES.map((cat, i) => (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                <span className="flex-1 text-sm font-medium" style={{ color: 'var(--color-sl-700)' }}>{cat.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setRates((prev) => { const r = [...prev]; r[i] = Math.max(0, r[i] - 1); return r; })}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold active:scale-95"
                    style={{ border: '1px solid var(--color-sl-200)' }}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-sm" style={{ color: 'var(--color-sl-800)' }}>{rates[i]}%</span>
                  <button
                    onClick={() => setRates((prev) => { const r = [...prev]; r[i] = Math.min(30, r[i] + 1); return r; })}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold active:scale-95"
                    style={{ border: '1px solid var(--color-sl-200)' }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              <Save size={14} /> {saving ? 'Enregistrement...' : 'Enregistrer les taux'}
            </Button>
          </div>
        </Card>

        {/* Revenus par categorie */}
        <Card title="Revenus par categorie">
          <div className="flex flex-col gap-3">
            {REVENUS_PAR_CATEGORIE.map((r) => (
              <div key={r.label} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                <span className="text-xs font-medium w-24" style={{ color: 'var(--color-sl-600)' }}>{r.label}</span>
                <div className="flex-1">
                  <div className="relative h-5 rounded-full" style={{ background: 'var(--color-sl-100)' }}>
                    <div
                      className="h-5 rounded-full transition-all"
                      style={{ width: `${(r.amount / MAX_REVENU) * 100}%`, background: r.color }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold w-20 text-right" style={{ color: 'var(--color-sl-800)' }}>
                  {formatXAF(r.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Parametres du sequestre */}
      <Card title="Parametres du sequestre">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-sl-400)' }}>
              Delai liberation (jours)
            </label>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold active:scale-95" style={{ border: '1px solid var(--color-sl-200)' }}>-</button>
              <span className="text-lg font-bold" style={{ color: 'var(--color-sl-800)' }}>3</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold active:scale-95" style={{ border: '1px solid var(--color-sl-200)' }}>+</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-sl-400)' }}>
              Sequestre max (XAF)
            </label>
            <p className="text-lg font-bold" style={{ color: 'var(--color-sl-800)' }}>{formatXAF(500000)}</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-sl-400)' }}>
              Operateurs actifs
            </label>
            <div className="flex gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'var(--color-orange-money-light)', color: 'var(--color-orange-money)' }}>Orange Money</span>
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'var(--color-mtn-momo-light)', color: 'var(--color-mtn-momo)' }}>MTN Momo</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}