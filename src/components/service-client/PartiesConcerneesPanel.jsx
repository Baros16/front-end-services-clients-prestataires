// src/components/service-client/PartiesConcerneesPanel.jsx
import { Card } from "../commons/Card";
import { Avatar } from "../commons/Avatar";
import { RatingStars } from "../commons/RatingStars";

export default function PartiesConcerneesPanel({ client, provider }) {
  return (
    <Card title="Parties concernées">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400 mb-2">
            Client
          </p>
          <div className="flex items-center gap-2">
            <Avatar initial={client.avatarInitial} name={client.name} size="md" />
            <div>
              <p className="text-sm font-semibold">{client.name}</p>
              <div className="flex items-center gap-1"><RatingStars value={Math.floor(client.rating)} size="sm" /><span className="text-xs text-gray-500">{client.rating}</span></div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-gray-400 mb-2">
            Prestataire
          </p>
          <div className="flex items-center gap-2">
            <Avatar initial={provider.avatarInitial} name={provider.name} size="md" />
            <div>
              <p className="text-sm font-semibold">{provider.name}</p>
              <div className="flex items-center gap-1"><RatingStars value={Math.floor(provider.rating)} size="sm" /><span className="text-xs text-gray-500">{provider.rating}</span></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
