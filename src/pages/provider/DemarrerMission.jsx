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
  SkeletonLoader,
  EmptyState,
  FileX,
  AlertBanner,
  CheckCircle,
  PlayCircle,
  MessageCircle,
  AlertTriangle,
  Lock,
  MapPin,
  PageHeader,
} from "../../components/commons";
import { getProviderDashboard, startMission } from "../../services/providerService";
import PreDepartChecklist from "../../components/provider/PreDepartChecklist";
import ClientCard from "../../components/provider/ClientCard";
import SequestreInfo from "../../components/provider/SequestreInfo";
import SuccessScreen from "../../components/provider/SuccessScreen";

const CHECKLIST = [
  { id: "materiaux", label: "Matériaux préparés",               checked: true  },
  { id: "outils",    label: "Outils chargés dans le véhicule",  checked: true  },
  { id: "adresse",   label: "Adresse client confirmée",          checked: false },
  { id: "telephone", label: "Téléphone chargé",                  checked: false },
];

export default function DemarrerMission() {
  const navigate = useNavigate();
  const [mission,   setMission]   = useState(null);
  const [checklist, setChecklist] = useState(CHECKLIST);
  const [loading,   setLoading]   = useState(true);
  const [starting,  setStarting]  = useState(false);
  const [done,      setDone]      = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchMission = async () => {
    try {
      const d = await getProviderDashboard();
      setMission(d.recentMissions?.[0] || null);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les informations de la mission.");
    } finally {
      setLoading(false);
    }
  };

  fetchMission();
}, []);

  const toutCoche = checklist.every((i) => i.checked);

  const toggle = (id) =>
    setChecklist(checklist.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));

const handleDemarrer = async () => {
  setStarting(true);

  try {
    await startMission(mission.id);
    setDone(true);
  } catch (err) {
    console.error(err);
  } finally {
    setStarting(false);
  }
};

  if (loading) {
  return <SkeletonLoader variant="card" count={2} />;
}

if (error) {
  return (
    <AlertBanner
      type="danger"
      title="Erreur"
      message={error}
    />
  );
}

if (!mission) {
  return (
    <EmptyState
      icon={<FileX size={40} />}
      title="Aucune mission"
      subtitle="Aucune mission disponible."
    />
  );
}

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <CheckCircle
  size={52}
  strokeWidth={1.5}
  className="text-[var(--color-success)]"
/>
        <h2 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
          Mission démarrée !
        </h2>
        <p className="text-[14px] text-sl-500 m-0">Le client a été notifié. Bonne intervention !</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-sl-50">

      <PageHeader
  title="Missions en attente"
  subtitle="Missions payées, prêtes à démarrer"
  badge={<StatusBadge variant="disponible" />}
/>

      <div className="grid grid-cols-[1fr_340px] gap-6 p-6 items-start">

        <div className="flex flex-col gap-4">

          <Card>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <SuccessScreen
  icon={
    <CheckCircle
      size={52}
      strokeWidth={1.5}
      style={{ color: "var(--color-success)" }}
    />
  }
  title="Mission démarrée !"
  message="Le client a été notifié. Bonne intervention !"
/>
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
                  label={<span className="flex items-center gap-1"><MapPin size={14} /> Adresse : {mission.location.address}</span>}
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

          <ClientCard
  showContact
  onContact={() => navigate("/provider/chat")}
/>

          <Card title="Checklist avant départ">
            <PreDepartChecklist items={checklist} onToggle={toggle} />
          </Card>

          <SequestreInfo amount={mission.sequesteredAmount} />

        </div>
      </div>
    </div>
  );
}
