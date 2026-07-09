import { useState, useEffect } from "react";
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
  Check,
  Lock,
} from "../../components/commons";
import { getProviderDashboard, completeMission } from "../../services/providerService";
import { formatXAF } from "../../utils/formatters";

export default function TacheTerminee() {
  const [mission,   setMission]   = useState(null);
  const [steps,     setSteps]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [finishing, setFinishing] = useState(false);
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    getProviderDashboard()
      .then((d) => {
        const m = d.recentMissions[0];
        setMission(m);
        setSteps(m.steps);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completed = steps.filter((s) => s.completed).length;
  const total     = steps.length;
  const toutFait  = total > 0 && completed === total;

  const toggleStep = (id) =>
    setSteps(steps.map((s) => s.id === id ? { ...s, completed: !s.completed } : s));

  const handleTerminer = () => {
    setFinishing(true);
    completeMission(mission.id)
      .then(() => setDone(true))
      .catch(console.error)
      .finally(() => setFinishing(false));
  };

  if (loading || !mission) return null;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <PartyPopper size={52} strokeWidth={1.5} style={{ color: "var(--color-brand)" }} />
        <h2 className="font-[family-name:var(--font-display)] text-[22px] font-bold text-sl-900 m-0">
          Mission terminée !
        </h2>
        <p className="text-[14px] text-sl-500 text-center max-w-sm m-0">
          Le paiement séquestré sera libéré après validation du client.
        </p>
        <AmountDisplay amount={mission.sequesteredAmount} size="xl" variant="positive" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-sl-50">

      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-sl-200 bg-white">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
            Tâche terminée
          </h1>
          <p className="text-[13px] text-sl-500 m-0 mt-1">{mission.title}</p>
        </div>
        <StatusBadge variant="en_cours" />
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6 p-6 items-start">

        <div className="flex flex-col gap-4">

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
                    ${step.completed ? "bg-success" : "border-[2px] border-sl-300 bg-white"}`}>
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

          <Card title="Client">
            <div className="flex items-center gap-3">
              <Avatar initial="M" size="lg" />
              <div>
                <p className="text-[14px] font-bold text-sl-900 m-0">Madeleine Kamdem</p>
                <p className="text-[12px] text-sl-400 m-0 mt-[2px]">Client vérifié</p>
              </div>
            </div>
          </Card>

          <Card title="Paiement séquestré">
            <div className="flex flex-col gap-1">
              <AmountDisplay amount={mission.sequesteredAmount} size="lg" variant="positive" />
              <p className="text-[12px] text-sl-400 m-0">Libéré après validation du client</p>
            </div>
          </Card>

          <AlertBanner
            type="info"
            title="Séquestre actif"
            message="Le montant sera libéré automatiquement 48h après validation, ou immédiatement si le client confirme."
          />

        </div>
      </div>
    </div>
  );
}
