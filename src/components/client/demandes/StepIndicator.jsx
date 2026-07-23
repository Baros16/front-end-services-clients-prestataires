// src/components/client/demand/StepIndicator.jsx
import { Check } from '../../commons';

/**
 * StepIndicator — Indicateur de progression multi-étapes
 * Props:
 *   steps: Array<{ number: number; label: string }>
 *   currentStep: number (1-based)
 *   completedSteps?: Set<number> | number[]  — étapes cochées manuellement
 *     (ex: après une action validée). Si absent, une étape est cochée
 *     automatiquement dès que step.number < currentStep.
 */
export function StepIndicator({ steps, currentStep, completedSteps }) {
  const completedSet = completedSteps ? new Set(completedSteps) : null;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-[420px]">
        {steps.map((step, index) => {
          const isCompleted = completedSet
            ? completedSet.has(step.number)
            : step.number < currentStep;
          const isActive = step.number === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              {/* Cercle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-brand text-white'
                        : isActive
                        ? 'bg-sl-900 text-white'
                        : 'bg-sl-200 text-sl-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sl-animate-scale-in" strokeWidth={2.5} />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`
                    text-[11px] font-medium whitespace-nowrap
                    ${
                      isActive
                        ? 'text-sl-900'
                        : isCompleted
                        ? 'text-brand'
                        : 'text-sl-400'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Ligne de connexion */}
              {!isLast && (
                <div className="flex-1 mx-2 mb-5">
                  <div
                    className={`h-[2px] transition-all duration-300 ${
                      isCompleted ? 'bg-brand' : 'bg-sl-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}