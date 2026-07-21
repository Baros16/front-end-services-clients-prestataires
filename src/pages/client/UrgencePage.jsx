// src/pages/client/UrgencyPage.jsx
import { useState, useEffect } from "react";
import { PageHeader, StatusBadge, SkeletonLoader, AlertBanner, EmptyState } from "../../components/commons";
import UrgencyBanner from "../../components/client/UrgencyBanner";
import NearbyProviderCard from "../../components/client/NearbyProviderCard";
import { getUrgencyProviders, getUrgencyContext } from "../../services/clientService";
import { useNavigate } from "react-router-dom";

export default function UrgencyPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [urgencyContext, setUrgencyContext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getUrgencyProviders(), getUrgencyContext()])
      .then(([providersResult, contextResult]) => {
        setProviders(providersResult.data ?? providersResult);
        setUrgencyContext(contextResult);
      })
      .catch((err) => {
        console.error('[UrgencyPage]', err);
        setError('Impossible de charger le mode urgence. Vérifiez votre connexion.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleContact = (providerId) => {
    navigate(`/client/urgence/contact?providerId=${providerId}`);
  };

  if (loading) return <SkeletonLoader variant="card" count={3} />;
  if (error) return <AlertBanner variant="error" message={error} />;
  if (!providers.length) return (
    <EmptyState
      title="Aucun prestataire disponible"
      description="Aucun prestataire n'est disponible dans votre zone pour le moment."
    />
  );

  return (
    <div>
      <PageHeader
        title="Mode urgence"
        subtitle="Trouvez un prestataire immediatement"
        actions={
          <StatusBadge variant="urgent" label="Urgence active" withDot />
        }
      />

      <div className="p-6 space-y-6">
        {urgencyContext && (
          <UrgencyBanner
            category={urgencyContext.category}
            description={urgencyContext.description}
            location={urgencyContext.location}
            countdownSeconds={urgencyContext.countdownSeconds}
          />
        )}

        <p className="text-xs font-bold text-sl-500 uppercase tracking-[0.08em]">
          Prestataires disponibles a proximite
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <NearbyProviderCard
              key={provider.id}
              provider={provider}
              onContact={handleContact}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
