// src/components/client/NearbyProviderCard.jsx
export default function NearbyProviderCard({ provider, onContact }) {
  const isAvailable = provider.availability === 'available';

  return (
    <div className="border rounded-lg p-4 bg-white flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {provider.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{provider.name}</p>
          <p className="text-xs text-gray-500">{provider.specialty}</p>
        </div>
      </div>

      <p className="text-sm">⭐ {provider.rating} · {provider.distanceKm} km</p>
      <p className="text-sm font-semibold">{provider.hourlyRate} FCFA/h</p>

      <span
        className={`text-xs font-bold px-2 py-1 rounded-full self-start ${
          isAvailable ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        }`}
      >
        {isAvailable ? 'DISPONIBLE' : 'SOUS 30 MIN'}
      </span>

      <button
        type="button"
        onClick={() => onContact(provider.id)}
        className="bg-blue-600 text-white py-2 rounded mt-2"
      >
        Contacter →
      </button>
    </div>
  );
}
