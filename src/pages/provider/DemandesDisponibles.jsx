import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/commons/PageHeader';
import { TabBar } from '../../components/commons/TabBar';
import { AlertBanner } from '../../components/commons/AlertBanner';
import { EmptyState } from '../../components/commons/EmptyState';
import { SkeletonLoader } from '../../components/commons/SkeletonLoader';
import { DemandCard } from '../../components/provider/DemandeDisponible/DemandCard';
import { Button } from '../../components/commons/Button';
import {AvailabilityToggle} from "../../components/provider/AvailabilityToggle";
import { getAvailableDemands, applyToDemand, updateAvailability } from '../../services/providerService';

const TABS = [
  { id: 'priority', label: 'Zone prioritaire' },
  { id: 'extended', label: 'Zones éloignées' },
];

export default function DemandesDisponibles() {
  const navigate = useNavigate();
  const [allDemands, setAllDemands]   = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState(null);
  const [successMsg, setSuccessMsg]   = useState(null);
  const [activeTab, setActiveTab]     = useState('priority');
  const [isAvailable, setIsAvailable] = useState(true);
  const [applyingId, setApplyingId]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getAvailableDemands();
        const raw = Array.isArray(res) ? res : res.data ?? [];
        const normalized = raw.map((d) => ({
          ...d,
          zone: d.distanceKm <= 2 ? 'priority' : 'extended',
        }));
        setAllDemands(normalized);
      } catch {
        setError('Impossible de charger les demandes. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredDemands = allDemands.filter((d) => d.zone === activeTab);
  const tabsWithCount = TABS.map((t) => ({
    ...t,
    count: allDemands.filter((d) => d.zone === t.id).length,
  }));

  const handleAvailabilityToggle = async () => {
    const next = !isAvailable;
    setIsAvailable(next);
    try {
      await updateAvailability(next);
    } catch {
      setIsAvailable(!next);
    }
  };

  const handleApply = async (demandId) => {
    if (applyingId) return;
    setApplyingId(demandId);
    setError(null);
    setSuccessMsg(null);
    try {
      await applyToDemand(demandId);
      setAllDemands((prev) => prev.filter((d) => d.id !== demandId));
      setSuccessMsg('Candidature envoyée avec succès ! Le client sera notifié.');
    } catch {
      setError('Erreur lors de la postulation. Veuillez réessayer.');
    } finally {
      setApplyingId(null);
    }
  };

  const handleViewDetails = (demandId) => {
    console.log('[DemandesDisponibles] Voir détails →', demandId);
  };

  /* ── Bouton Filtrer avec tokens CSS ── */
  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          border: '1px solid var(--color-sl-200)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--color-sl-700)',
          background: 'white',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          transition: 'background 150ms ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-sl-50)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
      >
        <svg
          width="15" height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="11" y1="18" x2="13" y2="18"/>
        </svg>
        <span className="hidden sm:inline">Filtrer</span>
      </button>

      <AvailabilityToggle isAvailable={isAvailable} onToggle={handleAvailabilityToggle} />
    </div>
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--color-sl-50)' }}
    >
      <PageHeader
        title="Demandes disponibles"
        withDot = "true"
        subtitle="Demandes correspondant à vos compétences"
        actions={headerActions}
      />

      <TabBar tabs={tabsWithCount} activeId={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto" style={{ padding: '1rem 1.5rem' }}>

        {/* ── Bannière succès ── */}
        {successMsg && (
          <div style={{ marginBottom: '1rem' }}>
            <AlertBanner
              type="success"
              message={successMsg}
              onClose={() => setSuccessMsg(null)}
            />
          </div>
        )}

        {/* ── Bannière erreur ── */}
        {error && (
          <div style={{ marginBottom: '1rem' }}>
            <AlertBanner
              type="danger"
              message={error}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* ── Skeleton chargement ── */}
        {isLoading && (
          <SkeletonLoader
            variant="card"
            count={6}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          />
        )}

        {/* ── Grille des demandes ── */}
        {!isLoading && filteredDemands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDemands.map((demand) => (
              <DemandCard
                key={demand.id}
                demand={demand}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                isApplying={applyingId === demand.id}
              />
            ))}
          </div>
        )}

        {/* ── État vide ── */}
        {!isLoading && filteredDemands.length === 0 && !error && (
          <EmptyState
            title="Aucune demande disponible"
            subtitle={
              activeTab === 'priority'
                ? "Aucune demande dans votre zone prioritaire pour l'instant."
                : "Aucune demande dans les zones éloignées."
            }
            action={
              <Button
                variant="primary"
                size="md"
                          onClick={() => window.location.reload()}
        >
          Rafraîchir
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}