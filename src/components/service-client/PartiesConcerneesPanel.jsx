// src/components/service-client/PartiesConcerneesPanel.jsx
import { Card, Avatar, RatingStars } from "../commons";

function PartyRow({ label, party, bgClass }) {
  return (
    <div>
      <p className="text-xs text-sl-500 mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <Avatar initial={party.avatarInitial} name={party.name} size="md" bgClass={bgClass} className="text-sl-700" />
        <div>
          <p className="text-sm font-semibold text-sl-900">{party.name}</p>
          <div className="flex items-center gap-1">
            <RatingStars value={Math.floor(party.rating)} size="sm" />
            <span className="text-xs text-sl-500">{party.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartiesConcerneesPanel({ client, provider }) {
  return (
    <Card title="Parties concernees">
      <div className="flex flex-col gap-4">
        <PartyRow label="Client" party={client} bgClass="bg-info-light" />
        <div className="border-t border-sl-100" />
        <PartyRow label="Prestataire" party={provider} bgClass="bg-success-light" />
      </div>
    </Card>
  );
}
