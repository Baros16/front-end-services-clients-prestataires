// src/components/provider/mission-start/MissionStepsForm.jsx
import { useState } from "react";
import { Card, Input, Button, AlertBanner, Plus, Trash2 } from "../../commons";



let localStepCounter = 0;
function newLocalStep() {
  localStepCounter += 1;
  return { localId: `local_${localStepCounter}`, label: "" };
}

export function MissionStepsForm({ onSubmit, loading = false, error = null, className = "" }) {
  const [estimatedDurationHours, setEstimatedDurationHours] = useState("");
  const [steps, setSteps] = useState([newLocalStep()]);
  const [validationError, setValidationError] = useState(null);

  function updateStepLabel(localId, label) {
    setSteps((prev) => prev.map((s) => (s.localId === localId ? { ...s, label } : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, newLocalStep()]);
  }

  function removeStep(localId) {
    setSteps((prev) => (prev.length > 1 ? prev.filter((s) => s.localId !== localId) : prev));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setValidationError(null);

    const duration = Number(estimatedDurationHours);
    if (!estimatedDurationHours || Number.isNaN(duration) || duration <= 0) {
      setValidationError("Indique une durée estimée valide (supérieure à 0).");
      return;
    }

    const cleanedSteps = steps
      .map((s, i) => ({ label: s.label.trim(), order: i + 1 }))
      .filter((s) => s.label.length > 0);

    if (cleanedSteps.length === 0) {
      setValidationError("Ajoute au moins une étape d'intervention.");
      return;
    }

    onSubmit({ estimatedDurationHours: duration, steps: cleanedSteps });
  }

  return (
    <Card title="Planifier l'intervention" className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <p className="text-[13px] text-sl-500 -mt-1 m-0">
          Avant de démarrer, définis la durée estimée et les étapes de ton intervention.
        </p>

        <Input
          label="Durée estimée (heures)"
          type="number"
          value={estimatedDurationHours}
          onChange={setEstimatedDurationHours}
          placeholder="Ex: 2"
          required
        />

        <div className="flex flex-col gap-3">
          <span className="text-[13px] font-medium text-sl-700">Étapes de l'intervention</span>

          {steps.map((step, index) => (
            <div key={step.localId} className="flex items-center gap-2">
              <span className="text-[13px] text-sl-400 w-5 shrink-0">{index + 1}.</span>
              <div className="flex-1">
                <Input
                  value={step.label}
                  onChange={(val) => updateStepLabel(step.localId, val)}
                  placeholder="Ex: Coupure eau principale"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStep(step.localId)}
                disabled={steps.length === 1}
                className="shrink-0 p-2 bg-transparent border-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed text-sl-400 hover:text-danger transition-colors"
                aria-label="Supprimer l'étape"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <Button type="button" variant="ghost" size="sm" onClick={addStep} className="self-start">
            <Plus size={14} />
            Ajouter une étape
          </Button>
        </div>

        {(validationError || error) && (
          <AlertBanner type="danger" message={validationError ?? error} />
        )}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Enregistrement..." : "Valider la planification"}
        </Button>
      </form>
    </Card>
  );
}