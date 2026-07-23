// src/pages/provider/DemandesDisponibles.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  PageHeader,
  TabBar,
  AlertBanner,
  EmptyState,
  SkeletonLoader,
  Button,
  AvailabilityToggle,
  Toast,
} from '../../components/commons';

import { DemandCard }  from '../../components/provider/demandedisponible/DemandCard';
import { SortMenu }    from '../../components/provider/demandedisponible/SortMenu';
import { sortDemands } from '../../components/provider/demandedisponible/sortUtils';
import { updateAvailability } from '../../services/providerService';
import { useAvailableDemands } from '../../hooks/useAvailableDemands';
import { useGeolocation } from '../../hooks/useGeolocation';

const TABS = [
  { id: 'priority', label: 'Zone prioritaire' },
  { id: 'extended', label: 'Zones éloignées' },
];

export default function DemandesDisponibles() {
  const navigate = useNavigate();

  // ── Position du prestataire — transmise au hook pour calculer distance/zone ──
  const { lat: providerLat, lng: providerLng } = useGeolocation({ autoRequest: true });

  const {
    demands,
    loading,
    error,
    applyingId,
    refetch,
    apply,
    toast,
    dismissToast,
  } = useAvailableDemands(providerLat, providerLng);

   const isLocating = providerLat == null || providerLng == null;
   const isLoading = loading || isLocating;

  // ── UI state uniquement ────────────────────────────────────────────────
  const [feedback,     setFeedback]     = useState(null);
  const [activeTab,    setActiveTab]    = useState('priority');
  const [isAvailable,  setIsAvailable]  = useState(true);
  const [activeSort,   setActiveSort]   = useState('recent');

  // Auto-dismiss du feedback par carte
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const filteredDemands = sortDemands(
    demands.filter((d) => d.zone === activeTab),
    activeSort
  );

  const tabsWithCount = TABS.map((t) => ({
    ...t,
    count: demands.filter((d) => d.zone === t.id).length,
  }));

  const handleAvailabilityToggle = async (next) => {
    setIsAvailable(next);
    try {
      await updateAvailability(next);
    } catch {
      setIsAvailable(!next);
    }
  };

  const handleApply = async (demandId) => {
    const result = await apply(demandId);
    if (result) setFeedback({ demandId, ...result });
  };

  const handleViewDetails = (demandId) => {
    navigate(`/provider/demandes/${demandId}`);
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <SortMenu activeSort={activeSort} onSortChange={setActiveSort} />
      <AvailabilityToggle isAvailable={isAvailable} onChange={handleAvailabilityToggle} />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-sl-50">
      <PageHeader
        title="Demandes disponibles"
        subtitle="Demandes correspondant à vos compétences"
        actions={headerActions}
        className="mb-4"
      />

      <TabBar tabs={tabsWithCount} activeId={activeTab} onChange={setActiveTab} />

      <div className="flex-1 overflow-y-auto py-4 px-6">
        {error && (
          <div className="mb-4">
            <AlertBanner variant="error" message={error} />
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonLoader key={i} variant="card" />
            ))}
          </div>
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
            description={
              activeTab === 'priority'
                ? "Aucune demande dans votre zone prioritaire pour l'instant."
                : "Aucune demande dans les zones éloignées."
            }
            action={
              <Button variant="primary" size="md" onClick={refetch}>
                Rafraîchir
              </Button>
            }
          />
        )}
      </div>

      {/* Toast global — erreurs d'action remontées par le hook (aligné useChat) */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      )}
    </div>
  );
}