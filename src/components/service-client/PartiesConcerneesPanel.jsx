// src/components/service-client/PartiesConcerneesPanel.jsx
import { Card } from "../commons/Card";
import { Avatar } from "../commons/Avatar";
import { RatingStars } from "../commons/RatingStars";

function PartyRow({ label, party, bgClass }) {
  return (
    <div>
      <p className="text-xs text-sl-500 mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <Avatar initial={party.avatarInitial} name={party.name} size="md" bgClass={bgClass} className="!text-slate-700" />
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
    <Card title="Parties concernées">
      <div className="flex flex-col gap-4">
        <PartyRow label="Client" party={client} bgClass="bg-blue-200" />
        <div className="border-t border-sl-100" />
        <PartyRow label="Prestataire" party={provider} bgClass="bg-emerald-200" />
      </div>
    </Card>
  );
}
