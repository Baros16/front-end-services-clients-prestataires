// src/pages/client/UrgencyPage.jsx
import UrgencyBanner from '../../components/client/UrgencyBanner';
import NearbyProviderCard from '../../components/client/NearbyProviderCard';
import { mockNearbyProviders, mockUrgencyContext } from '../../data/client/mockNearbyProviders';
export default function UrgencyPage() {
  const handleContact = (providerId) => {
    console.log('Contact du prestataire :', providerId);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mode Urgence</h1>
        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          URGENCE ACTIVE
        </span>
      </div>

      <UrgencyBanner
        category={mockUrgencyContext.category}
        description={mockUrgencyContext.description}
        location={mockUrgencyContext.location}
        countdownSeconds={mockUrgencyContext.countdownSeconds}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockNearbyProviders.map((provider) => (
          <NearbyProviderCard
            key={provider.id}
            provider={provider}
            onContact={handleContact}
          />
        ))}
      </div>
    </div>
  );
}
