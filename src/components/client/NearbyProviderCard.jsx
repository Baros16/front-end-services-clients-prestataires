// src/components/client/NearbyProviderCard.jsx
import { Avatar } from "../commons/Avatar";
import { RatingStars } from "../commons/RatingStars";
import { Button } from "../commons/Button";

export default function NearbyProviderCard({ provider, onContact }) {
  const {
    id,
    fullName,
    avatarInitial,
    specialty,
    rating,
    hourlyRate,
    distanceKm,
    isAvailable,
  } = provider;

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-3">
        <Avatar
          initial={avatarInitial}
          name={fullName}
          size="lg"
          bgClass="bg-gray-200"
          className="!text-gray-600"
        />
        <div>
          <p className="font-semibold text-gray-900">{fullName}</p>
          <div className="flex items-center gap-1">
            <RatingStars value={Math.floor(rating)} size="sm" />
            <span className="text-xs text-gray-500">{rating}</span>
          </div>
          <p className="text-xs text-gray-500">{specialty}</p>
        </div>
      </div>

      <div className="space-y-1 text-sm border-t border-gray-100 pt-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Distance</span>
          <span className="font-bold">{distanceKm} km</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Tarif horaire</span>
          <span className="font-bold">{hourlyRate.toLocaleString("fr-FR")} XAF/h</span>
        </div>
      </div>

      {isAvailable ? (
        <span className="inline-flex items-center gap-1 self-start px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          DISPONIBLE
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 self-start px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
          SOUS 30 MIN
        </span>
      )}

      <Button
        variant="primary"
        fullWidth
        onClick={() => onContact(id)}
        className="!bg-black hover:!bg-gray-900"
      >
        Contacter →
      </Button>
    </div>
  );
}
