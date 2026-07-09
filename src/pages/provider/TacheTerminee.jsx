import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  StatusBadge,
  AmountDisplay,
  Avatar,
  ProgressBar,
  AlertBanner,
  CheckCircle,
  PartyPopper,
  Lock,
  SkeletonLoader,
  EmptyState,
  FileX,
  PageHeader,
} from "../../components/commons";
import ClientCard from "../../components/provider/ClientCard";
import { getProviderDashboard, completeMission } from "../../services/providerService";
import PreDepartChecklist from "../../components/provider/PreDepartChecklist";
import SuccessScreen from "../../components/provider/SuccessScreen";
export default function TacheTerminee() {
<<<<<<< Updated upstream
  const [mission,  setMission]  = useState(null);
  const [steps,    setSteps]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [finishing,setFinishing]= useState(false);
  const [done,     setDone]     = useState(false);
=======
  const navigate = useNavigate();
  const [mission,   setMission]   = useState(null);
  const [steps,     setSteps]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error, setError] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [done,      setDone]      = useState(false);
>>>>>>> Stashed changes

  useEffect(() => {
  getProviderDashboard()
    .then((d) => {
      const m = d.recentMissions?.[0] || null;

      setMission(m);
      setSteps(m?.steps || []);
    })
    .catch((err) => {
      console.error(err);
      setError("Impossible de charger les informations de la mission.");
    })
    .finally(() => setLoading(false));
}, []);

  const completed = steps.filter((s) => s.completed).length;
  const total     = steps.length;
  const toutFait  = completed === total;

  const toggleStep = (id) =>
    setSteps(steps.map((s) => s.id === id ? { ...s, completed: !s.completed } : s));

  const handleTerminer = () => {
    setFinishing(true);
    completeMission(mission.id)
      .then(() => setDone(true))
      .catch(console.error)
      .finally(() => setFinishing(false));
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
      subtitle="Aucune mission terminable n'est disponible."
    />
  );
}

if (done) {
  return (
    <SuccessScreen
      icon={
        <PartyPopper
          size={52}
          strokeWidth={1.5}
          style={{ color: "var(--color-brand)" }}
        />
      }
      title="Mission terminée !"
      message="Le paiement séquestré sera libéré après validation du client."
    >
      <AmountDisplay
        amount={mission.sequesteredAmount}
        size="xl"
        variant="positive"
      />
    </SuccessScreen>
  );
}
  return (
    <div className="flex flex-col gap-0 min-h-screen bg-sl-50">

<<<<<<< Updated upstream
      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-sl-200 bg-sl-0">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
            Tâche terminée
          </h1>
          <p className="text-[13px] text-sl-500 m-0 mt-1">{mission.title}</p>
        </div>
        <StatusBadge variant="en_cours" withDot />
      </div>
=======
      <PageHeader
  title="Tâche terminée"
  subtitle={mission.title}
  badge={<StatusBadge variant="en_cours" />}
/>
>>>>>>> Stashed changes

      <div className="grid grid-cols-[1fr_320px] gap-6 p-6 items-start">

        <div className="flex flex-col gap-4">

<<<<<<< Updated upstream
          <Card title="Étapes de la mission">
            <div className="mb-4">
              <ProgressBar value={completed} max={total} label={`${completed} / ${total} étapes complétées`} />
            </div>
            <div className="flex flex-col gap-2">
              {[...steps].sort((a, b) => a.order - b.order).map((step) => (
                <div
                  key={step.id}
                  onClick={() => toggleStep(step.id)}
                  className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] cursor-pointer transition-colors duration-150
                    ${step.completed ? "bg-success-light" : "bg-sl-50 hover:bg-sl-100"}`}
                >
                  <div className={`w-5 h-5 min-w-[20px] rounded-md flex items-center justify-center transition-all duration-150
                    ${step.completed ? "bg-success" : "border-[2px] border-sl-300 bg-sl-0"}`}>
                    {step.completed && <Check size={12} style={{ color: "white" }} />}
                  </div>
                  <span className={`text-[13px] font-medium flex-1 transition-all duration-150
                    ${step.completed ? "text-success line-through" : "text-sl-700"}`}>
                    {step.label}
                  </span>
                  <span className="text-[11px] text-sl-300">#{step.order}</span>
                </div>
              ))}
            </div>
          </Card>
=======
<Card title="Étapes de la mission">
  <div className="mb-4">
    <ProgressBar
      value={completed}
      max={total}
      label={`${completed} / ${total} étapes complétées`}
    />
  </div>
>>>>>>> Stashed changes

  <PreDepartChecklist
  items={
    [...steps]
      .sort((a, b) => a.order - b.order)
      .map((step) => ({
        id: step.id,
        label: step.label,
        checked: step.completed,
      }))
  }
  onToggle={toggleStep}
/>
</Card>
          {!toutFait && (
            <AlertBanner
              type="warning"
              title="Étapes incomplètes"
              message="Cochez toutes les étapes avant de déclarer la mission terminée."
            />
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleTerminer}
            disabled={!toutFait || finishing}
            className="w-full justify-center"
          >
            <CheckCircle size={16} />
            {finishing ? "Traitement en cours..." : "Déclarer la mission terminée"}
          </Button>
        </div>

        <div className="flex flex-col gap-4">

        <ClientCard
  showContact
  onContact={() => navigate("/provider/chat")}
/>

          <Card title="Paiement séquestré">
            <div className="flex flex-col gap-1">
              <AmountDisplay amount={mission.sequesteredAmount} size="lg" variant="positive" />
              <p className="text-[12px] text-sl-400 m-0">Libéré après validation du client</p>
            </div>
          </Card>

          <AlertBanner
            type="info"
            title={<span className="flex items-center gap-1"><Lock size={14} /> Séquestre actif</span>}
            message="Le montant sera libéré automatiquement 48h après validation, ou immédiatement si le client confirme."
          />

        </div>
      </div>
    </div>
  );
}
