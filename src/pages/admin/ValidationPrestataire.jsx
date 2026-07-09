// src/pages/admin/ValidationPrestataire.jsx

import { useState, useEffect }  from 'react';
import {
  StatusBadge,
  DataTable,
  Button,
  Toast,
  EmptyState,
  SkeletonLoader,
  ChevronLeft,
  EmptyState,
}                               from '../../components/commons';
import { ProviderInfoCard }     from '../../components/admin/validation/ProviderInfoCard';
import { DocumentList }         from '../../components/admin/validation/DocumentList';
import { ActionPanel }          from '../../components/admin/validation/ActionPanel';
import {
  getDossiers,
  getDossier,
  validerPrestataire,
  refuserDossier,
  envoyerRappelSMS,
}                               from '../../services/adminService';
import { formatDate }           from '../../utils/formatters';
import { useToast }             from '../../hooks/useToast';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function VerdictBadge({ verdict }) {
  if (!verdict)                     return <StatusBadge label="Non examiné" variant="en_attente" />;
  if (verdict === 'needs_revision') return <StatusBadge label="À corriger"  variant="manquant"   />;
  if (verdict === 'approved')       return <StatusBadge label="Approuvé"    variant="dossier_ok" />;
  return                                   <StatusBadge label={verdict}     variant="en_attente" />;
}

function DocsCount({ documents }) {
  const valid = documents.filter(d => d.status === 'valide').length;
  const total = documents.length;
  const color = valid === total ? 'var(--color-success)' : 'var(--color-warning)';
  return (
    <span style={{ color, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14 }}>
      {valid}/{total} valides
    </span>
  );
}

// ─── Squelettes ───────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="flex gap-6">
      {[1, 2].map(i => (
        <div key={i} className="flex-1 rounded-2xl p-6 space-y-4"
          style={{ background: '#fff', border: '1px solid var(--color-sl-200)' }}>
          {Array.from({ length: 6 }).map((_, j) => (
            <div key={j} className="h-4 rounded sl-animate-shimmer"
              style={{ background: 'var(--color-sl-100)', width: j % 2 === 0 ? '60%' : '40%' }} />
          ))}
        </div>
      ))}
      <div className="rounded-2xl p-6 sl-animate-shimmer"
        style={{ width: 340, flexShrink: 0, background: 'var(--color-sl-100)' }} />
    </div>
  );
}

// ─── Colonnes DataTable ────────────────────────────────────────────────────────

function buildColumns(onVoir) {
  return [
    {
      key:    'prestataire',
      header:  'Prestataire',
      render: row => (
        <div style={{ fontFamily: 'var(--font-body)' }}>
          <p style={{ fontWeight: 600, color: 'var(--color-sl-900)', fontSize: 14 }}>
            {row.provider.fullName}
          </p>
          <p style={{ color: 'var(--color-sl-500)', fontSize: 12 }}>
            {row.provider.specialty}
          </p>
        </div>
      ),
    },
    {
      key:    'ville',
      header:  'Ville',
      render: row => (
        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-sl-700)', fontSize: 14 }}>
          {row.provider.serviceZone.city}
        </span>
      ),
    },
    {
      key:    'soumisLe',
      header:  'Soumis le',
      render: row => (
        <span style={{ fontFamily: 'var(--font-body)', color: 'var(--color-sl-500)', fontSize: 14 }}>
          {formatDate(row.provider.createdAt)}
        </span>
      ),
    },
    {
      key:    'documents',
      header:  'Documents',
      render: row => <DocsCount documents={row.documents} />,
    },
    {
      key:    'verdict',
      header:  'Verdict agent',
      render: row => <VerdictBadge verdict={row.agentReview?.verdict ?? null} />,
    },
    {
      key:    'action',
      header:  '',
      render: row => (
        <Button variant="secondary" size="sm" onClick={() => onVoir(row.provider.id)}>
          Voir le dossier
        </Button>
      ),
    },
  ];
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function ValidationPrestataire() {
  const [view,      setView]      = useState('list');
  const [dossiers,  setDossiers]  = useState([]);
  const [dossier,   setDossier]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [actioning, setActioning] = useState(false);
  const {toast, showToast, dismissToast} = useToast()

  useEffect(() => {
    setLoading(true);
    getDossiers()
      .then(setDossiers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleVoirDossier(providerId) {
    setLoading(true);
    try {
      const data = await getDossier(providerId);
      setDossier(data);
      setView('detail');
    } catch {
      showToast('error', 'Impossible de charger ce dossier.');
    } finally {
      setLoading(false);
    }
  }

  function handleRetour() {
    setDossier(null);
    setView('list');
  }

  async function handleValider() {
    setActioning(true);
    try {
      await validerPrestataire(dossier.provider.id);
      showToast('success', 'Prestataire validé avec succès.');
    } catch {
      showToast('error', 'Erreur lors de la validation.');
    } finally {
      setActioning(false);
    }
  }

  async function handleRefuser() {
    setActioning(true);
    try {
      await refuserDossier(dossier.provider.id);
      showToast('success', 'Dossier refusé.');
    } catch {
      showToast('error', 'Erreur lors du refus.');
    } finally {
      setActioning(false);
    }
  }

  async function handleSMS() {
    setActioning(true);
    try {
      await envoyerRappelSMS(dossier.provider.id);
      showToast('success', 'SMS de rappel envoyé.');
    } catch {
      showToast('error', "Erreur lors de l'envoi du SMS.");
    } finally {
      setActioning(false);
    }
  }

  const columns = buildColumns(handleVoirDossier);

  return (
    <div className="p-8 min-h-full" style={{ background: 'var(--color-sl-50)' }}>

      <Toast toast={toast} onDismiss={dismissToast}/>
      {/* ── VUE LISTE ─────────────────────────────────────── */}
      {view === 'list' && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold leading-tight"
              style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}>
              Validation prestataires
            </h1>
            <p className="text-sm mt-1"
              style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}>
              {dossiers.length} dossier{dossiers.length > 1 ? 's' : ''} en attente de traitement
            </p>
          </div>

          {loading ? (
            <SkeletonLoader variant="row" count={3} />
          ) : (
            <DataTable
              columns={columns}
              data={dossiers}
              keyExtractor={row => row.provider.id}
              isLoading={false}
              emptyState={
                <EmptyState
                  title='Aucun dossier en attente'
                  description= 'Tous les prestataires ont été traités.'
                />
              }
            />
          )}
        </>
      )}

      {/* ── VUE DÉTAIL ────────────────────────────────────── */}
      {view === 'detail' && (
        <>
          <div className="flex items-start justify-between mb-8">
            <div>
              <button
                onClick={handleRetour}
                className="flex items-center gap-1 mb-3 text-sm"
                style={{
                  color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <ChevronLeft size={16} />
                Retour à la liste
              </button>
              <h1 className="text-2xl font-bold leading-tight"
                style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}>
                Validation prestataire
              </h1>
              {dossier && (
                <p className="text-sm mt-1"
                  style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}>
                  Dossier de {dossier.provider.fullName} — {dossier.provider.specialty}
                </p>
              )}
            </div>
            <StatusBadge label="En attente" variant="en_attente" />
          </div>

          {loading ? <DetailSkeleton /> : dossier ? (
            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                <ProviderInfoCard provider={dossier.provider} />
              </div>
              <div className="flex-1 min-w-0">
                <DocumentList documents={dossier.documents} />
              </div>
              <ActionPanel
                provider={dossier.provider}
                documents={dossier.documents}
                onValider={handleValider}
                onRefuser={handleRefuser}
                onEnvoyerSMS={handleSMS}
                loading={actioning}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}>
                Dossier introuvable.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}