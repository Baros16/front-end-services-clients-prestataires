// src/components/provider/mission-start/MissionStepsChecklist.jsx
import { Card, ProgressBar, Check } from "../../commons";

export function MissionStepsChecklist({
  steps,
  onToggleStep,
  updatingStepId = null,
  className = "",
}) {
  const total = steps.length;
  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <Card title="Étapes de l'intervention" className={className}>
      <div className="flex flex-col gap-4">
        <ProgressBar value={completedCount} max={total} label={`${completedCount} / ${total} étapes`} />

        <ul className="flex flex-col gap-3 list-none m-0 p-0">
          {[...steps]
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((step) => {
              const isUpdating = updatingStepId === step.id;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => !isUpdating && onToggleStep(step.id, !step.completed)}
                    disabled={isUpdating}
                    className="flex items-center gap-3 w-full text-left bg-transparent border-none cursor-pointer p-0 disabled:opacity-50 disabled:cursor-wait"
                  >
                    <span
                      className={`
                        flex items-center justify-center shrink-0 w-5 h-5 rounded-[6px]
                        border-[1.5px] transition-colors duration-150
                        ${step.completed ? "bg-success border-success" : "bg-white border-sl-300"}
                      `}
                    >
                      {step.completed && <Check size={14} strokeWidth={3} className="text-white" />}
                    </span>
                    <span
                      className={`text-[14px] font-[family-name:var(--font-body)] transition-colors duration-150 ${
                        step.completed ? "text-sl-400 line-through" : "text-sl-700"
                      }`}
                    >
                      {step.label}
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </Card>
  );
}