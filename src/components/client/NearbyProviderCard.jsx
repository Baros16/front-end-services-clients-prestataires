// src/components/client/NearbyProviderCard.jsx
import { Avatar, RatingStars, Card, Button, PriceDisplay, Badge } from "../commons";

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
    <Card noPadding className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-3">
        <Avatar
          initial={avatarInitial}
          name={fullName}
          size="lg"
          bgClass="bg-sl-200"
          className="text-sl-600"
        />
        <div>
          <p className="font-semibold text-sl-900">{fullName}</p>
          <div className="flex items-center gap-1">
            <RatingStars value={Math.floor(rating)} size="sm" />
            <span className="text-xs text-sl-500">{rating}</span>
          </div>
          <p className="text-xs text-sl-500">{specialty}</p>
        </div>
      </div>

      <div className="space-y-1 text-sm border-t border-sl-100 pt-2">
        <div className="flex justify-between">
          <span className="text-sl-500">Distance</span>
          <span className="font-bold text-sl-900">{distanceKm} km</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sl-500">Tarif horaire</span>
          <PriceDisplay amount={hourlyRate} size="sm" />
        </div>
      </div>

      {isAvailable ? (
        <Badge label="DISPONIBLE" variant="success" withDot className="self-start" />
      ) : (
        <Badge label="SOUS 30 MIN" variant="warning" className="self-start" />
      )}

      <Button
        variant="primary"
        onClick={() => onContact(id)}
        className="w-full bg-sl-900 hover:bg-sl-800"
      >
        Contacter
      </Button>
    </Card>
  );
}
