import { useState } from "react";
import { Card } from "../../components/commons/Card";
import { Button } from "../../components/commons/Button";
import { StatusBadge } from "../../components/commons/StatusBadge";
import { AmountDisplay } from "../../components/commons/AmountDisplay";
import { Avatar } from "../../components/commons/Avatar";
import { RatingStars } from "../../components/commons/RatingStars";
import { MapEmbed } from "../../components/commons/MapEmbed";
import { AlertBanner } from "../../components/commons/AlertBanner";
import PreDepartChecklist from "../../components/provider/PreDepartChecklist";
import mockData from "../../data/provider/mock_dashboard.json";

const mission = mockData.data.recentMissions[0];

const CHECKLIST = [
  { id: "materiaux", label: "Matériaux préparés",               checked: true  },
  { id: "outils",    label: "Outils chargés dans le véhicule",  checked: true  },
  { id: "adresse",   label: "Adresse client confirmée",          checked: false },
  { id: "telephone", label: "Téléphone chargé",                  checked: false },
];

export default function DemarrerMission() {
  const [checklist, setChecklist] = useState(CHECKLIST);
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);

  const toutCoche = checklist.every((i) => i.checked);

  const toggle = (id) =>
    setChecklist(checklist.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));

  const handleDemarrer = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <span className="text-[52px]">✅</span>
        <h2 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
          Mission démarrée !
        </h2>
        <p className="text-[14px] text-sl-500 m-0">
          Le client a été notifié. Bonne intervention !
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">

      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-sl-200 bg-white">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
            Missions en attente
          </h1>
          <p className="text-[13px] text-sl-500 m-0 mt-1">
            Missions payées, prêtes à démarrer
          </p>
        </div>
        <StatusBadge variant="disponible" />
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6 p-6 bg-sl-50 min-h-screen items-start">

        <div className="flex flex-col gap-4">

          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[12px] text-sl-400 m-0">
                    Mission confirmée · Paiement reçu
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-[18px] font-bold text-sl-900 m-0 mt-1">
                    {mission.title}
                  </h2>
                </div>
                <StatusBadge variant="paye_sequestre" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "CLIENT",        value: "Madeleine K." },
                  { label: "MONTANT",       value: null, amount: mission.totalAmount },
                  { label: "DURÉE ESTIMÉE", value: `${mission.estimatedDurationHours} heures` },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="flex flex-col gap-1 bg-sl-50 rounded-[var(--radius-md)] p-3"
                  >
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-sl-400">
                      {info.label}
                    </span>
                    {info.amount !== undefined ? (
                      <AmountDisplay amount={info.amount} size="md" variant="positive" />
                    ) : (
                      <span className="text-[14px] font-bold text-sl-900">{info.value}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-sl-400">
                  LOCALISATION DE LA MISSION
                </span>
                <MapEmbed
                  address={mission.location.address}
                  label={`📍 Adresse : ${mission.location.address}`}
                  height="220px"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold text-sl-700 m-0">
                Prêt à commencer l'intervention ?
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleDemarrer}
                disabled={!toutCoche || loading}
                className="w-full justify-center"
              >
                {loading ? "Démarrage en cours..." : "▶ Démarrer la mission maintenant"}
              </Button>
              <p className="text-[11px] text-sl-400 text-center m-0">
                {toutCoche
                  ? "Le client sera notifié et l'heure de début enregistrée"
                  : "⚠ Complétez la checklist avant de démarrer"}
              </p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">

          <Card title="Client">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar initial="M" size="lg" />
                <div>
                  <p className="text-[14px] font-bold text-sl-900 m-0">Madeleine Kamdem</p>
                  <RatingStars value={4.2} size="sm" />
                  <p className="text-[12px] text-sl-400 m-0 mt-[2px]">
                    3 missions · Client vérifié
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-center">
                💬 Contacter le client
              </Button>
            </div>
          </Card>

          <Card title="Checklist avant départ">
            <PreDepartChecklist items={checklist} onToggle={toggle} />
          </Card>

          <AlertBanner
            variant="info"
            title="🔒 Rappel séquestre"
            message={`${mission.sequesteredAmount.toLocaleString("fr-FR")} XAF séquestrés. Libération après double validation.`}
          />

        </div>
      </div>
    </div>
  );
}
