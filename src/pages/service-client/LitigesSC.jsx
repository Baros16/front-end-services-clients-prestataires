// src/pages/service-client/LitigesSC.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader,
  Card,
  StatusBadge,
  SearchInput,
  SkeletonLoader,
  EmptyState,
  AlertBanner,
  AmountDisplay,
} from '../../components/commons';
import { Scale } from '../../components/commons';
import { getAssignedLitiges } from '../../services/serviceClientService';

export default function LitigesSC() {
  const [litiges, setLitiges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAssignedLitiges()
      .then(setLitiges)
      .catch(err => {
        console.error(err);
        setError(err.message || 'Erreur lors du chargement des litiges');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = litiges.filter(l =>
    !search || l.reference?.toLowerCase().includes(search.toLowerCase()) ||
    l.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    l.providerName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <SkeletonLoader variant="card" count={5} />
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

  return (
    <div className="p-6 flex flex-col gap-6">
      <PageHeader
        title="Litiges"
        subtitle="Liste des litiges assignés"
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Rechercher par référence, client ou prestataire..."
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Scale size={48} />}
          title={search ? 'Aucun résultat' : 'Aucun litige assigné'}
          description={search ? 'Essayez un autre terme de recherche.' : 'Les litiges vous seront assignés par l\'administrateur.'}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((litige) => (
            <div
              key={litige.id}
              onClick={() => navigate(`/service-client/litiges/${litige.id}`)}
              className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all hover:shadow-md"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-sl-200)' }}
            >
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--color-sl-800)' }}>
                    {litige.reference}
                  </span>
                  <StatusBadge label={litige.status} variant={litige.status} size="sm" />
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-sl-500)' }}>
                  <span>{litige.clientName}</span>
                  <span>vs</span>
                  <span>{litige.providerName}</span>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
                  {litige.motif}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <AmountDisplay amount={litige.amount} size="sm" />
                <span className="text-xs" style={{ color: 'var(--color-sl-400)' }}>
                  {new Date(litige.assignedAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}