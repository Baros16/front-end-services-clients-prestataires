import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  StatusBadge,
  AmountDisplay,
  Avatar,
  RatingStars,
  MapEmbed,
  AlertBanner,
  CheckCircle,
  PlayCircle,
  MessageCircle,
  AlertTriangle,
  Lock,
  MapPin,
} from "../../components/commons";
import { PreDepartChecklist } from "../../components/provider/PreDepartChecklist";
import { getProviderDashboard, startMission } from "../../services/providerService";
import { formatXAF } from "../../utils/formatters";

const CHECKLIST = [
  { id: "materiaux", label: "Matériaux préparés",              checked: true  },
  { id: "outils",    label: "Outils chargés dans le véhicule", checked: true  },
  { id: "adresse",   label: "Adresse client confirmée",         checked: false },
  { id: "telephone", label: "Téléphone chargé",                 checked: false },
];

export default function DemarrerMission() {
  const navigate = useNavigate();
  const [mission,   setMission]   = useState(null);
  const [checklist, setChecklist] = useState(CHECKLIST);
  const [loading,   setLoading]   = useState(true);
  const [starting,  setStarting]  = useState(false);
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then((d) => setMission(d.recentMissions[0]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toutCoche = checklist.every((i) => i.checked);

  const toggle = (id) =>
    setChecklist(checklist.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));

  const handleDemarrer = () => {
    setStarting(true);
    startMission(mission.id)
      .then(() => setDone(true))
      .catch(console.error)
      .finally(() => setStarting(false));
  };

  if (loading || !mission) return null;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <CheckCircle size={52} strokeWidth={1.5} style={{ color: "var(--color-success)" }} />
        <h2 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
          Mission démarrée !
        </h2>
        <p className="text-[14px] text-sl-500 m-0">Le client a été notifié. Bonne intervention !</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-sl-50">

      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-sl-200 bg-white">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
            Missions en attente
          </h1>
          <p className="text-[13px] text-sl-500 m-0 mt-1">Missions payées, prêtes à démarrer</p>
        </div>
        <StatusBadge variant="disponible" />
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6 p-6 items-start">

        <div className="flex flex-col gap-4">

          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[12px] text-sl-400 m-0">Mission confirmée · Paiement reçu</p>
                  <h2 className="font-[family-name:var(--font-display)] text-[18px] font-bold text-sl-900 m-0 mt-1">
                    {mission.title}
                  </h2>
                </div>
                <StatusBadge variant="paye_sequestre" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "CLIENT",        node: <span className="text-[14px] font-bold text-sl-900">Madeleine K.</span> },
                  { label: "MONTANT",       node: <AmountDisplay amount={mission.totalAmount} size="md" variant="positive" /> },
                  { label: "DURÉE ESTIMÉE", node: <span className="text-[14px] font-bold text-sl-900">{mission.estimatedDurationHours} heures</span> },
                ].map((info) => (
                  <div key={info.label} className="flex flex-col gap-1 bg-sl-50 rounded-[var(--radius-md)] p-3">
                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-sl-400">{info.label}</span>
                    {info.node}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-sl-400">
                  LOCALISATION DE LA MISSION
                </span>
                <MapEmbed
                  address={mission.location.address}
                  label={mission.location.address}
                  height="200px"
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold text-sl-700 m-0">Prêt à commencer l'intervention ?</p>
              <Button
                variant="primary"
                size="lg"
                onClick={handleDemarrer}
                disabled={!toutCoche || starting}
                className="w-full justify-center"
              >
                <PlayCircle size={16} />
                {starting ? "Démarrage en cours..." : "Démarrer la mission maintenant"}
              </Button>
              {!toutCoche && (
                <p className="text-[11px] text-sl-400 text-center m-0 flex items-center justify-center gap-1">
                  <AlertTriangle size={14} />
                  Complétez la checklist avant de démarrer
                </p>
              )}
              {toutCoche && (
                <p className="text-[11px] text-sl-400 text-center m-0">
                  Le client sera notifié et l'heure de début enregistrée
                </p>
              )}
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
                  <p className="text-[12px] text-sl-400 m-0 mt-[2px]">3 missions · Client vérifié</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                onClick={() => navigate("/provider/chat")}
              >
                <MessageCircle size={16} />
                Contacter le client
              </Button>
            </div>
          </Card>

          <Card title="Checklist avant départ">
            <PreDepartChecklist items={checklist} onToggle={toggle} />
          </Card>

          <AlertBanner
            type="info"
            title="Rappel séquestre"
            message={`${formatXAF(mission.sequesteredAmount)} séquestrés. Libération après double validation.`}
          />

        </div>
      </div>
    </div>
  );
}