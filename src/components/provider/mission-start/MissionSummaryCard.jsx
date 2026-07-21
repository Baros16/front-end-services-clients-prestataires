// src/components/provider/mission-start/MissionSummaryCard.jsx
import { Card, StatusBadge, AmountDisplay, MapEmbed, Clock } from "../../commons";
import { formatDate } from "../../../utils/formatters";

export function MissionSummaryCard({ mission, className = "" }) {
  const showPaidBadge = mission.status === "en_attente" && mission.paymentStatus === "sequestre";
  const badgeVariant = showPaidBadge ? "paye_sequestre" : mission.status;

  return (
    <Card title={mission.category} className={className}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-[family-name:var(--font-display)] font-bold text-[18px] text-sl-900 m-0">
            {mission.title}
          </h2>
          <StatusBadge variant={badgeVariant} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.08em] text-sl-400 font-semibold">
              Montant
            </span>
            <AmountDisplay amount={mission.totalAmount} size="lg" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.08em] text-sl-400 font-semibold">
              Durée estimée
            </span>
            {mission.estimatedDurationHours ? (
              <span className="flex items-center gap-1 text-[16px] font-semibold text-sl-900">
                <Clock size={16} className="text-sl-400" />
                {mission.estimatedDurationHours} h
              </span>
            ) : (
              <span className="text-[13px] text-sl-400 italic">Non définie</span>
            )}
          </div>
        </div>

        {mission.startedAt && (
          <p className="text-[12px] text-sl-400 m-0">
            Démarrée le {formatDate(mission.startedAt)}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.08em] text-sl-400 font-semibold">
            Localisation de la mission
          </span>
          <MapEmbed
            lat={mission.location?.lat}
            lng={mission.location?.lng}
            label={mission.location?.address}
            interactive={false}
            height="180px"
          />
          <span className="text-[13px] text-sl-600">{mission.location?.address}</span>
        </div>
      </div>
    </Card>
  );
}