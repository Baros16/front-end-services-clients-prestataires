// src/pages/client/UrgencyPage.jsx
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/commons/PageHeader";
import { StatusBadge } from "../../components/commons/StatusBadge";
import UrgencyBanner from "../../components/client/UrgencyBanner";
import NearbyProviderCard from "../../components/client/NearbyProviderCard";
import providersData from "../../data/client/mock_providers_search.json";
import { mockUrgencyContext } from "../../data/client/mockNearbyProviders";

export default function UrgencyPage() {
  const providers = providersData.data;
  const navigate = useNavigate();

  const handleContact = (providerId) => {
    navigate(`/client/urgence/contact?providerId=${providerId}`);
  };

  return (
    <div>
      <PageHeader
        title="Mode urgence"
        subtitle="Trouvez un prestataire immediatement"
        actions={
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-300 text-red-600 text-xs font-bold uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Urgence active
          </span>
        }
      />

      <div className="p-6 space-y-6">
        <UrgencyBanner
          category={mockUrgencyContext.category}
          description={mockUrgencyContext.description}
          location={mockUrgencyContext.location}
          countdownSeconds={mockUrgencyContext.countdownSeconds}
        />

        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.08em]">
          Prestataires disponibles a proximite
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
