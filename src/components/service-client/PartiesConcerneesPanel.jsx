// src/components/service-client/PartiesConcerneesPanel.jsx
import { Avatar } from "../commons/Avatar";
import { RatingStars } from "../commons/RatingStars";

export default function PartiesConcerneesPanel({ client, provider }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-bold text-lg mb-3 uppercase">Parties concernées</h3>
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400 mb-2">
            Client
          </p>
          <div className="flex items-center gap-2">
            <Avatar initial={client.avatarInitial} name={client.name} size="md" />
            <div>
              <p className="text-sm font-semibold">{client.name}</p>
              <RatingStars value={client.rating} size="sm" />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400 mb-2">
            Prestataire
          </p>
          <div className="flex items-center gap-2">
            <Avatar initial={provider.avatarInitial} name={provider.name} size="md" />
            <div>
              <p className="text-sm font-semibold">{provider.name}</p>
              <RatingStars value={provider.rating} size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
