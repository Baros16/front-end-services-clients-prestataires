import { AmountDisplay, StatusBadge } from '../commons';

export function MissionInfoGrid({ mission }) {
  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-sl-400 mb-1">Mission confirmée · Paiement reçu</p>
          <h2 className="text-xl font-bold text-sl-900">{mission.title}</h2>
        </div>
        <StatusBadge label="SÉQUESTRÉE" variant="sequestre" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <InfoItem label="CLIENT"        value="Madeleine K." />
        <InfoItem label="MONTANT"       value={<AmountDisplay amount={mission.totalAmount} size="md" />} />
        <InfoItem label="DURÉE ESTIMÉE" value={`${mission.estimatedDurationHours}h`} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="bg-sl-50 rounded-lg p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-sl-400 mb-1">{label}</p>
      <div className="font-semibold text-sm text-sl-900">{value}</div>
    </div>
  );
}
