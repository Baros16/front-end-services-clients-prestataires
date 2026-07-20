// src/pages/provider/DemandesDisponibles.jsx
import { useState, useEffect } from 'react';
import { PageHeader } from '../../components/commons/PageHeader';
import { TabBar } from '../../components/commons/TabBar';
import { AlertBanner } from '../../components/commons/AlertBanner';
import { EmptyState } from '../../components/commons/EmptyState';
import { SkeletonLoader } from '../../components/commons/SkeletonLoader';
import { DemandCard } from '../../components/provider/demandedisponible/DemandCard';
import { Button } from '../../components/commons/Button';
import { AvailabilityToggle } from "../../components/commons/AvailabilityToggle";
import { SortMenu } from '../../components/provider/demandedisponible/SortMenu';
import { sortDemands } from '../../components/provider/demandedisponible/sortUtils';
import { getAvailableDemands, applyToDemand, updateAvailability } from '../../services/providerService';

const TABS = [
  { id: 'priority', label: 'Zone prioritaire' },
  { id: 'extended', label: 'Zones éloignées' },
];

export default function DemandesDisponibles() {
  const [allDemands, setAllDemands]   = useState([]);
  const [isLoading, setIsLoading]     = useState(true);
  const [error, setError]             = useState(null); 
  const [feedback, setFeedback]       = useState(null); 
  const [activeTab, setActiveTab]     = useState('priority');
  const [isAvailable, setIsAvailable] = useState(true);
  const [applyingId, setApplyingId]   = useState(null);
  const [activeSort, setActiveSort]   = useState('recent');

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

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  const filteredDemands = sortDemands(
    allDemands.filter((d) => d.zone === activeTab),
    activeSort
  );

  const tabsWithCount = TABS.map((t) => ({
    ...t,
    count: allDemands.filter((d) => d.zone === t.id).length,
  }));

  const handleAvailabilityToggle = async (next) => {
    setIsAvailable(next);
    try {
      await updateAvailability(next);
    } catch {
      setIsAvailable(!next);
      setError('Impossible de mettre à jour votre disponibilité. Veuillez réessayer.');
    }
  };

  const handleApply = async (demandId) => {
    if (applyingId) return;
    setApplyingId(demandId);
    setFeedback(null);
    try {
      const res = await applyToDemand(demandId);
      setFeedback({
        demandId,
        type: 'success',
        message: res?.message ?? 'Candidature envoyée avec succès ! Le client sera notifié.',
      });
      setTimeout(() => {
        setAllDemands((prev) => prev.filter((d) => d.id !== demandId));
      }, 1800);
    } catch {
      setFeedback({
        demandId,
        type: 'danger',
        message: 'Erreur lors de la postulation. Veuillez réessayer.',
      });
    } finally {
      setApplyingId(null);
    }
  };

  const handleViewDetails = (demandId) => {
    console.log('[DemandesDisponibles] Voir détails →', demandId);
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <SortMenu activeSort={activeSort} onSortChange={setActiveSort} />
      <AvailabilityToggle isAvailable={isAvailable} onChange={handleAvailabilityToggle} />
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--color-sl-50)' }}>
      <PageHeader
        title="Demandes disponibles"
        withDot="true"
        subtitle="Demandes correspondant à vos compétences"
        actions={headerActions}
        className="mb-4"
      />

      <TabBar tabs={tabsWithCount} activeId={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto" style={{ padding: '1rem 1.5rem' }}>

        {error && (
          <div style={{ marginBottom: '1rem' }}>
            <AlertBanner
              type="danger"
              message={error}
              onClose={() => setError(null)}
              size="sm"
              className="max-w-sm"
            />
          </div>
        )}

        {isLoading && (
          <SkeletonLoader
            variant="card"
            count={6}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          />
        )}

        {!isLoading && filteredDemands.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDemands.map((demand) => (
              <DemandCard
                key={demand.id}
                demand={demand}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                isApplying={applyingId === demand.id}
                feedback={feedback?.demandId === demand.id ? feedback : null}
                onDismissFeedback={() => setFeedback(null)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredDemands.length === 0 && !error && (
          <EmptyState
            title="Aucune demande disponible"
            subtitle={
              activeTab === 'priority'
                ? "Aucune demande dans votre zone prioritaire pour l'instant."
                : "Aucune demande dans les zones éloignées."
            }
            action={
              <Button variant="primary" size="md" onClick={() => window.location.reload()}>
                Rafraîchir
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}