// src/pages/admin/ValidationPrestataire.jsx

import { useState, useEffect } from 'react';
import { useParams }           from 'react-router-dom';
import { StatusBadge }         from '../../components/commons';
import { ProviderInfoCard }    from '../../components/admin/validation/ProviderInfoCard';
import { DocumentList }        from '../../components/admin/validation/DocumentList';
import { ActionPanel }         from '../../components/admin/validation/ActionPanel';
import {
  getDossier,
  validerPrestataire,
  refuserDossier,
  envoyerRappelSMS,
} from '../../services/validationService';

// Squelette de chargement — reproduit la structure 3 colonnes
function ValidationSkeleton() {
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
      <div className="rounded-2xl p-6 space-y-4 sl-animate-shimmer"
        style={{ width: 340, flexShrink: 0, background: 'var(--color-sl-100)' }} />
    </div>
  );
}

export default function ValidationPrestataire() {
  const { providerId } = useParams();
  const targetId = providerId ?? 'usr_jcm456'; // fallback mock S2

  const [dossier,  setDossier]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [actioning, setActioning] = useState(false);
  const [toast,    setToast]    = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    setLoading(true);
    getDossier(targetId)
      .then(setDossier)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [targetId]);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleValider() {
    setActioning(true);
    try {
      await validerPrestataire(targetId);
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
      await refuserDossier(targetId);
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
      await envoyerRappelSMS(targetId);
      showToast('success', 'SMS de rappel envoyé.');
    } catch {
      showToast('error', "Erreur lors de l'envoi du SMS.");
    } finally {
      setActioning(false);
    }
  }

  return (
    <div className="p-8 min-h-full" style={{ background: 'var(--color-sl-50)' }}>

      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold
                     shadow-lg transition-all duration-200"
          style={{
            background: toast.type === 'success' ? 'var(--color-success)' : 'var(--color-error)',
            color:      '#ffffff',
            fontFamily: 'var(--font-body)',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* En-tête */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-display)' }}
          >
            Validation prestataire
          </h1>
          {dossier && (
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--color-sl-500)', fontFamily: 'var(--font-body)' }}
            >
              Dossier de {dossier.provider.fullName} — {dossier.provider.specialty}
            </p>
          )}
        </div>
        <StatusBadge label="En attente" variant="en_attente" />
      </div>

      {/* Contenu */}
      {loading ? (
        <ValidationSkeleton />
      ) : dossier ? (
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
    </div>
  );
}